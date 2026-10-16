class_name Screen
extends Control
## Base for every screen: themed background, scrolling centred column that adapts to window width.

const MAX_WIDTH := 720.0

var params: Dictionary = {}
var content: VBoxContainer
var scroll: ScrollContainer
var _margin: MarginContainer


func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	var bg := ColorRect.new()
	bg.color = Style.c("bg")
	bg.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bg)
	scroll = ScrollContainer.new()
	scroll.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	add_child(scroll)
	_margin = MarginContainer.new()
	_margin.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_margin.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.add_child(_margin)
	content = UI.vbox(18)
	_margin.add_child(content)
	resized.connect(_relayout)
	_relayout()
	build()


func _relayout() -> void:
	var side := int(maxf(16.0, (size.x - MAX_WIDTH) / 2.0))
	_margin.add_theme_constant_override("margin_left", side)
	_margin.add_theme_constant_override("margin_right", side)
	_margin.add_theme_constant_override("margin_top", 22)
	_margin.add_theme_constant_override("margin_bottom", 40)


func column_width() -> float:
	return minf(MAX_WIDTH, maxf(260.0, size.x - 32.0))


## Override in each screen.
func build() -> void:
	pass


func top_bar(back_text: String = "← Menu", back_target: String = "menu") -> HBoxContainer:
	var row := UI.hbox(10)
	content.add_child(row)
	var back := UI.button(back_text, "ghost", 38)
	back.pressed.connect(func(): Router.go(back_target))
	row.add_child(back)
	row.add_child(UI.spacer())
	return row
