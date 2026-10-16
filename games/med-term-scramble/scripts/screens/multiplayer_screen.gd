extends Screen

var cfg := {"category": "All", "difficulty": 0, "count": 10}
var name_edit: LineEdit
var code_edit: LineEdit
var status: Label
var buttons: Array = []


func build() -> void:
	top_bar()
	content.add_child(UI.eyebrow("Online multiplayer"))
	content.add_child(UI.title("Multiplayer"))
	content.add_child(UI.label("Everyone gets the same scrambles at the same time. Fastest accurate solver wins.", 16, "muted"))

	var nc := UI.card(content, 10)
	nc.add_child(UI.label("YOUR NAME", 13, "muted", "mono"))
	name_edit = UI.line_edit(SaveData.player_name(), "Display name")
	name_edit.max_length = 20
	nc.add_child(name_edit)

	var hc := UI.card(content, 12)
	hc.add_child(UI.label("Host a room", 22, "fg", "display"))
	var cats: Array = [["All", "All"]]
	for c in GameData.CATEGORIES:
		cats.append([c, c])
	hc.add_child(UI.chips(cats, "All", func(v): cfg["category"] = v))
	hc.add_child(UI.chips([["Mixed", 0], ["Easy", 1], ["Medium", 2], ["Hard", 3], ["Expert", 4]], 0, func(v): cfg["difficulty"] = v))
	hc.add_child(UI.chips([["5 Qs", 5], ["10 Qs", 10], ["15 Qs", 15]], 10, func(v): cfg["count"] = v))
	var create := UI.button("Create room", "primary", 52)
	create.pressed.connect(_create)
	hc.add_child(create)
	buttons.append(create)

	var jc := UI.card(content, 12)
	jc.add_child(UI.label("Join a room", 22, "fg", "display"))
	var row := UI.hbox(10)
	jc.add_child(row)
	code_edit = UI.line_edit("", "ROOM CODE")
	code_edit.max_length = 6
	code_edit.text_submitted.connect(func(_t): _join())
	row.add_child(code_edit)
	var join := UI.button("Join", "accent", 46)
	join.custom_minimum_size.x = 110
	join.pressed.connect(_join)
	row.add_child(join)
	buttons.append(join)

	status = UI.label("", 16, "warn", "bold")
	content.add_child(status)


func _busy(on: bool, text: String = "") -> void:
	for b in buttons:
		(b as Button).disabled = on
	status.text = text
	status.add_theme_color_override("font_color", Style.c("muted") if on else Style.c("bad"))


func _player() -> String:
	var n := name_edit.text.strip_edges()
	if n == "":
		n = "Student"
	SaveData.set_player_name(n)
	return n


func _create() -> void:
	_busy(true, "Creating room…")
	var rng := RandomNumberGenerator.new()
	rng.randomize()
	var ids: Array = []
	for t in GameData.pick(String(cfg["category"]), int(cfg["difficulty"]), int(cfg["count"]), false, rng):
		ids.append(String(t["id"]))
	var res := await Net.create_room(_player(), cfg.duplicate(), ids)
	if not is_inside_tree():
		return
	if res["ok"]:
		Router.go("lobby")
	else:
		_busy(false, String(res["error"]))


func _join() -> void:
	var code := code_edit.text.strip_edges().to_upper()
	if code.length() < 4:
		_busy(false, "Enter the room code your host shared.")
		return
	_busy(true, "Joining %s…" % code)
	var res := await Net.join_room(code, _player())
	if not is_inside_tree():
		return
	if res["ok"]:
		Router.go("lobby")
	else:
		_busy(false, String(res["error"]))
