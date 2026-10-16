extends Node
## Visual identity: palette, fonts and the shared Theme. Emits `changed` when the theme switches.

signal changed

const LIGHT := {
	"bg": Color("#f3f1f7"), "surface": Color("#ffffff"), "surface2": Color("#ebe7f3"),
	"fg": Color("#1f1b2e"), "muted": Color("#655f7d"), "line": Color("#d8d2e6"),
	"hema": Color("#4b2e83"), "hema_fg": Color("#ffffff"), "eosin": Color("#c93a73"),
	"good": Color("#1b7f55"), "warn": Color("#a8670a"), "bad": Color("#c2304f"),
}
const DARK := {
	"bg": Color("#14101e"), "surface": Color("#1e1930"), "surface2": Color("#2a2342"),
	"fg": Color("#ece8f5"), "muted": Color("#a59ebd"), "line": Color("#3a3156"),
	"hema": Color("#a88ff2"), "hema_fg": Color("#170f2a"), "eosin": Color("#f06b9a"),
	"good": Color("#4fd09a"), "warn": Color("#f0b54a"), "bad": Color("#ff7d97"),
}

var dark := false
var theme: Theme
var fonts: Dictionary = {}


func _ready() -> void:
	fonts["body"] = _font(["IBM Plex Sans", "Segoe UI", "Roboto", "Helvetica", "Arial"], 400)
	fonts["bold"] = _font(["IBM Plex Sans", "Segoe UI", "Roboto", "Helvetica", "Arial"], 600)
	fonts["display"] = _font(["Bricolage Grotesque", "Segoe UI", "Roboto", "Helvetica", "Arial"], 800)
	fonts["mono"] = _font(["IBM Plex Mono", "Cascadia Mono", "Consolas", "Menlo", "Courier New"], 600)
	refresh()


func _font(names: Array, weight: int) -> SystemFont:
	var f := SystemFont.new()
	f.font_names = PackedStringArray(names)
	f.font_weight = weight
	f.antialiasing = TextServer.FONT_ANTIALIASING_GRAY
	return f


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
	t.set_stylebox("normal", "Button", box(c("hema"), c("hema"), 10, 0, pad))
	t.set_stylebox("hover", "Button", box(c("hema").lightened(0.1), c("hema"), 10, 0, pad))
	t.set_stylebox("pressed", "Button", box(c("hema").darkened(0.12), c("hema"), 10, 0, pad))
	t.set_stylebox("disabled", "Button", box(c("surface2"), c("line"), 10, 1, pad))
	var focus := box(Color.TRANSPARENT, c("eosin"), 12, 3, pad)
	focus.draw_center = false
	t.set_stylebox("focus", "Button", focus)
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color", "font_hover_pressed_color"]:
		t.set_color(k, "Button", c("hema_fg"))
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

	t.set_stylebox("panel", "PanelContainer", box(c("surface"), c("line"), 12, 1, Vector4(18, 16, 18, 16)))
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
