extends Screen

const LOGO_WORD := "SCRAMBLE"


func build() -> void:
	var top := UI.hbox(8)
	content.add_child(top)
	top.add_child(UI.spacer())
	var theme_btn := UI.button("Theme: " + String(SaveData.settings["theme"]).capitalize(), "ghost", 36)
	theme_btn.pressed.connect(_cycle_theme)
	top.add_child(theme_btn)

	var head := UI.vbox(8)
	content.add_child(head)
	head.add_child(UI.eyebrow("Competitive medical terminology"))
	head.add_child(UI.title("Med Term", 60))
	head.add_child(_logo_tiles())
	head.add_child(UI.label("Unscramble medical terms against the clock. Build streaks, climb the ranks, challenge friends.", 17, "muted"))

	# Profile card
	var info := SaveData.rank_info(int(SaveData.data["xp"]))
	var pc := UI.card(content, 10)
	var row := UI.hbox(10)
	pc.add_child(row)
	var name_edit := UI.line_edit(SaveData.player_name(), "Your name")
	name_edit.max_length = 20
	name_edit.text_changed.connect(func(t: String): SaveData.set_player_name(t))
	row.add_child(name_edit)
	var rank := UI.label(String(info["name"]), 16, "hema", "bold", false)
	row.add_child(rank)
	pc.add_child(UI.progress_bar(float(info["progress"]), "eosin", 8))
	var next_txt := "Max rank reached" if int(info["next"]) < 0 else "%d / %d XP to next rank" % [int(SaveData.data["xp"]), int(info["next"])]
	pc.add_child(UI.label(next_txt, 13, "muted", "mono"))

	var play := UI.button("Play", "primary", 64)
	play.add_theme_font_size_override("font_size", 22)
	play.pressed.connect(func(): Router.go("modes"))
	content.add_child(play)
	play.grab_focus.call_deferred()

	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 12)
	grid.add_theme_constant_override("v_separation", 12)
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_child(grid)
	var items := [["Multiplayer", "multi", "accent"], ["Practice", "setup", "ghost"], ["Progress", "progress", "ghost"], ["Settings", "settings", "ghost"]]
	for it in items:
		var b := UI.button(String(it[0]), String(it[2]), 54)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var target := String(it[1])
		if target == "setup":
			b.pressed.connect(func(): Router.go("setup", {"mode": "practice"}))
		else:
			b.pressed.connect(func(): Router.go(target))
		grid.add_child(b)

	content.add_child(UI.label("%d medical terms · %d categories · %d clinical cases" % [GameData.terms.size(), GameData.CATEGORIES.size(), GameData.cases.size()], 13, "muted", "mono"))


func _logo_tiles() -> HFlowContainer:
	var f := UI.flow(6)
	var rng := RandomNumberGenerator.new()
	rng.randomize()
	var shuffled := Scramble.shuffle(LOGO_WORD, rng)
	var labels: Array = []
	for i in LOGO_WORD.length():
		var p := PanelContainer.new()
		p.custom_minimum_size = Vector2(40, 48)
		p.add_theme_stylebox_override("panel", Style.box(Style.c("hema"), Style.c("hema"), 8, 0, Vector4.ZERO))
		var l := UI.label(String(shuffled[i]), 23, "hema_fg", "mono", false)
		l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		p.add_child(l)
		f.add_child(p)
		labels.append(l)
	_unscramble.call_deferred(labels)
	return f


func _unscramble(labels: Array) -> void:
	await get_tree().create_timer(0.5).timeout
	for i in labels.size():
		if not is_inside_tree():
			return
		var l: Label = labels[i]
		l.text = LOGO_WORD[i]
		UI.pulse(l.get_parent(), 1.15)
		if i == labels.size() - 1:
			(l.get_parent() as PanelContainer).add_theme_stylebox_override("panel", Style.box(Style.c("eosin"), Style.c("eosin"), 8, 0, Vector4.ZERO))
		await get_tree().create_timer(0.06).timeout


func _cycle_theme() -> void:
	var order := ["auto", "light", "dark"]
	var i := order.find(String(SaveData.settings["theme"]))
	SaveData.settings["theme"] = order[(i + 1) % order.size()]
	SaveData.save()
	Style.refresh()
