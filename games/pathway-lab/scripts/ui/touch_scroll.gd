class_name TouchScroll
extends Node
## Touch scrolling for one ScrollContainer: on a phone, a swipe up or down scrolls it even when
## it starts on a button or card (the scroll box alone only moves when the finger lands on empty
## space). A button under the finger is let go without being pressed. Sideways drags are left alone.
## `blocked` (optional) gets the touch position in viewport coordinates and returns true when this
## touch must not scroll (for example when it starts on a piece being dragged).

## How far (pixels) a finger moves up or down before it scrolls instead of tapping.
const START := 12.0

var scroll: ScrollContainer
var blocked: Callable
var _start := Vector2.ZERO
var _scroll_start := 0
var _touching := false
var scrolling := false


func _init(target: ScrollContainer, is_blocked: Callable = Callable()) -> void:
	scroll = target
	blocked = is_blocked


func _input(event: InputEvent) -> void:
	if scroll == null or not scroll.is_visible_in_tree():
		return
	if event is InputEventScreenTouch and event.index == 0:
		if event.pressed:
			var inside := scroll.get_global_rect().has_point(event.position)
			_touching = inside and not (blocked.is_valid() and bool(blocked.call(event.position)))
			scrolling = false
			_start = event.position
			_scroll_start = scroll.scroll_vertical
		else:
			_touching = false
			if scrolling:
				get_viewport().set_input_as_handled()
	elif event is InputEventScreenDrag and event.index == 0 and _touching:
		var moved: Vector2 = event.position - _start
		var k := scroll.get_global_transform_with_canvas().get_scale().y
		if not scrolling and absf(moved.y) > START and absf(moved.y) > absf(moved.x):
			scrolling = true
			_cancel_presses(scroll)
		if scrolling:
			scroll.scroll_vertical = _scroll_start - int(moved.y / maxf(k, 0.01))
			get_viewport().set_input_as_handled()
	elif scrolling and event.device == InputEvent.DEVICE_ID_EMULATION and (event is InputEventMouseMotion or event is InputEventMouseButton):
		# The mouse events a browser makes from the same finger: the swipe is a scroll, not a click.
		get_viewport().set_input_as_handled()
		if event is InputEventMouseButton and not event.pressed:
			scrolling = false


func _cancel_presses(node: Node) -> void:
	for child in node.get_children():
		if child is BaseButton and not child.disabled and child.get_draw_mode() in [BaseButton.DRAW_PRESSED, BaseButton.DRAW_HOVER_PRESSED]:
			var button: BaseButton = child
			button.disabled = true
			button.set_deferred("disabled", false)
		_cancel_presses(child)
