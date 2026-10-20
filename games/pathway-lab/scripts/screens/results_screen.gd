extends Screen
## After a round: stars, score (counting up), what went well, and the whole pathway to review,
## with the steps you missed marked. Practise the missed steps, play again or switch mode.

var s: Dictionary
var p: Dictionary


func build() -> void:
	s = params.get("summary", {})
	p = PD.get_pathway(String(s.get("pid", "")))
	if p.is_empty():
		Router.go("home")
		return
	Style.set_accent(PD.color(p))
	theme = Style.theme
	var pid := String(p["id"])
	var mode := String(s["mode"])
	var win := bool(s["win"])

	top_bar("‹ Pathways", "home")
	var head := UI.vbox(6)
	content.add_child(head)
	head.add_child(UI.eyebrow("%s · %s · %s" % [p["name"], "Fill the gaps" if mode == "fill" else "Arrange the order", PathwayRound.DIFFICULTY[s["difficulty"]]["label"]]))
	head.add_child(UI.title("Pathway complete" if win else "Time's up", 44))

	var row := UI.flow(12)
	head.add_child(row)
	var stars := _big_stars(int(s["stars"]))
	row.add_child(stars)
	if bool(params.get("new_best", false)) and int(s["score"]) > 0:
		row.add_child(UI.pill("New best", "warn"))
	if bool(params.get("daily", false)):
		row.add_child(UI.pill("Today's pathway done · %d-day streak" % SaveData.daily_streak(), "good"))
	head.add_child(UI.label(_verdict(), 16, "muted"))

	var grid := GridContainer.new()
	grid.columns = 4 if column_width() >= 620 else 2
	grid.add_theme_constant_override("h_separation", 10)
	grid.add_theme_constant_override("v_separation", 10)
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_child(grid)
	var score_label := _stat(grid, "0", "Score")
	_stat(grid, "%d%%" % int(s["accuracy"]), "Accuracy")
	var tu := int(s["time_used"])
	_stat(grid, ("%d:%02d" % [tu / 60, tu % 60]) if bool(s["timed"]) else "No clock", "Time used")
	_stat(grid, "%d / %d" % [int(s["hints_used"]), PathwayRound.HINTS], "Hints used")
	_count_up(score_label, int(s["score"]))

	var btns := UI.flow(10)
	content.add_child(btns)
	var again := UI.button("Play again", "primary", 48)
	again.pressed.connect(func(): Router.go("play", {"pid": pid, "mode": mode, "difficulty": s["difficulty"]}))
	btns.add_child(again)
	var missed: Array = s.get("missed", [])
	if not missed.is_empty():
		var pr := UI.button("Practise the %d missed step%s" % [missed.size(), "" if missed.size() == 1 else "s"], "soft", 48)
		pr.pressed.connect(func(): Router.go("play", {"pid": pid, "mode": "fill", "difficulty": s["difficulty"], "focus": missed}))
		btns.add_child(pr)
	var other := "arrange" if mode == "fill" else "fill"
	var ob := UI.button("Try " + ("Arrange the order" if other == "arrange" else "Fill the gaps"), "ghost", 48)
	ob.pressed.connect(func(): Router.go("play", {"pid": pid, "mode": other, "difficulty": s["difficulty"]}))
	btns.add_child(ob)
	var home := UI.button("Choose another pathway", "ghost", 48)
	home.pressed.connect(func(): Router.go("home"))
	btns.add_child(home)
	again.grab_focus.call_deferred()

	var rv := UI.card(content, 8)
	rv.add_child(UI.label("THE FULL PATHWAY", 11, "muted", "mono", false))
	var nodes: Array = p["nodes"]
	for i in nodes.size():
		var n: Dictionary = nodes[i]
		var item := PanelContainer.new()
		item.add_theme_stylebox_override("panel", Style.box(Style.c("surface2"), Style.c("bad") if missed.has(i) else Color.TRANSPARENT, 12, 1 if missed.has(i) else 0, Vector4(12, 10, 12, 10)))
		var h := UI.hbox(10)
		item.add_child(h)
		var num := UI.label(str(i + 1), 12, "muted", "mono", false)
		num.custom_minimum_size.x = 22
		num.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
		h.add_child(num)
		var mk := UI.marker(String(n["t"]), 14)
		mk.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
		h.add_child(mk)
		var v := UI.vbox(3)
		h.add_child(v)
		var t := UI.flow(8)
		v.add_child(t)
		t.add_child(UI.label(String(n["n"]), 15, "fg", "bold", false))
		t.add_child(UI.pill(PD.TYPE_LABEL[n["t"]], "muted"))
		if missed.has(i):
			t.add_child(UI.pill("Missed", "bad"))
		v.add_child(UI.label(String(n["i"]), 13, "muted"))
		rv.add_child(item)
	if win:
		pass  # the win sound already played at the end of the round


func _verdict() -> String:
	var st := int(s["stars"])
	if not bool(s["win"]):
		return "The clock ran out. Read the pathway below, then try again, or practise the steps you missed."
	var combo := int(s.get("best_combo", 0))
	var extra := (" Best run: %d in a row." % combo) if combo >= 3 else ""
	match st:
		3:
			return "Clean run: at most one slip." + extra
		2:
			return "Nearly there: a few slips. One more go for three stars." + extra
	return "Done, with several slips. Learn it first, then come back for more stars." + extra


func _stat(parent: Control, value: String, caption: String) -> Label:
	var pc := PanelContainer.new()
	pc.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	pc.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("line"), 12, 1, Vector4(14, 10, 14, 10)))
	var v := UI.vbox(2)
	pc.add_child(v)
	v.add_child(UI.label(caption.to_upper(), 11, "muted", "mono", false))
	var l := UI.label(value, 24, "fg", "mono", false)
	v.add_child(l)
	parent.add_child(pc)
	return l


func _count_up(l: Label, target: int) -> void:
	if Style.reduced_motion() or target <= 0:
		l.text = str(target)
		return
	var tw := l.create_tween()
	tw.tween_method(func(v: float): l.text = str(int(v)), 0.0, float(target), 0.9).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)


## Three big stars that pop in one after another.
func _big_stars(on: int) -> Control:
	var h := UI.hbox(6)
	for i in 3:
		var st := UI.stars(1 if i < on else 0, 34, 1)
		h.add_child(st)
		if i < on and not Style.reduced_motion():
			st.scale = Vector2.ZERO
			st.pivot_offset = Vector2(17, 17)
			var tw := st.create_tween()
			tw.tween_interval(0.25 + i * 0.22)
			tw.tween_callback(func(): Audio.play("place"))
			tw.tween_property(st, "scale", Vector2.ONE, 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	return h
