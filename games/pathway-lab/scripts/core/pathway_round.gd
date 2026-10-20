class_name PathwayRound
extends RefCounted
## The rules of one round, separate from the screen so they can be tested on their own.
##
## Fill the gaps: about 45% of the steps are hidden; the bank holds the hidden pieces plus decoys
## from other pathways. A correct piece scores 100, plus a combo bonus for a run of correct
## pieces (+20 per piece in the run, up to +80). A wrong piece costs 15 and ends the run.
## Arrange the order: every step is shuffled. Each failed check costs 30; the score while
## unfinished is 40 per step in place minus penalties; a win scores 100 per step minus penalties.
## Both: 3 hints (each costs points), and a win adds 2 points per second left on the clock.
## Stars (wins only): 3 with at most 1 slip (wrong pieces, failed checks and hints together),
## 2 with at most 4, otherwise 1. These numbers match the original Pathway Lab.

const HINTS := 3
const DIFFICULTY := {
	"relaxed": {"label": "Relaxed", "time": 0, "gaps": 0.45, "decoys": 2, "hint_cost": 25,
		"about": "No clock. Take your time and read every explanation."},
	"standard": {"label": "Standard", "time": 180, "gaps": 0.45, "decoys": 2, "hint_cost": 25,
		"about": "3 minutes. The original Pathway Lab rules."},
	"expert": {"label": "Expert", "time": 120, "gaps": 0.6, "decoys": 3, "hint_cost": 40,
		"about": "2 minutes, more gaps, an extra decoy and dearer hints."},
}

var p: Dictionary
var nodes: Array
var mode := "fill"
var difficulty := "standard"
var total_time := 180.0
var time_left := 180.0

var score := 0
var penalty := 0
var hints_left := HINTS
var hints_used := 0
var wrong := 0
var combo := 0
var best_combo := 0
var over := false
var win := false
var left_at_end := 0

# fill
var gaps: Array = []            # step indexes that are hidden, in pathway order
var filled: Dictionary = {}     # index -> true
var bank: Array = []            # pieces still to place (node dictionaries)
# arrange
var order: Array = []           # nodes in the learner's current order
var marks: Dictionary = {}      # node id -> true / false, from the last check
var last_correct := 0
var final_correct := 0
var checks := 0

var missed: Dictionary = {}     # step index -> true (wrong piece tried there, hinted, or never placed)
var _hint_level: Dictionary = {}


func _init(pathway: Dictionary, round_mode: String, diff: String = "standard") -> void:
	p = pathway
	nodes = pathway["nodes"]
	mode = round_mode
	difficulty = diff if DIFFICULTY.has(diff) else "standard"
	total_time = float(DIFFICULTY[difficulty]["time"])
	time_left = total_time


func timed() -> bool:
	return total_time > 0.0


func hint_cost() -> int:
	return int(DIFFICULTY[difficulty]["hint_cost"])


# ------------------------------------------------------------------ set up

## focus: step indexes to hide first (practising the steps missed last time).
func setup_fill(rng: RandomNumberGenerator, focus: Array = []) -> void:
	var n := nodes.size()
	var k := maxi(3, int(round(n * float(DIFFICULTY[difficulty]["gaps"]))))
	var chosen: Array = []
	for i in focus:
		if int(i) >= 0 and int(i) < n and not chosen.has(int(i)):
			chosen.append(int(i))
	var rest: Array = range(n).filter(func(i): return not chosen.has(i))
	PD.shuffle(rest, rng)
	var want := k if focus.is_empty() else maxi(3, mini(k, chosen.size() + 2))
	while chosen.size() < want and not rest.is_empty():
		chosen.append(rest.pop_back())
	chosen.sort()
	gaps = chosen
	var types: Array = []
	for i in gaps:
		if not types.has(nodes[i]["t"]):
			types.append(nodes[i]["t"])
	bank = gaps.map(func(i): return nodes[i])
	bank.append_array(PD.decoys(p, types, int(DIFFICULTY[difficulty]["decoys"]), rng))
	PD.shuffle(bank, rng)


func setup_arrange(rng: RandomNumberGenerator) -> void:
	order = nodes.duplicate()
	var guard := 0
	while _in_order() and guard < 20:
		PD.shuffle(order, rng)
		guard += 1


func _in_order() -> bool:
	for i in order.size():
		if order[i] != nodes[i]:
			return false
	return true


# ------------------------------------------------------------------ fill

func is_gap_open(i: int) -> bool:
	return gaps.has(i) and not filled.has(i)


func open_gaps() -> Array:
	return gaps.filter(func(i): return not filled.has(i))


## Try a bank piece in gap i. Returns {ok, points, combo, done}.
func attempt(i: int, piece: Dictionary) -> Dictionary:
	if over or not is_gap_open(i):
		return {"ok": false, "points": 0, "combo": 0, "done": over}
	if String(piece["id"]) == String(nodes[i]["id"]):
		filled[i] = true
		bank.erase(piece)
		var pts := 100 + mini(80, 20 * combo)
		combo += 1
		best_combo = maxi(best_combo, combo)
		score += pts
		var done := open_gaps().is_empty()
		if done:
			finish(true)
		return {"ok": true, "points": pts, "combo": combo, "done": done}
	wrong += 1
	combo = 0
	score = maxi(0, score - 15)
	missed[i] = true
	return {"ok": false, "points": -15, "combo": 0, "done": false}


## The gap a piece really belongs in (or -1 for a decoy / already placed).
func home_of(piece: Dictionary) -> int:
	for i in gaps:
		if not filled.has(i) and String(nodes[i]["id"]) == String(piece["id"]):
			return i
	return -1


# ------------------------------------------------------------------ arrange

func move(from: int, to: int) -> void:
	if over or from == to or from < 0 or to < 0 or from >= order.size() or to >= order.size():
		return
	var before := order.duplicate()
	var item: Variant = order.pop_at(from)
	order.insert(to, item)
	# a mark stays only on steps that are still where they were checked
	for i in order.size():
		if order[i] != before[i]:
			marks.erase(String(order[i]["id"]))


## Returns how many steps are in the right place (and finishes the round when all are).
func check() -> int:
	if over:
		return final_correct
	checks += 1
	var c := 0
	marks.clear()
	for i in order.size():
		var ok: bool = order[i] == nodes[i]
		marks[String(order[i]["id"])] = ok
		if ok:
			c += 1
		else:
			missed[nodes.find(order[i])] = true
	last_correct = c
	if c == nodes.size():
		finish(true)
		return c
	wrong += 1
	combo = 0
	penalty += 30
	score = maxi(0, c * 40 - penalty)
	return c


# ------------------------------------------------------------------ hints

## Returns {index, text} for the next hint, or {} if there is nothing to hint / no hints left.
func hint() -> Dictionary:
	if over or hints_left <= 0:
		return {}
	var idx := -1
	if mode == "fill":
		var open := open_gaps()
		if open.is_empty():
			return {}
		idx = open[0]
		score = maxi(0, score - hint_cost())
	else:
		for j in order.size():
			if order[j] != nodes[j]:
				idx = j
				break
		if idx < 0:
			return {}
		penalty += hint_cost()
		score = maxi(0, last_correct * 40 - penalty)
	hints_left -= 1
	hints_used += 1
	missed[idx] = true
	var n: Dictionary = nodes[idx]
	var lvl := int(_hint_level.get(idx, 0)) + 1
	_hint_level[idx] = lvl
	var text := String(n["h"])
	if lvl > 1:
		text += " It starts with \"%s\" and has %d characters." % [String(n["n"]).substr(0, 3), String(n["n"]).length()]
	var where := ("Gap %d of %d" if mode == "fill" else "Position %d of %d") % [idx + 1, nodes.size()]
	return {"index": idx, "text": text, "where": where}


# ------------------------------------------------------------------ clock and end

## Advance the clock. Returns true when time just ran out.
func tick(delta: float) -> bool:
	if over or not timed():
		return false
	time_left = maxf(0.0, time_left - delta)
	if time_left <= 0.0:
		finish(false)
		return true
	return false


func finish(won: bool) -> void:
	if over:
		return
	over = true
	win = won
	left_at_end = int(ceil(time_left)) if timed() else 0
	var n := nodes.size()
	if mode == "arrange":
		final_correct = 0
		for i in order.size():
			if order[i] == nodes[i]:
				final_correct += 1
		score = (maxi(0, n * 100 - penalty) + left_at_end * 2) if won else maxi(0, final_correct * 40 - penalty)
	else:
		if won:
			score += left_at_end * 2
		for i in gaps:
			if not filled.has(i):
				missed[i] = true


func stars() -> int:
	if not win:
		return 0
	var slips := wrong + hints_used
	return 3 if slips <= 1 else (2 if slips <= 4 else 1)


func accuracy() -> int:
	if mode == "fill":
		var placed := filled.size()
		return int(round(100.0 * placed / (placed + wrong))) if placed + wrong > 0 else 0
	return int(round(100.0 * final_correct / maxf(1.0, nodes.size())))


func time_used() -> int:
	return int(round(total_time - time_left)) if timed() else 0


## Steps that were tested this round and never slipped on.
func clean_steps() -> Array:
	var tested: Array = gaps if mode == "fill" else range(nodes.size())
	return tested.filter(func(i): return not missed.has(i))


func summary() -> Dictionary:
	return {"pid": String(p["id"]), "mode": mode, "difficulty": difficulty, "score": score, "stars": stars(),
		"win": win, "accuracy": accuracy(), "time_used": time_used(), "hints_used": hints_used, "wrong": wrong,
		"best_combo": best_combo, "missed": missed.keys(), "clean": clean_steps(), "gaps": gaps.duplicate(),
		"timed": timed()}
