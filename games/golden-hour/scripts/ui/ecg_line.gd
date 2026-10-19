class_name EcgLine
extends Control
## The heart-monitor trace in the header. A bright sweep runs along a faint line.

const PTS := [Vector2(0, 20), Vector2(90, 20), Vector2(98, 17), Vector2(106, 20), Vector2(120, 20), Vector2(126, 28),
	Vector2(134, 2), Vector2(142, 32), Vector2(148, 20), Vector2(178, 20), Vector2(188, 15), Vector2(198, 20),
	Vector2(258, 20), Vector2(266, 17), Vector2(274, 20), Vector2(288, 20), Vector2(294, 28), Vector2(302, 2),
	Vector2(310, 32), Vector2(316, 20), Vector2(400, 20)]

var color := Color("#FEC107")
var _t := 0.0


func _ready() -> void:
	custom_minimum_size.y = 36
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mouse_filter = Control.MOUSE_FILTER_IGNORE


func _process(delta: float) -> void:
	if Style.reduced_motion():
		return
	_t = fmod(_t + delta * 0.45, 1.25)
	queue_redraw()


func _draw() -> void:
	var sx := size.x / 400.0
	var sy := size.y / 34.0
	var pts := PackedVector2Array()
	for p in PTS:
		pts.append(Vector2(p.x * sx, p.y * sy))
	if Style.reduced_motion():
		draw_polyline(pts, color, 2.0, true)
		return
	draw_polyline(pts, Color(color, 0.28), 2.0, true)
	var head := _t * size.x
	var tail := head - size.x * 0.35
	var seg := PackedVector2Array()
	for i in pts.size() - 1:
		var a: Vector2 = pts[i]
		var b: Vector2 = pts[i + 1]
		if b.x < tail or a.x > head:
			continue
		var a2 := a.lerp(b, clampf((tail - a.x) / maxf(b.x - a.x, 0.001), 0.0, 1.0)) if a.x < tail else a
		var b2 := a.lerp(b, clampf((head - a.x) / maxf(b.x - a.x, 0.001), 0.0, 1.0)) if b.x > head else b
		if seg.is_empty():
			seg.append(a2)
		seg.append(b2)
	if seg.size() >= 2:
		draw_polyline(seg, color, 2.5, true)
		draw_circle(seg[seg.size() - 1], 3.5, color)
