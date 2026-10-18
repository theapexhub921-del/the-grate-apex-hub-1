extends Node
## Local persistence for profile, XP, stats, achievements, settings and leaderboard.
## All disk access goes through _read()/_write() so a cloud backend can replace it later.

signal changed

const SAVE_PATH := "user://med_term_scramble_save.json"
const RANKS: Array = [
	{"name": "Pre-Med", "xp": 0},
	{"name": "Medical Student I", "xp": 400},
	{"name": "Medical Student II", "xp": 1000},
	{"name": "Medical Student III", "xp": 1900},
	{"name": "Clinical Student", "xp": 3100},
	{"name": "Intern", "xp": 4700},
	{"name": "Resident", "xp": 6800},
	{"name": "Specialist", "xp": 9500},
	{"name": "Consultant", "xp": 13000},
]

var data: Dictionary = {}

var settings: Dictionary:
	get: return data["settings"]
var stats: Dictionary:
	get: return data["stats"]
var profile: Dictionary:
	get: return data["profile"]


func _ready() -> void:
	data = _defaults()
	_merge(data, _read())
	if String(profile.get("id", "")) == "":
		profile["id"] = "p" + str(randi() % 900000 + 100000) + str(Time.get_ticks_usec() % 1000)
	save()


func _defaults() -> Dictionary:
	return {
		"version": 1,
		"profile": {"name": "Student", "id": ""},
		"xp": 0,
		"stats": _default_stats(),
		"achievements": {},
		"settings": {"sfx": true, "music": true, "volume": 0.8, "music_volume": 0.4, "theme": "auto", "reduced_motion": false},
		"leaderboard": [],
	}


func _default_stats() -> Dictionary:
	return {"games": 0, "questions": 0, "correct": 0, "wrong_tries": 0, "best_streak": 0,
		"fastest": 0.0, "total_time": 0.0, "category_correct": {}, "rush_correct": 0, "cases_solved": 0}


func _merge(base: Dictionary, incoming: Dictionary) -> void:
	for k in incoming.keys():
		if base.has(k) and base[k] is Dictionary and incoming[k] is Dictionary:
			_merge(base[k], incoming[k])
		else:
			base[k] = incoming[k]


func _read() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	return parsed if parsed is Dictionary else {}


func _write() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data, "\t"))


func save() -> void:
	_write()
	changed.emit()


func player_name() -> String:
	var n := String(profile.get("name", "")).strip_edges()
	return n if n != "" else "Student"


func set_player_name(n: String) -> void:
	profile["name"] = n.strip_edges().substr(0, 20)
	save()


func rank_info(xp: int) -> Dictionary:
	var idx := 0
	for i in RANKS.size():
		if xp >= int(RANKS[i]["xp"]):
			idx = i
	var floor_xp := int(RANKS[idx]["xp"])
	var next_xp := int(RANKS[idx + 1]["xp"]) if idx + 1 < RANKS.size() else -1
	var progress := 1.0 if next_xp < 0 else float(xp - floor_xp) / float(next_xp - floor_xp)
	return {"index": idx, "name": String(RANKS[idx]["name"]), "floor": floor_xp, "next": next_xp, "progress": progress}


func accuracy() -> float:
	var q := int(stats["questions"])
	return 0.0 if q == 0 else float(stats["correct"]) / float(q)


func favorite_category() -> String:
	var best := ""
	var best_n := 0
	var cc: Dictionary = stats["category_correct"]
	for k in cc.keys():
		if int(cc[k]) > best_n:
			best_n = int(cc[k])
			best = String(k)
	return best if best != "" else "—"


## Applies a finished round to the profile. Returns XP / rank / achievement changes.
func record_round(s: Dictionary) -> Dictionary:
	var results: Array = s.get("results", [])
	var old_rank: int = rank_info(int(data["xp"]))["index"]
	var round_correct := 0
	var round_wrong := 0
	for r in results:
		stats["questions"] = int(stats["questions"]) + 1
		round_wrong += int(r.get("wrong_tries", 0))
		if bool(r.get("correct", false)):
			round_correct += 1
			var t := float(r.get("time", 0.0))
			stats["total_time"] = float(stats["total_time"]) + t
			if float(stats["fastest"]) <= 0.0 or t < float(stats["fastest"]):
				stats["fastest"] = t
			var cc: Dictionary = stats["category_correct"]
			var cat := String(r.get("category", ""))
			cc[cat] = int(cc.get(cat, 0)) + 1
	stats["correct"] = int(stats["correct"]) + round_correct
	stats["wrong_tries"] = int(stats["wrong_tries"]) + round_wrong
	stats["best_streak"] = maxi(int(stats["best_streak"]), int(s.get("best_streak", 0)))
	stats["rush_correct"] = int(stats["rush_correct"]) + int(s.get("rush_correct", 0))
	if bool(s.get("case_solved", false)):
		stats["cases_solved"] = int(stats["cases_solved"]) + 1
	if not results.is_empty():
		stats["games"] = int(stats["games"]) + 1

	var score := int(s.get("score", 0))
	var xp_gained := 0
	if not results.is_empty():
		xp_gained = int(score / 10.0) + round_correct * 5 + 15
	data["xp"] = int(data["xp"]) + xp_gained

	if not results.is_empty():
		var board: Array = data["leaderboard"]
		board.append({"name": player_name(), "score": score, "mode": String(s.get("mode_title", s.get("mode", ""))),
			"accuracy": float(round_correct) / float(results.size()), "date": Time.get_date_string_from_system()})
		board.sort_custom(func(a, b): return int(a["score"]) > int(b["score"]))
		if board.size() > 20:
			board.resize(20)

	var round_info := {"size": results.size(), "correct": round_correct, "wrong": round_wrong}
	var unlocked: Dictionary = data["achievements"]
	var new_achievements: Array = []
	for a in GameData.achievements:
		var id := String(a.get("id", ""))
		if id == "" or unlocked.has(id):
			continue
		if _achievement_met(a, round_info):
			unlocked[id] = Time.get_date_string_from_system()
			new_achievements.append(a)

	var new_rank: int = rank_info(int(data["xp"]))["index"]
	save()
	return {"xp_gained": xp_gained, "xp": int(data["xp"]), "old_rank": old_rank, "new_rank": new_rank,
		"rank_up": new_rank > old_rank, "new_achievements": new_achievements}


func _achievement_met(a: Dictionary, r: Dictionary) -> bool:
	var v := float(a.get("value", 0))
	match String(a.get("type", "")):
		"total_correct": return int(stats["correct"]) >= v
		"streak": return int(stats["best_streak"]) >= v
		"fastest": return float(stats["fastest"]) > 0.0 and float(stats["fastest"]) <= v
		"perfect_round": return int(r["size"]) >= v and int(r["correct"]) == int(r["size"])
		"no_mistakes": return int(r["size"]) >= v and int(r["correct"]) == int(r["size"]) and int(r["wrong"]) == 0
		"category_correct":
			var cc: Dictionary = stats["category_correct"]
			return int(cc.get(String(a.get("category", "")), 0)) >= v
		"games": return int(stats["games"]) >= v
		"rush_correct": return int(stats["rush_correct"]) >= v
		"cases_solved": return int(stats["cases_solved"]) >= v
	return false


func reset_progress() -> void:
	data["xp"] = 0
	data["stats"] = _default_stats()
	data["achievements"] = {}
	data["leaderboard"] = []
	save()
