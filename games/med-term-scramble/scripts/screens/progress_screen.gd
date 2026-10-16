extends Screen
## Profile, achievements and local leaderboard.

var body: VBoxContainer


func build() -> void:
	top_bar()
	content.add_child(UI.eyebrow("Your progress"))
	content.add_child(UI.title("Progress"))
	content.add_child(UI.chips([["Profile", "profile"], ["Achievements", "achievements"], ["Leaderboard", "leaderboard"]], "profile", _show))
	body = UI.vbox(14)
	content.add_child(body)
	_show("profile")


func _show(tab: Variant) -> void:
	for c in body.get_children():
		body.remove_child(c)
		c.queue_free()
	match String(tab):
		"profile": _profile()
		"achievements": _achievements()
		"leaderboard": _leaderboard()


func _profile() -> void:
	var st: Dictionary = SaveData.stats
	var xp := int(SaveData.data["xp"])
	var info := SaveData.rank_info(xp)
	var pc := UI.card(body, 8, "hema")
	pc.add_child(UI.label(SaveData.player_name(), 30, "fg", "display"))
	pc.add_child(UI.label(String(info["name"]), 18, "hema", "bold"))
	pc.add_child(UI.progress_bar(float(info["progress"]), "eosin", 10))
	pc.add_child(UI.label(("%d XP · max rank" % xp) if int(info["next"]) < 0 else ("%d XP · next rank at %d" % [xp, int(info["next"])]), 14, "muted", "mono"))
	var ranks: Array = []
	for r in SaveData.RANKS:
		ranks.append(String(r["name"]))
	pc.add_child(UI.label(" › ".join(PackedStringArray(ranks)), 12, "muted", "mono"))

	var grid := UI.flow(12)
	body.add_child(grid)
	var correct := int(st["correct"])
	UI.stat(grid, str(st["games"]), "Games")
	UI.stat(grid, str(correct), "Correct")
	UI.stat(grid, "%d%%" % int(SaveData.accuracy() * 100.0), "Accuracy")
	UI.stat(grid, str(st["best_streak"]), "Best streak")
	UI.stat(grid, ("%.1fs" % float(st["fastest"])) if float(st["fastest"]) > 0.0 else "—", "Fastest solve")
	UI.stat(grid, ("%.1fs" % (float(st["total_time"]) / correct)) if correct > 0 else "—", "Avg solve")
	UI.stat(grid, SaveData.favorite_category(), "Favourite")
	UI.stat(grid, "%d/%d" % [(SaveData.data["achievements"] as Dictionary).size(), GameData.achievements.size()], "Achievements")

	var cc := UI.card(body, 6)
	cc.add_child(UI.eyebrow("Solved by category"))
	var cat: Dictionary = st["category_correct"]
	for c in GameData.CATEGORIES:
		var row := UI.hbox(10)
		var l := UI.label(c, 15, "fg", "body", false)
		l.custom_minimum_size.x = 170
		row.add_child(l)
		var n := int(cat.get(c, 0))
		row.add_child(UI.progress_bar(minf(1.0, n / 25.0), "hema", 8))
		row.add_child(UI.label(str(n), 14, "muted", "mono", false))
		cc.add_child(row)


func _achievements() -> void:
	var unlocked: Dictionary = SaveData.data["achievements"]
	for a in GameData.achievements:
		var id := String(a.get("id", ""))
		var got := unlocked.has(id)
		var v := UI.card(body, 4, "eosin" if got else "")
		var row := UI.hbox(10)
		v.add_child(row)
		row.add_child(UI.label(String(a.get("name", "")), 19, "fg" if got else "muted", "display"))
		row.add_child(UI.label(("Unlocked " + String(unlocked[id])) if got else "Locked", 13, "good" if got else "muted", "mono", false))
		v.add_child(UI.label(String(a.get("description", "")), 14, "muted"))


func _leaderboard() -> void:
	var board: Array = SaveData.data["leaderboard"]
	var v := UI.card(body, 8)
	v.add_child(UI.eyebrow("Local leaderboard · top 20"))
	if board.is_empty():
		v.add_child(UI.label("No scores yet. Finish a round to set your first record.", 16, "muted"))
	for i in board.size():
		var e: Dictionary = board[i]
		var row := UI.hbox(12)
		row.add_child(UI.label("#%d" % (i + 1), 18, "eosin" if i < 3 else "muted", "display", false))
		row.add_child(UI.label(String(e.get("name", "")), 16, "fg", "bold"))
		row.add_child(UI.label("%s · %d%% · %s" % [e.get("mode", ""), int(float(e.get("accuracy", 0)) * 100.0), e.get("date", "")], 13, "muted", "mono", false))
		row.add_child(UI.label(str(int(e.get("score", 0))), 18, "fg", "mono", false))
		v.add_child(row)
	body.add_child(UI.label("Global online leaderboards will plug into this same list later.", 13, "muted"))
