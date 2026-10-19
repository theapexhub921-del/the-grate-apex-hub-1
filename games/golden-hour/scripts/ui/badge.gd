class_name Badge
extends Control
## The round gold "Practice Verified" seal.

var text := ""


func _ready() -> void:
	custom_minimum_size = Vector2(150, 150)
	size_flags_horizontal = Control.SIZE_SHRINK_CENTER


func _draw() -> void:
	var c := size / 2.0
	var r := minf(size.x, size.y) / 2.0 - 4.0
	draw_circle(c, r, Style.c("gold"))
	draw_circle(c, r - 5.0, Style.c("surface"))
	draw_circle(c, r - 12.0, Style.c("gold"))
	draw_circle(c, r - 17.0, Style.c("surface"))
	var f := Style.font("display")
	var lines := text.split("\n")
	var fs := 15
	var lh := 18.0
	var y0 := c.y - lh * (lines.size() - 1) / 2.0 + 5.0
	for i in lines.size():
		var w := f.get_string_size(lines[i], HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x
		draw_string(f, Vector2(c.x - w / 2.0, y0 + i * lh), lines[i], HORIZONTAL_ALIGNMENT_LEFT, -1, fs, Style.c("fg"))
