extends Screen

var list: VBoxContainer
var status: Label
var start_btn: Button
var leaving := false


func build() -> void:
	var row := UI.hbox(10)
	content.add_child(row)
	var back := UI.button("‹ Leave room", "ghost", 38)
	back.pressed.connect(func():
		leaving = true
		Net.leave()
		Router.go("multi"))
	row.add_child(back)

	content.add_child(UI.eyebrow("Lobby"))
	var cc := UI.card(content, 6, "hema")
	cc.add_child(UI.label("ROOM CODE", 13, "muted", "mono"))
	var code := UI.label(" ".join(PackedStringArray(Array(Net.code.split("")))), 54, "hema", "mono", false)
	cc.add_child(code)
	cc.add_child(UI.label("Share this code. Friends choose Multiplayer › Join a room.", 15, "muted"))
	var settings: Dictionary = Net.room.get("settings", {})
	var diff := int(settings.get("difficulty", 0))
	cc.add_child(UI.label("%s · %s · %d questions" % [settings.get("category", "All"), "Mixed" if diff == 0 else GameData.difficulty_name(diff), (Net.room.get("questions", []) as Array).size()], 14, "eosin", "mono"))

	var pc := UI.card(content, 8)
	pc.add_child(UI.eyebrow("Connected players"))
	list = UI.vbox(6)
	pc.add_child(list)

	if Net.is_host:
		start_btn = UI.button("Start match", "primary", 58)
		start_btn.pressed.connect(func():
			start_btn.disabled = true
			Net.patch_room({"status": "playing", "index": 0}))
		content.add_child(start_btn)
	status = UI.label("Waiting for the host to start the match…" if not Net.is_host else "Start when everyone has joined.", 15, "muted")
	content.add_child(status)

	Net.room_updated.connect(_on_room)
	Net.connection_error.connect(func(msg: String): status.text = msg)
	_on_room(Net.room)


func _on_room(data: Dictionary) -> void:
	if leaving or not is_inside_tree():
		return
	for c in list.get_children():
		list.remove_child(c)
		c.queue_free()
	var players: Dictionary = data.get("players", {})
	for id in players.keys():
		var p: Dictionary = players[id]
		var row := UI.hbox(10)
		var me := String(id) == Net.my_id()
		row.add_child(UI.label(String(p.get("name", "?")) + (" (you)" if me else ""), 18, "hema" if me else "fg", "bold"))
		row.add_child(UI.label("HOST" if String(id) == String(data.get("host", "")) else "READY", 13, "good", "mono", false))
		list.add_child(row)
	if String(data.get("status", "")) == "playing":
		leaving = true
		Router.go("game", {"mode": "multi"})
