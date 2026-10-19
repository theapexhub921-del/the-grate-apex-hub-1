extends Screen
## Category / difficulty / length picker for Classic, Rush and Practice.

const DIFF_NOTES := {
	0: "Mixed: a blend of every level.",
	1: "Easy: short core terms, plain clues, most time. 100 base points.",
	2: "Medium: everyday clinical vocabulary. 150 base points.",
	3: "Hard: longer terms with clinical clues. 220 base points.",
	4: "Expert: the longest terms, tight clock. 300 base points.",
}

var cfg := {"category": "All", "difficulty": 0, "count": 10}
var mode := "classic"
var note: Label


func build() -> void:
	mode = String(params.get("mode", "classic"))
	top_bar("‹ Back", "menu" if mode == "practice" else "modes")
	var titles := {"classic": "Classic Scramble", "rush": "Medical Rush", "practice": "Practice"}
	content.add_child(UI.eyebrow("Set up your round"))
	content.add_child(UI.title(String(titles.get(mode, "Play"))))
	if mode == "practice":
		content.add_child(UI.label("Unlimited terms, relaxed timer and a full explanation after every answer.", 16, "muted"))

	var v := UI.card(content, 14)
	v.add_child(UI.label("CATEGORY", 13, "muted", "mono"))
	var cats: Array = [["All (%d)" % GameData.terms.size(), "All"]]
	for c in GameData.CATEGORIES:
		cats.append(["%s (%d)" % [c, GameData.count_in(c)], c])
	v.add_child(UI.chips(cats, cfg["category"], func(val): cfg["category"] = val))

	v.add_child(UI.label("DIFFICULTY", 13, "muted", "mono"))
	var diffs: Array = [["Mixed", 0], ["Easy", 1], ["Medium", 2], ["Hard", 3], ["Expert", 4]]
	v.add_child(UI.chips(diffs, cfg["difficulty"], func(val):
		cfg["difficulty"] = val
		note.text = DIFF_NOTES[int(val)]))
	note = UI.label(DIFF_NOTES[0], 14, "muted")
	v.add_child(note)

	if mode != "practice":
		v.add_child(UI.label("QUESTIONS", 13, "muted", "mono"))
		v.add_child(UI.chips([["5", 5], ["10", 10], ["15", 15], ["20", 20]], cfg["count"], func(val): cfg["count"] = val))

	var start := UI.button("Start", "primary", 60)
	start.add_theme_font_size_override("font_size", 21)
	start.pressed.connect(func():
		var p := cfg.duplicate()
		p["mode"] = mode
		Router.go("game", p))
	content.add_child(start)
	start.grab_focus.call_deferred()
