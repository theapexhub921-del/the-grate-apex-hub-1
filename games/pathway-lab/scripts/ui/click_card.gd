class_name ClickCard
extends PanelContainer
## A card the whole of which can be tapped or clicked (and focused and pressed with Enter).
## Tinted with `tint` (a pathway colour). A swipe that scrolls the page is not a tap.

signal pressed

var tint := Color(0, 0, 0, 0)
var _down := false
var _hover := false


func _init(color: Color = Color(0, 0, 0, 0)) -> void:
	tint = color
	mouse_filter = Control.MOUSE_FILTER_STOP
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	focus_mode = Control.FOCUS_ALL
	size_flags_horizontal = Control.SIZE_EXPAND_FILL


func _ready() -> void:
	_restyle()
	mouse_entered.connect(func(): _hover = true; _restyle(); UI._scale(self, 1.015))
	mouse_exited.connect(func(): _hover = false; _down = false; _restyle(); UI._scale(self, 1.0))
	focus_entered.connect(_restyle)
	focus_exited.connect(_restyle)
	resized.connect(func(): pivot_offset = size / 2.0)


func _restyle() -> void:
	var acc := Style.accent_for(tint) if tint.a > 0 else Style.c("accent")
	var bg := Style.c("surface").lerp(acc, 0.09 if Style.dark else 0.05)
	var border := acc if (_hover or has_focus()) else Style.c("surface").lerp(acc, 0.35)
	add_theme_stylebox_override("panel", Style.box(bg, border, 16, 1, Vector4(18, 16, 18, 16)))


func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			_down = true
		elif _down:
			_down = false
			if get_global_rect().has_point(get_global_mouse_position()):
				Audio.play("click")
				pressed.emit()
		accept_event()
	elif event is InputEventKey and event.pressed and not event.echo and event.keycode in [KEY_ENTER, KEY_KP_ENTER, KEY_SPACE]:
		Audio.play("click")
		pressed.emit()
		accept_event()
