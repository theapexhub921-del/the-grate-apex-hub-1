extends Node
## Saves progress for each shift (learn, drill, prove, hands-on check), checklist ticks and settings.

signal changed

const SAVE_PATH := "user://golden_hour_save.json"
const STEPS := ["learn", "drill", "prove", "check"]

var data: Dictionary = {}

var settings: Dictionary:
	get: return data["settings"]


func _ready() -> void:
	data = _defaults()
	if FileAccess.file_exists(SAVE_PATH):
		var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
		if parsed is Dictionary:
			_merge(data, parsed)
	save()


func _defaults() -> Dictionary:
	var shifts: Array = []
	for s in Data.shifts:
		var ticks: Array = []
		for c in s.get("checklist", []):
			ticks.append(false)
		shifts.append({"learn": false, "drill": false, "prove": false, "check": false, "ticks": ticks, "best_drill": 0})
	return {"version": 1, "name": "", "shifts": shifts,
		"settings": {"sfx": true, "music": false, "volume": 0.8, "music_volume": 0.3, "theme": "auto", "reduced_motion": false}}


func _merge(base: Dictionary, incoming: Dictionary) -> void:
	for k in incoming.keys():
		if not base.has(k):
			continue
		if base[k] is Dictionary and incoming[k] is Dictionary:
			_merge(base[k], incoming[k])
		elif k == "shifts" and incoming[k] is Array:
			var arr: Array = incoming[k]
			for i in mini(arr.size(), base[k].size()):
				if arr[i] is Dictionary:
					_merge(base[k][i], arr[i])
		else:
			base[k] = incoming[k]


func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data, "\t"))
	changed.emit()


func shift(i: int) -> Dictionary:
	return data["shifts"][i]


func is_done(i: int, step: String) -> bool:
	return bool(shift(i).get(step, false))


func set_done(i: int, step: String, value: bool = true) -> void:
	shift(i)[step] = value
	save()


func is_open(i: int) -> bool:
	return i == 0 or is_done(i - 1, "prove")


## The step a learner should do next on a shift.
func next_step(i: int) -> String:
	for s in STEPS:
		if not is_done(i, s):
			return s
	return "check"


## A step can be opened once the one before it is done.
func step_open(i: int, step: String) -> bool:
	var idx := STEPS.find(step)
	return idx <= 0 or is_done(i, STEPS[idx - 1])


func proves_passed() -> int:
	var n := 0
	for s in data["shifts"]:
		if bool(s["prove"]):
			n += 1
	return n


func rank() -> Dictionary:
	var n := proves_passed()
	if n >= 6:
		return {"name": "Charge Nurse", "next": "the top rank"}
	if n >= 3:
		return {"name": "Staff Nurse", "next": "Charge Nurse"}
	return {"name": "Student Nurse", "next": "Staff Nurse"}


func reset_progress() -> void:
	var s: Dictionary = data["settings"].duplicate()
	data = _defaults()
	data["settings"] = s
	save()
