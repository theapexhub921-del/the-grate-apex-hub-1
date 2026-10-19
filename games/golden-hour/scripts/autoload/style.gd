extends Node
## Visual identity: palette, fonts and the shared Theme. Emits `changed` when the theme switches.

signal changed

const LIGHT := {
	"bg": Color("#E8EEFB"), "surface": Color("#ffffff"), "surface2": Color("#DCE5F8"),
	"fg": Color("#0E1B45"), "muted": Color("#55649A"), "line": Color("#CAD6F2"),
	"hema": Color("#1144C3"), "hema_fg": Color("#ffffff"), "eosin": Color("#1144C3"),
	"gold": Color("#FEC107"), "gold_fg": Color("#12242F"), "ink": Color("#0E1B45"),
	"hero": Color("#1144C3"), "hero_fg": Color("#ffffff"), "hero_muted": Color("#D4E2FF"),
	"good": Color("#2B7A4B"), "warn": Color("#B7791F"), "bad": Color("#B3392F"),
}
const DARK := {
	"bg": Color("#0A1433"), "surface": Color("#101C45"), "surface2": Color("#18275A"),
	"fg": Color("#EAF0FF"), "muted": Color("#9DB0E0"), "line": Color("#263A7A"),
	"hema": Color("#7FA6FF"), "hema_fg": Color("#0A1433"), "eosin": Color("#7FA6FF"),
	"gold": Color("#FEC107"), "gold_fg": Color("#12242F"), "ink": Color("#EAF0FF"),
	"hero": Color("#1144C3"), "hero_fg": Color("#ffffff"), "hero_muted": Color("#D4E2FF"),
	"good": Color("#6CCB8E"), "warn": Color("#F0B54A"), "bad": Color("#F07A6E"),
}

var dark := false
var theme: Theme
var fonts: Dictionary = {}


func _ready() -> void:
	fonts["body"] = _font("ibm-plex-sans", 400, ["Figtree", "Segoe UI", "Roboto", "Helvetica", "Arial"])
	fonts["bold"] = _font("ibm-plex-sans", 600, ["Figtree", "Segoe UI", "Roboto", "Helvetica", "Arial"])
	fonts["display"] = _font("bricolage-grotesque", 800, ["Montserrat", "Segoe UI", "Roboto", "Helvetica", "Arial"])
	fonts["mono"] = _font("ibm-plex-mono", 600, ["IBM Plex Mono", "Cascadia Mono", "Consolas", "Menlo", "Courier New"])
	refresh()


## The game's own font files (res://fonts, Latin and Latin Extended), with the device's fonts
## behind them for any other character. A web browser cannot hand system fonts to the game, so
## without the files the web version would use the engine's small built-in font (blurry, no bold).
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
	return (DARK if dark else LIGHT).get(key, Color.MAGENTA)


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
	t.set_stylebox("normal", "Button", box(c("gold"), c("gold"), 14, 0, pad))
	t.set_stylebox("hover", "Button", box(c("gold").lightened(0.12), c("gold"), 14, 0, pad))
	t.set_stylebox("pressed", "Button", box(c("gold").darkened(0.1), c("gold"), 14, 0, pad))
	t.set_stylebox("disabled", "Button", box(c("surface2"), c("line"), 10, 1, pad))
	var focus := box(Color.TRANSPARENT, c("gold"), 16, 3, pad)
	focus.draw_center = false
	t.set_stylebox("focus", "Button", focus)
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color", "font_hover_pressed_color"]:
		t.set_color(k, "Button", c("gold_fg"))
	t.set_color("font_disabled_color", "Button", c("muted"))
	t.set_font("font", "Button", fonts["bold"])

	t.set_stylebox("normal", "LineEdit", box(c("surface"), c("line"), 8, 2, Vector4(14, 10, 14, 10)))
	t.set_stylebox("focus", "LineEdit", box(Color.TRANSPARENT, c("eosin"), 8, 2, Vector4(14, 10, 14, 10)))
	t.set_stylebox("read_only", "LineEdit", box(c("surface2"), c("line"), 8, 2, Vector4(14, 10, 14, 10)))
	t.set_color("font_color", "LineEdit", c("fg"))
	t.set_color("font_placeholder_color", "LineEdit", c("muted"))
	t.set_color("caret_color", "LineEdit", c("eosin"))
	t.set_color("selection_color", "LineEdit", Color(c("eosin"), 0.35))
	t.set_font("font", "LineEdit", fonts["mono"])

	t.set_stylebox("panel", "PanelContainer", box(c("surface"), c("line"), 18, 1, Vector4(16, 16, 16, 16)))
	t.set_stylebox("background", "ProgressBar", box(c("surface2"), c("line"), 999, 1, Vector4.ZERO))
	t.set_stylebox("fill", "ProgressBar", box(c("hema"), Color.TRANSPARENT, 999, 0, Vector4.ZERO))
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
	t.set_stylebox("grabber_area", "HSlider", box(c("hema"), Color.TRANSPARENT, 999, 0, Vector4(0, 4, 0, 4)))
	t.set_stylebox("grabber_area_highlight", "HSlider", box(c("eosin"), Color.TRANSPARENT, 999, 0, Vector4(0, 4, 0, 4)))
	return t
