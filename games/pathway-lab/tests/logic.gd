extends Node
## Rules checks for every pathway: run with  godot --headless --path . res://tests/logic.tscn

var fails := 0


func check(ok: bool, what: String) -> void:
	if not ok:
		fails += 1
		printerr("FAIL ", what)


func _ready() -> void:
	var rng := RandomNumberGenerator.new()
	rng.seed = 7
	check(PD.pathways.size() == 70, "70 pathways loaded (%d)" % PD.pathways.size())
	var steps := 0
	for p in PD.pathways:
		var n: int = (p["nodes"] as Array).size()
		steps += n
		var name := String(p["name"])
		for diff in ["relaxed", "standard", "expert"]:
			# fill: right size, bank has every gap piece plus decoys from elsewhere, perfect play wins with 3 stars
			var r := PathwayRound.new(p, "fill", diff)
			r.setup_fill(rng)
			var k := maxi(3, int(round(n * float(PathwayRound.DIFFICULTY[diff]["gaps"]))))
			check(r.gaps.size() == mini(k, n), "%s %s: %d gaps (want %d)" % [name, diff, r.gaps.size(), k])
			var names := {}
			for nd in p["nodes"]:
				names[nd["n"]] = true
			var decoys := r.bank.filter(func(x): return r.home_of(x) < 0)
			check(decoys.size() <= int(PathwayRound.DIFFICULTY[diff]["decoys"]), "%s: decoy count" % name)
			for d in decoys:
				check(not names.has(d["n"]), "%s: decoy %s is not from this pathway" % [name, d["n"]])
			for i in r.gaps:
				check(r.bank.has(p["nodes"][i]), "%s: gap piece %d is in the bank" % [name, i])
			# one wrong try (if a decoy exists), then all right
			if not decoys.is_empty():
				var res := r.attempt(r.gaps[0], decoys[0])
				check(not res["ok"] and r.wrong == 1 and r.combo == 0, "%s: decoy rejected" % name)
			var total := 0
			for i in r.gaps.duplicate():
				var res2 := r.attempt(i, p["nodes"][i])
				check(res2["ok"], "%s: right piece accepted at %d" % [name, i])
				total += int(res2["points"])
			check(r.over and r.win, "%s %s: filling every gap wins" % [name, diff])
			check(r.stars() == 3, "%s: one slip still gives 3 stars" % name)
			if diff == "relaxed":
				check(not r.timed() and r.left_at_end == 0, "relaxed has no clock")
			else:
				check(r.left_at_end == int(PathwayRound.DIFFICULTY[diff]["time"]), "%s: time bonus counts the whole clock" % name)
			# arrange: shuffled, never already in order; sorting wins
			var a := PathwayRound.new(p, "arrange", diff)
			a.setup_arrange(rng)
			var same := true
			for i in n:
				if a.order[i] != p["nodes"][i]:
					same = false
			check(not same, "%s: arrange starts shuffled" % name)
			var c := a.check()
			check(not a.over and c < n and a.penalty == 30, "%s: a wrong check costs 30" % name)
			var h := a.hint()
			check(not h.is_empty() and a.hints_left == 2, "%s: arrange hint" % name)
			for target in n:
				var cur := a.order.find(p["nodes"][target])
				a.move(cur, target)
			check(a.check() == n and a.over and a.win, "%s %s: sorted order wins" % [name, diff])
			check(a.stars() == 3 if a.wrong + a.hints_used <= 1 else a.stars() == 2, "%s: arrange stars" % name)
	# timing out
	var p0: Dictionary = PD.pathways[0]
	var t := PathwayRound.new(p0, "fill", "standard")
	t.setup_fill(rng)
	check(not t.tick(179.0), "clock still running at 1 s")
	check(t.tick(2.0) and t.over and not t.win and t.stars() == 0, "time running out ends the round")
	check(t.summary()["missed"].size() == t.gaps.size(), "unfilled gaps count as missed")
	# hints: cost, second-level hint gives letters, no hints after 3
	var hh := PathwayRound.new(p0, "fill", "standard")
	hh.setup_fill(rng)
	hh.score = 200
	var first := hh.hint()
	check(hh.score == 175, "fill hint costs 25")
	var second := hh.hint()
	check(String(second["text"]).find("starts with") >= 0, "second hint on the same gap gives the first letters")
	hh.hint()
	check(hh.hint().is_empty() and hh.hints_left == 0, "only 3 hints")
	# practising missed steps hides exactly those steps first
	var f := PathwayRound.new(p0, "fill", "standard")
	f.setup_fill(rng, [1, 3])
	check(f.gaps.has(1) and f.gaps.has(3), "focus steps are among the gaps")
	# combo scoring
	var cb := PathwayRound.new(p0, "fill", "standard")
	cb.setup_fill(rng)
	var pts: Array = []
	for i in cb.gaps.duplicate():
		pts.append(int(cb.attempt(i, p0["nodes"][i])["points"]))
	check(pts[0] == 100 and pts[1] == 120 and pts[2] == 140, "combo: 100, 120, 140 ... (%s)" % str(pts))
	# arrange: marks stay only on steps that did not move
	var m := PathwayRound.new(p0, "arrange", "standard")
	m.setup_arrange(rng)
	m.check()
	var before := m.marks.size()
	m.move(0, 1)
	check(m.marks.size() == before - 2, "moving one step clears the marks of the two steps that changed place")
	# daily pathway is stable
	check(PD.daily_id() == PD.daily_id() and PD.by_id.has(PD.daily_id()), "daily pathway")
	# search finds steps too
	check(PD.search("All", "pyruvate kinase").size() >= 1, "search matches step names")
	check(PD.search("Anatomy", "").size() == 17, "subject filter")
	print("LOGIC DONE steps=%d failures=%d" % [steps, fails])
	printerr("LOGIC DONE failures=", fails)
	get_tree().quit(1 if fails > 0 else 0)
