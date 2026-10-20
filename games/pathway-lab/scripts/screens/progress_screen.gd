extends Screen
## Your progress: totals, each subject, recent rounds and the steps you miss most.


func build() -> void:
	Style.set_accent(Style.DEFAULT_ACCENT)
	theme = Style.theme
	top_bar("‹ Pathways", "home")
	content.add_child(UI.eyebrow("Your progress"))
	content.add_child(UI.title("Progress", 40))

	var total := PD.pathways.size()
	var done := PD.pathways.filter(func(p): return SaveData.completed(String(p["id"]))).size()
	var studied := PD.pathways.filter(func(p): return SaveData.is_studied(String(p["id"]))).size()
	var grid := GridContainer.new()
	grid.columns = 4 if column_width() >= 620 else 2
	grid.add_theme_constant_override("h_separation", 10)
	grid.add_theme_constant_override("v_separation", 10)
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_child(grid)
	_stat(grid, "%d / %d" % [done, total], "Pathways complete")
	_stat(grid, "%d / %d" % [SaveData.stars_total(), total * 6], "Stars")
	_stat(grid, str(studied), "Studied")
	_stat(grid, "%d (best %d)" % [SaveData.daily_streak(), int(SaveData.data["daily"]["best_streak"])], "Daily streak")

	var sc := UI.card(content, 12)
	sc.add_child(UI.label("BY SUBJECT", 11, "muted", "mono", false))
	for subj in PD.subjects:
		var list := PD.pathways.filter(func(p): return String(p["subj"]) == subj)
		var d := list.filter(func(p): return SaveData.completed(String(p["id"]))).size()
		var st := 0
		for p in list:
			st += SaveData.stars(String(p["id"]), "fill") + SaveData.stars(String(p["id"]), "arrange")
		var row := UI.hbox(10)
		sc.add_child(row)
		row.add_child(UI.label(subj, 16, "fg", "bold"))
		row.add_child(UI.label("%d / %d · %d stars" % [d, list.size(), st], 13, "muted", "mono", false))
		sc.add_child(UI.progress_bar(float(d) / maxf(1.0, list.size()), "accent", 8))

	var recent: Array = SaveData.data["recent"]
	var rc := UI.card(content, 8)
	rc.add_child(UI.label("RECENT ROUNDS", 11, "muted", "mono", false))
	if recent.is_empty():
		rc.add_child(UI.label("No rounds yet. Pick a pathway on the home screen to start.", 15, "muted"))
	for it in recent:
		var p := PD.get_pathway(String(it["pid"]))
		if p.is_empty():
			continue
		var row := UI.hbox(10)
		rc.add_child(row)
		row.add_child(UI.marker("e", 12, Style.accent_for(PD.color(p))))
		row.add_child(UI.label("%s · %s" % [p["name"], "Fill" if it["mode"] == "fill" else "Arrange"], 15, "fg"))
		row.add_child(UI.stars(int(it["stars"]), 14))
		row.add_child(UI.label(str(int(it["score"])), 14, "muted", "mono", false))

	# the steps missed most, across every pathway
	var weak: Array = []
	for pid in SaveData.data["missed"].keys():
		var p := PD.get_pathway(pid)
		if p.is_empty():
			continue
		for k in SaveData.data["missed"][pid].keys():
			var i := int(k)
			if i < (p["nodes"] as Array).size():
				weak.append([pid, i, int(SaveData.data["missed"][pid][k])])
	weak.sort_custom(func(a, b): return a[2] > b[2])
	var wc := UI.card(content, 8)
	wc.add_child(UI.label("STEPS YOU MISS MOST", 11, "muted", "mono", false))
	if weak.is_empty():
		wc.add_child(UI.label("Nothing yet. Steps you get wrong or need a hint for will show up here.", 15, "muted"))
	for w in weak.slice(0, 8):
		var p := PD.get_pathway(String(w[0]))
		var n: Dictionary = p["nodes"][int(w[1])]
		var row := UI.hbox(10)
		wc.add_child(row)
		row.add_child(UI.marker(String(n["t"]), 14, Style.accent_for(PD.color(p))))
		var v := UI.vbox(0)
		row.add_child(v)
		v.add_child(UI.label(String(n["n"]), 15, "fg", "bold"))
		v.add_child(UI.label("%s · missed %d time%s" % [p["name"], int(w[2]), "" if int(w[2]) == 1 else "s"], 12, "muted"))
		var b := UI.button("Practise", "soft", 38)
		var pid := String(w[0])
		b.pressed.connect(func(): Router.go("play", {"pid": pid, "mode": "fill", "focus": SaveData.weak_steps(pid)}))
		row.add_child(b)


func _stat(parent: Control, value: String, caption: String) -> void:
	var pc := PanelContainer.new()
	pc.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	pc.add_theme_stylebox_override("panel", Style.box(Style.c("surface"), Style.c("line"), 12, 1, Vector4(14, 10, 14, 10)))
	var v := UI.vbox(2)
	pc.add_child(v)
	v.add_child(UI.label(caption.to_upper(), 11, "muted", "mono", false))
	v.add_child(UI.label(value, 22, "fg", "mono", false))
	parent.add_child(pc)
