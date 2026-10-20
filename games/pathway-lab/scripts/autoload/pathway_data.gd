extends Node
## The pathways (res://data/pathways.json, taken unchanged from the Pathway Lab prototype).
## Each pathway: id, name, subj, blurb, color, nodes [{t: type, n: name, i: explanation, h: hint}].
## Types: e = enzyme, m = molecule, s = structure or event, r = protein or channel.

const TYPE_LABEL := {"e": "Enzyme", "m": "Molecule", "s": "Structure / event", "r": "Protein / channel"}
const TYPE_SLOT := {"e": "enzyme", "m": "molecule", "s": "step", "r": "protein"}
const PALETTE := ["#ff9a3c", "#2fc7b8", "#a78bfa", "#ff5d6c", "#f472b6", "#60a5fa", "#34d3ee", "#9acd32",
	"#f5d547", "#fb923c", "#4ade80", "#c084fc", "#38bdf8", "#fbbf24"]

var pathways: Array = []
var by_id: Dictionary = {}
var subjects: Array = []


func _ready() -> void:
	var f := FileAccess.open("res://data/pathways.json", FileAccess.READ)
	var parsed: Variant = JSON.parse_string(f.get_as_text()) if f else null
	if parsed is Dictionary:
		pathways = parsed.get("pathways", [])
	for i in pathways.size():
		var p: Dictionary = pathways[i]
		if p.get("color") == null or String(p.get("color", "")) == "":
			p["color"] = PALETTE[i % PALETTE.size()]
		var nodes: Array = p["nodes"]
		for j in nodes.size():
			nodes[j]["id"] = String(p["id"]) + str(j)
		by_id[String(p["id"])] = p
		if not subjects.has(String(p["subj"])):
			subjects.append(String(p["subj"]))


func get_pathway(pid: String) -> Dictionary:
	return by_id.get(pid, {})


func color(p: Dictionary) -> Color:
	return Color(String(p.get("color", "#ff9a3c")))


func enzyme_count(p: Dictionary) -> int:
	return (p["nodes"] as Array).filter(func(n): return n["t"] == "e").size()


## Decoy pieces for a round: real pieces from other pathways, of the same types as the gaps,
## with names that do not appear anywhere in this pathway.
func decoys(p: Dictionary, types: Array, count: int, rng: RandomNumberGenerator) -> Array:
	var names := {}
	for n in p["nodes"]:
		names[String(n["n"])] = true
	var pool: Array = []
	var seen := {}
	for q in pathways:
		if q == p:
			continue
		for n in q["nodes"]:
			var nm := String(n["n"])
			if names.has(nm) or seen.has(nm) or not types.has(n["t"]):
				continue
			seen[nm] = true
			pool.append(n)
	shuffle(pool, rng)
	return pool.slice(0, count)


## Today's pathway: the same for everyone on a given date.
func daily_id() -> String:
	if pathways.is_empty():
		return ""
	var d := Time.get_date_dict_from_system()
	var key := int(d["year"]) * 372 + int(d["month"]) * 31 + int(d["day"])
	var h := (key * 2654435761) % 4294967296
	return String(pathways[h % pathways.size()]["id"])


func search(subject: String, query: String) -> Array:
	var q := query.strip_edges().to_lower()
	return pathways.filter(func(p):
		if subject != "All" and String(p["subj"]) != subject:
			return false
		if q == "":
			return true
		var hay := (String(p["name"]) + " " + String(p["blurb"])).to_lower()
		if hay.find(q) >= 0:
			return true
		for n in p["nodes"]:
			if String(n["n"]).to_lower().find(q) >= 0:
				return true
		return false)


static func shuffle(a: Array, rng: RandomNumberGenerator) -> void:
	for i in range(a.size() - 1, 0, -1):
		var j := rng.randi_range(0, i)
		var t: Variant = a[i]
		a[i] = a[j]
		a[j] = t
