class_name UI
extends RefCounted
## Reusable UI building blocks so every screen shares the same buttons, cards, chips and type.


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


static func eyebrow(text: String) -> Label:
	var l := label(text.to_upper(), 13, "eosin", "mono", false)
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
		var s := Style.box(Style.c("surface"), Style.c(accent), 12, 2, Vector4(18, 16, 18, 16))
		p.add_theme_stylebox_override("panel", s)
	parent.add_child(p)
	var v := vbox(sep)
	p.add_child(v)
	return v


static func tag(text: String, color: String = "hema") -> PanelContainer:
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
		"accent":
			_style_button(b, Style.c("eosin"), Style.c("eosin"), Color.WHITE, 0)
	add_feel(b)
	b.pressed.connect(func(): Audio.play("click"))
	return b


static func _style_button(b: Button, bg: Color, border: Color, fg: Color, bw: int) -> void:
	var pad := Vector4(18, 10, 18, 10)
	b.add_theme_stylebox_override("normal", Style.box(bg, border, 10, bw, pad))
	b.add_theme_stylebox_override("hover", Style.box(bg.lerp(Style.c("surface2"), 0.5) if bw > 0 else bg.lightened(0.1), Style.c("hema") if bw > 0 else border, 10, maxi(bw, 1) if bw > 0 else 0, pad))
	b.add_theme_stylebox_override("pressed", Style.box(Style.c("surface2") if bw > 0 else bg.darkened(0.12), Style.c("hema") if bw > 0 else border, 10, bw, pad))
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
	var bg := Style.c("hema") if on else Style.c("surface2")
	var border := Style.c("hema") if on else Style.c("line")
	var fg := Style.c("hema_fg") if on else Style.c("fg")
	b.add_theme_stylebox_override("normal", Style.box(bg, border, 999, 1, pad))
	b.add_theme_stylebox_override("hover", Style.box(bg if on else Style.c("surface"), Style.c("hema"), 999, 1, pad))
	b.add_theme_stylebox_override("pressed", Style.box(Style.c("hema"), Style.c("hema"), 999, 1, pad))
	for k in ["font_color", "font_hover_color", "font_focus_color"]:
		b.add_theme_color_override(k, fg)
	b.add_theme_color_override("font_pressed_color", Style.c("hema_fg"))
	b.add_theme_font_override("font", Style.font("body"))
	b.add_theme_font_size_override("font_size", 15)


static func stat(parent: Control, value: String, caption: String) -> void:
	var v := card(parent, 2)
	v.get_parent().size_flags_horizontal = Control.SIZE_EXPAND_FILL
	v.get_parent().custom_minimum_size.x = 140
	v.add_child(label(value, 26, "fg", "display", false))
	v.add_child(label(caption.to_upper(), 12, "muted", "mono", false))


static func progress_bar(value: float, color: String = "hema", height: int = 10) -> ProgressBar:
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
