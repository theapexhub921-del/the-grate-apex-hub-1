class_name SisterPortrait
extends Control
## Sister Rebecca as a small animated vector portrait: nurse's cap, hair in a bun, uniform collar.
## She blinks, and talks for a moment when she first appears (her mouth moves).

var talk_time := 1.6
var _t := 0.0
var _blink := 0.0
var _next_blink := 1.5


func _init(size_px: int = 42) -> void:
	custom_minimum_size = Vector2(size_px, size_px)
	size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	_next_blink = 0.8 + randf() * 2.5


func _process(delta: float) -> void:
	_t += delta
	talk_time = maxf(0.0, talk_time - delta)
	_next_blink -= delta
	if _next_blink <= 0.0:
		_blink = 0.13
		_next_blink = 2.2 + randf() * 3.0
	_blink = maxf(0.0, _blink - delta)
	queue_redraw()


func _ellipse(c: Vector2, r: Vector2, col: Color, n: int = 28) -> void:
	var pts := PackedVector2Array()
	for i in n:
		var a := TAU * i / n
		pts.append(c + Vector2(cos(a) * r.x, sin(a) * r.y))
	draw_colored_polygon(pts, col)


func _draw() -> void:
	var s := minf(size.x, size.y)
	var k := s / 100.0  # draw on a 100 x 100 grid
	var o := (size - Vector2(s, s)) * 0.5
	var P := func(x: float, y: float) -> Vector2: return o + Vector2(x, y) * k
	var line := Color("#10202a")
	var skin := Color("#7a4a2e")
	var hair := Color("#1b1414")
	var calm := Style.reduced_motion()
	var bob := 0.0 if calm else sin(_t * 1.6) * 0.8
	# background circle
	draw_circle(P.call(50, 50), 50 * k, Style.c("hero"))
	draw_set_transform(Vector2(0, bob * k))
	# uniform: shoulders and white collar
	var body := PackedVector2Array([P.call(14, 100), P.call(20, 82), P.call(36, 74), P.call(64, 74), P.call(80, 82), P.call(86, 100)])
	var disc := PackedVector2Array()
	for i in 40:
		disc.append(P.call(50, 50) + Vector2(cos(TAU * i / 40.0), sin(TAU * i / 40.0)) * 50 * k - Vector2(0, bob * k))
	for part in Geometry2D.intersect_polygons(body, disc):
		draw_colored_polygon(part, Style.c("hema"))
	draw_colored_polygon(PackedVector2Array([P.call(38, 74), P.call(50, 86), P.call(62, 74), P.call(56, 72), P.call(50, 79), P.call(44, 72)]), Color.WHITE)
	# neck
	draw_rect(Rect2(P.call(44, 62), Vector2(12, 12) * k), skin.darkened(0.12))
	# bun and hair behind the head
	_ellipse(P.call(50, 22), Vector2(12, 9) * k, hair)
	_ellipse(P.call(50, 44), Vector2(25, 26) * k, hair)
	# face
	_ellipse(P.call(50, 48), Vector2(20, 23) * k, skin)
	_ellipse(P.call(30, 50), Vector2(4, 6) * k, skin)
	_ellipse(P.call(70, 50), Vector2(4, 6) * k, skin)
	# hairline fringe
	draw_colored_polygon(PackedVector2Array([P.call(29, 44), P.call(33, 30), P.call(50, 24), P.call(67, 30), P.call(71, 44), P.call(62, 34), P.call(50, 32), P.call(38, 34)]), hair)
	# nurse's cap with a red cross
	draw_colored_polygon(PackedVector2Array([P.call(33, 30), P.call(36, 18), P.call(64, 18), P.call(67, 30), P.call(50, 27)]), Color.WHITE)
	draw_rect(Rect2(P.call(48, 19.5), Vector2(4, 8) * k), Color("#d23a3a"))
	draw_rect(Rect2(P.call(46, 21.5), Vector2(8, 4) * k), Color("#d23a3a"))
	# eyebrows
	draw_line(P.call(36, 40), P.call(45, 39), hair, 2.2 * k)
	draw_line(P.call(55, 39), P.call(64, 40), hair, 2.2 * k)
	# eyes (blink)
	var eye_h := 0.6 if _blink > 0.0 else 4.2
	for x in [41.0, 59.0]:
		_ellipse(P.call(x, 47), Vector2(3.6, eye_h) * k, Color.WHITE)
		if _blink <= 0.0:
			draw_circle(P.call(x, 47.5), 2.3 * k, line)
			draw_circle(P.call(x + 0.8, 46.5), 0.8 * k, Color.WHITE)
	# nose
	draw_line(P.call(50, 50), P.call(48, 57), skin.darkened(0.3), 1.4 * k)
	# mouth: a smile, or moving while she talks
	if talk_time > 0.0 and not calm:
		var open := 1.5 + absf(sin(_t * 15.0)) * 4.0
		_ellipse(P.call(50, 63), Vector2(5, open) * k, Color("#5a2420"))
	else:
		var pts := PackedVector2Array()
		for i in 9:
			var a := lerpf(0.15, PI - 0.15, i / 8.0)
			pts.append(P.call(50 + cos(a) * 7.0, 59 + sin(a) * 4.0))
		draw_polyline(pts, Color("#5a2420"), 2.2 * k, true)
	# cheeks
	_ellipse(P.call(36, 56), Vector2(3.5, 2) * k, Color(0.85, 0.35, 0.35, 0.25))
	_ellipse(P.call(64, 56), Vector2(3.5, 2) * k, Color(0.85, 0.35, 0.35, 0.25))
	draw_set_transform(Vector2.ZERO)
