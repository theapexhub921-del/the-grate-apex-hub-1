extends Screen
## The scramble itself. Handles Classic, Practice, Medical Rush, Case and Multiplayer modes.
## params: mode, category, difficulty (0 = mixed), count, case_id

const MODE_TITLES := {"classic": "Classic Scramble", "rush": "Medical Rush", "practice": "Practice",
	"case": "Case Mode", "multi": "Multiplayer Match"}

var mode := "classic"
var category := "All"
var difficulty := 0
var count := 10
var case_data: Dictionary = {}

var questions: Array = []
var index := -1
var current: Dictionary = {}
var term := ""
var rng := RandomNumberGenerator.new()

var letters: Array = []
var used: Array = []
var picked: Array = []
var tiles: Array = []
var slots: Array = []
var tile_size := Vector2(52, 62)

var time_limit := 15.0
var time_left := 15.0
var running := false
var answered := false
var q_wrong := 0
var last_tick := -1

var score := 0
var streak := 0
var best_streak := 0
var results: Array = []
var rush_correct := 0
var finished := false

var rush_running := false
var rush_time := 0.0
var rush_bar: ProgressBar
var rush_buttons: Array = []
var rush_order: Array = []

var q_started_ms := 0
var advanced_for := -1
var host_accum := 0.0
var recent_ids: Array = []
var pending_next: Callable = Callable()
## Phones: a box that opens the phone's keyboard; what is typed goes onto the tiles.
var type_box: LineEdit
var _typing_sync := false

var q_label: Label
var cat_tag: Label
var diff_tag: Label
var score_label: Label
var streak_label: Label
var timer_bar: ProgressBar
var bar_fill: StyleBoxFlat
var secs_label: Label
var worth_label: Label
var tiles_box: HFlowContainer
var slots_box: HFlowContainer
var clue_label: Label
var feedback_label: Label
var info_panel: PanelContainer
var info_box: VBoxContainer
var controls: Array = []
var ticker_box: VBoxContainer
var practice_label: Label
var shown_score := 0.0


func build() -> void:
	mode = String(params.get("mode", "classic"))
	category = String(params.get("category", "All"))
	difficulty = int(params.get("difficulty", 0))
	count = int(params.get("count", 10))
	_prepare_questions()
	_build_ui()
	if mode == "multi":
		Net.room_updated.connect(_on_room)
		Net.connection_error.connect(func(msg: String): _set_feedback(msg, "warn"))
	if mode != "practice" and questions.is_empty():
		_set_feedback("No terms are available for this selection.", "bad")
		return
	Audio.play("start")
	_next_question()


# ---------------------------------------------------------------- setup

func _prepare_questions() -> void:
	match mode:
		"case":
			case_data = GameData.case_by_id(String(params.get("case_id", "")))
			questions = (case_data.get("steps", []) as Array).duplicate()
		"multi":
			var settings: Dictionary = Net.room.get("settings", {})
			category = String(settings.get("category", "All"))
			difficulty = int(settings.get("difficulty", 0))
			for id in Net.room.get("questions", []):
				if GameData.by_id.has(String(id)):
					questions.append(GameData.by_id[String(id)])
		"practice":
			pass
		_:
			rng.randomize()
			questions = GameData.pick(category, difficulty, count, mode == "rush", rng)


func _build_ui() -> void:
	var top := UI.hbox(10)
	content.add_child(top)
	var back := UI.button("‹ Leave" if mode == "multi" else "‹ Menu", "ghost", 38)
	back.focus_mode = Control.FOCUS_NONE
	back.pressed.connect(_quit)
	top.add_child(back)
	top.add_child(UI.spacer())
	top.add_child(UI.eyebrow(MODE_TITLES.get(mode, "")))

	if mode == "case" and not case_data.is_empty():
		var cc := UI.card(content, 6, "eosin")
		cc.add_child(UI.eyebrow("Case · " + String(case_data.get("title", ""))))
		cc.add_child(UI.label(String(case_data.get("presentation", "")), 17))

	# HUD
	var hud := UI.card(content, 8)
	var row := UI.hbox(12)
	hud.add_child(row)
	var left := UI.vbox(6)
	row.add_child(left)
	q_label = UI.label("", 15, "muted", "mono", false)
	left.add_child(q_label)
	var tags := UI.hbox(8)
	left.add_child(tags)
	var ct := UI.tag("")
	tags.add_child(ct)
	cat_tag = ct.get_child(0)
	var dt := UI.tag("", "eosin")
	tags.add_child(dt)
	diff_tag = dt.get_child(0)
	streak_label = UI.label("", 15, "eosin", "mono", false)
	left.add_child(streak_label)
	var right := VBoxContainer.new()
	right.alignment = BoxContainer.ALIGNMENT_CENTER
	row.add_child(right)
	var sc := UI.label("SCORE", 12, "muted", "mono", false)
	sc.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	right.add_child(sc)
	score_label = UI.label("0", 40, "fg", "display", false)
	score_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	right.add_child(score_label)

	# Timer
	var trow := UI.hbox(8)
	content.add_child(trow)
	secs_label = UI.label("0.0", 28, "fg", "mono", false)
	trow.add_child(secs_label)
	trow.add_child(UI.spacer())
	worth_label = UI.label("", 16, "muted", "mono", false)
	trow.add_child(worth_label)
	timer_bar = UI.progress_bar(1.0, "good", 12)
	bar_fill = timer_bar.get_theme_stylebox("fill") as StyleBoxFlat
	content.add_child(timer_bar)

	# Letters
	tiles_box = UI.flow(8, true)
	content.add_child(tiles_box)
	slots_box = UI.flow(8, true)
	content.add_child(slots_box)
	# Touch screens have no keys to press, so this box opens the phone's keyboard.
	# (A computer types straight onto the tiles, so it is only shown on touch screens.)
	if DisplayServer.is_touchscreen_available():
		type_box = UI.line_edit("", "Tap here to type the answer")
		type_box.alignment = HORIZONTAL_ALIGNMENT_CENTER
		type_box.add_theme_font_override("font", Style.font("mono"))
		type_box.virtual_keyboard_type = LineEdit.KEYBOARD_TYPE_DEFAULT
		type_box.text_changed.connect(_on_typed)
		type_box.text_submitted.connect(_on_type_submit)
		content.add_child(type_box)

	var clue_card := UI.card(content, 6)
	clue_card.add_child(UI.eyebrow("Clue"))
	clue_label = UI.label("", 19, "fg", "bold")
	clue_card.add_child(clue_label)

	var crow := UI.flow(8, true)
	content.add_child(crow)
	var defs := [["Delete", "ghost", _delete_last], ["Clear", "ghost", _clear], ["Shuffle", "ghost", _shuffle_tiles], ["Check", "primary", _check]]
	if mode == "practice":
		defs.insert(3, ["Skip", "ghost", _skip])
	for d in defs:
		var b := UI.button(String(d[0]), String(d[1]), 46)
		b.custom_minimum_size.x = 110
		b.focus_mode = Control.FOCUS_NONE
		b.pressed.connect(d[2])
		crow.add_child(b)
		controls.append(b)

	feedback_label = UI.label("", 17, "fg", "bold")
	feedback_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	content.add_child(feedback_label)

	info_panel = PanelContainer.new()
	info_panel.visible = false
	content.add_child(info_panel)
	info_box = UI.vbox(10)
	info_panel.add_child(info_box)

	if mode == "practice":
		var pc := UI.card(content, 8)
		practice_label = UI.label("", 15, "muted", "mono")
		pc.add_child(practice_label)
		var end := UI.button("End session & save progress", "ghost", 44)
		end.focus_mode = Control.FOCUS_NONE
		end.pressed.connect(func(): _finish())
		pc.add_child(end)
		_update_practice_stats()

	if mode == "multi":
		var tc := UI.card(content, 6)
		tc.add_child(UI.eyebrow("Live opponents"))
		ticker_box = UI.vbox(4)
		tc.add_child(ticker_box)
		_update_ticker(Net.room.get("players", {}))

	content.add_child(UI.label("Tap the tiles or type the letters on your keyboard. Delete removes the last letter, Enter checks.", 13, "muted"))


# ---------------------------------------------------------------- question flow

func _next_question() -> void:
	if finished:
		return
	index += 1
	if mode == "practice":
		if index >= questions.size():
			var t := GameData.random_term(category, difficulty, recent_ids)
			if t.is_empty():
				_set_feedback("No terms match these filters.", "bad")
				return
			questions.append(t)
	elif index >= questions.size():
		if mode != "multi":
			_finish()
		return
	current = questions[index]
	term = String(current.get("term", "")).to_upper()
	recent_ids.append(current.get("id", term))
	if recent_ids.size() > 20:
		recent_ids.pop_front()
	answered = false
	q_wrong = 0
	picked.clear()
	last_tick = -1
	pending_next = Callable()
	var diff := int(current.get("difficulty", 2))
	time_limit = Scoring.time_limit(diff, term.length())
	if mode == "practice":
		time_limit *= 1.5
	time_left = time_limit
	if mode == "multi":
		rng.seed = hash(Net.code + ":" + str(index))
	else:
		rng.randomize()
	letters = Scramble.shuffle(term, rng)
	used.clear()
	for i in letters.size():
		used.append(false)
	_build_letters()

	if mode == "practice":
		q_label.text = "TERM %d" % (index + 1)
	elif mode == "case":
		q_label.text = "STEP %d / %d · %s" % [index + 1, questions.size(), String(current.get("stage", "")).to_upper()]
	else:
		q_label.text = "Q %d / %d" % [index + 1, questions.size()]
	cat_tag.text = String(current.get("category", "")).to_upper()
	diff_tag.text = GameData.difficulty_name(diff).to_upper()
	clue_label.text = String(current.get("clue", ""))
	info_panel.visible = false
	_set_controls(true)
	_set_feedback("", "fg")
	q_started_ms = Time.get_ticks_msec()
	running = true
	_update_timer_ui()


func _build_letters() -> void:
	for c in tiles_box.get_children():
		tiles_box.remove_child(c)
		c.queue_free()
	for c in slots_box.get_children():
		slots_box.remove_child(c)
		c.queue_free()
	tiles.clear()
	slots.clear()
	var n := letters.size()
	var w := clampf((column_width() - float(n - 1) * 8.0) / float(n), 34.0, 58.0)
	tile_size = Vector2(w, round(w * 1.18))
	for i in n:
		var b := Button.new()
		b.text = String(letters[i])
		b.custom_minimum_size = tile_size
		b.pivot_offset = tile_size / 2.0
		b.focus_mode = Control.FOCUS_NONE
		b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		_style_tile(b)
		b.pressed.connect(_on_tile.bind(i))
		tiles_box.add_child(b)
		tiles.append(b)
		_pop_in(b, i * 0.025)
	for k in n:
		var s := Button.new()
		s.custom_minimum_size = tile_size
		s.pivot_offset = tile_size / 2.0
		s.focus_mode = Control.FOCUS_NONE
		s.pressed.connect(_on_slot.bind(k))
		slots_box.add_child(s)
		slots.append(s)
	_refresh_slots()


func _style_tile(b: Button) -> void:
	var pad := Vector4(0, 0, 0, 0)
	b.add_theme_stylebox_override("normal", Style.box(Style.c("surface"), Style.c("hema"), 9, 2, pad))
	b.add_theme_stylebox_override("hover", Style.box(Style.c("surface2"), Style.c("eosin"), 9, 2, pad))
	b.add_theme_stylebox_override("pressed", Style.box(Style.c("hema"), Style.c("hema"), 9, 2, pad))
	b.add_theme_stylebox_override("disabled", Style.box(Style.c("surface2"), Style.c("line"), 9, 1, pad))
	b.add_theme_font_override("font", Style.font("mono"))
	b.add_theme_font_size_override("font_size", int(tile_size.x * 0.5))
	b.add_theme_color_override("font_color", Style.c("hema"))
	b.add_theme_color_override("font_hover_color", Style.c("eosin"))
	b.add_theme_color_override("font_pressed_color", Style.c("hema_fg"))
	b.add_theme_color_override("font_disabled_color", Color(Style.c("muted"), 0.35))


func _style_slot(s: Button, state: String) -> void:
	var pad := Vector4(0, 0, 0, 0)
	var bg := Style.c("surface2")
	var border := Style.c("line")
	var fg := Style.c("fg")
	match state:
		"filled":
			bg = Style.c("hema")
			border = Style.c("hema")
			fg = Style.c("hema_fg")
		"good":
			bg = Style.c("good")
			border = Style.c("good")
			fg = Color.WHITE
		"bad":
			bg = Style.c("surface")
			border = Style.c("bad")
			fg = Style.c("bad")
	var box := Style.box(bg, border, 9, 2, pad)
	for k in ["normal", "hover", "pressed", "disabled"]:
		s.add_theme_stylebox_override(k, box)
	for k in ["font_color", "font_hover_color", "font_pressed_color", "font_disabled_color"]:
		s.add_theme_color_override(k, fg)
	s.add_theme_font_override("font", Style.font("mono"))
	s.add_theme_font_size_override("font_size", int(tile_size.x * 0.5))


func _refresh_slots() -> void:
	for k in slots.size():
		var s: Button = slots[k]
		if k < picked.size():
			s.text = String(letters[picked[k]])
			_style_slot(s, "filled")
		else:
			s.text = ""
			_style_slot(s, "empty")
	_show_typed()


## The letters placed so far, as a word.
func _picked_word() -> String:
	var word := ""
	for i in picked:
		word += String(letters[i])
	return word


## The type box always shows the letters on the tiles (tapping a tile updates it too).
func _show_typed() -> void:
	if type_box == null or _typing_sync:
		return
	var word := _picked_word()
	if type_box.text != word:
		type_box.text = word
		type_box.caret_column = word.length()


## Phone keyboard: the box's new text decides the answer. Letters that already match
## stay; the rest are taken back and the new ones are placed on unused tiles.
func _on_typed(text: String) -> void:
	if answered or not running:
		_show_typed()
		return
	var wanted := ""
	for ch in text.to_upper():
		if ch >= "A" and ch <= "Z":
			wanted += ch
	_typing_sync = true
	var current_word := _picked_word()
	var same := 0
	while same < mini(current_word.length(), wanted.length()) and current_word[same] == wanted[same]:
		same += 1
	while picked.size() > same:
		_delete_last()
	for k in range(same, wanted.length()):
		if answered or picked.size() >= term.length():
			break
		_type_letter(wanted[k])
	_typing_sync = false
	_show_typed()


## Enter on the phone keyboard: check the answer, or go on once it is answered.
func _on_type_submit(_text: String) -> void:
	if answered:
		if pending_next.is_valid():
			pending_next.call()
	else:
		_check()


func _pop_in(node: Control, delay: float) -> void:
	if Style.reduced_motion():
		return
	node.scale = Vector2(0.5, 0.5)
	node.modulate.a = 0.0
	var tw := node.create_tween().set_parallel(true).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_property(node, "scale", Vector2.ONE, 0.26).set_delay(delay)
	tw.tween_property(node, "modulate:a", 1.0, 0.18).set_delay(delay)


# ---------------------------------------------------------------- input

func _unhandled_input(event: InputEvent) -> void:
	var k := event as InputEventKey
	if k == null or not k.pressed or k.echo:
		return
	var handled := true
	if rush_running:
		var n := int(k.keycode) - KEY_1
		if n >= 0 and n < rush_buttons.size():
			_on_rush_choice(n)
		else:
			handled = false
	elif answered:
		if k.keycode in [KEY_ENTER, KEY_KP_ENTER, KEY_SPACE] and pending_next.is_valid():
			pending_next.call()
		else:
			handled = false
	elif running:
		match k.keycode:
			KEY_BACKSPACE:
				_delete_last()
			KEY_ENTER, KEY_KP_ENTER:
				_check()
			KEY_ESCAPE:
				_clear()
			_:
				var ch := String.chr(k.unicode).to_upper() if k.unicode > 0 else ""
				if ch.length() == 1 and ch >= "A" and ch <= "Z":
					_type_letter(ch)
				else:
					handled = false
	else:
		handled = false
	if handled:
		get_viewport().set_input_as_handled()


func _type_letter(ch: String) -> void:
	for i in letters.size():
		if not used[i] and String(letters[i]) == ch:
			_on_tile(i)
			return
	_shake(tiles_box)


func _on_tile(i: int) -> void:
	if answered or not running or used[i]:
		return
	used[i] = true
	picked.append(i)
	(tiles[i] as Button).disabled = true
	Audio.play("letter")
	_refresh_slots()
	UI.pulse(slots[picked.size() - 1], 1.12)
	if picked.size() == term.length():
		_check()


func _on_slot(k: int) -> void:
	if answered or not running or k >= picked.size():
		return
	var i: int = picked[k]
	picked.remove_at(k)
	used[i] = false
	(tiles[i] as Button).disabled = false
	UI.pulse(tiles[i], 1.1)
	Audio.play("back")
	_refresh_slots()


func _delete_last() -> void:
	if not picked.is_empty():
		_on_slot(picked.size() - 1)


func _clear() -> void:
	if answered:
		return
	for i in picked:
		used[i] = false
		(tiles[i] as Button).disabled = false
	picked.clear()
	_refresh_slots()


func _shuffle_tiles() -> void:
	if answered:
		return
	var order: Array = range(tiles.size())
	order.shuffle()
	for j in order.size():
		tiles_box.move_child(tiles[order[j]], j)
	for t in tiles:
		UI.pulse(t, 1.08)
	Audio.play("back")


func _skip() -> void:
	if answered or not running:
		return
	time_left = 0.0
	_on_timeout(true)


# ---------------------------------------------------------------- answering

func _check() -> void:
	if answered or not running:
		return
	if picked.size() < term.length():
		_set_feedback("Use all %d letters." % term.length(), "warn")
		_shake(slots_box)
		return
	var guess := ""
	for i in picked:
		guess += String(letters[i])
	if guess == term:
		_on_correct()
	else:
		_on_wrong()


func _on_wrong() -> void:
	q_wrong += 1
	var had := streak
	streak = 0
	_update_streak(false)
	Audio.play("wrong")
	_set_feedback("Not quite — streak broken. Try again." if had >= 2 else "Not quite. Try again.", "bad")
	for k in picked.size():
		_style_slot(slots[k], "bad")
	_shake(slots_box)
	await get_tree().create_timer(0.45).timeout
	if not is_inside_tree() or answered:
		return
	_clear()


func _on_correct() -> void:
	answered = true
	running = false
	streak += 1
	best_streak = maxi(best_streak, streak)
	var diff := int(current.get("difficulty", 2))
	var pts := Scoring.score(diff, time_left, time_limit, streak)
	score += int(pts["total"])
	results.append(_result(true, time_limit - time_left, int(pts["total"])))
	Audio.play("correct")
	for k in slots.size():
		_style_slot(slots[k], "good")
		if not Style.reduced_motion():
			var s: Button = slots[k]
			var tw := s.create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
			tw.tween_property(s, "scale", Vector2(1.18, 1.18), 0.09).set_delay(k * 0.03)
			tw.tween_property(s, "scale", Vector2.ONE, 0.16)
	_animate_score()
	_update_streak(true)
	var text := "Correct!  +%d   (base %d · speed %d" % [pts["total"], pts["base"], pts["speed"]]
	if int(pts["streak"]) > 0:
		text += " · streak %d" % pts["streak"]
	if int(pts["milestone"]) > 0:
		text += " · combo %d" % pts["milestone"]
	_set_feedback(text + ")", "good")
	if int(pts["milestone"]) > 0:
		_streak_reward(streak)
	_after_answer(true)


func _on_timeout(skipped: bool = false) -> void:
	if answered:
		return
	answered = true
	running = false
	time_left = 0.0
	streak = 0
	_update_streak(false)
	results.append(_result(false, time_limit, 0))
	Audio.play("timeout")
	picked.clear()
	for k in slots.size():
		var s: Button = slots[k]
		s.text = term[k]
		_style_slot(s, "bad")
	_update_timer_ui()
	_set_feedback(("Skipped — it was %s." if skipped else "Time's up — it was %s.") % term, "bad")
	_after_answer(false)


func _result(correct: bool, t: float, pts: int) -> Dictionary:
	return {"id": current.get("id", term), "term": term, "category": current.get("category", ""),
		"correct": correct, "time": snappedf(t, 0.01), "points": pts, "wrong_tries": q_wrong}


func _after_answer(correct: bool) -> void:
	_set_controls(false)
	worth_label.text = ""
	_update_practice_stats()
	match mode:
		"practice":
			_show_info(true, "Next term")
		"case":
			_show_info(true, "Continue the case" if index < questions.size() - 1 else "Close the case")
		"rush":
			if correct and current.has("rush"):
				_show_rush()
			else:
				_show_info(false, "Next")
				_auto_next(2.4)
		"multi":
			_show_info(false, "")
			var act := ("Solved Q%d in %.1fs" % [index + 1, time_limit - time_left]) if correct else ("Missed Q%d" % (index + 1))
			Net.update_player({"score": score, "activity": act, "done": index, "streak": streak})
			feedback_label.text += "\nWaiting for the other players…"
		_:
			_show_info(false, "Next")
			_auto_next(2.2)


func _auto_next(delay: float) -> void:
	var my_index := index
	await get_tree().create_timer(delay).timeout
	if is_inside_tree() and index == my_index and answered and not rush_running and not finished:
		_go_next()


func _go_next() -> void:
	pending_next = Callable()
	_next_question()


func _clear_info() -> void:
	for c in info_box.get_children():
		info_box.remove_child(c)
		c.queue_free()


func _show_info(extended: bool, next_text: String) -> void:
	_clear_info()
	info_box.add_child(UI.label(term, 26, "hema", "display", false))
	info_box.add_child(UI.label(String(current.get("definition", "")), 17))
	if extended:
		var ex := String(current.get("explanation", ""))
		if ex != "":
			info_box.add_child(UI.label(ex, 16, "muted"))
		var rel: Array = current.get("related", [])
		if not rel.is_empty():
			info_box.add_child(UI.label("Related: " + ", ".join(PackedStringArray(rel)), 14, "eosin", "mono"))
	if next_text != "":
		var b := UI.button(next_text + "  ›", "primary", 46)
		b.focus_mode = Control.FOCUS_NONE
		b.pressed.connect(_go_next)
		info_box.add_child(b)
		pending_next = _go_next
	_reveal_info()


func _reveal_info() -> void:
	info_panel.visible = true
	UI.fade_in(info_panel)
	await get_tree().process_frame
	await get_tree().process_frame
	if is_inside_tree():
		scroll.ensure_control_visible(info_panel)


func _show_rush() -> void:
	var r: Dictionary = current["rush"]
	_clear_info()
	info_box.add_child(UI.eyebrow("Medical Rush · +%d bonus · press 1-%d" % [Scoring.RUSH_BONUS, (r.get("choices", []) as Array).size()]))
	info_box.add_child(UI.label(String(r.get("question", "")), 20, "fg", "display"))
	rush_bar = UI.progress_bar(1.0, "eosin", 8)
	info_box.add_child(rush_bar)
	var choices: Array = r.get("choices", [])
	rush_order = range(choices.size())
	rush_order.shuffle()
	rush_buttons.clear()
	for n in rush_order.size():
		var b := UI.button("%d.  %s" % [n + 1, choices[rush_order[n]]], "ghost", 48)
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		b.focus_mode = Control.FOCUS_NONE
		b.pressed.connect(_on_rush_choice.bind(n))
		info_box.add_child(b)
		rush_buttons.append(b)
	_reveal_info()
	rush_time = Scoring.RUSH_TIME
	rush_running = true
	Audio.play("rush")


func _on_rush_choice(n: int) -> void:
	if not rush_running:
		return
	rush_running = false
	var r: Dictionary = current["rush"]
	var answer := int(r.get("answer", 0))
	var chosen: int = rush_order[n] if n >= 0 else -1
	for j in rush_buttons.size():
		var b: Button = rush_buttons[j]
		b.disabled = true
		if int(rush_order[j]) == answer:
			UI.tint(b, "good")
		elif j == n:
			UI.tint(b, "bad")
	if chosen == answer:
		rush_correct += 1
		score += Scoring.RUSH_BONUS
		var last: Dictionary = results.back()
		last["points"] = int(last["points"]) + Scoring.RUSH_BONUS
		last["rush"] = true
		Audio.play("correct")
		_animate_score()
		_set_feedback("Rush bonus +%d!" % Scoring.RUSH_BONUS, "good")
	else:
		Audio.play("wrong")
		_set_feedback("Out of time on the challenge." if n < 0 else "Not the best answer.", "bad")
	info_box.add_child(UI.label(String(r.get("why", "")), 16, "muted"))
	var b2 := UI.button("Next  ›", "primary", 46)
	b2.focus_mode = Control.FOCUS_NONE
	b2.pressed.connect(_go_next)
	info_box.add_child(b2)
	pending_next = _go_next


# ---------------------------------------------------------------- frame update

func _process(delta: float) -> void:
	if running:
		time_left = maxf(0.0, time_left - delta)
		_update_timer_ui()
		if time_left <= 0.0:
			_on_timeout()
	if rush_running:
		rush_time -= delta
		if rush_bar:
			rush_bar.value = maxf(0.0, rush_time / Scoring.RUSH_TIME)
		if rush_time <= 0.0:
			_on_rush_choice(-1)
	if mode == "multi" and Net.is_host and not finished:
		host_accum += delta
		if host_accum >= 0.5:
			host_accum = 0.0
			_host_check()


func _update_timer_ui() -> void:
	var ratio := time_left / time_limit if time_limit > 0.0 else 0.0
	timer_bar.value = ratio
	secs_label.text = "%.1f" % time_left
	var key := "good" if ratio > 0.5 else ("warn" if ratio > 0.25 else "bad")
	bar_fill.bg_color = Style.c(key)
	secs_label.add_theme_color_override("font_color", Style.c("bad") if ratio <= 0.25 else Style.c("fg"))
	if running:
		var potential := Scoring.score(int(current.get("difficulty", 2)), time_left, time_limit, streak + 1)
		worth_label.text = "worth +%d" % potential["total"]
		var whole := int(ceil(time_left))
		if ratio <= 0.34 and whole <= 5 and whole > 0 and whole != last_tick:
			last_tick = whole
			Audio.play("tick")
			UI.pulse(secs_label, 1.2)
	else:
		worth_label.text = ""


func _update_streak(animate: bool) -> void:
	streak_label.text = ("STREAK ×%d" % streak) if streak >= 2 else ""
	if animate and streak >= 2:
		UI.pulse(streak_label, 1.3)


func _streak_reward(n: int) -> void:
	Audio.play("streak")
	var text := "MAJOR COMBO ×%d" % n if n >= 10 else ("HOT STREAK ×%d" % n if n >= 5 else "STREAK ×%d" % n)
	var l := UI.label(text, 48 if n >= 10 else 38, "eosin", "display", false)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	l.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	l.add_theme_color_override("font_outline_color", Style.c("bg"))
	l.add_theme_constant_override("outline_size", 10)
	add_child(l)
	l.reset_size()
	l.position = (size - l.size) / 2.0
	l.pivot_offset = l.size / 2.0
	if Style.reduced_motion():
		get_tree().create_timer(1.0).timeout.connect(l.queue_free)
		return
	l.scale = Vector2(0.6, 0.6)
	var tw := l.create_tween().set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_property(l, "scale", Vector2(1.08, 1.08), 0.25)
	tw.tween_interval(0.5)
	tw.tween_property(l, "modulate:a", 0.0, 0.35)
	tw.tween_callback(l.queue_free)
	if n >= 5:
		var p := CPUParticles2D.new()
		p.position = size / 2.0
		p.amount = 70 if n >= 10 else 36
		p.one_shot = true
		p.explosiveness = 0.95
		p.lifetime = 1.3
		p.spread = 180.0
		p.initial_velocity_min = 220.0
		p.initial_velocity_max = 480.0
		p.gravity = Vector2(0, 700)
		p.scale_amount_min = 4.0
		p.scale_amount_max = 9.0
		p.color = Style.c("eosin")
		p.hue_variation_min = -0.12
		p.hue_variation_max = 0.12
		add_child(p)
		p.emitting = true
		get_tree().create_timer(1.8).timeout.connect(p.queue_free)


func _animate_score() -> void:
	var tw := create_tween()
	tw.tween_method(_set_shown_score, shown_score, float(score), 0.45 if not Style.reduced_motion() else 0.01)
	UI.pulse(score_label, 1.12)


func _set_shown_score(v: float) -> void:
	shown_score = v
	score_label.text = str(int(round(v)))


func _set_controls(on: bool) -> void:
	for b in controls:
		(b as Button).disabled = not on


func _set_feedback(text: String, color: String) -> void:
	feedback_label.text = text
	feedback_label.add_theme_color_override("font_color", Style.c(color))


func _shake(node: Control) -> void:
	if Style.reduced_motion():
		return
	var x := node.position.x
	var tw := node.create_tween()
	for off in [10.0, -10.0, 6.0, -6.0, 0.0]:
		tw.tween_property(node, "position:x", x + off, 0.04)


func _update_practice_stats() -> void:
	if practice_label == null:
		return
	var done := results.size()
	var correct := 0
	var t := 0.0
	for r in results:
		if r["correct"]:
			correct += 1
			t += float(r["time"])
	var acc := (100.0 * correct / done) if done > 0 else 0.0
	var avg := (t / correct) if correct > 0 else 0.0
	practice_label.text = "SCORE %d   ·   ACCURACY %d%% (%d/%d)   ·   AVG %.1fs   ·   STREAK %d   ·   BEST %d" % [score, int(acc), correct, done, avg, streak, best_streak]


# ---------------------------------------------------------------- multiplayer

func _on_room(data: Dictionary) -> void:
	if finished:
		return
	_update_ticker(data.get("players", {}))
	var status := String(data.get("status", ""))
	if status == "ended":
		if running and not answered:
			results.append(_result(false, time_limit, 0))
			running = false
		_finish(data.get("players", {}))
		return
	var idx := int(data.get("index", 0))
	if idx > index:
		if index >= 0 and not answered:
			running = false
			answered = true
			streak = 0
			results.append(_result(false, time_limit, 0))
		index = idx - 1
		_next_question()


func _host_check() -> void:
	var room: Dictionary = Net.room
	if String(room.get("status", "")) != "playing" or advanced_for == index or index < 0:
		return
	var players: Dictionary = room.get("players", {})
	var all_done := not players.is_empty()
	for p in players.values():
		if int((p as Dictionary).get("done", -1)) < index:
			all_done = false
			break
	var elapsed := (Time.get_ticks_msec() - q_started_ms) / 1000.0
	if all_done or elapsed > time_limit + 4.0:
		advanced_for = index
		var at := index
		await get_tree().create_timer(1.8 if all_done else 0.2).timeout
		if not is_inside_tree() or finished:
			return
		if at + 1 >= questions.size():
			Net.patch_room({"status": "ended"})
		else:
			Net.patch_room({"index": at + 1})


func _update_ticker(players: Variant) -> void:
	if ticker_box == null or not (players is Dictionary):
		return
	for c in ticker_box.get_children():
		ticker_box.remove_child(c)
		c.queue_free()
	var arr: Array = []
	for id in (players as Dictionary).keys():
		var p: Dictionary = players[id]
		arr.append({"id": String(id), "name": String(p.get("name", "?")), "score": int(p.get("score", 0)), "activity": String(p.get("activity", ""))})
	arr.sort_custom(func(a, b): return int(a["score"]) > int(b["score"]))
	for e in arr:
		var row := UI.hbox(10)
		var me := String(e["id"]) == Net.my_id()
		row.add_child(UI.label(String(e["name"]) + (" (you)" if me else ""), 15, "hema" if me else "fg", "bold", false))
		var act := UI.label(String(e["activity"]), 14, "muted", "body", true)
		row.add_child(act)
		row.add_child(UI.label("%d" % e["score"], 15, "fg", "mono", false))
		ticker_box.add_child(row)


# ---------------------------------------------------------------- end

func _finish(players: Dictionary = {}) -> void:
	if finished:
		return
	finished = true
	running = false
	rush_running = false
	var case_solved := false
	if mode == "case" and results.size() == questions.size() and not results.is_empty():
		case_solved = bool(results.back()["correct"])
	var summary := {"mode": mode, "mode_title": MODE_TITLES.get(mode, mode), "score": score, "results": results,
		"best_streak": best_streak, "rush_correct": rush_correct, "case_solved": case_solved,
		"case_title": case_data.get("title", ""), "category": category, "difficulty": difficulty}
	var outcome := SaveData.record_round(summary)
	if mode == "multi":
		Net.stop_polling()
	Router.go("results", {"summary": summary, "outcome": outcome, "players": players, "replay": params})


func _quit() -> void:
	if mode == "multi":
		Net.leave()
		Router.go("multi")
	elif mode == "practice" and not results.is_empty():
		_finish()
	else:
		Router.go("menu")
