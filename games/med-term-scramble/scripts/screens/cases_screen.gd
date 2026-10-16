extends Screen


func build() -> void:
	top_bar("← Back", "modes")
	content.add_child(UI.eyebrow("Case Mode"))
	content.add_child(UI.title("Clinical Cases"))
	content.add_child(UI.label("Each case chains several scrambles: symptoms, investigations, then the diagnosis.", 16, "muted"))
	for c in GameData.cases:
		var v := UI.card(content, 10, "eosin")
		v.add_child(UI.label(String(c.get("title", "")), 22, "fg", "display"))
		v.add_child(UI.label(String(c.get("presentation", "")), 16, "muted"))
		var steps: Array = c.get("steps", [])
		var stages: Array = []
		for s in steps:
			stages.append(String(s.get("stage", "")))
		v.add_child(UI.label(" → ".join(PackedStringArray(stages)), 13, "eosin", "mono"))
		var b := UI.button("Start case", "primary", 46)
		var id := String(c.get("id", ""))
		b.pressed.connect(func(): Router.go("game", {"mode": "case", "case_id": id}))
		v.add_child(b)
