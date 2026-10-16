extends Control
## Root node. Hosts whichever screen the Router shows.


func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_read_web_params()
	theme = Style.theme
	Router.setup(self)
	Router.go("menu")


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		Net.leave()


## When embedded in GRATEAPEX on the web, the page passes ?name=...&theme=light|dark.
func _read_web_params() -> void:
	if not OS.has_feature("web"):
		return
	var js := "(function(){var p=new URLSearchParams(window.location.search);return JSON.stringify({name:p.get('name')||'',theme:p.get('theme')||''});})()"
	var raw: Variant = JavaScriptBridge.eval(js, true)
	var parsed: Variant = JSON.parse_string(String(raw)) if raw != null else null
	if not (parsed is Dictionary):
		return
	var n := String(parsed.get("name", "")).strip_edges()
	if n != "" and SaveData.player_name() == "Student":
		SaveData.set_player_name(n)
	var t := String(parsed.get("theme", ""))
	if t in ["light", "dark"] and String(SaveData.settings.get("theme", "auto")) == "auto":
		SaveData.settings["theme"] = t
		Style.refresh()
