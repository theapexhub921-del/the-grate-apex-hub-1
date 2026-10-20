extends Node
## Everything the game remembers, in one file on this device (user://pathway_lab_save.json):
## settings, best score and stars per pathway and mode, which pathways were studied,
## the steps a learner keeps missing, recent rounds and the daily-pathway streak.

signal changed

const SAVE_PATH := "user://pathway_lab_save.json"
const MODES := ["fill", "arrange"]

var data: Dictionary = {}

var settings: Dictionary:
	get: return data["settings"]


func _ready() -> void:
	data = _defaults()
	_merge(data, _read())


func _defaults() -> Dictionary:
	return {
		"version": 1,
		"settings": {"sfx": true, "music": false, "volume": 0.8, "music_volume": 0.3, "theme": "auto",
			"reduced_motion": false, "difficulty": "standard"},
		"best": {},        # "<pathway>:<mode>" -> best score
		"stars": {},       # "<pathway>:<mode>" -> best stars (0-3)
		"studied": {},     # pathway -> true once Learn mode was finished
		"missed": {},      # pathway -> {step index (as text): times missed}
		"recent": [],      # last rounds, newest first
		"rounds": 0,
		"daily": {"last": "", "streak": 0, "best_streak": 0},
	}


func _merge(base: Dictionary, incoming: Dictionary) -> void:
	for k in incoming.keys():
		if base.has(k) and base[k] is Dictionary and incoming[k] is Dictionary:
			_merge(base[k], incoming[k])
		else:
			base[k] = incoming[k]


func _read() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if f == null:
		return {}
	var parsed: Variant = JSON.parse_string(f.get_as_text())
	return parsed if parsed is Dictionary else {}


func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))
	changed.emit()


# ------------------------------------------------------------------ results

func best(pid: String, mode: String) -> int:
	return int(data["best"].get(pid + ":" + mode, 0))


func stars(pid: String, mode: String) -> int:
	return int(data["stars"].get(pid + ":" + mode, 0))


func best_any(pid: String) -> int:
	return maxi(best(pid, "fill"), best(pid, "arrange"))


func stars_total() -> int:
	var n := 0
	for v in data["stars"].values():
		n += int(v)
	return n


## A pathway counts as complete once either mode has been won.
func completed(pid: String) -> bool:
	return stars(pid, "fill") > 0 or stars(pid, "arrange") > 0


func is_studied(pid: String) -> bool:
	return bool(data["studied"].get(pid, false))


func mark_studied(pid: String) -> void:
	data["studied"][pid] = true
	save()


## Saves one finished round. Returns {"new_best": bool, "daily": bool (the daily pathway was done today)}.
func record_round(r: Dictionary) -> Dictionary:
	var pid := String(r["pid"])
	var key := pid + ":" + String(r["mode"])
	var score := int(r["score"])
	var new_best := score > int(data["best"].get(key, 0))
	if new_best:
		data["best"][key] = score
	data["stars"][key] = maxi(int(data["stars"].get(key, 0)), int(r["stars"]))
	# steps missed this round are remembered; steps got right first time are slowly forgiven
	var m: Dictionary = data["missed"].get(pid, {})
	for i in r.get("missed", []):
		m[str(i)] = int(m.get(str(i), 0)) + 1
	for i in r.get("clean", []):
		if m.has(str(i)):
			m[str(i)] = int(m[str(i)]) - 1
			if int(m[str(i)]) <= 0:
				m.erase(str(i))
	data["missed"][pid] = m
	data["rounds"] = int(data["rounds"]) + 1
	var recent: Array = data["recent"]
	recent.push_front({"pid": pid, "mode": r["mode"], "score": score, "stars": r["stars"], "win": r["win"], "day": today()})
	while recent.size() > 12:
		recent.pop_back()
	var daily := false
	if bool(r["win"]) and pid == PD.daily_id():
		daily = _mark_daily()
	save()
	return {"new_best": new_best, "daily": daily}


## Step indexes the learner has missed more than once lately, most-missed first.
func weak_steps(pid: String) -> Array:
	var m: Dictionary = data["missed"].get(pid, {})
	var out: Array = []
	for k in m.keys():
		out.append([int(k), int(m[k])])
	out.sort_custom(func(a, b): return a[1] > b[1])
	return out.map(func(x): return x[0])


# ------------------------------------------------------------------ daily pathway

static func today() -> String:
	return Time.get_date_string_from_system()


func daily_done() -> bool:
	return String(data["daily"]["last"]) == today()


func daily_streak() -> int:
	var d: Dictionary = data["daily"]
	var last := String(d["last"])
	if last == today() or last == _yesterday():
		return int(d["streak"])
	return 0


func _mark_daily() -> bool:
	var d: Dictionary = data["daily"]
	if String(d["last"]) == today():
		return false
	d["streak"] = int(d["streak"]) + 1 if String(d["last"]) == _yesterday() else 1
	d["best_streak"] = maxi(int(d["best_streak"]), int(d["streak"]))
	d["last"] = today()
	return true


static func _yesterday() -> String:
	var t := Time.get_unix_time_from_system() - 86400.0
	return Time.get_date_string_from_unix_time(int(t) + _utc_offset())


static func _utc_offset() -> int:
	return int(Time.get_time_zone_from_system().get("bias", 0)) * 60


func reset_progress() -> void:
	var keep: Dictionary = settings.duplicate(true)
	data = _defaults()
	data["settings"] = keep
	save()
