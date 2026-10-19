extends Control
## Plays every screen and every shift's Prove step automatically.

func _ready() -> void:
	theme = Style.theme
	Router.setup(self)
	_run.call_deferred()


func _w(t: float) -> void:
	await get_tree().create_timer(t).timeout


func _press(text_part: String) -> bool:
	var g = Router.current
	for b in _buttons(g.panel_box if g.get("panel_box") else g):
		if b.text.find(text_part) >= 0 and b.visible and not b.disabled:
			b.emit_signal("pressed")
			return true
	return false


func _buttons(n: Node) -> Array:
	var out: Array = []
	for c in n.get_children():
		if c is Button:
			out.append(c)
		out.append_array(_buttons(c))
	return out


## Presses the option that has no penalty (Golden Hour marks correct options by their feedback).
func _good_choice(g) -> void:
	await _w(0.15)


func _run() -> void:
	printerr("shifts:", Data.shifts.size(), " wards:", Data.wards.keys())
	for s in ["home", "settings"]:
		Router.go(s)
		await _w(0.5)
		printerr("OK ", Router.current_name)
	# learn + drill shift 1
	Router.go("learn", {"shift": 0})
	await _w(0.5)
	while Router.current_name == "learn":
		Router.current._next()
		await _w(0.6)
	printerr("after learn -> ", Router.current_name, " learn done:", SaveData.is_done(0, "learn"))
	var d = Router.current
	for i in 6:
		var q: Dictionary = d._qs()[d.idx]
		d._answer(d.order.find(int(q["answer"])))
		d._go_next()
		await _w(0.1)
	printerr("drill score ", d.score, " done:", SaveData.is_done(0, "drill"))

	# PROVE shift 1 (vitals) - play it right
	Router.go("prove", {"shift": 0})
	await _w(0.6)
	var g = Router.current
	g._act("wash"); await _w(3.6)
	g._act("curtain"); await _w(1.2)
	g._act("greet"); await _w(0.2)
	_press("May I check"); await _w(0.2)
	g._act("bp"); await _w(0.2)
	_press("Regular adult"); await _w(3.0)
	g._act("temp"); await _w(2.2)
	g._act("spo2"); await _w(2.2)
	g._act("pulse"); await _w(0.2)
	_press("Start counting"); await _w(0.3)
	for i in 26: g._count_n += 1
	g._count_left = 0.01; await _w(0.3)
	g._act("resp"); await _w(0.2)
	_press("Start counting"); await _w(0.3)
	for i in 6: g._count_n += 1
	g._count_left = 0.01; await _w(0.3)
	printerr("vitals done: ", g.done.keys(), " safe ", g.safe, " dig ", g.dig)
	_press("Continue"); await _w(0.2)
	_press("getting worse"); await _w(0.2)
	_press("SBAR"); await _w(0.4)
	printerr("shift1 prove passed: ", SaveData.is_done(0, "prove"))

	# Prove shifts 2-6 by picking zero-penalty options from data
	for si in range(1, 6):
		Router.go("prove", {"shift": si})
		await _w(0.6)
		g = Router.current
		var cfg: Dictionary = Data.ward(si)
		for t in cfg["tasks"]:
			g._ward_act(String(t["id"]))
			await _w(0.15)
			if String(t["type"]) == "bar":
				await _w(float(t["ms"]) / 1000.0 + 0.4)
			else:
				for o in t["options"]:
					if float(o["safety"]) == 0 and float(o["dignity"]) == 0:
						_press(String(o["text"]).substr(0, 25))
						break
				await _w(0.15)
		for f in cfg["final"]:
			for o in f["options"]:
				if float(o["safety"]) == 0 and float(o["dignity"]) == 0:
					_press(String(o["text"]).substr(0, 25))
					break
			await _w(0.2)
		printerr("shift ", si + 1, " safe ", g.safe, " dig ", g.dig, " passed: ", SaveData.is_done(si, "prove"))

	# a mistake run on shift 1 to check penalties
	Router.go("prove", {"shift": 0})
	await _w(0.6)
	g = Router.current
	g._act("bp"); await _w(0.2)
	printerr("touch penalties -> safe ", g.safe, " dig ", g.dig)
	_press("Small child"); await _w(0.2)
	printerr("wrong cuff -> safe ", g.safe)

	# check screen
	Router.go("check", {"shift": 0})
	await _w(0.5)
	var c = Router.current
	for b in _buttons(c):
		if b is CheckBox:
			b.button_pressed = true
	await _w(0.3)
	printerr("check done: ", SaveData.is_done(0, "check"), " rank: ", SaveData.rank())
	Router.go("home")
	await _w(0.5)
	printerr("SMOKE DONE")
	get_tree().quit()
