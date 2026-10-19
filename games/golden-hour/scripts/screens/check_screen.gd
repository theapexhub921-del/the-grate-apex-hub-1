extends Screen
## "Do it for real": a partner ticks the hands-on checklist. All ticked = practice verified.

var shift_i := 0


func build() -> void:
	shift_i = int(params.get("shift", 0))
	var s: Dictionary = Data.shift(shift_i)
	UI.header(content, "Shift %d · Do it for real" % (shift_i + 1))
	UI.sister(content, "Put the phone down. " + String(s["checkpoint"]))
	var v := UI.card(content, 2)
	v.add_child(UI.label("Practical checklist", 19, "fg", "display"))
	var ticks: Array = SaveData.shift(shift_i)["ticks"]
	var items: Array = s["checklist"]
	for k in items.size():
		var c := CheckBox.new()
		c.text = String(items[k])
		c.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		c.button_pressed = k < ticks.size() and bool(ticks[k])
		c.add_theme_font_size_override("font_size", 16)
		c.custom_minimum_size.y = 46
		c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		c.toggled.connect(func(on: bool):
			ticks[k] = on
			Audio.play("tap")
			_update())
		v.add_child(c)
		if k < items.size() - 1:
			var sep := HSeparator.new()
			sep.add_theme_stylebox_override("separator", Style.box(Style.c("line"), Color.TRANSPARENT, 0, 0, Vector4(0, 0, 0, 0)))
			sep.add_theme_constant_override("separation", 1)
			v.add_child(sep)
	_footer = UI.vbox(12)
	content.add_child(_footer)
	_update(false)


var _footer: VBoxContainer


func _update(animate: bool = true) -> void:
	var ticks: Array = SaveData.shift(shift_i)["ticks"]
	var all := true
	for t in ticks:
		if not bool(t):
			all = false
	var was := SaveData.is_done(shift_i, "check")
	SaveData.set_done(shift_i, "check", all)
	for c in _footer.get_children():
		_footer.remove_child(c)
		c.queue_free()
	var s: Dictionary = Data.shift(shift_i)
	if all:
		var badge := Badge.new()
		badge.text = "Practice\nVerified\n" + String(s["badge"])
		_footer.add_child(badge)
		if animate and not was:
			Audio.play("pass")
			UI.pulse(badge, 1.12)
		var h := UI.label("Well done!", 26, "fg", "display")
		h.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		_footer.add_child(h)
		var more := " Shift %d is open." % (shift_i + 2) if shift_i < 5 else " You have finished all six shifts."
		var p := UI.label("Shift %d complete. %s now shows as Ready for real practice.%s" % [shift_i + 1, s["skill"], more], 16)
		p.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		_footer.add_child(p)
		if shift_i < 5:
			var nb := UI.button("Next shift", "primary", 54)
			nb.pressed.connect(func(): Router.go(SaveData.next_step(shift_i + 1), {"shift": shift_i + 1}))
			_footer.add_child(nb)
	else:
		_footer.add_child(UI.label("The shift only counts as complete once your partner has ticked every step.", 14, "muted"))
	var back := UI.button("Finish" if all and shift_i == 5 else "Back to the ward", "primary" if all and shift_i == 5 else "ghost", 50)
	back.pressed.connect(func(): Router.go("home"))
	_footer.add_child(back)
