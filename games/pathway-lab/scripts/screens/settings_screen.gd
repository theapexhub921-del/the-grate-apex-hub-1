extends Screen
## Settings: theme, sound, motion, default difficulty, and resetting progress.

var _reset_armed := false


func build() -> void:
	Style.set_accent(Style.DEFAULT_ACCENT)
	theme = Style.theme
	top_bar("‹ Pathways", "home")
	content.add_child(UI.title("Settings", 40))

	var look := UI.card(content, 12)
	look.add_child(UI.label("THEME", 11, "muted", "mono", false))
	look.add_child(UI.chips([["Match device", "auto"], ["Dark", "dark"], ["Light", "light"]], String(SaveData.settings["theme"]), func(v):
		SaveData.settings["theme"] = String(v)
		SaveData.save()
		Style.refresh()))
	_toggle(look, "Reduce motion", "Turns off pops, shakes, confetti and the moving line.", "reduced_motion")

	var snd := UI.card(content, 12)
	snd.add_child(UI.label("SOUND", 11, "muted", "mono", false))
	_toggle(snd, "Sound effects", "Clicks, correct and wrong sounds, the last-10-seconds tick.", "sfx")
	_toggle(snd, "Background music", "A quiet ambient loop.", "music", func(): Audio.apply_settings())
	var vrow := UI.hbox(12)
	snd.add_child(vrow)
	vrow.add_child(UI.label("Volume", 16, "fg", "body", false))
	var vol := HSlider.new()
	vol.min_value = 0.0
	vol.max_value = 1.0
	vol.step = 0.05
	vol.value = float(SaveData.settings["volume"])
	vol.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	vol.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	vol.value_changed.connect(func(v):
		SaveData.settings["volume"] = v
		Audio.apply_settings())
	vol.drag_ended.connect(func(_c): SaveData.save(); Audio.play("tap"))
	vrow.add_child(vol)

	var play := UI.card(content, 12)
	play.add_child(UI.label("DEFAULT DIFFICULTY", 11, "muted", "mono", false))
	var opts: Array = []
	for k in ["relaxed", "standard", "expert"]:
		opts.append([PathwayRound.DIFFICULTY[k]["label"], k])
	var note := UI.label(String(PathwayRound.DIFFICULTY[String(SaveData.settings["difficulty"])]["about"]), 14, "muted")
	play.add_child(UI.chips(opts, String(SaveData.settings["difficulty"]), func(v):
		SaveData.settings["difficulty"] = String(v)
		SaveData.save()
		note.text = String(PathwayRound.DIFFICULTY[String(v)]["about"])))
	play.add_child(note)

	var danger := UI.card(content, 10)
	danger.add_child(UI.label("PROGRESS", 11, "muted", "mono", false))
	danger.add_child(UI.label("Your scores, stars and studied pathways are kept on this device.", 14, "muted"))
	var reset := UI.button("Reset all progress", "ghost", 44)
	reset.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	reset.pressed.connect(func():
		if _reset_armed:
			SaveData.reset_progress()
			reset.text = "Progress reset"
			reset.disabled = true
			return
		_reset_armed = true
		reset.text = "Tap again to erase everything"
		UI.tint(reset, "bad"))
	danger.add_child(reset)
	content.add_child(UI.label("Pathway Lab · %d pathways, %d steps" % [PD.pathways.size(), PD.pathways.reduce(func(a, p): return a + (p["nodes"] as Array).size(), 0)], 12, "muted", "mono"))



func _toggle(parent: Control, title: String, about: String, key: String, after: Callable = Callable()) -> CheckButton:
	var row := UI.hbox(12)
	parent.add_child(row)
	var v := UI.vbox(0)
	row.add_child(v)
	v.add_child(UI.label(title, 16, "fg", "bold"))
	v.add_child(UI.label(about, 13, "muted"))
	var cb := CheckButton.new()
	cb.button_pressed = bool(SaveData.settings.get(key, false))
	cb.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	cb.toggled.connect(func(on: bool):
		SaveData.settings[key] = on
		SaveData.save()
		Audio.play("tap")
		if after.is_valid():
			after.call())
	row.add_child(cb)
	return cb
