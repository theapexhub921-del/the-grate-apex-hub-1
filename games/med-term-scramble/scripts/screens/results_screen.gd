extends Screen


func build() -> void:
	var s: Dictionary = params.get("summary", {})
	var o: Dictionary = params.get("outcome", {})
	var players: Dictionary = params.get("players", {})
	var mode := String(s.get("mode", "classic"))
	var results: Array = s.get("results", [])
	Audio.play("results")

	content.add_child(UI.eyebrow(String(s.get("mode_title", "")) + " · complete"))
	var heading := "Final Leaderboard" if mode == "multi" else ("Case Closed" if bool(s.get("case_solved", false)) else ("Case Review" if mode == "case" else "Round Complete"))
	content.add_child(UI.title(heading, 40))
	if mode == "case":
		content.add_child(UI.label(String(s.get("case_title", "")), 18, "muted"))

	# Score
	var sc := UI.card(content, 4, "hema")
	sc.add_child(UI.label("SCORE", 13, "muted", "mono"))
	var score_l := UI.label("0", 64, "hema", "display", false)
	sc.add_child(score_l)
	var final_score := int(s.get("score", 0))
	if Style.reduced_motion():
		score_l.text = str(final_score)
	else:
		var tw := create_tween()
		tw.tween_method(func(v: float): score_l.text = str(int(v)), 0.0, float(final_score), 0.9).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)

	# Multiplayer standings
	if mode == "multi" and not players.is_empty():
		var lb := UI.card(content, 8)
		lb.add_child(UI.eyebrow("Match standings"))
		var arr: Array = []
		for id in players.keys():
			var p: Dictionary = players[id]
			arr.append({"id": String(id), "name": String(p.get("name", "?")), "score": int(p.get("score", 0))})
		arr.sort_custom(func(a, b): return int(a["score"]) > int(b["score"]))
		for i in arr.size():
			var e: Dictionary = arr[i]
			var me := String(e["id"]) == Net.my_id()
			var row := UI.hbox(12)
			row.add_child(UI.label("#%d" % (i + 1), 22 if i == 0 else 18, "eosin" if i == 0 else "muted", "display", false))
			row.add_child(UI.label(String(e["name"]) + (" (you)" if me else ""), 18, "hema" if me else "fg", "bold"))
			row.add_child(UI.label("%d pts" % e["score"], 18, "fg", "mono", false))
			lb.add_child(row)

	# Stats
	var correct := 0
	var t := 0.0
	for r in results:
		if r["correct"]:
			correct += 1
			t += float(r["time"])
	var grid := UI.flow(12)
	content.add_child(grid)
	UI.stat(grid, "%d/%d" % [correct, results.size()], "Correct")
	UI.stat(grid, "%d%%" % int(100.0 * correct / maxf(1.0, results.size())), "Accuracy")
	UI.stat(grid, "%.1fs" % (t / correct) if correct > 0 else "—", "Avg solve")
	UI.stat(grid, str(s.get("best_streak", 0)), "Best streak")
	if mode == "rush":
		UI.stat(grid, str(s.get("rush_correct", 0)), "Rush wins")

	# XP / rank
	var info := SaveData.rank_info(int(o.get("xp", 0)))
	var xc := UI.card(content, 8)
	var xrow := UI.hbox(10)
	xc.add_child(xrow)
	xrow.add_child(UI.label("+%d XP" % int(o.get("xp_gained", 0)), 24, "eosin", "display", false))
	xrow.add_child(UI.spacer())
	xrow.add_child(UI.label(String(info["name"]), 18, "hema", "bold", false))
	xc.add_child(UI.progress_bar(float(info["progress"]), "eosin", 10))
	if bool(o.get("rank_up", false)):
		var up := UI.label("Promoted to %s!" % info["name"], 20, "good", "display")
		xc.add_child(up)
		UI.pulse(up, 1.2)

	var achs: Array = o.get("new_achievements", [])
	if not achs.is_empty():
		var ac := UI.card(content, 6, "eosin")
		ac.add_child(UI.eyebrow("Achievement unlocked"))
		for a in achs:
			ac.add_child(UI.label(String(a.get("name", "")), 19, "fg", "display"))
			ac.add_child(UI.label(String(a.get("description", "")), 14, "muted"))

	# Buttons
	var brow := UI.flow(10)
	content.add_child(brow)
	var again := UI.button("Play again", "primary", 52)
	again.custom_minimum_size.x = 200
	var replay: Dictionary = params.get("replay", {})
	again.pressed.connect(func():
		if mode == "multi":
			Router.go("multi")
		else:
			Router.go("game", replay))
	brow.add_child(again)
	var menu := UI.button("Main menu", "ghost", 52)
	menu.custom_minimum_size.x = 200
	menu.pressed.connect(func():
		if mode == "multi":
			Net.leave()
		Router.go("menu"))
	brow.add_child(menu)
	again.grab_focus.call_deferred()

	# Review
	if not results.is_empty():
		var rv := UI.card(content, 6)
		rv.add_child(UI.eyebrow("Review"))
		for r in results:
			var row := UI.hbox(10)
			var ok := bool(r["correct"])
			row.add_child(UI.label("✓" if ok else "✗", 18, "good" if ok else "bad", "bold", false))
			var term := String(r["term"])
			var d: Dictionary = GameData.by_id.get(String(r.get("id", "")), {})
			var tl := UI.label(term, 16, "fg", "mono", false)
			row.add_child(tl)
			row.add_child(UI.label(String(d.get("definition", "")), 13, "muted"))
			row.add_child(UI.label(("%.1fs · +%d" % [float(r["time"]), int(r["points"])]) if ok else "missed", 14, "muted", "mono", false))
			rv.add_child(row)
