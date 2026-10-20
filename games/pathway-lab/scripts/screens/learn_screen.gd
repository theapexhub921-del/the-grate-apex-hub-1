extends Screen
## Learn it first: one step at a time, with the whole route beside it. Tap any station on the
## route to jump there; arrow keys work too. Finishing marks the pathway as studied.

var p: Dictionary
var pid := ""
var nodes: Array = []
var idx := 0

var _step_label: Label
var _bar: ProgressBar
var _card: VBoxContainer
var _route: VBoxContainer
var _prev: Button
var _next: Button


func build() -> void:
	pid = String(params.get("pid", ""))
	p = PD.get_pathway(pid)
	if p.is_empty():
		Router.go("home")
		return
	nodes = p["nodes"]
	idx = clampi(int(params.get("step", 0)), 0, nodes.size() - 1)
	Style.set_accent(PD.color(p))
	theme = Style.theme

	var top := top_bar("‹ " + String(p["name"]), "pathway", {"pid": pid})
	_step_label = UI.label("", 13, "muted", "mono", false)
	top.add_child(_step_label)

	content.add_child(UI.eyebrow("Learn · " + String(p["subj"])))
	_bar = UI.progress_bar(0.0, "accent", 6)
	content.add_child(_bar)

	var cols := HBoxContainer.new()
	cols.add_theme_constant_override("separation", 18)
	cols.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_child(cols)
	var main := UI.vbox(14)
	cols.add_child(main)
	var cardp := PanelContainer.new()
	cardp.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	cardp.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("accent"), 18, 1, Vector4(22, 20, 22, 20)))
	main.add_child(cardp)
	_card = UI.vbox(12)
	cardp.add_child(_card)

	var nav := UI.hbox(10)
	main.add_child(nav)
	_prev = UI.button("‹ Previous", "ghost", 48)
	_prev.pressed.connect(func(): _go(idx - 1))
	nav.add_child(_prev)
	nav.add_child(UI.spacer())
	_next = UI.button("Next ›", "primary", 48)
	_next.pressed.connect(_on_next)
	nav.add_child(_next)

	# the route: on wide screens beside the card, on phones underneath
	var wide := column_width() >= 700
	var rp := PanelContainer.new()
	rp.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("line"), 14, 1, Vector4(12, 12, 14, 12)))
	if wide:
		rp.custom_minimum_size.x = 260
		rp.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
		cols.add_child(rp)
	else:
		main.add_child(rp)
	var rv := UI.vbox(6)
	rp.add_child(rv)
	rv.add_child(UI.label("THE ROUTE", 11, "muted", "mono", false))
	_route = UI.vbox(0)
	rv.add_child(_route)
	_show()


func _on_next() -> void:
	if _next.disabled:
		return
	if idx >= nodes.size() - 1:
		_finish()
	else:
		_go(idx + 1)


func _go(i: int) -> void:
	if i < 0 or i >= nodes.size() or i == idx:
		return
	idx = i
	Audio.play("page")
	_show()


func _show() -> void:
	var n: Dictionary = nodes[idx]
	_step_label.text = "Step %d of %d" % [idx + 1, nodes.size()]
	_bar.value = float(idx + 1) / nodes.size()
	for c in _card.get_children():
		c.queue_free()
	var top := UI.hbox(10)
	_card.add_child(top)
	top.add_child(UI.marker(String(n["t"]), 22))
	top.add_child(UI.pill(PD.TYPE_LABEL[n["t"]], "accent"))
	top.add_child(UI.spacer())
	top.add_child(UI.label("%d / %d" % [idx + 1, nodes.size()], 14, "muted", "mono", false))
	_card.add_child(UI.label(String(n["n"]), 32, "fg", "display"))
	_card.add_child(UI.label(String(n["i"]), 18, "fg"))
	var keep := PanelContainer.new()
	keep.add_theme_stylebox_override("panel", Style.box(Style.c("accent_soft"), Color.TRANSPARENT, 10, 0, Vector4(14, 10, 14, 10)))
	var kv := UI.vbox(2)
	keep.add_child(kv)
	kv.add_child(UI.label("REMEMBER IT AS", 11, "accent", "mono", false))
	kv.add_child(UI.label(String(n["h"]), 15, "fg"))
	_card.add_child(keep)
	if idx > 0:
		var prev: Dictionary = nodes[idx - 1]
		var from := UI.hbox(6)
		from.add_child(UI.label("Comes after", 13, "muted", "body", false))
		from.add_child(UI.marker(String(prev["t"]), 12))
		from.add_child(UI.label(String(prev["n"]), 13, "muted", "bold"))
		_card.add_child(from)
	UI.fade_in(_card, 0.18)
	_prev.disabled = idx == 0
	_next.disabled = false
	_next.text = "Finish" if idx == nodes.size() - 1 else "Next ›"
	_draw_route()


func _draw_route() -> void:
	for c in _route.get_children():
		c.queue_free()
	for i in nodes.size():
		var n: Dictionary = nodes[i]
		var row := HBoxContainer.new()
		row.add_theme_constant_override("separation", 6)
		var rail := StationRail.new()
		rail.custom_minimum_size = Vector2(28, 34)
		rail.kind = String(n["t"])
		rail.first = i == 0
		rail.last = i == nodes.size() - 1
		rail.link_up = i <= idx
		rail.link_down = i < idx
		rail.known = true
		row.add_child(rail)
		var b := Button.new()
		b.text = String(n["n"])
		b.flat = true
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		b.add_theme_font_size_override("font_size", 13)
		var col := Style.c("fg") if i == idx else (Style.c("muted") if i > idx else Style.c("fg").lerp(Style.c("muted"), 0.4))
		for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
			b.add_theme_color_override(k, col)
		b.add_theme_font_override("font", Style.font("bold" if i == idx else "body"))
		var sb := Style.box(Style.c("accent_soft") if i == idx else Color.TRANSPARENT, Color.TRANSPARENT, 8, 0, Vector4(8, 4, 8, 4))
		for k in ["normal", "hover", "pressed", "focus"]:
			b.add_theme_stylebox_override(k, sb if k != "hover" else Style.box(Style.c("surface2"), Color.TRANSPARENT, 8, 0, Vector4(8, 4, 8, 4)))
		var j := i
		b.pressed.connect(func(): _go(j))
		row.add_child(b)
		_route.add_child(row)


func _finish() -> void:
	SaveData.mark_studied(pid)
	Audio.play("win")
	for c in _card.get_children():
		c.queue_free()
	_card.add_child(UI.icon("check", 34, "good"))
	_card.add_child(UI.label("You have walked the whole pathway", 26, "fg", "display"))
	_card.add_child(UI.label("%d steps, from %s to %s. Now test yourself." % [nodes.size(), nodes[0]["n"], nodes[nodes.size() - 1]["n"]], 16, "muted"))
	var row := UI.flow(10)
	_card.add_child(row)
	var diff := String(SaveData.settings.get("difficulty", "standard"))
	var f := UI.button("Fill the gaps", "primary", 48)
	f.pressed.connect(func(): Router.go("play", {"pid": pid, "mode": "fill", "difficulty": diff}))
	row.add_child(f)
	var a := UI.button("Arrange the order", "soft", 48)
	a.pressed.connect(func(): Router.go("play", {"pid": pid, "mode": "arrange", "difficulty": diff}))
	row.add_child(a)
	var again := UI.button("Read it again", "ghost", 48)
	again.pressed.connect(func(): idx = -1; _go(0))
	row.add_child(again)
	_next.disabled = true
	UI.burst(self, get_global_mouse_position() - global_position, [Style.c("accent"), Style.c("good"), Style.c("warn")], 36)


func _unhandled_input(event: InputEvent) -> void:
	var k := event as InputEventKey
	if k and k.pressed and not k.echo:
		if k.keycode == KEY_RIGHT:
			_on_next()
		elif k.keycode == KEY_LEFT:
			_go(idx - 1)
