class_name Screen
extends Control
## Base for every screen: themed background, scrolling centred column that adapts to window width.

const MAX_WIDTH := 720.0
## How far (pixels) a finger moves up or down before it scrolls instead of tapping.
const TOUCH_SCROLL_START := 12.0

var params: Dictionary = {}
var content: VBoxContainer
var scroll: ScrollContainer
var _margin: MarginContainer
var _touch_start := Vector2.ZERO
var _scroll_start := 0
var _touching := false
var _touch_scrolling := false


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


## Touch scrolling: on a phone, a swipe up or down scrolls the screen even when
## it starts on a button or card (the scroll box alone only moves when the
## finger lands on empty space). A button under the finger is let go without
## being pressed. Sideways drags (sliders) are left alone.
func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch and event.index == 0:
		if event.pressed:
			_touching = true
			_touch_scrolling = false
			_touch_start = (make_input_local(event) as InputEventScreenTouch).position
			_scroll_start = scroll.scroll_vertical
		else:
			_touching = false
			if _touch_scrolling:
				get_viewport().set_input_as_handled()
	elif event is InputEventScreenDrag and event.index == 0 and _touching:
		# In this screen's own units, so the page follows the finger exactly.
		var moved: Vector2 = (make_input_local(event) as InputEventScreenDrag).position - _touch_start
		if not _touch_scrolling and absf(moved.y) > TOUCH_SCROLL_START and absf(moved.y) > absf(moved.x):
			_touch_scrolling = true
			_cancel_presses(content)
		if _touch_scrolling:
			scroll.scroll_vertical = _scroll_start - int(moved.y)
			get_viewport().set_input_as_handled()
	elif _touch_scrolling and event.device == InputEvent.DEVICE_ID_EMULATION and (event is InputEventMouseMotion or event is InputEventMouseButton):
		# The mouse events a browser makes from the same finger: the swipe is a scroll, not a click.
		get_viewport().set_input_as_handled()
		if event is InputEventMouseButton and not event.pressed:
			_touch_scrolling = false


## Lets go of any button the finger went down on, so the swipe does not press it.
func _cancel_presses(node: Node) -> void:
	for child in node.get_children():
		if child is BaseButton and not child.disabled and child.get_draw_mode() in [BaseButton.DRAW_PRESSED, BaseButton.DRAW_HOVER_PRESSED]:
			var button: BaseButton = child
			button.disabled = true
			button.set_deferred("disabled", false)
		_cancel_presses(child)


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
