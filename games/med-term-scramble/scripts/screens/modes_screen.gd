extends Screen


func build() -> void:
	top_bar()
	content.add_child(UI.eyebrow("Choose a mode"))
	content.add_child(UI.title("Play"))
	_mode_card("Classic Scramble", "The core game. Unscramble each term before time runs out. Speed and streaks score big.", "Play Classic",
		func(): Router.go("setup", {"mode": "classic"}), "hema")
	_mode_card("Medical Rush", "Solve the scramble, then answer a lightning clinical challenge about that term for bonus points.", "Play Medical Rush",
		func(): Router.go("setup", {"mode": "rush"}), "eosin")
	_mode_card("Case Mode", "Work through a patient case one scramble at a time, ending with the diagnosis.", "Choose a case",
		func(): Router.go("cases"), "line")


func _mode_card(t: String, desc: String, cta: String, action: Callable, accent: String) -> void:
	var v := UI.card(content, 10, accent)
	v.add_child(UI.label(t, 24, "fg", "display"))
	v.add_child(UI.label(desc, 16, "muted"))
	var b := UI.button(cta, "primary", 48)
	b.pressed.connect(action)
	v.add_child(b)
