extends Node
## Real online multiplayer via the Firebase Realtime Database REST API (same database as the prototype).
## Room shape: rooms/CODE = {host, status: lobby|playing|ended, settings, questions: [ids], index,
##                           players: {id: {name, score, activity, done, streak}}}

signal room_updated(data: Dictionary)
signal connection_error(message: String)

const CODE_CHARS := "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

var base_url := ""
var code := ""
var is_host := false
var room: Dictionary = {}
var _poll: Timer
var _poll_busy := false


func _ready() -> void:
	base_url = String(GameData.net_config.get("database_url", "")).trim_suffix("/")
	_poll = Timer.new()
	_poll.wait_time = float(GameData.net_config.get("poll_seconds", 0.7))
	_poll.timeout.connect(_on_poll)
	add_child(_poll)


func my_id() -> String:
	return String(SaveData.profile["id"])


func _request(method: int, path: String, body: Variant = null) -> Dictionary:
	if base_url == "":
		return {"ok": false, "error": "No database configured"}
	var http := HTTPRequest.new()
	http.timeout = 10.0
	add_child(http)
	var payload := "" if body == null else JSON.stringify(body)
	var err := http.request("%s/%s.json" % [base_url, path], PackedStringArray(["Content-Type: application/json"]), method, payload)
	if err != OK:
		http.queue_free()
		return {"ok": false, "error": "Could not start a network request"}
	var res: Array = await http.request_completed
	http.queue_free()
	if int(res[0]) != HTTPRequest.RESULT_SUCCESS:
		return {"ok": false, "error": "No connection to the game server. Check your internet."}
	var status := int(res[1])
	if status == 401 or status == 403:
		return {"ok": false, "error": "The game server refused access (database rules)."}
	if status < 200 or status >= 300:
		return {"ok": false, "error": "Server error %d" % status}
	var text := (res[3] as PackedByteArray).get_string_from_utf8()
	return {"ok": true, "data": JSON.parse_string(text) if text != "" else null}


func create_room(player: String, settings: Dictionary, question_ids: Array) -> Dictionary:
	var new_code := ""
	for attempt in 5:
		new_code = ""
		for i in 5:
			new_code += CODE_CHARS[randi() % CODE_CHARS.length()]
		var check := await _request(HTTPClient.METHOD_GET, "rooms/" + new_code)
		if not check["ok"]:
			return check
		if check["data"] == null:
			break
	var players := {}
	players[my_id()] = {"name": player, "score": 0, "activity": "Created the room", "done": -1, "streak": 0}
	var body := {"host": my_id(), "status": "lobby", "settings": settings, "questions": question_ids,
		"index": 0, "created": int(Time.get_unix_time_from_system()), "players": players}
	var res := await _request(HTTPClient.METHOD_PUT, "rooms/" + new_code, body)
	if res["ok"]:
		code = new_code
		is_host = true
		room = body
		_poll.start()
	return res


func join_room(join_code: String, player: String) -> Dictionary:
	join_code = join_code.strip_edges().to_upper()
	var res := await _request(HTTPClient.METHOD_GET, "rooms/" + join_code)
	if not res["ok"]:
		return res
	if not (res["data"] is Dictionary):
		return {"ok": false, "error": "Room %s was not found." % join_code}
	var data: Dictionary = res["data"]
	if String(data.get("status", "")) != "lobby":
		return {"ok": false, "error": "That match has already started."}
	var me := {"name": player, "score": 0, "activity": "Joined", "done": -1, "streak": 0}
	var put := await _request(HTTPClient.METHOD_PUT, "rooms/%s/players/%s" % [join_code, my_id()], me)
	if put["ok"]:
		code = join_code
		is_host = String(data.get("host", "")) == my_id()
		room = data
		_poll.start()
	return put


func update_player(fields: Dictionary) -> void:
	if code != "":
		_request(HTTPClient.METHOD_PATCH, "rooms/%s/players/%s" % [code, my_id()], fields)


func patch_room(fields: Dictionary) -> void:
	if code != "":
		_request(HTTPClient.METHOD_PATCH, "rooms/" + code, fields)


func leave() -> void:
	_poll.stop()
	if code != "":
		if is_host and String(room.get("status", "")) == "lobby":
			_request(HTTPClient.METHOD_DELETE, "rooms/" + code)
		elif String(room.get("status", "")) != "ended":
			_request(HTTPClient.METHOD_DELETE, "rooms/%s/players/%s" % [code, my_id()])
	code = ""
	is_host = false
	room = {}


func stop_polling() -> void:
	_poll.stop()


func _on_poll() -> void:
	if _poll_busy or code == "":
		return
	_poll_busy = true
	var res := await _request(HTTPClient.METHOD_GET, "rooms/" + code)
	_poll_busy = false
	if code == "":
		return
	if not res["ok"]:
		connection_error.emit(String(res["error"]))
		return
	if res["data"] is Dictionary:
		room = res["data"]
		room_updated.emit(room)
	else:
		connection_error.emit("The room was closed by the host.")
