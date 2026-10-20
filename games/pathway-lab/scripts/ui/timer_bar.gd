class_name TimerBar
extends Control
## The thin countdown bar under the HUD. Turns red and pulses in the last 30 seconds.

var fraction := 1.0
var low := false
var _t := 0.0


func _init() -> void:
	custom_minimum_size = Vector2(0, 6)
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mouse_filter = Control.MOUSE_FILTER_IGNORE


func _process(delta: float) -> void:
	_t += delta
	queue_redraw()


func _draw() -> void:
	var r := size.y * 0.5
	var bg := StyleBoxFlat.new()
	bg.bg_color = Style.c("surface2")
	bg.set_corner_radius_all(int(r))
	draw_style_box(bg, Rect2(Vector2.ZERO, size))
	var w := size.x * clampf(fraction, 0.0, 1.0)
	if w < 1.0:
		return
	var fill := StyleBoxFlat.new()
	var col := Style.c("bad") if low else Style.c("accent")
	if low and not Style.reduced_motion():
		col.a = 0.65 + 0.35 * absf(sin(_t * PI))
	fill.bg_color = col
	fill.set_corner_radius_all(int(r))
	draw_style_box(fill, Rect2(Vector2.ZERO, Vector2(w, size.y)))
