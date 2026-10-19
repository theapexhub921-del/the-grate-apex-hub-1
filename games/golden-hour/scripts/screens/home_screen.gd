extends Screen
## The ward: header with rank, Sister Rebecca, the six shifts and the readiness screen.


func build() -> void:
	var top := UI.hbox(8)
	content.add_child(top)
	top.add_child(UI.spacer())
	var settings := UI.button("Settings", "ghost", 36)
	settings.pressed.connect(func(): Router.go("settings"))
	top.add_child(settings)

	_hero()
	UI.sister(content, "Welcome to the ward. I am Sister Rebecca and I will walk you through six shifts. Learn it, drill it, prove it, then do it for real.")

	content.add_child(UI.label("Tonight's shifts", 21, "fg", "display"))
	for i in Data.shifts.size():
		_shift_card(i)

	content.add_child(UI.label("Readiness screen", 21, "fg", "display"))
	for i in Data.shifts.size():
		_readiness_card(i)

	content.add_child(UI.label("Prototype. A phone game builds knowledge, order, speed and judgement. Hands-on skills only become safe through supervised practice. Ranges, steps and checklists must follow your school's protocols and be reviewed by a lecturer or clinician.", 13, "muted"))


func _hero() -> void:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", Style.box(Style.c("hero"), Color.TRANSPARENT, 26, 0, Vector4(20, 22, 20, 18)))
	content.add_child(p)
	var v := UI.vbox(4)
	p.add_child(v)
	var t := UI.label("Golden Hour", 38, "gold", "display", false)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(t)
	var sub := UI.label("Ridgeview General Hospital. Night shift, short-staffed. Difficulty 8.5 out of 10.", 14, "hero_muted")
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(sub)
	var ecg := EcgLine.new()
	ecg.color = Style.c("gold")
	v.add_child(ecg)
	var r := SaveData.rank()
	var row := UI.hbox(8)
	row.alignment = BoxContainer.ALIGNMENT_CENTER
	v.add_child(row)
	row.add_child(UI.label(String(r["name"]), 14, "hero_fg", "bold", false))
	row.add_child(UI.label("next rank: " + String(r["next"]), 14, "hero_muted", "body", false))
	var bar := UI.progress_bar(SaveData.proves_passed() / 6.0, "gold", 8)
	bar.add_theme_stylebox_override("background", Style.box(Color(1, 1, 1, 0.18), Color.TRANSPARENT, 99, 0, Vector4.ZERO))
	v.add_child(bar)
	var n := UI.label("%d of 6 shifts proven" % SaveData.proves_passed(), 12, "hero_muted", "bold", false)
	n.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(n)


func _shift_card(i: int) -> void:
	var s: Dictionary = Data.shift(i)
	var open := SaveData.is_open(i)
	var v := UI.click_card(content, func(): _open_shift(i), not open)
	v.add_child(UI.label("Shift %d. %s" % [i + 1, s["name"]], 19, "fg", "display"))
	v.add_child(UI.label(String(s["skills"]), 14, "muted"))
	var pips := UI.flow(6)
	pips.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(pips)
	if not open:
		pips.add_child(UI.pip("Locked: pass Prove on Shift %d" % i))
		return
	var names := {"learn": "Learn", "drill": "Drill", "prove": "Prove", "check": "Do it for real"}
	for step in SaveData.STEPS:
		var done := SaveData.is_done(i, step)
		var b := Button.new()
		b.text = names[step]
		b.focus_mode = Control.FOCUS_NONE
		var can := SaveData.step_open(i, step)
		b.disabled = not can
		b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		var bg := Style.c("gold") if done and step == "check" else (Style.c("hema") if done else Color.TRANSPARENT)
		var fg := Style.c("gold_fg") if done and step == "check" else (Style.c("hema_fg") if done else Style.c("muted"))
		var box := Style.box(bg, bg if done else Style.c("line"), 99, 1, Vector4(10, 3, 10, 3))
		for k in ["normal", "hover", "pressed", "disabled", "focus"]:
			b.add_theme_stylebox_override(k, box)
		for k in ["font_color", "font_hover_color", "font_pressed_color", "font_disabled_color", "font_focus_color"]:
			b.add_theme_color_override(k, fg if can else Color(fg, 0.5))
		b.add_theme_font_size_override("font_size", 12)
		b.add_theme_font_override("font", Style.font("bold"))
		b.tooltip_text = "Open %s" % names[step]
		b.pressed.connect(func():
			Audio.play("click")
			Router.go(step, {"shift": i}))
		pips.add_child(b)


func _readiness_card(i: int) -> void:
	var s: Dictionary = Data.shift(i)
	var v := UI.card(content, 4)
	v.add_child(UI.label(String(s["skill"]), 16, "fg", "bold"))
	var proven := SaveData.is_done(i, "prove")
	var checked := SaveData.is_done(i, "check")
	var r1 := UI.hbox(6)
	r1.add_child(UI.label("In-app mastery:", 14, "muted", "body", false))
	r1.add_child(UI.label("Passed" if proven else "Not yet", 14, "good" if proven else "muted", "bold", false))
	v.add_child(r1)
	var r2 := UI.hbox(6)
	r2.add_child(UI.label("Hands-on checkpoint:", 14, "muted", "body", false))
	r2.add_child(UI.label("Signed off" if checked else "Not yet", 14, "good" if checked else "muted", "bold", false))
	v.add_child(r2)
	var ready := proven and checked
	var f := UI.flow(6)
	f.add_child(UI.pip("Ready for real practice" if ready else "Not ready for real practice", "gold" if ready else "off"))
	v.add_child(f)


func _open_shift(i: int) -> void:
	if not SaveData.is_open(i):
		Audio.play("wrong")
		UI.toast(self, "Pass the Prove step of Shift %d to open this shift." % i)
		return
	Router.go(SaveData.next_step(i), {"shift": i})
