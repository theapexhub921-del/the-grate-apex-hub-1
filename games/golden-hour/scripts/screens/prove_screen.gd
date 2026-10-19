extends Control
## Prove: the 3D ward. Tap the gold dots to do each task. Safety and Dignity must both stay at 80+.
## Shift 1 is the full vital-signs scenario; shifts 2-6 come from data/wards.json.

const PENALTY := 1.25  ## Mistakes cost a little more in the 3D ward than in the drill.
const PASS := 80
const VITAL_TASKS := [["wash", "Wash hands"], ["curtain", "Curtain"], ["greet", "Greet"], ["pulse", "Pulse"],
	["resp", "Breathing"], ["bp", "BP"], ["temp", "Temp"], ["spo2", "SpO₂"]]
const VITAL_DOTS := {"wash": [Vector3(3.2, 1.3, -2.1), 0.1], "curtain": [Vector3(2, 2.2, 0.6), 0.14],
	"greet": ["mouth", 0.08], "temp": ["forehead", 0.07],
	"resp": ["chest", 0.1], "bp": ["upper_arm", 0.08],
	"pulse": ["wrist", 0.06], "spo2": ["finger", 0.05]}

var params: Dictionary = {}
var shift_i := 0
var cfg: Dictionary = {}

var ward: Ward
var view_box: SubViewportContainer
var hud_tasks: HFlowContainer
var meter_labels: Dictionary = {}
var meter_bars: Dictionary = {}
var panel: PanelContainer
var panel_scroll: ScrollContainer
var panel_box: VBoxContainer

var safe := 100
var dig := 100
var locked := false
var done: Dictionary = {}
var readings: Dictionary = {}
var penalised: Dictionary = {}
var finished := false

var _drag_from := Vector2.ZERO
var _dragging := false
var _moved := false

# counting game
var _count_id := ""
var _count_n := 0
var _count_left := 0.0
var _count_button: Button
var _heart: HeartIcon
var _last_beat := false
# timed progress bar
var _bar: ProgressBar
var _bar_time := 0.0
var _bar_total := 0.0
var _bar_done: Callable = Callable()


func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	shift_i = int(params.get("shift", 0))
	cfg = Data.ward(shift_i)
	_build()
	Audio.play("start")
	if shift_i == 0:
		_vitals_reset()
	else:
		_ward_start()


# ================================================================== layout

func _build() -> void:
	view_box = SubViewportContainer.new()
	view_box.stretch = true
	view_box.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	view_box.mouse_filter = Control.MOUSE_FILTER_STOP
	view_box.gui_input.connect(_on_view_input)
	add_child(view_box)
	# Phones in a browser draw the page at 2-3x for their sharp screens; the 3D ward is drawn
	# at half that and scaled up (the flat colours and outlines barely change), so it stays smooth.
	if OS.has_feature("web_android") or OS.has_feature("web_ios"):
		view_box.stretch_shrink = 2
	var sv := SubViewport.new()
	sv.own_world_3d = true
	sv.msaa_3d = Viewport.MSAA_2X
	sv.handle_input_locally = false
	view_box.add_child(sv)
	ward = Ward.new()
	sv.add_child(ward)

	# HUD: back + meters on one row, task chips on the next
	var hud_col := VBoxContainer.new()
	hud_col.set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
	hud_col.offset_left = 10
	hud_col.offset_top = 10
	hud_col.offset_right = -10
	hud_col.add_theme_constant_override("separation", 8)
	hud_col.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(hud_col)
	var hud := HFlowContainer.new()
	hud.add_theme_constant_override("h_separation", 8)
	hud.add_theme_constant_override("v_separation", 8)
	hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud_col.add_child(hud)
	var back := _pill_button("‹ Back to ward")
	back.pressed.connect(func(): Router.go("home"))
	hud.add_child(back)
	for key in ["Safety", "Dignity"]:
		hud.add_child(_meter_pill(key))
	hud_tasks = HFlowContainer.new()
	hud_tasks.add_theme_constant_override("h_separation", 5)
	hud_tasks.add_theme_constant_override("v_separation", 5)
	hud_tasks.mouse_filter = Control.MOUSE_FILTER_IGNORE
	hud_col.add_child(hud_tasks)

	# Sister Rebecca's panel
	panel = PanelContainer.new()
	var sb := Style.box(Style.c("surface"), Style.c("ink"), 20, 3, Vector4(14, 12, 14, 12))
	sb.shadow_color = Style.c("ink")
	sb.shadow_offset = Vector2(0, 5)
	sb.shadow_size = 1
	panel.add_theme_stylebox_override("panel", sb)
	add_child(panel)
	panel_scroll = ScrollContainer.new()
	panel_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	panel.add_child(panel_scroll)
	panel_box = UI.vbox(8)
	panel_scroll.add_child(panel_box)
	resized.connect(_layout_panel)
	_layout_panel.call_deferred()


func _layout_panel() -> void:
	var w := minf(560.0, size.x - 20.0)
	panel.custom_minimum_size.x = w
	panel_scroll.custom_minimum_size = Vector2(w - 28.0, 0)
	var content_h := panel_box.get_combined_minimum_size().y
	var h := minf(content_h, size.y * 0.55)
	panel_scroll.custom_minimum_size.y = h
	panel.reset_size()
	panel.position = Vector2((size.x - panel.size.x) / 2.0, size.y - panel.size.y - 12.0)


func _pill_style() -> StyleBoxFlat:
	return Style.box(Style.c("surface"), Style.c("ink"), 14, 2, Vector4(10, 6, 10, 6))


func _pill_button(text: String) -> Button:
	var b := Button.new()
	b.text = text
	b.focus_mode = Control.FOCUS_NONE
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	for k in ["normal", "hover", "pressed"]:
		b.add_theme_stylebox_override(k, _pill_style())
	for k in ["font_color", "font_hover_color", "font_pressed_color"]:
		b.add_theme_color_override(k, Style.c("ink"))
	b.add_theme_font_override("font", Style.font("bold"))
	b.add_theme_font_size_override("font_size", 13)
	b.pressed.connect(func(): Audio.play("click"))
	return b


func _meter_pill(name: String) -> PanelContainer:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", _pill_style())
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var v := UI.vbox(3)
	p.add_child(v)
	var l := UI.label("%s 100" % name, 13, "ink", "bold", false)
	v.add_child(l)
	var bar := UI.progress_bar(1.0, "good", 9)
	bar.custom_minimum_size.x = 90
	v.add_child(bar)
	meter_labels[name] = l
	meter_bars[name] = bar
	return p


# ================================================================== panel

## Sister Rebecca speaks. buttons: [[label, callable_or_null, style("" | "alt")], ...]
func say(text: String, buttons: Array = [], extra: Control = null, heading: String = "") -> void:
	for c in panel_box.get_children():
		panel_box.remove_child(c)
		c.queue_free()
	_count_button = null
	_heart = null
	_bar = null
	var row := UI.hbox(10)
	panel_box.add_child(row)
	row.add_child(UI.avatar("R", 38))
	var v := UI.vbox(2)
	row.add_child(v)
	v.add_child(UI.label("Sister Rebecca", 14, "fg", "bold", false))
	if heading != "":
		v.add_child(UI.label(heading, 22, "fg", "display"))
	var rt := RichTextLabel.new()
	rt.bbcode_enabled = true
	rt.fit_content = true
	rt.scroll_active = false
	rt.text = text
	rt.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	rt.add_theme_color_override("default_color", Style.c("fg"))
	rt.add_theme_font_override("normal_font", Style.font("body"))
	rt.add_theme_font_override("bold_font", Style.font("bold"))
	rt.add_theme_font_size_override("normal_font_size", 16)
	rt.add_theme_font_size_override("bold_font_size", 16)
	v.add_child(rt)
	if extra:
		panel_box.add_child(extra)
	var list := buttons.duplicate()
	if list.size() > 1:
		list.shuffle()
	for i in list.size():
		var b := _choice_button(String(list[i][0]), String(list[i][2]) if list[i].size() > 2 else "")
		var cb: Variant = list[i][1]
		b.pressed.connect(func():
			Audio.play("click")
			if cb is Callable and (cb as Callable).is_valid():
				(cb as Callable).call()
			else:
				say("Pick a glowing dot to begin."))
		panel_box.add_child(b)
	_layout_panel.call_deferred()
	await get_tree().process_frame
	if is_inside_tree():
		panel_scroll.scroll_vertical = 99999 if heading != "" else 0
		_layout_panel()


func _choice_button(text: String, style: String) -> Button:
	var b := Button.new()
	b.text = text
	b.alignment = HORIZONTAL_ALIGNMENT_LEFT
	b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	b.focus_mode = Control.FOCUS_NONE
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	b.custom_minimum_size.y = 46
	var bg := Style.c("surface") if style == "alt" else Style.c("gold")
	var fg := Style.c("ink") if style == "alt" else Style.c("gold_fg")
	var pad := Vector4(12, 10, 12, 10)
	var n := Style.box(bg, Style.c("ink"), 13, 2, pad)
	n.shadow_color = Style.c("ink")
	n.shadow_offset = Vector2(0, 3)
	n.shadow_size = 1
	b.add_theme_stylebox_override("normal", n)
	b.add_theme_stylebox_override("hover", Style.box(bg.lightened(0.12), Style.c("ink"), 13, 2, pad))
	b.add_theme_stylebox_override("pressed", Style.box(bg.darkened(0.08), Style.c("ink"), 13, 2, pad))
	for k in ["font_color", "font_hover_color", "font_pressed_color"]:
		b.add_theme_color_override(k, fg)
	b.add_theme_font_override("font", Style.font("bold"))
	b.add_theme_font_size_override("font_size", 15)
	return b


## Shows a progress bar for an action that takes time (washing, cuff inflating...).
func timed(text: String, ms: int, on_done: Callable) -> void:
	_bar = null
	var bar := UI.progress_bar(0.0, "gold", 12)
	bar.add_theme_stylebox_override("background", Style.box(Style.c("surface"), Style.c("ink"), 9, 2, Vector4.ZERO))
	say(text, [], bar)
	_bar = bar
	_bar_time = 0.0
	_bar_total = ms / 1000.0
	_bar_done = on_done


# ================================================================== meters and tasks

func penalty(s: float, d: float = 0.0) -> void:
	safe -= int(round(s * PENALTY))
	dig -= int(round(d * PENALTY))
	if s > 0.0 or d > 0.0:
		Audio.play("wrong")
	_meters()


func raw_penalty(s: int, d: int = 0) -> void:
	safe -= s
	dig -= d
	if s > 0 or d > 0:
		Audio.play("wrong")
	_meters()


func _meters() -> void:
	safe = maxi(0, safe)
	dig = maxi(0, dig)
	ward.dignity = dig
	for pair in [["Safety", safe], ["Dignity", dig]]:
		var v: int = pair[1]
		meter_labels[pair[0]].text = "%s %d" % [pair[0], v]
		var bar: ProgressBar = meter_bars[pair[0]]
		bar.value = v / 100.0
		(bar.get_theme_stylebox("fill") as StyleBoxFlat).bg_color = UI.meter_color(v, 70, 50)
		UI.pulse(meter_labels[pair[0]], 1.1)


func _tasks(list: Array, state: Dictionary) -> void:
	for c in hud_tasks.get_children():
		hud_tasks.remove_child(c)
		c.queue_free()
	for t in list:
		var is_done := bool(state.get(t[0], false))
		var p := PanelContainer.new()
		p.mouse_filter = Control.MOUSE_FILTER_IGNORE
		var bg := Style.c("good") if is_done else Style.c("surface")
		p.add_theme_stylebox_override("panel", Style.box(bg, bg if is_done else Style.c("ink"), 99, 2, Vector4(8, 2, 8, 2)))
		p.add_child(UI.label(String(t[1]), 12, "hero_fg" if is_done else "ink", "bold", false))
		hud_tasks.add_child(p)


# ================================================================== input and frame

func _on_view_input(event: InputEvent) -> void:
	var mb := event as InputEventMouseButton
	if mb and mb.button_index == MOUSE_BUTTON_LEFT:
		if mb.pressed:
			_dragging = true
			_moved = false
			_drag_from = mb.position
			ward.drag_begin()
		else:
			_dragging = false
			ward.drag_end()
			if not _moved:
				var id := ward.pick(mb.position / float(view_box.stretch_shrink))
				if id != "":
					Audio.play("tap")
					ward.poke(id)
					_act(id)
		return
	var mm := event as InputEventMouseMotion
	if mm and _dragging:
		var dx := mm.position.x - _drag_from.x
		if absf(dx) > 6.0:
			_moved = true
		if _moved:
			ward.drag_to(dx)


func _unhandled_input(event: InputEvent) -> void:
	var k := event as InputEventKey
	if k and k.pressed and not k.echo and k.keycode == KEY_SPACE and _count_button:
		_count_button.emit_signal("pressed")
		get_viewport().set_input_as_handled()


func _process(delta: float) -> void:
	# dots are hidden while busy or once done
	for id in ward.hotspots.keys():
		ward.show_hotspot(id, not locked and not finished and not bool(done.get(id, false)))
	if _bar:
		_bar_time += delta
		_bar.value = clampf(_bar_time / _bar_total, 0.0, 1.0)
		if _bar_time >= _bar_total:
			_bar = null
			var cb := _bar_done
			_bar_done = Callable()
			Audio.play("done")
			cb.call()
	if _count_id != "":
		_count_left -= delta
		if _count_id == "pulse":
			var on := ward.beat_on(104.0)
			if _heart:
				_heart.on = on
			if on and not _last_beat:
				Audio.play("beat")
			_last_beat = on
		_update_count_label()
		if _count_left <= 0.0:
			_count_finish()


# ================================================================== shift 1: vital signs

func _act(id: String) -> void:
	if shift_i != 0:
		_ward_act(id)
		return
	if locked or bool(done.get(id, false)):
		return
	match id:
		"wash":
			ward.set_view("sink")
			locked = true
			timed("Scrubbing: palms, backs of hands, between fingers, thumbs, fingertips.", 3200, func():
				locked = false
				_done("wash")
				_after("Clean hands. Nice start."))
		"curtain":
			locked = true
			ward.curtain_closed = true
			await get_tree().create_timer(0.9).timeout
			if not is_inside_tree():
				return
			locked = false
			_done("curtain")
			_after("Curtain closed. Privacy protected.")
		"greet":
			ward.set_view("head")
			say("Mr Amoah opens his eyes. What do you say?", [
				["\"Hello Mr Amoah, I am your student nurse. May I check your vitals now?\"", func():
					Audio.play("correct")
					_done("greet")
					_after("He smiles and nods. Consent and comfort matter.")],
				["\"Roll over, I am in a hurry.\"", func():
					raw_penalty(0, 25)
					say("He looks worried. Rushing a patient costs dignity. Try again.", [["Say it better", func(): _act("greet")]]), "alt"]])
		_:
			var m := _touch_check()
			var pre := (m + "\n") if m != "" else ""
			match id:
				"pulse", "resp":
					_count_intro(id, pre)
				"bp":
					ward.set_view("arm")
					say(pre + "Pick a cuff for his arm.", [
						["Small child cuff", _wrong_cuff],
						["Regular adult cuff", func():
							locked = true
							ward.show_tool("cuff", true)
							timed("Inflating cuff, then releasing slowly.", 2600, func():
								locked = false
								ward.show_tool("cuff", false)
								readings["bp"] = "96/58"
								_done("bp")
								_after("Blood pressure 96/58 mmHg. That is low for him."))],
						["Large thigh cuff", _wrong_cuff]])
				"temp":
					ward.set_view("head")
					locked = true
					ward.show_tool("thermo", true)
					timed(pre + "Taking temperature. Wait for the beep.", 1800, func():
						locked = false
						ward.show_tool("thermo", false)
						readings["temp"] = "38.2"
						_done("temp")
						_after("Temperature 38.2 °C. He has a fever."))
				"spo2":
					ward.set_view("wrist")
					locked = true
					ward.show_tool("clip", true)
					timed(pre + "Clip on a clean finger. Wait for a steady reading.", 1800, func():
						locked = false
						ward.show_tool("clip", false)
						readings["spo2"] = "93"
						_done("spo2")
						_after("Oxygen saturation 93%. Below the normal 95 to 100%."))


func _vitals_reset() -> void:
	finished = false
	ward.clear_hotspots()
	for id in VITAL_DOTS.keys():
		ward.add_hotspot(id, VITAL_DOTS[id][0], VITAL_DOTS[id][1])
	done = {}
	readings = {}
	penalised = {}
	safe = 100
	dig = 100
	locked = false
	ward.set_view("over")
	ward.curtain_closed = false
	ward.pulse_rate = 0.0
	ward.breathing_fast = false
	for t in ["cuff", "clip", "thermo"]:
		ward.show_tool(t, false)
	_meters()
	_tasks(VITAL_TASKS, done)
	say("Mr Amoah, 68, is on day 1 after surgery and his 4 pm vitals are due. Tap the gold dots to do the check yourself. Drag to look around the ward.", [["Start the check", null]])


## Touching the patient before hands, curtain and greeting costs points (once each).
func _touch_check() -> String:
	var msgs: Array = []
	if not done.get("wash", false) and not penalised.has("w"):
		penalised["w"] = true
		penalty(15, 0)
		msgs.append("Hands first! Always clean them before touching a patient.")
	if not done.get("curtain", false) and not penalised.has("c"):
		penalised["c"] = true
		penalty(0, 15)
		msgs.append("Close the curtain. He is exposed to the ward.")
	if not done.get("greet", false) and not penalised.has("g"):
		penalised["g"] = true
		penalty(0, 10)
		msgs.append("Introduce yourself and ask permission first.")
	return "[b]" + " ".join(PackedStringArray(msgs)) + "[/b]" if not msgs.is_empty() else ""


func _wrong_cuff() -> void:
	raw_penalty(19, 0)
	say("Wrong cuff size gives a false reading. Choose again.", [["Choose a cuff", func(): _act("bp")]])


func _done(id: String) -> void:
	done[id] = true
	_tasks(VITAL_TASKS if shift_i == 0 else _ward_task_list(), done)
	ward.set_view("over")


func _after(msg: String) -> void:
	Audio.play("correct")
	var all := true
	for t in VITAL_TASKS:
		if not done.get(t[0], false):
			all = false
	if all:
		say(msg, [["Continue", _decide]])
	else:
		say(msg)


func _count_intro(id: String, pre: String) -> void:
	ward.set_view("wrist" if id == "pulse" else "chest")
	locked = true
	var how := "[b]How to count the pulse:[/b] a big heart will flash with each beat. Tap the button once for every flash. Being close is good enough." if id == "pulse" \
		else "[b]How to count breathing:[/b] watch his chest rise and fall. Tap the button once each time it rises."
	say(pre + how + "\nYou count for 15 seconds, then we multiply by 4. Read this first. The timer starts only when you press Start.", [["Start counting", func(): _count_start(id)]])


func _count_start(id: String) -> void:
	_count_id = id
	_count_n = 0
	_count_left = 15.0
	if id == "pulse":
		ward.pulse_rate = 104.0
	else:
		ward.breathing_fast = true
	var box := UI.vbox(8)
	if id == "pulse":
		var h := HeartIcon.new()
		box.add_child(h)
		_heart = h
	var b := _choice_button("", "")
	b.alignment = HORIZONTAL_ALIGNMENT_CENTER
	b.add_theme_font_size_override("font_size", 24)
	b.custom_minimum_size.y = 72
	b.pressed.connect(func():
		_count_n += 1
		Audio.play("tap")
		_update_count_label())
	box.add_child(b)
	await say("Counting now. Tap for every %s. (Space bar works too.)" % ("flash" if id == "pulse" else "rise"), [], box)
	if id == "pulse":
		_heart = h_from(box)
	_count_button = b
	_update_count_label()


func h_from(box: Control) -> HeartIcon:
	for c in box.get_children():
		if c is HeartIcon:
			return c
	return null


func _update_count_label() -> void:
	if _count_button:
		var unit := "beats" if _count_id == "pulse" else "breaths"
		_count_button.text = "Tap!  %d %s  ·  %ds" % [_count_n, unit, maxi(0, int(ceil(_count_left)))]


func _count_finish() -> void:
	var id := _count_id
	_count_id = ""
	_count_button = null
	ward.pulse_rate = 0.0
	ward.breathing_fast = false
	locked = false
	var rate := 104 if id == "pulse" else 24
	var per_min := _count_n * 4
	var tol := 12 if id == "pulse" else 8
	var note := "That is fast for him." if id == "pulse" else "That is fast. Normal is 12 to 20."
	if absi(per_min - rate) <= tol:
		readings[id] = rate
		_done(id)
		_after("You counted %d in 15 s, so %d per minute. %s" % [_count_n, per_min, note])
	else:
		raw_penalty(5, 0)
		say("You counted %d, which gives %d per minute. That is a bit off, so try again. Take your time." % [_count_n, per_min], [
			["Count again", func(): _act(id)],
			["Let Sister Rebecca count with me (-10 Safety)", func():
				raw_penalty(10, 0)
				readings[id] = rate
				_done(id)
				_after("Together we counted %d per minute. %s" % [rate, note])]])


func _trend_table() -> GridContainer:
	var g := GridContainer.new()
	g.columns = 4
	g.add_theme_constant_override("h_separation", 18)
	g.add_theme_constant_override("v_separation", 6)
	var rows := [["", "8 am", "12 pm", "4 pm"], ["BP", "128/82", "112/70", str(readings.get("bp", "96/58"))],
		["Pulse", "78", "92", str(readings.get("pulse", 104))], ["Breaths", "16", "20", str(readings.get("resp", 24))],
		["Temp", "37.0", "37.6", "38.2"], ["SpO₂", "97", "95", "93"]]
	for r in rows.size():
		for c in 4:
			var head := r == 0 or c == 0
			var l := UI.label(String(rows[r][c]), 15, "bad" if (c == 3 and r > 0) else ("muted" if head else "fg"), "bold" if (head or c == 3) else "body", false)
			g.add_child(l)
	return g


func _decide() -> void:
	ward.set_view("over")
	say("All five readings are in. Compare them with this morning and midday. What do you notice?", [
		["Each reading is only a little off. Record it and move on.", func(): _escalate(35, "Look at the trend, not single numbers. Everything is moving the wrong way.")],
		["The trend is getting worse. I need to escalate now.", func(): _escalate(0, "Falling BP with rising pulse, breathing rate and temperature is a worsening trend.")],
		["Wait for the next scheduled round.", func(): _escalate(25, "Waiting delays care when a patient is deteriorating.")]], _trend_table())


func _escalate(s: float, why: String) -> void:
	penalty(s)
	if s == 0.0:
		Audio.play("correct")
	say(why + " How do you escalate?", [
		["Call the nurse in charge with an SBAR: situation, background, assessment, recommendation.", func(): _vitals_finish(0, "A clear SBAR gets the right help quickly.")],
		["Tell his visitor to let the doctor know.", func(): _vitals_finish(20, "Escalation cannot be left to a visitor, and it shares his information.", 20)],
		["Write it in the notes and carry on.", func(): _vitals_finish(30, "Notes are not escalation. Someone has to be told now.")]])


func _vitals_finish(s: float, why: String, d: float = 0.0) -> void:
	penalty(s, d)
	_result(why, _vitals_reset)


# ================================================================== shifts 2-6 from data

func _ward_task_list() -> Array:
	var out: Array = []
	for t in cfg.get("tasks", []):
		out.append([String(t["id"]), String(t["label"])])
	return out


func _v3(a: Array) -> Vector3:
	return Vector3(float(a[0]), float(a[1]), float(a[2]))


func _ward_start() -> void:
	finished = false
	ward.clear_hotspots()
	ward.set_props(cfg.get("props", []))
	for t in cfg.get("tasks", []):
		var at: Variant = t["at"]
		ward.add_hotspot(String(t["id"]), at if at is String else _v3(at), float(t.get("radius", 0.11)))
	done = {}
	penalised = {}
	safe = 100
	dig = 100
	locked = false
	ward.curtain_closed = false
	ward.set_view("over")
	_meters()
	_tasks(_ward_task_list(), done)
	say(String(cfg.get("intro", "")) + " Tap the gold dots. Drag to look around.", [["Start the shift", null]])


func _task(id: String) -> Dictionary:
	for t in cfg.get("tasks", []):
		if String(t["id"]) == id:
			return t
	return {}


func _ward_view(v: Variant) -> void:
	if v is Array:
		ward.set_view([_v3(v[0]), _v3(v[1])])
	else:
		ward.set_view(String(v))


func _ward_act(id: String) -> void:
	if locked or bool(done.get(id, false)):
		return
	var t := _task(id)
	if t.is_empty():
		return
	var pre := ""
	var needs: Array = t.get("needs", [])
	var missing := false
	for n in needs:
		if not done.get(String(n), false):
			missing = true
	if missing and not penalised.has(id):
		penalised[id] = true
		penalty(float(t.get("warn_safety", 10)), float(t.get("warn_dignity", 0)))
		pre = "[b]" + String(t.get("warn", "")) + "[/b]\n"
	_ward_view(t.get("view", "over"))
	_person_reacts(t)
	if id == "curtain":
		ward.curtain_closed = true
	if String(t.get("type", "")) == "bar":
		locked = true
		timed(pre + String(t["text"]), int(t.get("ms", 2500)), func():
			locked = false
			_done(id)
			_ward_next("Done."))
	else:
		_ward_choice(t, pre)


## The person you walk up to looks at you and speaks; Mr Amoah nods when you talk to him at his head.
func _person_reacts(t: Dictionary) -> void:
	var at: Variant = t["at"]
	if at is Array:
		var f := ward.person_near(float(at[0]))
		if f and absf(float(at[2]) - f.position.z) < 0.4:
			f.talk(1.8)
			return
	if at is String and String(at) in ["head", "forehead", "mouth"]:
		ward.patient.talk(1.4)
		ward.patient.react("yes")


func _ward_choice(t: Dictionary, pre: String) -> void:
	var buttons: Array = []
	for o in t["options"]:
		var opt: Dictionary = o
		buttons.append([String(opt["text"]), func():
			var s := float(opt["safety"])
			var d := float(opt["dignity"])
			if s > 0.0 or d > 0.0:
				penalty(s, d)
				say(String(opt["feedback"]) + " Try again.", [["Try again", func(): _ward_choice(t, "")]])
			else:
				Audio.play("correct")
				_done(String(t["id"]))
				_ward_next(String(opt["feedback"]))])
	say(pre + String(t["question"]), buttons)


func _ward_next(msg: String) -> void:
	for t in cfg.get("tasks", []):
		if not done.get(String(t["id"]), false):
			say(msg)
			return
	_ward_final(0, msg)


func _ward_final(i: int, msg: String) -> void:
	var finals: Array = cfg.get("final", [])
	if i >= finals.size():
		_result(msg, _ward_start)
		return
	var f: Dictionary = finals[i]
	var buttons: Array = []
	for o in f["options"]:
		var opt: Dictionary = o
		buttons.append([String(opt["text"]), func():
			var s := float(opt["safety"])
			var d := float(opt["dignity"])
			penalty(s, d)
			if s == 0.0 and d == 0.0:
				Audio.play("correct")
			_ward_final(i + 1, String(opt["feedback"]))])
	say(((msg + " ") if msg != "" else "") + String(f["question"]), buttons)


# ================================================================== result

func _result(msg: String, replay: Callable) -> void:
	finished = true
	ward.set_view("over")
	var ok := safe >= PASS and dig >= PASS
	if ok:
		SaveData.set_done(shift_i, "prove")
		Audio.play("pass")
	else:
		Audio.play("alert")
	var text := "%s Safety [b]%d[/b], Dignity [b]%d[/b]. " % [msg, safe, dig]
	if ok:
		text += "Both stayed high. Now do it for real with a partner or model."
	else:
		if safe < PASS:
			text += "Safety is too low. "
		if dig < PASS:
			text += "Dignity is too low. "
		text += "Both meters need 80 or more. There is no game over. Read the notes and replay."
	var buttons: Array = [["Hands-on checkpoint", func(): Router.go("check", {"shift": shift_i})]] if ok \
		else [["Replay the shift", replay]]
	say(text, buttons, null, "Shift passed" if ok else "Near miss")
