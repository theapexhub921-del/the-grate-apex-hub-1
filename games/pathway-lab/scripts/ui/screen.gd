class_name Screen
extends Control
## Base for every screen: lab-grid background and a scrolling centred column that adapts to the
## window width (touch scrolling on phones through TouchScroll).

const MAX_WIDTH := 760.0

var params: Dictionary = {}
var content: VBoxContainer
var scroll: ScrollContainer
var _margin: MarginContainer


func _ready() -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	theme = Style.theme
	add_child(LabBackground.new())
	scroll = ScrollContainer.new()
	scroll.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	add_child(scroll)
	add_child(TouchScroll.new(scroll))
	_margin = MarginContainer.new()
	_margin.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_margin.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.add_child(_margin)
	content = UI.vbox(18)
	_margin.add_child(content)
	resized.connect(_relayout)
	_relayout()
	build()


func max_width() -> float:
	return MAX_WIDTH


func _relayout() -> void:
	var side := int(maxf(16.0, (size.x - max_width()) / 2.0))
	_margin.add_theme_constant_override("margin_left", side)
	_margin.add_theme_constant_override("margin_right", side)
	_margin.add_theme_constant_override("margin_top", 20)
	_margin.add_theme_constant_override("margin_bottom", 48)


func column_width() -> float:
	return minf(max_width(), maxf(260.0, size.x - 32.0))


## Override in each screen.
func build() -> void:
	pass


func top_bar(back_text: String = "‹ Pathways", back_target: String = "home", back_params: Dictionary = {}) -> HBoxContainer:
	var row := UI.hbox(10)
	row.alignment = BoxContainer.ALIGNMENT_BEGIN
	content.add_child(row)
	var back := UI.button(back_text, "ghost", 38)
	back.pressed.connect(func(): Router.go(back_target, back_params))
	row.add_child(back)
	row.add_child(UI.spacer())
	return row
