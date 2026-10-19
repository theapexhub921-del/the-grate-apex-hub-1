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


# ------------------------------------------------------------- Golden Hour pieces

## Sister Rebecca's speech bubble.
static func sister(parent: Control, text: String, who: String = "Sister Rebecca") -> void:
	var row := hbox(10)
	row.alignment = BoxContainer.ALIGNMENT_BEGIN
	parent.add_child(row)
	row.add_child(avatar())
	var bubble := PanelContainer.new()
	bubble.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var sb := Style.box(Style.c("surface"), Style.c("line"), 16, 1, Vector4(13, 10, 13, 11))
	sb.corner_radius_top_left = 4
	bubble.add_theme_stylebox_override("panel", sb)
	row.add_child(bubble)
	var v := vbox(2)
	bubble.add_child(v)
	v.add_child(label(who, 13, "muted", "bold", false))
	v.add_child(label(text, 16))


static func avatar(letter: String = "R", size: int = 42) -> Control:
	if letter == "R":
		return SisterPortrait.new(size + 6)
	var p := PanelContainer.new()
	p.custom_minimum_size = Vector2(size, size)
	p.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	p.add_theme_stylebox_override("panel", Style.box(Style.c("hero"), Color.TRANSPARENT, size / 2, 0, Vector4.ZERO))
	var l := label(letter, int(size * 0.43), "hero_fg", "display", false)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	p.add_child(l)
	return p


## Top row on every shift screen: "Back to ward" and where you are.
static func header(parent: Control, title_text: String) -> void:
	var row := hbox(8)
	parent.add_child(row)
	var back := Button.new()
	back.text = "‹ Back to ward"
	back.flat = true
	back.focus_mode = Control.FOCUS_NONE
	back.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		back.add_theme_color_override(k, Style.c("hema"))
	back.add_theme_font_override("font", Style.font("bold"))
	back.add_theme_font_size_override("font_size", 15)
	back.pressed.connect(func():
		Audio.play("click")
		Router.go("home"))
	row.add_child(back)
	row.add_child(spacer())
	row.add_child(label(title_text, 14, "muted", "bold", false))


## A small rounded chip. style: "off", "on" (blue), "gold".
static func pip(text: String, style: String = "off") -> PanelContainer:
	var p := PanelContainer.new()
	var bg := Color.TRANSPARENT
	var border := Style.c("line")
	var fg := "muted"
	if style == "on":
		bg = Style.c("hema")
		border = bg
		fg = "hema_fg"
	elif style == "gold":
		bg = Style.c("gold")
		border = bg
		fg = "gold_fg"
	p.add_theme_stylebox_override("panel", Style.box(bg, border, 99, 1, Vector4(10, 3, 10, 3)))
	p.add_child(label(text, 12, fg, "bold", false))
	return p


## A card that acts as one big button. Returns the card's inner VBox.
static func click_card(parent: Control, on_click: Callable, dimmed: bool = false) -> VBoxContainer:
	var p := PanelContainer.new()
	p.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	p.mouse_filter = Control.MOUSE_FILTER_STOP
	p.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	var normal := Style.box(Style.c("surface"), Style.c("line"), 18, 1, Vector4(16, 16, 16, 16))
	var hover := Style.box(Style.c("surface"), Style.c("hema"), 18, 1, Vector4(16, 16, 16, 16))
	p.add_theme_stylebox_override("panel", normal)
	p.mouse_entered.connect(func(): p.add_theme_stylebox_override("panel", hover))
	p.mouse_exited.connect(func(): p.add_theme_stylebox_override("panel", normal))
	p.gui_input.connect(func(e: InputEvent):
		var mb := e as InputEventMouseButton
		if mb and mb.button_index == MOUSE_BUTTON_LEFT and not mb.pressed:
			Audio.play("click")
			on_click.call())
	if dimmed:
		p.modulate.a = 0.6
	parent.add_child(p)
	var v := vbox(4)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	p.add_child(v)
	return v


## Brief message that fades away at the bottom of a screen.
static func toast(host: Control, text: String) -> void:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", Style.box(Style.c("ink"), Color.TRANSPARENT, 14, 0, Vector4(16, 12, 16, 12)))
	var l := label(text, 15, "bg", "bold", true)
	l.custom_minimum_size.x = minf(380.0, host.size.x - 40.0)
	p.add_child(l)
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	host.add_child(p)
	p.reset_size()
	p.position = Vector2((host.size.x - p.size.x) / 2.0, host.size.y - p.size.y - 28.0)
	var tw := p.create_tween()
	tw.tween_interval(2.4)
	tw.tween_property(p, "modulate:a", 0.0, 0.4)
	tw.tween_callback(p.queue_free)


## Coloured meter: ok at 80+, gold at 60+, otherwise bad.
static func meter_color(v: float, ok_at: float = 80.0, mid_at: float = 60.0) -> Color:
	if v >= ok_at:
		return Style.c("good")
	if v >= mid_at:
		return Style.c("gold")
	return Style.c("bad")


## Shuffles a copy of an array (used for answer order).
static func shuffled(a: Array) -> Array:
	var b := a.duplicate()
	b.shuffle()
	return b
