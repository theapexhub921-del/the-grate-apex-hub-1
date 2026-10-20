extends Control
## One round of Fill the gaps or Arrange the order: the HUD, the countdown, the pathway drawn as a
## metro line (one station per step), the pieces, the explainer and hints.
## The rules are in PathwayRound; this screen draws them and turns taps and drags into moves.
##
## Fill: drag a piece onto a gap, or tap a piece and then tap a gap.
## Arrange: drag a row by its grip, or use its up / down buttons, then Check order.

const WIDE := 900.0
const DRAG_START := 8.0

var params: Dictionary = {}
var r: PathwayRound
var p: Dictionary
var rng := RandomNumberGenerator.new()
var wide := false

var _root: Control
var _layer: CanvasLayer
var _back: Button
var _clock: Label
var _score: Label
var _hints: Label
var _combo: Label
var _hint_btn: Button
var _check_btn: Button
var _timer: TimerBar
var _board_scroll: ScrollContainer
var _board: VBoxContainer
var _bank_flow: HFlowContainer
var _bank_label: Label
var _note: Label
var _info_box: VBoxContainer
var _info_panel: PanelContainer

var _rails: Dictionary = {}     # fill: step index -> StationRail
var _cells: Dictionary = {}     # fill: step index -> Button (node or gap)
var _rows: Array = []           # arrange: row panels in order
var _grips: Array = []          # arrange: grip controls (touches there never scroll)

var _selected := ""             # piece id picked by a tap
var _press_piece: Dictionary = {}
var _press_pos := Vector2.ZERO
var _dragging := false
var _ghost: Control
var _hot := -1
var _drag_row := ""             # arrange: id of the row being dragged

var _info: Dictionary = {"kind": "idle"}
var _note_text := ""
var _note_kind := ""
var _leave_armed := false
var _elapsed := 0.0
var _last_sec := -1
var _ending := false
var _edge_time := 0.0


func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	p = PD.get_pathway(String(params.get("pid", "")))
	if p.is_empty():
		Router.go.call_deferred("home")
		return
	var mode := String(params.get("mode", "fill"))
	var diff := String(params.get("difficulty", SaveData.settings.get("difficulty", "standard")))
	r = PathwayRound.new(p, mode, diff)
	rng.randomize()
	if mode == "fill":
		r.setup_fill(rng, params.get("focus", []))
	else:
		r.setup_arrange(rng)
	Style.set_accent(PD.color(p))
	theme = Style.theme
	add_child(LabBackground.new())
	_layer = CanvasLayer.new()
	_layer.layer = 5
	add_child(_layer)
	wide = size.x >= WIDE
	_build()
	resized.connect(_on_resized)
	Audio.play("start")


func _on_resized() -> void:
	var w := size.x >= WIDE
	if w != wide:
		wide = w
		_build()


# ================================================================== layout

func _build() -> void:
	if _root:
		_root.queue_free()
	_rails.clear()
	_cells.clear()
	_rows.clear()
	_grips.clear()
	var m := MarginContainer.new()
	m.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	var side := int(maxf(12.0, (size.x - 1180.0) / 2.0))
	m.add_theme_constant_override("margin_left", side)
	m.add_theme_constant_override("margin_right", side)
	m.add_theme_constant_override("margin_top", 10)
	m.add_theme_constant_override("margin_bottom", 10)
	add_child(m)
	move_child(m, 1)
	_root = m
	var v := UI.vbox(10)
	v.size_flags_vertical = Control.SIZE_EXPAND_FILL
	m.add_child(v)
	_build_hud(v)
	if r.timed():
		_timer = TimerBar.new()
		v.add_child(_timer)
	else:
		_timer = null

	var body := HBoxContainer.new()
	body.add_theme_constant_override("separation", 16)
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	v.add_child(body)
	var left := UI.vbox(10)
	left.size_flags_vertical = Control.SIZE_EXPAND_FILL
	body.add_child(left)

	var stage := PanelContainer.new()
	stage.size_flags_vertical = Control.SIZE_EXPAND_FILL
	stage.add_theme_stylebox_override("panel", Style.box(Color(Style.c("surface"), 0.86), Style.c("line"), 18, 1, Vector4(14, 12, 10, 12)))
	left.add_child(stage)
	_board_scroll = ScrollContainer.new()
	_board_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	_board_scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	stage.add_child(_board_scroll)
	add_child(TouchScroll.new(_board_scroll, _touch_blocked))
	var bm := MarginContainer.new()
	bm.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	bm.add_theme_constant_override("margin_right", 8)
	_board_scroll.add_child(bm)
	_board = UI.vbox(0)
	bm.add_child(_board)

	_info_panel = PanelContainer.new()
	_info_box = UI.vbox(6)
	if wide:
		var side_col := UI.vbox(12)
		side_col.custom_minimum_size.x = 330
		side_col.size_flags_horizontal = Control.SIZE_SHRINK_END
		body.add_child(side_col)
		side_col.add_child(_info_panel)
		_info_panel.add_child(_info_box)
		side_col.add_child(_how_to())

	var bottom := PanelContainer.new()
	bottom.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("line"), 16, 1, Vector4(12, 10, 12, 10)))
	left.add_child(bottom)
	var bv := UI.vbox(8)
	bottom.add_child(bv)
	if not wide:
		# phones: the explainer sits at the top of the bottom panel, small, and only when it has something to say
		var sc := ScrollContainer.new()
		sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
		sc.custom_minimum_size.y = 66
		_info_panel.add_child(sc)
		_info_box.add_theme_constant_override("separation", 3)
		sc.add_child(_info_box)
		add_child(TouchScroll.new(sc))
		bv.add_child(_info_panel)
	_note = UI.label(_note_text, 13, "muted", "mono")
	_note.add_theme_color_override("font_color", _note_color())
	if r.mode == "fill":
		_bank_label = UI.label("", 11, "muted", "mono", false)
		bv.add_child(_bank_label)
		_bank_flow = UI.flow(6 if not wide else 8)
		bv.add_child(_bank_flow)
		bv.add_child(_note)
	else:
		var row := UI.hbox(10)
		bv.add_child(row)
		row.add_child(_note)
		_check_btn = UI.button("Check order", "primary", 46)
		_check_btn.pressed.connect(_check)
		row.add_child(_check_btn)

	_render_board()
	_render_bank()
	_render_info()
	_update_hud()


func _build_hud(v: VBoxContainer) -> void:
	_back = UI.button("‹ Pathways", "ghost", 38)
	_back.pressed.connect(_on_back)
	_hint_btn = UI.button("Hint", "soft", 40)
	_hint_btn.pressed.connect(_hint)
	_hint_btn.tooltip_text = "Show a hint for the next gap (costs %d points). Keyboard: H" % r.hint_cost()
	var title := UI.vbox(2)
	title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	title.add_child(UI.eyebrow(String(p["subj"])))
	title.add_child(UI.label(String(p["name"]), 26 if wide else 21, "fg", "display"))
	title.add_child(UI.label("%s · %s" % ["Fill the gaps" if r.mode == "fill" else "Arrange the order", PathwayRound.DIFFICULTY[r.difficulty]["label"]], 12, "muted", "mono", false))
	var stats := UI.hbox(8)
	_clock = _stat(stats, "Time" if r.timed() else "Elapsed")
	_score = _stat(stats, "Score")
	_hints = _stat(stats, "Hints")
	_combo = _stat(stats, "Combo")
	if wide:
		var row := UI.hbox(14)
		v.add_child(row)
		var lcol := UI.vbox(6)
		lcol.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		row.add_child(lcol)
		var brow := UI.hbox(8)
		brow.add_child(_back)
		lcol.add_child(brow)
		lcol.add_child(title)
		stats.size_flags_horizontal = Control.SIZE_SHRINK_END
		stats.size_flags_vertical = Control.SIZE_SHRINK_END
		row.add_child(stats)
		_hint_btn.size_flags_vertical = Control.SIZE_SHRINK_END
		row.add_child(_hint_btn)
	else:
		var r1 := UI.hbox(8)
		v.add_child(r1)
		r1.add_child(_back)
		var t2 := UI.vbox(0)
		t2.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var nm := UI.label(String(p["name"]), 18, "fg", "display", false)
		nm.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		nm.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		nm.clip_text = true
		t2.add_child(nm)
		t2.add_child(UI.label("%s · %s" % ["Fill the gaps" if r.mode == "fill" else "Arrange", PathwayRound.DIFFICULTY[r.difficulty]["label"]], 11, "muted", "mono", false))
		r1.add_child(t2)
		r1.add_child(_hint_btn)
		title.queue_free()
		for c in stats.get_children():
			c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		v.add_child(stats)


func _stat(parent: Control, caption: String) -> Label:
	var pc := PanelContainer.new()
	pc.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("line"), 12, 1, Vector4(12, 5, 12, 6) if wide else Vector4(10, 3, 10, 4)))
	pc.custom_minimum_size.x = 70
	var vb := UI.vbox(0)
	pc.add_child(vb)
	vb.add_child(UI.label(caption.to_upper(), 10, "muted", "mono", false))
	var val := UI.label("0", 20 if wide else 17, "fg", "mono", false)
	vb.add_child(val)
	parent.add_child(pc)
	return val


func _how_to() -> Control:
	var pc := PanelContainer.new()
	pc.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("line"), 16, 1, Vector4(16, 12, 16, 14)))
	var vb := UI.vbox(6)
	pc.add_child(vb)
	vb.add_child(UI.label("SHAPES", 11, "muted", "mono", false))
	for t in ["e", "m", "s", "r"]:
		var row := UI.hbox(8)
		row.add_child(UI.marker(t, 14))
		row.add_child(UI.label(PD.TYPE_LABEL[t], 13, "muted", "body", false))
		vb.add_child(row)
	vb.add_child(UI.label("Keyboard: H for a hint." + (" Enter checks the order." if r.mode == "arrange" else ""), 12, "muted"))
	return pc


# ================================================================== board

func _render_board() -> void:
	for c in _board.get_children():
		c.queue_free()
	_rails.clear()
	_cells.clear()
	_rows.clear()
	_grips.clear()
	var instr := UI.label(_instructions(), 14, "muted")
	var im := MarginContainer.new()
	im.add_theme_constant_override("margin_bottom", 10)
	im.add_child(instr)
	_board.add_child(im)
	if r.mode == "fill":
		_render_chain()
	else:
		_render_rows()


func _instructions() -> String:
	if r.mode == "fill" and not wide:
		var d := r.bank.size() - r.open_gaps().size()
		return "Drag a piece onto its gap, or tap a piece then a gap. %d decoy%s. Tap a step to read about it." % [maxi(0, d), "" if d == 1 else "s"]
	if r.mode == "arrange" and not wide:
		return "Drag by the grip or use the arrows to order the steps, then Check order. Tap a step to read about it."
	if r.mode == "fill":
		var decoys := r.bank.size() - r.open_gaps().size()
		return "Drag each piece onto the gap it belongs in, or tap a piece and then tap a gap. %d of the pieces are decoys. Tap any step on the line to read about it." % maxi(0, decoys)
	return "Drag a step by its grip, or use the arrows, to put the steps in order from first to last. Tap a step to read about it, then press Check order."


func _known(i: int) -> bool:
	return i >= 0 and i < r.nodes.size() and not r.is_gap_open(i)


func _render_chain() -> void:
	var n := r.nodes.size()
	for i in n:
		var node: Dictionary = r.nodes[i]
		var row := HBoxContainer.new()
		row.add_theme_constant_override("separation", 10)
		var rail := StationRail.new()
		rail.kind = String(node["t"])
		rail.first = i == 0
		rail.last = i == n - 1
		rail.known = _known(i)
		rail.link_up = _known(i) and _known(i - 1)
		rail.link_down = _known(i) and _known(i + 1)
		row.add_child(rail)
		_rails[i] = rail
		var cm := MarginContainer.new()
		cm.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		cm.add_theme_constant_override("margin_top", 4)
		cm.add_theme_constant_override("margin_bottom", 4)
		row.add_child(cm)
		var b := Button.new()
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		b.custom_minimum_size.y = 40
		b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		var j := i
		if r.is_gap_open(i):
			b.text = "%s  ·  gap %d" % [PD.TYPE_SLOT[node["t"]], i + 1]
			_style_cell(b, String(node["t"]), "gap")
			b.pressed.connect(func(): _tap_gap(j))
		else:
			b.text = String(node["n"])
			_style_cell(b, String(node["t"]), "placed" if r.gaps.has(i) else "given")
			b.pressed.connect(func(): _explain(r.nodes[j]))
		cm.add_child(b)
		_cells[i] = b
		_board.add_child(row)


## Looks for a step on the line: type decides the shape (enzymes are accent pills), state
## decides the border: given, placed (green), gap (dashed look), ready (a piece is picked), hot.
func _style_cell(b: Button, t: String, state: String) -> void:
	var acc := Style.c("accent")
	var radius := 999 if t == "e" else (6 if t in ["s", "r"] else 10)
	var bg := Style.c("surface2")
	var border := Style.c("line")
	var bw := 1
	var fg := Style.c("fg")
	var font := "bold"
	var size := 15
	if t == "e":
		bg = Style.c("surface2").lerp(acc, 0.14)
		border = Color(acc, 0.55)
		fg = acc
		font = "mono"
		size = 14
	if t == "r":
		bw = 3
		border = Style.c("muted")
	match state:
		"placed":
			border = Style.c("good")
			bw = 2
			bg = bg.lerp(Style.c("good"), 0.10)
		"gap", "ready", "hot":
			bg = Color(0, 0, 0, 0)
			border = Color(Style.c("muted"), 0.6)
			bw = 1
			fg = Style.c("muted")
			font = "mono"
			size = 13
			if state == "ready":
				border = Color(acc, 0.7)
				bg = Color(acc, 0.06)
			elif state == "hot":
				border = acc
				bw = 2
				bg = Color(acc, 0.18)
				fg = acc
	var pad := Vector4(14, 8, 14, 8)
	var sb := Style.box(bg, border, radius, bw, pad)
	var hover := Style.box(bg if state != "given" and state != "placed" else bg.lerp(acc, 0.06), acc, radius, maxi(bw, 1), pad)
	b.add_theme_stylebox_override("normal", sb)
	b.add_theme_stylebox_override("hover", hover)
	b.add_theme_stylebox_override("pressed", hover)
	b.add_theme_stylebox_override("focus", Style.box(Color(0, 0, 0, 0), acc, radius, 2, pad))
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color", "font_hover_pressed_color"]:
		b.add_theme_color_override(k, fg)
	b.add_theme_font_override("font", Style.font(font))
	b.add_theme_font_size_override("font_size", size)


func _render_rows() -> void:
	var n := r.order.size()
	var list := UI.vbox(8)
	_board.add_child(list)
	for j in n:
		var node: Dictionary = r.order[j]
		var id := String(node["id"])
		var row := PanelContainer.new()
		var border := Style.c("line")
		var bw := 1
		if r.marks.has(id):
			border = Style.c("good") if r.marks[id] else Style.c("bad")
			bw = 2
		row.add_theme_stylebox_override("panel", Style.box(Style.c("surface2"), border, 12, bw, Vector4(8, 6, 8, 6)))
		row.set_meta("id", id)
		if _drag_row == id:
			row.modulate.a = 0.3
		var h := UI.hbox(8)
		row.add_child(h)
		var pos := UI.label(str(j + 1), 13, "muted", "mono", false)
		pos.custom_minimum_size.x = 22
		pos.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		h.add_child(pos)
		var grip := Control.new()
		grip.custom_minimum_size = Vector2(30, 40)
		grip.mouse_default_cursor_shape = Control.CURSOR_MOVE
		grip.tooltip_text = "Drag to move"
		grip.draw.connect(func(): UI.draw_icon(grip, "grip", Rect2(Vector2(3, 8), Vector2(24, 24)), Style.c("muted")))
		grip.gui_input.connect(func(e): _grip_input(e, id))
		h.add_child(grip)
		_grips.append(grip)
		h.add_child(UI.marker(String(node["t"]), 14))
		var body := Button.new()
		body.text = String(node["n"])
		body.flat = true
		body.alignment = HORIZONTAL_ALIGNMENT_LEFT
		body.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		body.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		var t := String(node["t"])
		var fg := Style.c("accent") if t == "e" else Style.c("fg")
		for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
			body.add_theme_color_override(k, fg)
		body.add_theme_font_override("font", Style.font("mono" if t == "e" else "bold"))
		body.add_theme_font_size_override("font_size", 14 if t == "e" else 15)
		var nd := node
		body.pressed.connect(func(): _explain(nd))
		h.add_child(body)
		var jj := j
		var up := UI.icon_button("up", "Move up", 34)
		up.disabled = j == 0
		up.pressed.connect(func(): _move_row(jj, jj - 1, "up"))
		h.add_child(up)
		var dn := UI.icon_button("down", "Move down", 34)
		dn.disabled = j == n - 1
		dn.pressed.connect(func(): _move_row(jj, jj + 1, "down"))
		h.add_child(dn)
		list.add_child(row)
		_rows.append(row)


func _move_row(from: int, to: int, dir: String) -> void:
	if r.over or to < 0 or to >= r.order.size():
		return
	r.move(from, to)
	Audio.play("tap")
	_render_board()
	# keep the keyboard on the same row's button so it can be moved again
	await get_tree().process_frame
	if to < _rows.size():
		var h: HBoxContainer = _rows[to].get_child(0)
		var btn: Button = h.get_child(h.get_child_count() - (2 if dir == "up" else 1))
		if not btn.disabled:
			btn.grab_focus()
		_board_scroll.ensure_control_visible(_rows[to])


# ================================================================== bank

func _render_bank() -> void:
	if _bank_flow == null:
		return
	for c in _bank_flow.get_children():
		c.queue_free()
	var decoys := r.bank.size() - r.open_gaps().size()
	_bank_label.text = "PIECES TO PLACE · %d LEFT · %d DECOY%s" % [r.open_gaps().size(), decoys, "" if decoys == 1 else "S"]
	for piece in r.bank:
		_bank_flow.add_child(_token(piece))


func _token(piece: Dictionary) -> Button:
	var b := Button.new()
	b.text = String(piece["n"])
	b.custom_minimum_size.y = 42 if wide else 34
	b.mouse_default_cursor_shape = Control.CURSOR_DRAG
	b.focus_mode = Control.FOCUS_ALL
	var t := String(piece["t"])
	_style_cell(b, t, "given")
	if not wide:
		_compact(b, t)
	if _selected == String(piece["id"]):
		var acc := Style.c("accent")
		var sel := Style.box(Color(acc, 0.22), acc, 999 if t == "e" else 10, 2, Vector4(14, 8, 14, 8) if wide else Vector4(10, 4, 10, 4))
		for k in ["normal", "hover", "pressed", "focus"]:
			b.add_theme_stylebox_override(k, sel)
	b.set_meta("piece", piece)
	b.gui_input.connect(func(e): _token_input(e, b))
	return b


## Smaller pieces on phones, so more of the board stays in view.
func _compact(b: Button, t: String) -> void:
	for k in ["normal", "hover", "pressed", "focus"]:
		var sb := b.get_theme_stylebox(k) as StyleBoxFlat
		if sb:
			var c := sb.duplicate() as StyleBoxFlat
			c.content_margin_left = 10
			c.content_margin_right = 10
			c.content_margin_top = 4
			c.content_margin_bottom = 4
			b.add_theme_stylebox_override(k, c)
	b.add_theme_font_size_override("font_size", 13 if t == "e" else 14)


func _token_input(e: InputEvent, b: Button) -> void:
	if r.over:
		return
	if e is InputEventMouseButton and e.button_index == MOUSE_BUTTON_LEFT and e.pressed:
		_press_piece = b.get_meta("piece")
		_press_pos = b.get_global_mouse_position()
		_dragging = false
	elif e is InputEventKey and e.pressed and not e.echo and e.keycode in [KEY_ENTER, KEY_KP_ENTER, KEY_SPACE]:
		_select(b.get_meta("piece"))
		b.accept_event()


func _select(piece: Dictionary) -> void:
	var id := String(piece["id"])
	_selected = "" if _selected == id else id
	Audio.play("tap")
	_explain(piece)
	_render_bank()
	_restyle_gaps()
	if _selected != "":
		_say("", "Now tap the gap where %s belongs." % piece["n"])


func _selected_piece() -> Dictionary:
	for piece in r.bank:
		if String(piece["id"]) == _selected:
			return piece
	return {}


func _restyle_gaps() -> void:
	for i in _cells.keys():
		if r.is_gap_open(i):
			_style_cell(_cells[i], String(r.nodes[i]["t"]), "hot" if i == _hot else ("ready" if _selected != "" or _dragging else "gap"))
			_rails[i].hot = i == _hot
			_rails[i].queue_redraw()


func _tap_gap(i: int) -> void:
	if r.over:
		return
	var piece := _selected_piece()
	if piece.is_empty():
		_say("", "Pick a piece from below first, or drag one here.")
		Audio.play("tap")
		return
	_attempt(i, piece)


# ================================================================== pointer: dragging pieces and rows

func _touch_blocked(pos: Vector2) -> bool:
	if not _press_piece.is_empty() or _drag_row != "":
		return true
	for g in _grips:
		if is_instance_valid(g) and (g as Control).get_global_rect().grow(6).has_point(pos):
			return true
	return false


func _input(event: InputEvent) -> void:
	if not _press_piece.is_empty():
		if event is InputEventMouseMotion:
			var pos: Vector2 = event.position
			if not _dragging and pos.distance_to(_press_pos) > DRAG_START:
				_start_drag()
			if _dragging:
				_ghost.position = pos - _ghost.size * 0.5 - Vector2(0, 26)
				_set_hot(_gap_at(pos))
				get_viewport().set_input_as_handled()
		elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and not event.pressed:
			var piece := _press_piece
			_press_piece = {}
			if _dragging:
				var target := _gap_at(event.position)
				_end_drag()
				if target >= 0:
					_attempt(target, piece)
				else:
					_say("", "Drop the piece on a gap in the line.")
			else:
				_select(piece)
			get_viewport().set_input_as_handled()
	elif _drag_row != "":
		if event is InputEventMouseMotion:
			_reorder_to(event.position.y)
			if _ghost:
				_ghost.position = Vector2(_ghost.position.x, event.position.y - _ghost.size.y * 0.5)
			get_viewport().set_input_as_handled()
		elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and not event.pressed:
			_drag_row = ""
			if _ghost:
				_ghost.queue_free()
				_ghost = null
			Audio.play("tap")
			_render_board()
			get_viewport().set_input_as_handled()


func _start_drag() -> void:
	_dragging = true
	Audio.play("pick")
	var b := Button.new()
	b.text = String(_press_piece["n"])
	b.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_style_cell(b, String(_press_piece["t"]), "given")
	var acc := Style.c("accent")
	b.add_theme_stylebox_override("normal", Style.box(Style.c("surface2").lerp(acc, 0.2), acc, 999 if _press_piece["t"] == "e" else 10, 2, Vector4(14, 8, 14, 8)))
	b.modulate.a = 0.95
	_layer.add_child(b)
	b.reset_size()
	_ghost = b
	for c in _bank_flow.get_children():
		if c.get_meta("piece", {}) == _press_piece:
			(c as Control).modulate.a = 0.3
	_restyle_gaps()


func _end_drag() -> void:
	_dragging = false
	if _ghost:
		_ghost.queue_free()
		_ghost = null
	_set_hot(-1)
	for c in _bank_flow.get_children():
		(c as Control).modulate.a = 1.0
	_restyle_gaps()


func _gap_at(pos: Vector2) -> int:
	if not _board_scroll.get_global_rect().has_point(pos):
		return -1
	for i in _cells.keys():
		if r.is_gap_open(i):
			var row: Control = (_cells[i] as Control).get_parent().get_parent()
			if row.get_global_rect().grow_individual(0, 4, 0, 4).has_point(pos):
				return i
	return -1


func _set_hot(i: int) -> void:
	if i == _hot:
		return
	_hot = i
	_restyle_gaps()


func _grip_input(e: InputEvent, id: String) -> void:
	if r.over:
		return
	if e is InputEventMouseButton and e.button_index == MOUSE_BUTTON_LEFT and e.pressed:
		_drag_row = id
		Audio.play("pick")
		for row in _rows:
			if row.get_meta("id") == id:
				var g := PanelContainer.new()
				g.add_theme_stylebox_override("panel", Style.box(Style.c("surface2"), Style.c("accent"), 12, 2, Vector4(14, 10, 14, 10)))
				var nd: Dictionary = r.order.filter(func(x): return String(x["id"]) == id)[0]
				g.add_child(UI.label(String(nd["n"]), 15, "fg", "bold", false))
				g.mouse_filter = Control.MOUSE_FILTER_IGNORE
				_layer.add_child(g)
				g.size = Vector2((row as Control).size.x, 0)
				g.position = Vector2((row as Control).global_position.x, (row as Control).global_position.y)
				_ghost = g
				(row as Control).modulate.a = 0.3
		get_viewport().set_input_as_handled()


func _reorder_to(y: float) -> void:
	var cur := -1
	for k in r.order.size():
		if String(r.order[k]["id"]) == _drag_row:
			cur = k
	if cur < 0:
		return
	var target := 0
	for k in _rows.size():
		if k == cur:
			continue
		var rect := (_rows[k] as Control).get_global_rect()
		if y > rect.position.y + rect.size.y * 0.5:
			target += 1
	if target != cur:
		r.move(cur, target)
		Audio.play("tap")
		_render_board()


func _process(delta: float) -> void:
	if r == null:
		return
	# keep the board moving under a held piece that rests near its top or bottom edge
	# (only after a short pause there, so carrying a piece up from the tray does not scroll)
	if (_dragging or _drag_row != "") and _board_scroll:
		var pos := get_global_mouse_position()
		var rect := _board_scroll.get_global_rect()
		var edge := clampf(rect.size.y * 0.15, 24.0, 70.0)
		var dir := 0.0
		if rect.has_point(pos):
			if pos.y < rect.position.y + edge:
				dir = -(1.0 - (pos.y - rect.position.y) / edge)
			elif pos.y > rect.end.y - edge:
				dir = 1.0 - (rect.end.y - pos.y) / edge
		_edge_time = _edge_time + delta if dir != 0.0 else 0.0
		if _edge_time > 0.35:
			_board_scroll.scroll_vertical += int(560.0 * delta * dir)
	else:
		_edge_time = 0.0
	if r.over:
		return
	if r.timed():
		var ended := r.tick(delta)
		_update_clock()
		var sec := int(ceil(r.time_left))
		if sec != _last_sec:
			_last_sec = sec
			if sec <= 10 and sec > 0:
				Audio.play("tick")
		if ended:
			_time_up()
	else:
		_elapsed += delta
		_update_clock()


# ================================================================== moves

func _attempt(i: int, piece: Dictionary) -> void:
	if r.over:
		return
	var at := _cell_center(i)
	var res := r.attempt(i, piece)
	if res["ok"]:
		_selected = ""
		var node: Dictionary = r.nodes[i]
		_explain(node)
		var combo := int(res["combo"])
		Audio.play("combo" if combo >= 3 else "place")
		_say("good", "Correct. %s belongs there." % node["n"])
		UI.float_text(self, "+%d" % int(res["points"]), at, "good")
		if combo >= 2:
			UI.float_text(self, "Combo x%d" % combo, at + Vector2(70, 18), "warn", 16)
		UI.burst(self, at, [Style.c("accent"), Style.c("good"), Color.WHITE], 18 if combo < 3 else 34, 0.6)
		_render_board()
		_render_bank()
		_update_hud()
		await get_tree().process_frame
		if _cells.has(i):
			UI.pulse(_cells[i], 1.06)
		if res["done"]:
			_win()
	else:
		Audio.play("wrong")
		_explain(piece)
		_say("bad", "That piece does not fit this gap. Read its explanation and try another.")
		UI.float_text(self, "-15", at, "bad")
		if _cells.has(i):
			UI.shake(_cells[i])
		_update_hud()


func _cell_center(i: int) -> Vector2:
	if _cells.has(i):
		var rect := (_cells[i] as Control).get_global_rect()
		if rect.size.x > 1.0 and rect.position.y > 1.0:
			return rect.get_center() - global_position
	return _board_scroll.get_global_rect().get_center() - global_position if _board_scroll else size * 0.5


func _hint() -> void:
	if r.over:
		return
	if r.hints_left <= 0:
		_say("bad", "No hints left.")
		Audio.play("wrong")
		return
	var h := r.hint()
	if h.is_empty():
		if r.mode == "arrange":
			_say("good", "Every step is already in place. Press Check order.")
		return
	Audio.play("hint")
	_info = {"kind": "hint", "where": h["where"], "text": h["text"]}
	_render_info()
	_update_hud()
	var idx := int(h["index"])
	var target: Control = null
	if r.mode == "fill" and _cells.has(idx):
		target = _cells[idx]
	elif r.mode == "arrange" and idx < _rows.size():
		target = _rows[idx]
	if target:
		_board_scroll.ensure_control_visible(target)
		_glow(target)


## Three soft yellow pulses on a row (the original's "glow").
func _glow(c: Control) -> void:
	if Style.reduced_motion():
		return
	var tw := c.create_tween()
	for k in 3:
		tw.tween_property(c, "modulate", Color(1.5, 1.4, 0.7), 0.25)
		tw.tween_property(c, "modulate", Color.WHITE, 0.25)


func _check() -> void:
	if r.over:
		return
	var c := r.check()
	if r.over:
		_render_board()
		_win()
		return
	Audio.play("wrong")
	_say("bad", "%d of %d steps are in the right place. Green is correct, red is not." % [c, r.nodes.size()])
	_render_board()
	_update_hud()


# ================================================================== explainer, notes, HUD

func _explain(node: Dictionary) -> void:
	_info = {"kind": "node", "node": node}
	_render_info()


func _render_info() -> void:
	if _info_box == null:
		return
	for c in _info_box.get_children():
		c.queue_free()
	var acc := Style.c("accent")
	if not wide:
		_info_panel.visible = String(_info["kind"]) != "idle"
		_info_panel.add_theme_stylebox_override("panel", StyleBoxEmpty.new())
		if String(_info["kind"]) == "hint":
			var hr := UI.hbox(6)
			hr.add_child(UI.icon("hint", 14, "warn"))
			hr.add_child(UI.label("HINT · " + String(_info["where"]).to_upper(), 11, "warn", "mono", false))
			_info_box.add_child(hr)
			_info_box.add_child(UI.label(String(_info["text"]), 14, "fg"))
		elif String(_info["kind"]) == "node":
			var node0: Dictionary = _info["node"]
			var nr := UI.hbox(6)
			nr.add_child(UI.marker(String(node0["t"]), 12))
			nr.add_child(UI.label(String(node0["n"]), 15, "fg", "bold"))
			nr.add_child(UI.pill(PD.TYPE_LABEL[node0["t"]], "accent"))
			_info_box.add_child(nr)
			_info_box.add_child(UI.label(String(node0["i"]), 13, "muted"))
		UI.fade_in(_info_box, 0.15)
		return
	match String(_info["kind"]):
		"hint":
			_info_panel.add_theme_stylebox_override("panel", Style.box(Style.c("surface").lerp(Style.c("warn"), 0.11), Color(Style.c("warn"), 0.5), 16, 1, Vector4(16, 12, 16, 14)))
			var row := UI.hbox(8)
			row.add_child(UI.icon("hint", 16, "warn"))
			row.add_child(UI.label("HINT · " + String(_info["where"]).to_upper(), 11, "warn", "mono", false))
			_info_box.add_child(row)
			_info_box.add_child(UI.label(String(_info["text"]), 15, "fg"))
		"node":
			_info_panel.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Color(acc, 0.45), 16, 1, Vector4(16, 12, 16, 14)))
			var node: Dictionary = _info["node"]
			var row := UI.hbox(8)
			row.add_child(UI.marker(String(node["t"]), 14))
			row.add_child(UI.pill(PD.TYPE_LABEL[node["t"]], "accent"))
			_info_box.add_child(row)
			_info_box.add_child(UI.label(String(node["n"]), 20, "fg", "display"))
			_info_box.add_child(UI.label(String(node["i"]), 15, "fg"))
		_:
			_info_panel.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Color(acc, 0.3), 16, 1, Vector4(16, 12, 16, 14)))
			_info_box.add_child(UI.label("EXPLAINER", 11, "muted", "mono", false))
			_info_box.add_child(UI.label("Tap any step or piece to see what it does and why it matters.", 14, "muted"))
	UI.fade_in(_info_box, 0.15)


func _say(kind: String, text: String) -> void:
	_note_text = text
	_note_kind = kind
	if _note:
		_note.text = text
		_note.add_theme_color_override("font_color", _note_color())


func _note_color() -> Color:
	return Style.c("good") if _note_kind == "good" else (Style.c("bad") if _note_kind == "bad" else Style.c("muted"))


func _update_hud() -> void:
	_score.text = str(r.score)
	_hints.text = str(r.hints_left)
	_combo.text = ("x%d" % r.combo) if r.combo >= 2 else "-"
	_combo.add_theme_color_override("font_color", Style.c("warn") if r.combo >= 2 else Style.c("fg"))
	_hint_btn.disabled = r.over or r.hints_left <= 0
	if _check_btn:
		_check_btn.disabled = r.over
	_update_clock()


func _update_clock() -> void:
	if r.timed():
		var left := int(ceil(r.time_left))
		_clock.text = "%d:%02d" % [left / 60, left % 60]
		var low := r.time_left <= 30.0
		_clock.add_theme_color_override("font_color", Style.c("bad") if low else Style.c("fg"))
		if _timer:
			_timer.fraction = r.time_left / r.total_time
			_timer.low = low
	else:
		var s := int(_elapsed)
		_clock.text = "%d:%02d" % [s / 60, s % 60]


func _on_back() -> void:
	if r.over:
		Router.go("pathway", {"pid": p["id"]})
		return
	if _leave_armed:
		Router.go("pathway", {"pid": p["id"]})
		return
	_leave_armed = true
	_back.text = "Leave this round?"
	UI.tint(_back, "bad")
	get_tree().create_timer(3.0).timeout.connect(func():
		if is_instance_valid(_back) and not r.over:
			_leave_armed = false
			_back.text = "‹ Pathways"
			UI._style_button(_back, Style.c("surface"), Style.c("line"), Style.c("fg"), 1))


func _unhandled_input(event: InputEvent) -> void:
	var k := event as InputEventKey
	if k and k.pressed and not k.echo:
		if k.keycode == KEY_H:
			_hint()
		elif k.keycode in [KEY_ENTER, KEY_KP_ENTER] and r.mode == "arrange":
			_check()
		elif k.keycode == KEY_ESCAPE:
			_selected = ""
			_render_bank()
			_restyle_gaps()


# ================================================================== the end

func _win() -> void:
	if _ending:
		return
	_ending = true
	_update_hud()
	Audio.play("win")
	_say("good", "Pathway complete.")
	var calm := Style.reduced_motion()
	if r.mode == "fill":
		# the finished line lights up green, station by station
		var n := r.nodes.size()
		var dur := 0.0 if calm else clampf(n * 0.07, 0.5, 1.1)
		if dur > 0.0:
			var tw := create_tween()
			tw.tween_method(func(t: float):
				for i in _rails.keys():
					var rail: StationRail = _rails[i]
					rail.flow = clampf(t - i, 0.0, 1.0) if t >= i else -1.0
					rail.queue_redraw()
				var lead := int(t)
				if _cells.has(lead):
					_board_scroll.ensure_control_visible(_cells[lead]), 0.0, float(n), dur)
			await tw.finished
	else:
		for row in _rows:
			(row as PanelContainer).add_theme_stylebox_override("panel", Style.box(Style.c("surface2"), Style.c("good"), 12, 2, Vector4(8, 6, 8, 6)))
			if not calm:
				UI.pulse(row, 1.02)
				await get_tree().create_timer(0.04).timeout
	UI.burst(self, Vector2(size.x * 0.5, size.y * 0.4), [Style.c("accent"), Style.c("good"), Style.c("warn"), Color.WHITE], 70, 1.2)
	await get_tree().create_timer(0.0 if calm else 0.7).timeout
	_go_results()


func _time_up() -> void:
	if _ending:
		return
	_ending = true
	if _dragging:
		_end_drag()
	_press_piece = {}
	_drag_row = ""
	Audio.play("lose")
	_say("bad", "Time's up.")
	_update_hud()
	var l := UI.label("Time's up", 54, "bad", "display", false)
	l.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_layer.add_child(l)
	l.position = size * 0.5 - Vector2(140, 40)
	UI.fade_in(l, 0.2)
	await get_tree().create_timer(1.0).timeout
	_go_results()


func _go_results() -> void:
	var s := r.summary()
	var saved := SaveData.record_round(s)
	Router.go("results", {"summary": s, "new_best": saved["new_best"], "daily": saved["daily"],
		"focus": params.get("focus", [])})
