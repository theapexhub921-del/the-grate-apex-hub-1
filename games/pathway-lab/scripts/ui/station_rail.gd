class_name StationRail
extends Control
## The left edge of one board row: the line from the previous station, this station's marker
## and the line on to the next. Lines are lit when both stations they join are in place, and
## glow green as the finished pathway "flows" (see `flow`).

var kind := "m"
var first := false
var last := false
var known := true          ## false while this station is an open gap (dashed marker)
var link_up := false       ## the line above is lit (both ends known)
var link_down := false
var flow := -1.0           ## 0..1 while the win animation passes this row; 1 after it has passed
var hot := false           ## a piece is being held over this gap


func _init() -> void:
	custom_minimum_size = Vector2(34, 44)
	size_flags_vertical = Control.SIZE_FILL
	mouse_filter = Control.MOUSE_FILTER_IGNORE


func _draw() -> void:
	var acc := Style.c("accent")
	var x := size.x * 0.5
	var cy := 22.0
	var w := 3.0
	var dim := Style.c("line")
	var green := Style.c("good")
	var up_col := (acc if link_up else dim)
	var down_col := (acc if link_down else dim)
	if flow >= 0.0:
		up_col = green if flow > 0.0 else up_col
		down_col = green if flow >= 1.0 else down_col
	if not first:
		draw_line(Vector2(x, 0), Vector2(x, cy), up_col, w, true)
	if not last:
		draw_line(Vector2(x, cy), Vector2(x, size.y), down_col, w, true)
		if flow > 0.0 and flow < 1.0:
			draw_line(Vector2(x, cy), Vector2(x, lerpf(cy, size.y, flow)), green, w + 1.0, true)
	var r := Rect2(Vector2(x - 10, cy - 10), Vector2(20, 20))
	if hot:
		draw_circle(Vector2(x, cy), 15.0, Color(acc, 0.25))
	if known:
		UI.draw_marker(self, kind, r, green if flow > 0.0 else acc)
	else:
		UI.draw_marker(self, kind, r, acc, true)
