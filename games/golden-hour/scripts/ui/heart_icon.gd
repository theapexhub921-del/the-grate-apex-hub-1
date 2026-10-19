class_name HeartIcon
extends Control
## The heart that flashes with each beat during the pulse-counting game.

var on := false:
	set(v):
		if v != on:
			on = v
			queue_redraw()


func _ready() -> void:
	custom_minimum_size = Vector2(0, 64)
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mouse_filter = Control.MOUSE_FILTER_IGNORE


func _draw() -> void:
	var c := Vector2(size.x / 2.0, size.y / 2.0 + 2.0)
	var s := 26.0 * (1.35 if on else 1.0)
	var pts := PackedVector2Array()
	for i in 64:
		var t := TAU * i / 64.0
		# classic heart curve
		var x := 16.0 * pow(sin(t), 3)
		var y := -(13.0 * cos(t) - 5.0 * cos(2.0 * t) - 2.0 * cos(3.0 * t) - cos(4.0 * t))
		pts.append(c + Vector2(x, y) * s / 17.0)
	draw_colored_polygon(pts, Color("#e0384f") if on else Color("#9aa5ad"))
