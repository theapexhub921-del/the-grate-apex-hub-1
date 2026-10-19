extends Screen

var status: Label


func build() -> void:
	top_bar("‹ Back to ward", "home")
	content.add_child(UI.eyebrow("Preferences"))
	content.add_child(UI.title("Settings"))
	var s: Dictionary = SaveData.settings

	var ac := UI.card(content, 10)
	ac.add_child(UI.label("AUDIO", 13, "muted", "mono"))
	ac.add_child(_toggle("Sound effects", "sfx"))
	ac.add_child(_toggle("Ward ambience", "music"))
	ac.add_child(_slider("Master volume", "volume"))
	ac.add_child(_slider("Music volume", "music_volume"))

	var dc := UI.card(content, 10)
	dc.add_child(UI.label("DISPLAY", 13, "muted", "mono"))
	dc.add_child(UI.chips([["Automatic", "auto"], ["Light", "light"], ["Dark", "dark"]], s["theme"], func(v):
		SaveData.settings["theme"] = v
		SaveData.save()
		Style.refresh()))
	dc.add_child(_toggle("Reduced motion", "reduced_motion"))

	var rc := UI.card(content, 10, "bad")
	rc.add_child(UI.label("DANGER ZONE", 13, "bad", "mono"))
	rc.add_child(UI.label("Erase every shift's Learn, Drill, Prove and checklist progress. Settings are kept.", 15, "muted"))
	var reset := UI.button("Reset progress", "danger", 46)
	reset.pressed.connect(_confirm_reset)
	rc.add_child(reset)

	status = UI.label("", 15, "good", "bold")
	content.add_child(status)


func _toggle(text: String, key: String) -> CheckButton:
	var c := CheckButton.new()
	c.text = text
	c.button_pressed = bool(SaveData.settings[key])
	c.add_theme_font_size_override("font_size", 17)
	c.toggled.connect(func(on: bool):
		SaveData.settings[key] = on
		SaveData.save()
		Audio.apply_settings()
		Audio.play("click"))
	return c


func _slider(text: String, key: String) -> VBoxContainer:
	var v := UI.vbox(4)
	v.add_child(UI.label(text, 15, "fg"))
	var sl := HSlider.new()
	sl.min_value = 0.0
	sl.max_value = 1.0
	sl.step = 0.05
	sl.value = float(SaveData.settings[key])
	sl.custom_minimum_size.y = 28
	sl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	sl.value_changed.connect(func(val: float):
		SaveData.settings[key] = val
		Audio.apply_settings())
	sl.drag_ended.connect(func(_c: bool):
		SaveData.save()
		Audio.play("click"))
	v.add_child(sl)
	return v


func _confirm_reset() -> void:
	var d := ConfirmationDialog.new()
	d.title = "Reset progress?"
	d.dialog_text = "This erases progress on all six shifts, including signed-off checklists.\nThis cannot be undone."
	d.ok_button_text = "Erase everything"
	d.cancel_button_text = "Keep my progress"
	d.theme = Style.theme
	add_child(d)
	d.confirmed.connect(func():
		SaveData.reset_progress()
		status.text = "Progress reset.")
	d.visibility_changed.connect(func():
		if not d.visible:
			d.queue_free())
	d.popup_centered(Vector2i(460, 200))
