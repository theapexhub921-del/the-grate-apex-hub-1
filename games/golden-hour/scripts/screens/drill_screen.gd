extends Screen
## Drill: quick timed questions. 5 correct out of 6 opens Prove.

const TIME := 6.7
const PASS := 5

var shift_i := 0
var idx := 0
var score := 0
var answered := false
var time_left := TIME
var order: Array = []
var holder: VBoxContainer
var timer_bar: ProgressBar
var option_buttons: Array = []
var last_tick := -1


func build() -> void:
	shift_i = int(params.get("shift", 0))
	holder = UI.vbox(12)
	content.add_child(holder)
	Audio.play("start")
	_show()


func _qs() -> Array:
	return Data.shift(shift_i)["drill"]


func _clear() -> void:
	for c in holder.get_children():
		holder.remove_child(c)
		c.queue_free()
	option_buttons.clear()
	timer_bar = null


func _show() -> void:
	_clear()
	var qs := _qs()
	UI.header(holder, "Shift %d · Drill %d/%d" % [shift_i + 1, mini(idx + 1, qs.size()), qs.size()])
	if idx >= qs.size():
		_result()
		return
	var q: Dictionary = qs[idx]
	answered = false
	time_left = TIME
	last_tick = -1
	timer_bar = UI.progress_bar(1.0, "gold", 8)
	holder.add_child(timer_bar)
	var v := UI.card(holder, 4)
	v.add_child(UI.label(String(q["label"]), 15, "muted", "bold"))
	var prompt := String(q["prompt"])
	v.add_child(UI.label(prompt, 22 if prompt.length() > 30 else 36, "fg", "display"))
	var choices: Array = q["choices"]
	order = range(choices.size())
	if not bool(q.get("keep_order", false)):
		order.shuffle()
	for n in order.size():
		var b := UI.button("%d.  %s" % [n + 1, choices[order[n]]], "ghost", 52)
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		b.pressed.connect(_answer.bind(n))
		holder.add_child(b)
		option_buttons.append(b)
	holder.add_child(UI.label("Tip: press 1, 2 or 3 on a keyboard.", 13, "muted"))
	UI.fade_in(holder, 0.15)


func _process(delta: float) -> void:
	if answered or timer_bar == null:
		return
	time_left -= delta
	timer_bar.value = maxf(0.0, time_left / TIME)
	var whole := int(ceil(time_left))
	if whole <= 2 and whole != last_tick and whole > 0:
		last_tick = whole
		Audio.play("tick")
	if time_left <= 0.0:
		_answer(-1)


func _unhandled_input(event: InputEvent) -> void:
	var k := event as InputEventKey
	if k == null or not k.pressed or k.echo:
		return
	if not answered:
		var n := int(k.keycode) - KEY_1
		if n >= 0 and n < option_buttons.size():
			_answer(n)
			get_viewport().set_input_as_handled()
	elif k.keycode in [KEY_ENTER, KEY_KP_ENTER, KEY_SPACE]:
		_go_next()
		get_viewport().set_input_as_handled()


func _answer(n: int) -> void:
	if answered:
		return
	answered = true
	var q: Dictionary = _qs()[idx]
	var correct := int(q["answer"])
	var chosen: int = order[n] if n >= 0 else -1
	for j in option_buttons.size():
		var b: Button = option_buttons[j]
		b.disabled = true
		if int(order[j]) == correct:
			UI.tint(b, "good")
		elif j == n:
			UI.tint(b, "bad")
	var ok := chosen == correct
	if ok:
		score += 1
		Audio.play("correct")
	else:
		Audio.play("wrong")
	var fb := PanelContainer.new()
	fb.add_theme_stylebox_override("panel", Style.box(Color(Style.c("hema"), 0.12), Color.TRANSPARENT, 12, 0, Vector4(12, 10, 12, 10)))
	var choices: Array = q["choices"]
	var msg := "Correct." if ok else ("Time's up. Answer: %s." % choices[correct] if n < 0 else "Answer: %s." % choices[correct])
	fb.add_child(UI.label(msg, 15, "fg", "bold"))
	holder.add_child(fb)
	var b2 := UI.button("Next", "primary", 50)
	b2.pressed.connect(_go_next)
	holder.add_child(b2)


func _go_next() -> void:
	idx += 1
	_show()


func _result() -> void:
	var qs := _qs()
	var passed := score >= PASS
	if passed:
		SaveData.set_done(shift_i, "drill")
		Audio.play("pass")
	var sh := SaveData.shift(shift_i)
	sh["best_drill"] = maxi(int(sh.get("best_drill", 0)), score)
	SaveData.save()
	var v := UI.card(holder, 8, "good" if passed else "bad")
	v.add_child(UI.label("%d of %d correct" % [score, qs.size()], 28, "fg", "display"))
	v.add_child(UI.label("Good speed and accuracy. You are ready to prove it." if passed else "You need %d correct to move on. Run it again." % PASS, 16))
	var b := UI.button("Go to Prove" if passed else "Try the drill again", "primary", 54)
	b.pressed.connect(func():
		if passed:
			Router.go("prove", {"shift": shift_i})
		else:
			Router.go("drill", {"shift": shift_i}))
	holder.add_child(b)
	b.grab_focus.call_deferred()
