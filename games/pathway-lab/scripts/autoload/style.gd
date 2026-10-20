extends Node
## Visual identity: a dark lab bench (or a light one), fonts and the shared Theme.
## Every pathway has its own colour: set_accent() switches it, and c("accent") gives the
## version that reads well on the current background. Emits `changed` when the theme switches.

signal changed

const DARK := {
	"bg": Color("#0d1215"), "surface": Color("#151d22"), "surface2": Color("#1d2830"),
	"fg": Color("#e9eff1"), "muted": Color("#8fa2ab"), "line": Color("#2b3841"), "grid": Color(1, 1, 1, 0.028),
	"ink": Color("#0d1215"), "good": Color("#58d68d"), "bad": Color("#ff6b6b"), "warn": Color("#f5c542"),
}
const LIGHT := {
	"bg": Color("#f3f5f6"), "surface": Color("#ffffff"), "surface2": Color("#e8edef"),
	"fg": Color("#10181c"), "muted": Color("#52646d"), "line": Color("#d0d9dd"), "grid": Color(0, 0, 0, 0.035),
	"ink": Color("#0d1215"), "good": Color("#1d8a50"), "bad": Color("#c93636"), "warn": Color("#946500"),
}
const DEFAULT_ACCENT := Color("#ff9a3c")

var accent_base := DEFAULT_ACCENT
var dark := false
var theme: Theme
var fonts: Dictionary = {}


func _ready() -> void:
	fonts["body"] = _font("ibm-plex-sans", 400, ["IBM Plex Sans", "Segoe UI", "Roboto", "Helvetica", "Arial"])
	fonts["bold"] = _font("ibm-plex-sans", 600, ["IBM Plex Sans", "Segoe UI", "Roboto", "Helvetica", "Arial"])
	fonts["display"] = _font("bricolage-grotesque", 800, ["Bricolage Grotesque", "Segoe UI", "Roboto", "Helvetica", "Arial"])
	fonts["mono"] = _font("ibm-plex-mono", 600, ["IBM Plex Mono", "Cascadia Mono", "Consolas", "Menlo", "Courier New"])
	refresh()


## The game's own font files (res://fonts, Latin and Latin Extended), with the
## device's fonts behind them for any other character. A browser cannot hand
## system fonts to the game, so without the files the web version fell back to
## the engine's small built-in font for everything (blurry, no bold or mono).
func _font(file: String, weight: int, names: Array) -> Font:
	var system := SystemFont.new()
	system.font_names = PackedStringArray(names)
	system.font_weight = weight
	system.antialiasing = TextServer.FONT_ANTIALIASING_GRAY
	var main: FontFile = load("res://fonts/%s-latin-%d.ttf" % [file, weight])
	var extended: FontFile = load("res://fonts/%s-latin-ext-%d.ttf" % [file, weight])
	if main == null:
		return system
	var chain: Array[Font] = []
	if extended:
		chain.append(extended)
	chain.append(system)
	main.fallbacks = chain
	return main


func refresh() -> void:
	var mode := String(SaveData.settings.get("theme", "auto"))
	dark = mode == "dark" or (mode == "auto" and DisplayServer.is_dark_mode())
	theme = _build_theme()
	RenderingServer.set_default_clear_color(c("bg"))
	changed.emit()


func c(key: String) -> Color:
	match key:
		"accent":
			return accent_for(accent_base)
		"accent_fg":
			return c("ink") if dark else Color.WHITE
		"accent_soft":
			return Color(accent_for(accent_base), 0.13 if dark else 0.10)
	return (DARK if dark else LIGHT).get(key, Color.MAGENTA)


## The pathway colour, darkened on the light theme until text in it is easy to read.
func accent_for(base: Color) -> Color:
	if dark:
		return base
	var col := base
	var guard := 0
	while col.get_luminance() > 0.36 and guard < 12:
		col = col.darkened(0.08)
		guard += 1
	return col


## Switch the colour used for accents (each pathway has its own). Rebuilds the theme.
func set_accent(base: Color) -> void:
	if base == accent_base and theme != null:
		return
	accent_base = base
	theme = _build_theme()


func font(key: String) -> Font:
	return fonts.get(key, fonts["body"])


func reduced_motion() -> bool:
	return bool(SaveData.settings.get("reduced_motion", false))


func box(bg: Color, border: Color = Color.TRANSPARENT, radius: int = 10, border_w: int = 0, pad: Vector4 = Vector4(16, 12, 16, 12)) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = bg
	s.border_color = border
	s.set_border_width_all(border_w)
	s.set_corner_radius_all(radius)
	s.content_margin_left = pad.x
	s.content_margin_top = pad.y
	s.content_margin_right = pad.z
	s.content_margin_bottom = pad.w
	s.anti_aliasing = true
	return s


func _build_theme() -> Theme:
	var t := Theme.new()
	t.default_font = fonts["body"]
	t.default_font_size = 17
	t.set_color("font_color", "Label", c("fg"))

	var pad := Vector4(20, 12, 20, 12)
	t.set_stylebox("normal", "Button", box(c("accent"), c("accent"), 10, 0, pad))
	t.set_stylebox("hover", "Button", box(c("accent").lightened(0.1), c("accent"), 10, 0, pad))
	t.set_stylebox("pressed", "Button", box(c("accent").darkened(0.12), c("accent"), 10, 0, pad))
	t.set_stylebox("disabled", "Button", box(c("surface2"), c("line"), 10, 1, pad))
	var focus := box(Color.TRANSPARENT, c("accent"), 12, 3, pad)
	focus.draw_center = false
	t.set_stylebox("focus", "Button", focus)
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color", "font_hover_pressed_color"]:
		t.set_color(k, "Button", c("accent_fg"))
	t.set_color("font_disabled_color", "Button", c("muted"))
	t.set_font("font", "Button", fonts["bold"])

	t.set_stylebox("normal", "LineEdit", box(c("surface"), c("line"), 8, 2, Vector4(14, 10, 14, 10)))
	t.set_stylebox("focus", "LineEdit", box(Color.TRANSPARENT, c("accent"), 8, 2, Vector4(14, 10, 14, 10)))
	t.set_stylebox("read_only", "LineEdit", box(c("surface2"), c("line"), 8, 2, Vector4(14, 10, 14, 10)))
	t.set_color("font_color", "LineEdit", c("fg"))
	t.set_color("font_placeholder_color", "LineEdit", c("muted"))
	t.set_color("caret_color", "LineEdit", c("accent"))
	t.set_color("selection_color", "LineEdit", Color(c("accent"), 0.35))
	t.set_font("font", "LineEdit", fonts["mono"])

	t.set_stylebox("panel", "PanelContainer", box(c("surface"), c("line"), 12, 1, Vector4(18, 16, 18, 16)))
	t.set_stylebox("background", "ProgressBar", box(c("surface2"), c("line"), 999, 1, Vector4.ZERO))
	t.set_stylebox("fill", "ProgressBar", box(c("accent"), Color.TRANSPARENT, 999, 0, Vector4.ZERO))
	t.set_stylebox("panel", "ScrollContainer", StyleBoxEmpty.new())

	for cls in ["CheckButton", "CheckBox"]:
		t.set_color("font_color", cls, c("fg"))
		t.set_color("font_hover_color", cls, c("fg"))
		t.set_color("font_pressed_color", cls, c("fg"))
		t.set_color("font_focus_color", cls, c("fg"))
		t.set_color("font_hover_pressed_color", cls, c("fg"))
		t.set_stylebox("normal", cls, StyleBoxEmpty.new())
		t.set_stylebox("hover", cls, StyleBoxEmpty.new())
		t.set_stylebox("pressed", cls, StyleBoxEmpty.new())
		t.set_stylebox("hover_pressed", cls, StyleBoxEmpty.new())

	t.set_stylebox("panel", "PopupPanel", box(c("surface"), c("line"), 12, 1, Vector4(18, 16, 18, 16)))
	t.set_stylebox("panel", "AcceptDialog", box(c("surface"), c("line"), 0, 0, Vector4(18, 16, 18, 16)))
	t.set_color("font_color", "AcceptDialog", c("fg"))
	t.set_stylebox("slider", "HSlider", box(c("surface2"), c("line"), 999, 1, Vector4(0, 4, 0, 4)))
	t.set_stylebox("grabber_area", "HSlider", box(c("accent"), Color.TRANSPARENT, 999, 0, Vector4(0, 4, 0, 4)))
	t.set_stylebox("grabber_area_highlight", "HSlider", box(c("accent"), Color.TRANSPARENT, 999, 0, Vector4(0, 4, 0, 4)))
	return t
