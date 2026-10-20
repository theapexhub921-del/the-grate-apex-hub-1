extends Screen
## One pathway: what it is, the route at a glance, Learn it first, the two game modes with your
## best scores, the difficulty, and practising the steps you missed last time.

var p: Dictionary
var pid := ""
var _diff := "standard"
var _diff_note: Label


func build() -> void:
	pid = String(params.get("pid", ""))
	p = PD.get_pathway(pid)
	if p.is_empty():
		Router.go("home")
		return
	Style.set_accent(PD.color(p))
	theme = Style.theme
	_diff = String(SaveData.settings.get("difficulty", "standard"))

	top_bar("‹ Pathways", "home")

	var head := UI.vbox(8)
	content.add_child(head)
	head.add_child(UI.eyebrow(String(p["subj"])))
	head.add_child(UI.title(String(p["name"]), 40))
	head.add_child(UI.label(String(p["blurb"]), 16, "muted"))

	# the route at a glance, and what each shape means
	var rc := UI.card(content, 10)
	rc.add_child(UI.label("THE ROUTE · %d STEPS" % (p["nodes"] as Array).size(), 11, "muted", "mono", false))
	var mk := MetroLine.new(26)
	mk.kinds = (p["nodes"] as Array).map(func(n): return n["t"])
	rc.add_child(mk)
	var legend := UI.flow(14)
	rc.add_child(legend)
	var seen := {}
	for n in p["nodes"]:
		var t := String(n["t"])
		if seen.has(t):
			continue
		seen[t] = true
		var item := UI.hbox(6)
		item.add_child(UI.marker(t, 14))
		item.add_child(UI.label(PD.TYPE_LABEL[t], 13, "muted", "body", false))
		legend.add_child(item)

	# learn first
	var learn := ClickCard.new(PD.color(p))
	content.add_child(learn)
	learn.pressed.connect(func(): Router.go("learn", {"pid": pid}))
	var lh := UI.hbox(14)
	learn.add_child(lh)
	lh.add_child(UI.icon("book", 30, "accent"))
	var lv := UI.vbox(2)
	lh.add_child(lv)
	lv.add_child(UI.label("Learn it first", 19, "fg", "bold"))
	lv.add_child(UI.label("Walk through all %d steps with their explanations, then play." % (p["nodes"] as Array).size(), 14, "muted"))
	if SaveData.is_studied(pid):
		lh.add_child(UI.pill("Studied", "good"))
	lh.add_child(UI.icon("right", 20, "muted"))
	_ignore_mouse(lh)

	# the two modes
	var grid := GridContainer.new()
	grid.columns = 2 if column_width() >= 560 else 1
	grid.add_theme_constant_override("h_separation", 12)
	grid.add_theme_constant_override("v_separation", 12)
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_child(grid)
	_mode_card(grid, "fill", "Fill the gaps", "Drag the missing enzymes and steps into the chain. Watch out for decoys.")
	_mode_card(grid, "arrange", "Arrange the order", "Every step is shuffled. Put them back in sequence, first to last.")

	# difficulty
	var dc := UI.card(content, 10)
	dc.add_child(UI.label("DIFFICULTY", 11, "muted", "mono", false))
	var opts: Array = []
	for k in ["relaxed", "standard", "expert"]:
		opts.append([PathwayRound.DIFFICULTY[k]["label"], k])
	dc.add_child(UI.chips(opts, _diff, func(v):
		_diff = String(v)
		SaveData.settings["difficulty"] = _diff
		SaveData.save()
		_diff_note.text = _about()))
	_diff_note = UI.label(_about(), 14, "muted")
	dc.add_child(_diff_note)

	var weak := SaveData.weak_steps(pid)
	if not weak.is_empty():
		var w := UI.card(content, 8, "warn")
		w.add_child(UI.label("Steps you missed last time", 17, "fg", "bold"))
		var names: Array = weak.map(func(i): return String(p["nodes"][i]["n"]))
		w.add_child(UI.label(", ".join(PackedStringArray(names)), 14, "muted"))
		var b := UI.button("Practise these steps", "soft", 44)
		b.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
		b.pressed.connect(func(): Router.go("play", {"pid": pid, "mode": "fill", "difficulty": _diff, "focus": weak}))
		w.add_child(b)


func _about() -> String:
	return String(PathwayRound.DIFFICULTY[_diff]["about"]) + " 3 hints. Tap any piece to learn about it."


func _mode_card(parent: Control, mode: String, title: String, about: String) -> void:
	var card := ClickCard.new(PD.color(p))
	card.size_flags_vertical = Control.SIZE_FILL
	parent.add_child(card)
	card.pressed.connect(func(): Router.go("play", {"pid": pid, "mode": mode, "difficulty": _diff}))
	var v := UI.vbox(8)
	card.add_child(v)
	v.add_child(_mode_icon(mode))
	v.add_child(UI.label(title, 20, "fg", "display"))
	var a := UI.label(about, 14, "muted")
	a.size_flags_vertical = Control.SIZE_EXPAND_FILL
	v.add_child(a)
	var row := UI.hbox(8)
	v.add_child(row)
	var best := SaveData.best(pid, mode)
	row.add_child(UI.label(("Best %d" % best) if best > 0 else "Not played yet", 13, "accent" if best > 0 else "muted", "mono", false))
	row.add_child(UI.spacer())
	row.add_child(UI.stars(SaveData.stars(pid, mode), 16))
	var play := UI.button("Play", "primary", 44)
	play.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(play)
	_ignore_mouse(v)


## Little pictures of each mode, like the original's mode buttons.
func _mode_icon(mode: String) -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(64, 30)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.draw.connect(func():
		var col := Style.c("accent")
		if mode == "fill":
			var a := StyleBoxFlat.new()
			a.draw_center = false
			a.border_color = col
			a.set_border_width_all(2)
			a.set_corner_radius_all(4)
			c.draw_style_box(a, Rect2(2, 6, 16, 18))
			c.draw_line(Vector2(21, 15), Vector2(29, 15), col, 2.0, true)
			c.draw_polyline(PackedVector2Array([Vector2(26, 11), Vector2(30, 15), Vector2(26, 19)]), col, 2.0, true)
			for k in 4:
				c.draw_line(Vector2(33 + k * 4.5, 6), Vector2(35 + k * 4.5, 6), col, 2.0)
				c.draw_line(Vector2(33 + k * 4.5, 24), Vector2(35 + k * 4.5, 24), col, 2.0)
			c.draw_line(Vector2(33, 6), Vector2(33, 24), col, 2.0)
			c.draw_line(Vector2(49, 6), Vector2(49, 24), col, 2.0)
			c.draw_line(Vector2(52, 15), Vector2(60, 15), col, 2.0, true)
		else:
			for k in 3:
				var s := StyleBoxFlat.new()
				s.set_corner_radius_all(3)
				s.draw_center = k == 1
				s.bg_color = col
				s.border_color = col
				s.set_border_width_all(2)
				c.draw_style_box(s, Rect2(2 + k * 10, 2 + k * 10, 38, 7)))
	return c


static func _ignore_mouse(n: Node) -> void:
	if n is Control:
		(n as Control).mouse_filter = Control.MOUSE_FILTER_IGNORE
	for c in n.get_children():
		_ignore_mouse(c)
