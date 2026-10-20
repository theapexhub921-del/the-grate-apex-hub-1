class_name UI
extends RefCounted
## Reusable UI building blocks so every screen shares the same buttons, cards, chips, markers and type.


static func label(text: String, size: int = 17, color: String = "fg", font: String = "body", wrap: bool = true) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", Style.c(color))
	l.add_theme_font_override("font", Style.font(font))
	if wrap:
		l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return l


static func eyebrow(text: String, color: String = "accent") -> Label:
	var l := label(text.to_upper(), 12, color, "mono", true)
	l.add_theme_constant_override("outline_size", 0)
	return l


static func title(text: String, size: int = 34) -> Label:
	return label(text, size, "fg", "display")


static func vbox(sep: int = 12) -> VBoxContainer:
	var b := VBoxContainer.new()
	b.add_theme_constant_override("separation", sep)
	b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return b


static func hbox(sep: int = 12) -> HBoxContainer:
	var b := HBoxContainer.new()
	b.add_theme_constant_override("separation", sep)
	b.alignment = BoxContainer.ALIGNMENT_BEGIN
	return b


static func flow(sep: int = 8, centered: bool = false) -> HFlowContainer:
	var f := HFlowContainer.new()
	f.add_theme_constant_override("h_separation", sep)
	f.add_theme_constant_override("v_separation", sep)
	f.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	if centered:
		f.alignment = FlowContainer.ALIGNMENT_CENTER
	return f


static func spacer() -> Control:
	var c := Control.new()
	c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return c


## Adds a card to `parent` and returns its inner VBox.
static func card(parent: Control, sep: int = 12, accent: String = "") -> VBoxContainer:
	var p := PanelContainer.new()
	p.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	if accent != "":
		var s := Style.box(Style.c("surface"), Style.c(accent), 14, 1, Vector4(18, 16, 18, 16))
		p.add_theme_stylebox_override("panel", s)
	else:
		p.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("line"), 14, 1, Vector4(18, 16, 18, 16)))
	parent.add_child(p)
	var v := vbox(sep)
	p.add_child(v)
	return v


static func tag(text: String, color: String = "accent") -> PanelContainer:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", Style.box(Style.c("surface2"), Style.c("line"), 6, 1, Vector4(8, 2, 8, 2)))
	var l := label(text.to_upper(), 12, color, "mono", false)
	p.add_child(l)
	return p


static func button(text: String, kind: String = "primary", min_h: int = 48) -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size.y = min_h
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	match kind:
		"ghost":
			_style_button(b, Style.c("surface"), Style.c("line"), Style.c("fg"), 1)
		"danger":
			_style_button(b, Style.c("bad"), Style.c("bad"), Color.WHITE, 0)
		"soft":
			_style_button(b, Style.c("surface2"), Style.c("line"), Style.c("fg"), 1)
	add_feel(b)
	b.pressed.connect(func(): Audio.play("click"))
	return b


static func _style_button(b: Button, bg: Color, border: Color, fg: Color, bw: int) -> void:
	var pad := Vector4(18, 10, 18, 10)
	b.add_theme_stylebox_override("normal", Style.box(bg, border, 10, bw, pad))
	b.add_theme_stylebox_override("hover", Style.box(bg.lerp(Style.c("surface2"), 0.5) if bw > 0 else bg.lightened(0.1), Style.c("accent") if bw > 0 else border, 10, maxi(bw, 1) if bw > 0 else 0, pad))
	b.add_theme_stylebox_override("pressed", Style.box(Style.c("surface2") if bw > 0 else bg.darkened(0.12), Style.c("accent") if bw > 0 else border, 10, bw, pad))
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color", "font_hover_pressed_color"]:
		b.add_theme_color_override(k, fg)


static func tint(b: Button, color: String) -> void:
	var s := Style.box(Style.c(color), Style.c(color), 10, 0, Vector4(18, 10, 18, 10))
	for k in ["normal", "hover", "pressed", "disabled"]:
		b.add_theme_stylebox_override(k, s)
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_disabled_color", "font_focus_color"]:
		b.add_theme_color_override(k, Color.WHITE)


## Subtle hover / press scale feedback.
static func add_feel(c: Control) -> void:
	c.resized.connect(func(): c.pivot_offset = c.size / 2.0)
	c.mouse_entered.connect(func(): _scale(c, 1.03))
	c.mouse_exited.connect(func(): _scale(c, 1.0))
	if c is BaseButton:
		(c as BaseButton).button_down.connect(func(): _scale(c, 0.97))
		(c as BaseButton).button_up.connect(func(): _scale(c, 1.0))


static func _scale(c: Control, s: float) -> void:
	if Style.reduced_motion() or not c.is_inside_tree():
		return
	var tw := c.create_tween().set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tw.tween_property(c, "scale", Vector2(s, s), 0.08)


static func pulse(c: Control, amount: float = 1.15) -> void:
	if Style.reduced_motion() or not c.is_inside_tree():
		return
	c.pivot_offset = c.size / 2.0
	var tw := c.create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_property(c, "scale", Vector2(amount, amount), 0.08)
	tw.tween_property(c, "scale", Vector2.ONE, 0.18)


static func fade_in(c: CanvasItem, dur: float = 0.2) -> void:
	if Style.reduced_motion() or not c.is_inside_tree():
		c.modulate.a = 1.0
		return
	c.modulate.a = 0.0
	c.create_tween().tween_property(c, "modulate:a", 1.0, dur)


## A row of mutually exclusive chips. options: Array of [label, value].
static func chips(options: Array, selected: Variant, on_change: Callable) -> HFlowContainer:
	var f := flow(8)
	for opt in options:
		var b := Button.new()
		b.text = String(opt[0])
		b.set_meta("value", opt[1])
		b.custom_minimum_size.y = 40
		b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		_style_chip(b, opt[1] == selected)
		b.pressed.connect(func():
			Audio.play("click")
			for child in f.get_children():
				_style_chip(child, child.get_meta("value") == b.get_meta("value"))
			on_change.call(b.get_meta("value")))
		f.add_child(b)
	return f


static func _style_chip(b: Button, on: bool) -> void:
	var pad := Vector4(16, 6, 16, 6)
	var bg := Style.c("accent") if on else Style.c("surface2")
	var border := Style.c("accent") if on else Style.c("line")
	var fg := Style.c("accent_fg") if on else Style.c("fg")
	b.add_theme_stylebox_override("normal", Style.box(bg, border, 999, 1, pad))
	b.add_theme_stylebox_override("hover", Style.box(bg if on else Style.c("surface"), Style.c("accent"), 999, 1, pad))
	b.add_theme_stylebox_override("pressed", Style.box(Style.c("accent"), Style.c("accent"), 999, 1, pad))
	for k in ["font_color", "font_hover_color", "font_focus_color"]:
		b.add_theme_color_override(k, fg)
	b.add_theme_color_override("font_pressed_color", Style.c("accent_fg"))
	b.add_theme_font_override("font", Style.font("body"))
	b.add_theme_font_size_override("font_size", 15)


static func stat(parent: Control, value: String, caption: String) -> void:
	var v := card(parent, 2)
	v.get_parent().size_flags_horizontal = Control.SIZE_EXPAND_FILL
	v.get_parent().custom_minimum_size.x = 140
	v.add_child(label(value, 26, "fg", "display", false))
	v.add_child(label(caption.to_upper(), 12, "muted", "mono", false))


static func progress_bar(value: float, color: String = "accent", height: int = 10) -> ProgressBar:
	var p := ProgressBar.new()
	p.show_percentage = false
	p.min_value = 0.0
	p.max_value = 1.0
	p.step = 0.0001
	p.value = value
	p.custom_minimum_size.y = height
	p.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	p.add_theme_stylebox_override("fill", Style.box(Style.c(color), Color.TRANSPARENT, 999, 0, Vector4.ZERO))
	return p


static func line_edit(text: String, placeholder: String) -> LineEdit:
	var e := LineEdit.new()
	e.text = text
	e.placeholder_text = placeholder
	e.custom_minimum_size.y = 46
	e.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	e.add_theme_font_size_override("font_size", 17)
	return e


## A small drawn tick (right) or cross (wrong). Drawn as lines because the game's fonts
## have no tick or cross characters.
static func mark(ok: bool, size: float = 18.0) -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(size, size)
	c.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.draw.connect(func():
		var s := c.size
		var col := Style.c("good" if ok else "bad")
		var w := maxf(2.0, s.x * 0.14)
		if ok:
			c.draw_polyline(PackedVector2Array([Vector2(0.15, 0.55) * s, Vector2(0.42, 0.8) * s, Vector2(0.88, 0.22) * s]), col, w, true)
		else:
			c.draw_line(Vector2(0.2, 0.2) * s, Vector2(0.8, 0.8) * s, col, w, true)
			c.draw_line(Vector2(0.8, 0.2) * s, Vector2(0.2, 0.8) * s, col, w, true))
	return c


## A "station" marker in the shape of its type, like the original game:
## molecule = ring, enzyme = filled diamond, structure / event = rounded square,
## protein / channel = double-bordered square. hollow draws a dashed outline (a gap).
static func marker(kind: String, size: float = 16.0, color: Color = Color(0, 0, 0, 0), hollow: bool = false) -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(size, size)
	c.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.draw.connect(func(): draw_marker(c, kind, Rect2(Vector2.ZERO, c.size), color if color.a > 0 else Style.c("accent"), hollow))
	return c


static func draw_marker(ci: CanvasItem, kind: String, r: Rect2, col: Color, hollow: bool = false, fill: Color = Color(0, 0, 0, 0)) -> void:
	var c := r.get_center()
	var s := minf(r.size.x, r.size.y)
	var w := maxf(1.6, s * 0.14)
	var bg := fill if fill.a > 0 else Style.c("bg")
	if hollow:
		var pts := _shape_points(kind, c, s * 0.42)
		pts.append(pts[0])
		for i in pts.size() - 1:
			if i % 2 == 0:
				ci.draw_line(pts[i], pts[i + 1], Style.c("muted"), w * 0.8, true)
		return
	match kind:
		"e":
			ci.draw_colored_polygon(_shape_points("e", c, s * 0.5), col)
		"m":
			ci.draw_circle(c, s * 0.42, bg)
			ci.draw_arc(c, s * 0.42, 0, TAU, 28, col, w, true)
		"r":
			var o := _shape_points("s", c, s * 0.46)
			ci.draw_colored_polygon(o, bg)
			o.append(o[0])
			ci.draw_polyline(o, col, w * 0.7, true)
			var inner := _shape_points("s", c, s * 0.26)
			inner.append(inner[0])
			ci.draw_polyline(inner, col, w * 0.7, true)
		_:
			var q := _shape_points("s", c, s * 0.42)
			ci.draw_colored_polygon(q, bg)
			q.append(q[0])
			ci.draw_polyline(q, col, w, true)


static func _shape_points(kind: String, c: Vector2, half: float) -> PackedVector2Array:
	var pts := PackedVector2Array()
	if kind == "e":
		return PackedVector2Array([c + Vector2(0, -half), c + Vector2(half, 0), c + Vector2(0, half), c + Vector2(-half, 0)])
	if kind == "m":
		for i in 24:
			pts.append(c + Vector2.from_angle(TAU * i / 24.0) * half)
		return pts
	# rounded square
	var rr := half * 0.3
	for corner in [Vector2(1, 1), Vector2(-1, 1), Vector2(-1, -1), Vector2(1, -1)]:
		var cc: Vector2 = c + Vector2(corner.x * (half - rr), corner.y * (half - rr))
		var a0 := atan2(corner.y, corner.x) - PI / 4.0
		for k in 5:
			pts.append(cc + Vector2.from_angle(a0 + (PI / 2.0) * k / 4.0) * rr)
	return pts


## A row of three stars, `on` of them lit.
static func stars(on: int, size: float = 18.0, total: int = 3) -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(size * total + 4.0 * (total - 1), size)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	c.draw.connect(func():
		for i in total:
			var ctr := Vector2(size * 0.5 + i * (size + 4.0), c.size.y * 0.5)
			draw_star(c, ctr, size * 0.5, Style.c("warn") if i < on else Style.c("line")))
	return c


static func draw_star(ci: CanvasItem, ctr: Vector2, r: float, col: Color) -> void:
	var pts := PackedVector2Array()
	for k in 10:
		var rad := r if k % 2 == 0 else r * 0.45
		pts.append(ctr + Vector2.from_angle(-PI / 2.0 + PI * k / 5.0) * rad)
	ci.draw_colored_polygon(pts, col)


## Small drawn icons (the fonts have no arrows): up, down, left, right, grip, hint, clock, check.
static func icon(name: String, size: float = 18.0, color: String = "muted") -> Control:
	var c := Control.new()
	c.custom_minimum_size = Vector2(size, size)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	c.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	c.draw.connect(func(): draw_icon(c, name, Rect2(Vector2.ZERO, c.size), Style.c(color)))
	return c


static func draw_icon(ci: CanvasItem, name: String, r: Rect2, col: Color) -> void:
	var s := minf(r.size.x, r.size.y)
	var o := r.position + (r.size - Vector2(s, s)) * 0.5
	var P := func(x: float, y: float) -> Vector2: return o + Vector2(x, y) * s
	var w := maxf(1.8, s * 0.12)
	match name:
		"up":
			ci.draw_polyline(PackedVector2Array([P.call(0.22, 0.64), P.call(0.5, 0.36), P.call(0.78, 0.64)]), col, w, true)
		"down":
			ci.draw_polyline(PackedVector2Array([P.call(0.22, 0.36), P.call(0.5, 0.64), P.call(0.78, 0.36)]), col, w, true)
		"left":
			ci.draw_polyline(PackedVector2Array([P.call(0.62, 0.2), P.call(0.34, 0.5), P.call(0.62, 0.8)]), col, w, true)
		"right":
			ci.draw_polyline(PackedVector2Array([P.call(0.38, 0.2), P.call(0.66, 0.5), P.call(0.38, 0.8)]), col, w, true)
		"arrow":
			ci.draw_line(P.call(0.15, 0.5), P.call(0.8, 0.5), col, w, true)
			ci.draw_polyline(PackedVector2Array([P.call(0.55, 0.25), P.call(0.82, 0.5), P.call(0.55, 0.75)]), col, w, true)
		"grip":
			for gx in [0.38, 0.62]:
				for gy in [0.25, 0.5, 0.75]:
					ci.draw_circle(P.call(gx, gy), s * 0.07, col)
		"hint":
			ci.draw_arc(P.call(0.5, 0.4), s * 0.26, PI * 0.8, PI * 2.2, 20, col, w, true)
			ci.draw_line(P.call(0.4, 0.74), P.call(0.6, 0.74), col, w, true)
			ci.draw_line(P.call(0.43, 0.86), P.call(0.57, 0.86), col, w, true)
		"clock":
			ci.draw_arc(P.call(0.5, 0.5), s * 0.38, 0, TAU, 28, col, w, true)
			ci.draw_line(P.call(0.5, 0.5), P.call(0.5, 0.26), col, w, true)
			ci.draw_line(P.call(0.5, 0.5), P.call(0.68, 0.58), col, w, true)
		"check":
			ci.draw_polyline(PackedVector2Array([P.call(0.18, 0.54), P.call(0.42, 0.78), P.call(0.84, 0.24)]), col, w * 1.2, true)
		"cross":
			ci.draw_line(P.call(0.22, 0.22), P.call(0.78, 0.78), col, w * 1.2, true)
			ci.draw_line(P.call(0.78, 0.22), P.call(0.22, 0.78), col, w * 1.2, true)
		"book":
			ci.draw_polyline(PackedVector2Array([P.call(0.5, 0.26), P.call(0.16, 0.2), P.call(0.16, 0.78), P.call(0.5, 0.84), P.call(0.84, 0.78), P.call(0.84, 0.2), P.call(0.5, 0.26), P.call(0.5, 0.84)]), col, w, true)
		"flame":
			# a teardrop: round at the bottom, pointed at the top
			var pts := PackedVector2Array()
			for k in 21:
				var a := PI * k / 20.0
				pts.append(P.call(0.5 + cos(a) * 0.26, 0.62 + sin(a) * 0.26))
			pts.append(P.call(0.5, 0.1))
			ci.draw_colored_polygon(pts, col)


## An icon button: a square ghost button with a drawn icon.
static func icon_button(name: String, tip: String, size: int = 40) -> Button:
	var b := Button.new()
	b.custom_minimum_size = Vector2(size, size)
	b.tooltip_text = tip
	b.focus_mode = Control.FOCUS_ALL
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	_style_button(b, Style.c("surface"), Style.c("line"), Style.c("fg"), 1)
	var ic := icon(name, size * 0.5, "muted")
	ic.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	ic.position -= ic.custom_minimum_size * 0.5
	b.add_child(ic)
	b.mouse_entered.connect(func(): ic.modulate = Color(1.4, 1.4, 1.4))
	b.mouse_exited.connect(func(): ic.modulate = Color.WHITE)
	b.pressed.connect(func(): Audio.play("click"))
	return b


## A rounded pill label, e.g. a type badge.
static func pill(text: String, fg: String = "accent", bg: Color = Color(0, 0, 0, 0)) -> PanelContainer:
	var p := PanelContainer.new()
	var fill := bg if bg.a > 0 else Color(Style.c(fg), 0.15)
	p.add_theme_stylebox_override("panel", Style.box(fill, Color.TRANSPARENT, 999, 0, Vector4(9, 2, 9, 3)))
	p.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	p.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	p.add_child(label(text.to_upper(), 11, fg, "mono", false))
	return p


## A short message that floats up and fades (score popups, "New best!").
static func float_text(parent: Control, text: String, at: Vector2, color: String = "good", size: int = 20) -> void:
	var l := label(text, size, color, "display", false)
	l.position = at - Vector2(30, 14)
	l.z_index = 50
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(l)
	if Style.reduced_motion():
		parent.get_tree().create_timer(0.9).timeout.connect(l.queue_free)
		return
	var tw := l.create_tween().set_parallel(true)
	tw.tween_property(l, "position:y", l.position.y - 46.0, 0.8).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tw.tween_property(l, "modulate:a", 0.0, 0.8).set_delay(0.25)
	tw.chain().tween_callback(l.queue_free)


## Side-to-side shake for a wrong answer.
static func shake(c: Control) -> void:
	if Style.reduced_motion() or not c.is_inside_tree():
		return
	var x := c.position.x
	var tw := c.create_tween()
	for d in [-7.0, 7.0, -4.0, 4.0, 0.0]:
		tw.tween_property(c, "position:x", x + d, 0.045)


## A burst of confetti from a point (wins, combos).
static func burst(parent: Control, at: Vector2, colors: Array, amount: int = 40, spread: float = 1.0) -> void:
	if Style.reduced_motion():
		return
	var parts := CPUParticles2D.new()
	parts.position = at
	parts.amount = amount
	parts.one_shot = true
	parts.explosiveness = 0.95
	parts.lifetime = 1.1
	parts.direction = Vector2(0, -1)
	parts.spread = 70.0 * spread
	parts.initial_velocity_min = 180.0 * spread
	parts.initial_velocity_max = 360.0 * spread
	parts.gravity = Vector2(0, 520)
	parts.angular_velocity_min = -360.0
	parts.angular_velocity_max = 360.0
	parts.scale_amount_min = 3.0
	parts.scale_amount_max = 6.0
	var grad := Gradient.new()
	grad.offsets = PackedFloat32Array([0.0, 0.8, 1.0])
	grad.colors = PackedColorArray([Color.WHITE, Color.WHITE, Color(1, 1, 1, 0)])
	parts.color_ramp = grad
	var cols := Gradient.new()
	var offs := PackedFloat32Array()
	var cc := PackedColorArray()
	for i in colors.size():
		offs.append(float(i) / maxf(1.0, colors.size() - 1))
		cc.append(colors[i])
	cols.offsets = offs
	cols.colors = cc
	parts.color_initial_ramp = cols
	parts.z_index = 60
	parent.add_child(parts)
	parts.emitting = true
	parent.get_tree().create_timer(1.6).timeout.connect(parts.queue_free)
