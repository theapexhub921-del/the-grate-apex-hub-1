extends Screen
## Learn: one card per key point, with Sister Rebecca's hints.

var shift_i := 0
var idx := 0
var holder: VBoxContainer


func build() -> void:
	shift_i = int(params.get("shift", 0))
	UI.header(content, "Shift %d · Learn" % (shift_i + 1))
	holder = UI.vbox(14)
	content.add_child(holder)
	_show()


func _show() -> void:
	for c in holder.get_children():
		holder.remove_child(c)
		c.queue_free()
	var s: Dictionary = Data.shift(shift_i)
	var cards: Array = s["learn"]
	var x: Dictionary = cards[idx]
	UI.sister(holder, String(s["intro"]) if idx == 0 else "Next one. Take it step by step.")
	var v := UI.card(holder, 8)
	v.add_child(UI.label("%d of %d" % [idx + 1, cards.size()], 14, "muted", "bold", false))
	var title := String(x["title"])
	v.add_child(UI.label(title, 30 if title.length() > 16 else 38, "fg", "display"))
	var key := PanelContainer.new()
	key.size_flags_horizontal = Control.SIZE_FILL
	key.add_theme_stylebox_override("panel", Style.box(Color(Style.c("hema"), 0.14), Color.TRANSPARENT, 10, 0, Vector4(10, 4, 10, 4)))
	key.add_child(UI.label("%s %s" % [s["learn_label"], x["key"]], 15, "hema", "bold", true))
	v.add_child(key)
	v.add_child(UI.label(String(x["text"]), 17))
	var bar := UI.progress_bar(float(idx + 1) / cards.size(), "gold", 6)
	holder.add_child(bar)
	var last := idx >= cards.size() - 1
	var b := UI.button("Start the drill" if last else "Next", "primary", 52)
	b.pressed.connect(_next)
	holder.add_child(b)
	b.grab_focus.call_deferred()
	if idx > 0:
		var prev := UI.button("Back", "ghost", 44)
		prev.pressed.connect(func():
			idx -= 1
			_show())
		holder.add_child(prev)
	UI.fade_in(holder, 0.18)


func _next() -> void:
	var cards: Array = Data.shift(shift_i)["learn"]
	if idx < cards.size() - 1:
		idx += 1
		_show()
	else:
		SaveData.set_done(shift_i, "learn")
		Router.go("drill", {"shift": shift_i})
