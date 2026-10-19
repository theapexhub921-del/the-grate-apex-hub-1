extends Node
## Loads the shifts (learn cards, drills, checklists) and ward scenarios from res://data.

var shifts: Array = []
var wards: Dictionary = {}


func _ready() -> void:
	shifts = _load("res://data/shifts.json").get("shifts", [])
	wards = _load("res://data/wards.json").get("wards", {})


func _load(path: String) -> Dictionary:
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(path))
	if parsed is Dictionary:
		return parsed
	push_error("Could not read " + path)
	return {}


func shift(i: int) -> Dictionary:
	return shifts[clampi(i, 0, shifts.size() - 1)]


func ward(i: int) -> Dictionary:
	return wards.get(str(i + 1), {})
