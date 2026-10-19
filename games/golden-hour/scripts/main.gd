extends Control
## Root node: hosts the current screen.


func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_read_web_params()
	theme = Style.theme
	Router.setup(self)
	Router.go("home")


## When embedded in GRATEAPEX on the web, the page can pass ?theme=light|dark.
func _read_web_params() -> void:
	if not OS.has_feature("web"):
		return
	var raw: Variant = JavaScriptBridge.eval("new URLSearchParams(window.location.search).get('theme') || ''", true)
	var t := String(raw) if raw != null else ""
	if t in ["light", "dark"] and String(SaveData.settings.get("theme", "auto")) == "auto":
		SaveData.settings["theme"] = t
		Style.refresh()
