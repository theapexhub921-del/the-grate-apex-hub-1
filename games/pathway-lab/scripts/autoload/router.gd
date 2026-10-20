extends Node
## Screen navigation with a short fade transition.

const SCREENS := {
	"home": "res://scripts/screens/home_screen.gd",
	"pathway": "res://scripts/screens/pathway_screen.gd",
	"learn": "res://scripts/screens/learn_screen.gd",
	"play": "res://scripts/screens/play_screen.gd",
	"results": "res://scripts/screens/results_screen.gd",
	"progress": "res://scripts/screens/progress_screen.gd",
	"settings": "res://scripts/screens/settings_screen.gd",
}

var host: Control
var current: Control
var current_name := ""
var current_params: Dictionary = {}
var _fade: ColorRect
var _busy := false


func setup(root: Control) -> void:
	host = root
	_fade = ColorRect.new()
	_fade.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_fade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_fade.color = Color(Style.c("bg"), 0.0)
	host.add_child(_fade)
	Style.changed.connect(_on_style_changed)


func go(screen: String, params: Dictionary = {}) -> void:
	if _busy or not SCREENS.has(screen):
		return
	_busy = true
	if current:
		await _fade_to(1.0)
		current.queue_free()
	var s: Control = load(SCREENS[screen]).new()
	s.set("params", params)
	current = s
	current_name = screen
	current_params = params
	host.add_child(s)
	host.move_child(_fade, -1)
	await _fade_to(0.0)
	_busy = false


func _fade_to(alpha: float) -> void:
	_fade.color = Color(Style.c("bg"), _fade.color.a)
	if Style.reduced_motion():
		_fade.color.a = alpha
		return
	var tw := _fade.create_tween()
	tw.tween_property(_fade, "color:a", alpha, 0.14)
	await tw.finished


## A theme change rebuilds the screen so every colour updates (not mid-round).
func _on_style_changed() -> void:
	host.theme = Style.theme
	if current and current_name != "play":
		var n := current_name
		var p := current_params
		current.queue_free()
		current = null
		_busy = false
		go(n, p)
