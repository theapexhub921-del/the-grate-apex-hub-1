class_name MetroLine
extends Control
## A metro-map line of stations (rings and diamonds) with a light that travels along it,
## like the original Pathway Lab header. `kinds` sets the station shapes (default alternates).

var kinds: Array = ["m", "e", "m", "e", "m", "e", "m"]
var color := Color(0, 0, 0, 0)
var _t := 0.0


func _init(height: float = 28.0) -> void:
	custom_minimum_size = Vector2(200, height)
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mouse_filter = Control.MOUSE_FILTER_IGNORE


func _process(delta: float) -> void:
	if Style.reduced_motion():
		return
	_t += delta
	queue_redraw()


func _draw() -> void:
	var col := color if color.a > 0 else Style.c("accent")
	var h := size.y
	var r := h * 0.28
	var x0 := r + 2.0
	var x1 := size.x - r - 2.0
	var y := h * 0.5
	draw_line(Vector2(x0, y), Vector2(x1, y), Color(col, 0.55), maxf(2.0, h * 0.09), true)
	# the travelling light
	if not Style.reduced_motion():
		var f := fmod(_t * 0.22, 1.0)
		var px := lerpf(x0, x1, f)
		for k in 6:
			draw_circle(Vector2(px - k * 6.0, y), maxf(1.0, h * 0.11 - k * 0.6), Color(col, 0.5 - k * 0.08))
	var n := kinds.size()
	for i in n:
		var x := lerpf(x0, x1, float(i) / maxf(1.0, n - 1))
		UI.draw_marker(self, String(kinds[i]), Rect2(Vector2(x - r * 1.1, y - r * 1.1), Vector2(r * 2.2, r * 2.2)), col)
