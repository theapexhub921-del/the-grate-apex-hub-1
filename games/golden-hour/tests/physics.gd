extends Node
## Physics checks for the ward: same result at 30, 60 and 144 fps, no runaway values,
## tools settle, the fling stops, the camera springs back from the edge, nothing sinks into
## the bed or the chairs. Run: godot --headless --path . res://tests/physics.tscn

var fails := 0


func check(ok: bool, what: String) -> void:
	printerr(("PASS " if ok else "FAIL ") + what)
	if not ok:
		fails += 1


func _make() -> Ward:
	seed(7)
	var w := Ward.new()
	add_child(w)
	w.set_props(Data.ward(4).get("props", []))
	w.set_process(false)
	for f in [w.patient] + w._people:
		f.set_process(false)
	return w


func _step(w: Ward, dt: float) -> void:
	w._process(dt)
	for f in [w.patient] + w._people:
		if is_instance_valid(f):
			f.update_pose(dt)


## The same story at a given frame rate; returns the state after 2.5 s.
func _run(fps: float) -> Dictionary:
	var w := _make()
	await get_tree().process_frame
	w.add_hotspot("bp", "upper_arm", 0.08)
	var dt := 1.0 / fps
	var t := 0.0
	var max_yaw := 0.0
	var nan := false
	var dragged := false
	var released := false
	while t < 2.5:
		if t >= 0.1 and not dragged:
			dragged = true
			w.drag_begin()
			w.set_view("arm")
			w.curtain_closed = true
			w.show_tool("cuff", true)
			w.poke("bp")
		if dragged and not released:
			w.drag_to(minf(t - 0.1, 0.25) * 900.0)   # a quick swipe, 900 px/s for 0.25 s
			if t >= 0.35:
				released = true
				w.drag_end()
		_step(w, dt)
		t += dt
		max_yaw = maxf(max_yaw, absf(w.yaw))
		for x in [w.camera.position.x, w.yaw, w._curtain.scale.z]:
			if is_nan(x) or is_inf(x):
				nan = true
	var r := {"cam": w.camera.position, "yaw": w.yaw, "curtain": w._curtain.scale.z,
		"cuff": w.tools["cuff"].position, "drop": w._drop("cuff"), "max_yaw": max_yaw, "nan": nan,
		"chest": w.patient.joints["chest"], "w": w}
	return r


func _ready() -> void:
	_go.call_deferred()


func _go() -> void:
	var a: Dictionary = await _run(30.0)
	var b: Dictionary = await _run(60.0)
	var c: Dictionary = await _run(144.0)
	for r in [a, b, c]:
		check(not r["nan"], "no NaN or infinite values")
		check(r["max_yaw"] < 1.3 + 0.35, "fling past the edge is held back by the rubber band (max %.2f)" % r["max_yaw"])
		check(absf(r["yaw"]) <= 1.301, "camera springs back inside the edge (%.3f)" % r["yaw"])
		check(r["drop"] == 0.0, "the cuff has settled on the arm")
		check(absf(r["curtain"] - 1.0) < 0.01, "curtain closed and settled (%.3f)" % r["curtain"])
	for pair in [[a, b, "30 vs 60"], [c, b, "144 vs 60"]]:
		var p: Dictionary = pair[0]
		var q: Dictionary = pair[1]
		check((p["cam"] as Vector3).distance_to(q["cam"]) < 0.05, "camera ends in the same place, %s (%.4f m)" % [pair[2], (p["cam"] as Vector3).distance_to(q["cam"])])
		check(absf(float(p["yaw"]) - float(q["yaw"])) < 0.03, "fling ends at the same angle, %s (%.4f)" % [pair[2], absf(float(p["yaw"]) - float(q["yaw"]))])
		check((p["cuff"] as Vector3).distance_to(q["cuff"]) < 0.01, "cuff in the same place, %s" % pair[2])

	# mid-flight comparison of the falling tool and the curtain spring (not just the end)
	var mids: Array = []
	for fps in [30.0, 60.0, 144.0]:
		var w := _make()
		await get_tree().process_frame
		w.show_tool("clip", true)
		w.curtain_closed = true
		var t := 0.0
		while t < 0.3 - 0.0001:
			_step(w, 1.0 / fps)
			t += 1.0 / fps
		mids.append([w._drop("clip"), w._curtain.scale.z])
		w.queue_free()
	check(absf(mids[0][0] - mids[1][0]) < 0.01 and absf(mids[2][0] - mids[1][0]) < 0.01, "a falling tool bounces the same at 30/60/144 fps %s" % str(mids))
	check(absf(mids[0][1] - mids[1][1]) < 0.02 and absf(mids[2][1] - mids[1][1]) < 0.02, "curtain moves the same at 30/60/144 fps")

	# a long hitch (tab in the background) must not throw anything across the room
	var w2 := _make()
	await get_tree().process_frame
	w2.curtain_closed = true
	w2._yaw_vel = 6.0
	_step(w2, 2.0)
	check(w2._curtain.scale.z <= 1.06 and absf(w2.yaw) < 1.7, "a 2-second hitch is capped (curtain %.2f, yaw %.2f)" % [w2._curtain.scale.z, w2.yaw])

	# breathing rate change is smooth: the chest never jumps between frames
	var p := w2.patient
	var last: Vector3 = p.joints["chest"]
	var worst := 0.0
	for i in 240:
		if i == 100:
			w2.breathing_fast = true
		_step(w2, 1.0 / 60.0)
		var now: Vector3 = p.joints["chest"]
		worst = maxf(worst, now.distance_to(last))
		last = now
	check(worst < 0.004, "chest moves smoothly when breathing speeds up (largest step %.4f m)" % worst)

	# nothing sinks: Mr Amoah lies on the mattress, his hand rests on the blanket,
	# seated patients sit on the seat (thigh radius 0.075)
	_step(w2, 1.0 / 60.0)
	var back_y := p.to_global(p.joints["chest"]).y - 0.108 * 1.15
	check(back_y >= 0.84, "his back rests on the mattress (%.3f, mattress top 0.85)" % back_y)
	for k in [1.0, 0.75]:
		var at: Vector3 = p.to_global((p.joints["el_r"] as Vector3).lerp(p.joints["wr_r"], k))
		var bottom := at.y - 0.045 * 1.15
		check(at.x < -0.22 or bottom >= 1.105, "his forearm lies on top of the blanket, not in it (%.3f at x %.2f, blanket top 1.11)" % [bottom, at.x])
	for f in w2._people:
		if String((f as Figure).pose).begins_with("sit"):
			var lowest := INF
			for s in ["hip_l", "kn_l", "hip_r", "kn_r"]:
				lowest = minf(lowest, f.to_global(f.joints[s]).y - 0.075)
			check(lowest >= 0.415, "a seated patient's thighs rest on the seat (%.3f, seat top 0.42)" % lowest)

	# a push sways the body and it returns to rest
	var f0: Figure = w2._people[0]
	var rest: Vector3 = f0.joints["chest"]
	f0.push(Vector3(0, 0, -0.45))
	var far := 0.0
	for i in 120:
		_step(w2, 1.0 / 60.0)
		far = maxf(far, (f0.joints["chest"] as Vector3).distance_to(rest))
	check(far > 0.01 and far < 0.09, "a touched patient sways (%.3f m) without flying off" % far)
	var settled := Vector2(f0._push_off.x, f0._push_off.z).length() < 0.002
	check(settled, "and settles back within two seconds")

	# performance: 200 frames of a full triage ward
	var t0 := Time.get_ticks_usec()
	for i in 200:
		_step(w2, 1.0 / 60.0)
	var ms := (Time.get_ticks_usec() - t0) / 200.0 / 1000.0
	check(ms < 2.0, "ward physics costs %.3f ms a frame" % ms)

	printerr("PHYSICS DONE, failures: ", fails)
	get_tree().quit(1 if fails > 0 else 0)
