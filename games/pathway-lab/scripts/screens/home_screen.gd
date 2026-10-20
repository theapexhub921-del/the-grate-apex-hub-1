extends Screen
## Home: today's pathway, your progress, and every pathway as a card (filter by subject, search).

var _filter := "All"
var _query := ""
var _grid: GridContainer
var _count_label: Label
var _empty: Label


func max_width() -> float:
	return 1120.0


func build() -> void:
	Style.set_accent(Style.DEFAULT_ACCENT)
	theme = Style.theme
	_filter = String(params.get("filter", "All"))

	var top := UI.hbox(8)
	content.add_child(top)
	top.add_child(UI.spacer())
	var prog := UI.button("Progress", "ghost", 38)
	prog.pressed.connect(func(): Router.go("progress"))
	top.add_child(prog)
	var sett := UI.button("Settings", "ghost", 38)
	sett.pressed.connect(func(): Router.go("settings"))
	top.add_child(sett)

	var head := UI.vbox(10)
	content.add_child(head)
	head.add_child(UI.eyebrow(" · ".join(PackedStringArray(PD.subjects))))
	var t := UI.title("Pathway Lab", 64 if size.x >= 700 else 50)
	head.add_child(t)
	var metro := MetroLine.new(26)
	metro.custom_minimum_size.x = 0
	metro.size_flags_horizontal = Control.SIZE_FILL
	var holder := MarginContainer.new()
	holder.add_theme_constant_override("margin_right", int(maxf(0.0, column_width() - 460.0)))
	holder.add_child(metro)
	head.add_child(holder)
	head.add_child(UI.label("Pick a pathway, then drag the missing enzymes and steps into place or put the whole sequence in order. Tap any step to read a short explanation. New here? Open a pathway and choose Learn it first.", 16, "muted"))

	_progress_strip()
	_daily_card()
	_weak_card()

	var filt := UI.vbox(10)
	content.add_child(filt)
	var opts: Array = [["All", "All"]]
	for s in PD.subjects:
		opts.append([s, s])
	filt.add_child(UI.chips(opts, _filter, func(v): _filter = String(v); _refresh()))
	var search := UI.line_edit("", "Search pathways, enzymes or molecules")
	search.clear_button_enabled = true
	search.text_changed.connect(func(txt: String): _query = txt; _refresh())
	filt.add_child(search)
	_count_label = UI.label("", 13, "muted", "mono")
	filt.add_child(_count_label)

	_grid = GridContainer.new()
	_grid.add_theme_constant_override("h_separation", 14)
	_grid.add_theme_constant_override("v_separation", 14)
	_grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_child(_grid)
	_empty = UI.label("No pathway matches that search.", 16, "muted")
	_empty.visible = false
	content.add_child(_empty)
	resized.connect(_columns)
	_columns()
	_refresh()


func _columns() -> void:
	if _grid:
		var w := column_width()
		_grid.columns = 3 if w >= 980 else (2 if w >= 600 else 1)


func _progress_strip() -> void:
	var row := UI.hbox(10)
	content.add_child(row)
	var done := PD.pathways.filter(func(p): return SaveData.completed(String(p["id"]))).size()
	_mini_stat(row, "%d / %d" % [done, PD.pathways.size()], "Pathways complete")
	_mini_stat(row, "%d / %d" % [SaveData.stars_total(), PD.pathways.size() * 6], "Stars")
	_mini_stat(row, str(SaveData.daily_streak()), "Daily streak")


func _mini_stat(parent: Control, value: String, caption: String) -> void:
	var p := PanelContainer.new()
	p.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	p.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("line"), 12, 1, Vector4(14, 10, 14, 10)))
	var v := UI.vbox(0)
	p.add_child(v)
	v.add_child(UI.label(value, 22, "fg", "mono", false))
	var cap := UI.label(caption.to_upper(), 11, "muted", "mono", true)
	v.add_child(cap)
	parent.add_child(p)


func _daily_card() -> void:
	var p := PD.get_pathway(PD.daily_id())
	if p.is_empty():
		return
	var col := PD.color(p)
	var card := ClickCard.new(col)
	content.add_child(card)
	card.pressed.connect(func(): Router.go("pathway", {"pid": p["id"]}))
	var v := UI.vbox(8)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	card.add_child(v)
	var r := UI.hbox(8)
	v.add_child(r)
	var k := UI.label("TODAY'S PATHWAY", 12, "accent", "mono", false)
	k.add_theme_color_override("font_color", Style.accent_for(col))
	r.add_child(k)
	r.add_child(UI.spacer())
	if SaveData.daily_done():
		r.add_child(UI.icon("check", 16, "good"))
		r.add_child(UI.label("Done today", 13, "good", "bold", false))
	else:
		var streak := SaveData.daily_streak()
		r.add_child(UI.label(("Keep your %d-day streak" % streak) if streak > 0 else "Win it to start a streak", 13, "muted", "body", false))
	v.add_child(UI.label(String(p["name"]), 26, "fg", "display"))
	v.add_child(UI.label(String(p["blurb"]), 15, "muted"))
	_route(v, p, col)
	_ignore_mouse(v)


func _weak_card() -> void:
	# the pathway with the most often-missed steps, if any
	var best_pid := ""
	var best_n := 0
	for pid in SaveData.data["missed"].keys():
		var n := 0
		for v in SaveData.data["missed"][pid].values():
			n += int(v)
		if n > best_n and PD.by_id.has(pid):
			best_n = n
			best_pid = pid
	if best_pid == "" or best_n < 2:
		return
	var p := PD.get_pathway(best_pid)
	var card := ClickCard.new(Style.c("warn"))
	content.add_child(card)
	card.pressed.connect(func(): Router.go("play", {"pid": best_pid, "mode": "fill", "focus": SaveData.weak_steps(best_pid)}))
	var h := UI.hbox(12)
	h.mouse_filter = Control.MOUSE_FILTER_IGNORE
	card.add_child(h)
	h.add_child(UI.icon("hint", 26, "warn"))
	var v := UI.vbox(2)
	h.add_child(v)
	v.add_child(UI.label("Practise your tricky steps", 17, "fg", "bold"))
	var names: Array = SaveData.weak_steps(best_pid).slice(0, 3).map(func(i): return String(p["nodes"][i]["n"]))
	v.add_child(UI.label("%s: %s" % [p["name"], ", ".join(PackedStringArray(names))], 14, "muted"))
	h.add_child(UI.icon("right", 20, "muted"))
	_ignore_mouse(h)


func _refresh() -> void:
	if _grid == null:
		return
	for c in _grid.get_children():
		c.queue_free()
	var list := PD.search(_filter, _query)
	_empty.visible = list.is_empty()
	_count_label.text = "%d pathway%s" % [list.size(), "" if list.size() == 1 else "s"]
	for p in list:
		_grid.add_child(_card(p))


func _card(p: Dictionary) -> Control:
	var col := PD.color(p)
	var acc := Style.accent_for(col)
	var pid := String(p["id"])
	var card := ClickCard.new(col)
	card.size_flags_vertical = Control.SIZE_FILL
	card.pressed.connect(func(): Router.go("pathway", {"pid": pid}))
	var v := UI.vbox(8)
	card.add_child(v)
	var top := UI.hbox(6)
	v.add_child(top)
	var k := UI.label(String(p["subj"]).to_upper(), 11, "accent", "mono", false)
	k.add_theme_color_override("font_color", acc)
	top.add_child(k)
	top.add_child(UI.spacer())
	if SaveData.is_studied(pid):
		top.add_child(UI.icon("book", 16, "muted"))
	if pid == PD.daily_id():
		top.add_child(UI.pill("Today", "warn"))
	v.add_child(UI.label(String(p["name"]), 21, "fg", "display"))
	var blurb := UI.label(String(p["blurb"]), 13, "muted")
	blurb.size_flags_vertical = Control.SIZE_EXPAND_FILL
	v.add_child(blurb)
	_route(v, p, col)
	var meta := UI.hbox(8)
	v.add_child(meta)
	var ne := PD.enzyme_count(p)
	var txt := "%d steps" % (p["nodes"] as Array).size()
	if ne > 0:
		txt += " · %d enzymes" % ne
	var best := SaveData.best_any(pid)
	if best > 0:
		txt += " · best %d" % best
	meta.add_child(UI.label(txt, 12, "muted", "mono", false))
	meta.add_child(UI.spacer())
	var st := maxi(SaveData.stars(pid, "fill"), SaveData.stars(pid, "arrange"))
	if st > 0:
		meta.add_child(UI.stars(st, 14))
	_ignore_mouse(v)
	return card


func _route(parent: Control, p: Dictionary, col: Color) -> void:
	var f := UI.flow(5)
	parent.add_child(f)
	for n in p["nodes"]:
		f.add_child(UI.marker(String(n["t"]), 12, Style.accent_for(col)))


static func _ignore_mouse(n: Node) -> void:
	if n is Control:
		(n as Control).mouse_filter = Control.MOUSE_FILTER_IGNORE
	for c in n.get_children():
		_ignore_mouse(c)
