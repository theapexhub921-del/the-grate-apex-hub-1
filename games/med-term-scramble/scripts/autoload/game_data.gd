extends Node
## Loads all medical content from res://data. Gameplay code never hard-codes terms.

const CATEGORIES: Array[String] = [
	"Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology",
	"Microbiology", "Immunology", "Genetics", "Hematology", "Neurology",
	"Cardiology", "Respiratory", "Gastroenterology", "Endocrinology",
]
const DIFFICULTIES: Array[String] = ["Easy", "Medium", "Hard", "Expert"]

var terms: Array = []
var by_id: Dictionary = {}
var cases: Array = []
var achievements: Array = []
var net_config: Dictionary = {}


func _ready() -> void:
	terms = _load_json("res://data/terms.json").get("terms", [])
	for t in terms:
		t["term"] = String(t.get("term", "")).to_upper()
		t["difficulty"] = clampi(int(t.get("difficulty", 2)), 1, 4)
		by_id[String(t.get("id", t["term"]))] = t
	cases = _load_json("res://data/cases.json").get("cases", [])
	for c in cases:
		for s in c.get("steps", []):
			s["term"] = String(s.get("term", "")).to_upper()
			s["difficulty"] = clampi(int(s.get("difficulty", 2)), 1, 4)
	achievements = _load_json("res://data/achievements.json").get("achievements", [])
	net_config = _load_json("res://data/net_config.json")


func _load_json(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		push_error("Missing data file: " + path)
		return {}
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(path))
	if parsed is Dictionary:
		return parsed
	push_error("Invalid JSON in " + path)
	return {}


func difficulty_name(d: int) -> String:
	return DIFFICULTIES[clampi(d, 1, 4) - 1]


func count_in(category: String) -> int:
	return pool(category, 0).size()


func pool(category: String, difficulty: int) -> Array:
	var out: Array = []
	for t in terms:
		if category != "All" and String(t.get("category", "")) != category:
			continue
		if difficulty > 0 and int(t.get("difficulty", 0)) != difficulty:
			continue
		out.append(t)
	return out


## Picks `count` terms. Falls back to nearby pools when a filter is too narrow.
func pick(category: String, difficulty: int, count: int, prefer_rush: bool, rng: RandomNumberGenerator) -> Array:
	var primary := pool(category, difficulty)
	if prefer_rush:
		var with_rush: Array = []
		var without: Array = []
		for t in primary:
			if t.has("rush"):
				with_rush.append(t)
			else:
				without.append(t)
		shuffle(with_rush, rng)
		shuffle(without, rng)
		primary = with_rush + without
	else:
		shuffle(primary, rng)
	var chosen: Array = primary.slice(0, count)
	if chosen.size() < count:
		var fallbacks: Array = [pool(category, 0), pool("All", difficulty), pool("All", 0)]
		for fb in fallbacks:
			shuffle(fb, rng)
			for t in fb:
				if chosen.size() >= count:
					break
				if not chosen.has(t):
					chosen.append(t)
	shuffle(chosen, rng)
	return chosen


func random_term(category: String, difficulty: int, avoid_ids: Array) -> Dictionary:
	var p := pool(category, difficulty)
	if p.is_empty():
		p = pool(category, 0)
	if p.is_empty():
		return {}
	var fresh: Array = p.filter(func(t): return not avoid_ids.has(t.get("id", "")))
	if fresh.is_empty():
		fresh = p
	return fresh[randi() % fresh.size()]


func case_by_id(id: String) -> Dictionary:
	for c in cases:
		if String(c.get("id", "")) == id:
			return c
	return {}


func shuffle(arr: Array, rng: RandomNumberGenerator) -> void:
	for i in range(arr.size() - 1, 0, -1):
		var j := rng.randi_range(0, i)
		var tmp: Variant = arr[i]
		arr[i] = arr[j]
		arr[j] = tmp
