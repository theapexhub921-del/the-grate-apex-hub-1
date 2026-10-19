class_name Ward
extends Node3D
## The 3D ward for the Prove step: room, bed, Mr Amoah, curtain, sink, tools and gold hotspots.
## Built in code from simple shapes with a dark outline (toon look). Positions are in metres.

## Camera viewpoints: [camera position, look-at point].
const VIEWS := {
	"over": [Vector3(0.9, 2.6, 5.0), Vector3(0.5, 1.1, 0.0)],
	"sink": [Vector3(2.4, 2.1, 0.4), Vector3(3.2, 1.1, -2.3)],
	"wrist": [Vector3(0.3, 1.95, 2.0), Vector3(-0.15, 0.72, 0.3)],
	"arm": [Vector3(-0.15, 1.95, 2.05), Vector3(-0.4, 0.72, 0.3)],
	"head": [Vector3(-0.5, 1.7, 1.6), Vector3(-0.8, 0.8, 0.1)],
	"chest": [Vector3(-0.25, 1.95, 1.95), Vector3(-0.42, 0.8, 0.15)],
	"cur": [Vector3(0.9, 2.6, 5.0), Vector3(1.0, 1.2, 0.0)],
}
const OUTLINE := Color("#10202a")
const SKIN := Color("#8a5a3c")

var camera: Camera3D
var yaw := -0.45
var view: Variant = "over"
var breathing_fast := false   ## True while the player counts breaths (24/min).
var pulse_rate := 0.0          ## Beats/min to flash on the wrist hotspot while counting.
var curtain_closed := false
var dignity := 100.0
var smile := 0.0               ## Seconds Mr Amoah keeps smiling (after a kind greeting).

var hotspots: Dictionary = {}  ## id -> MeshInstance3D
var tools: Dictionary = {}     ## cuff, clip, thermo
var patient: Figure
var _people: Array = []        ## figures added as props (triage patients)
var _curtain: MeshInstance3D
var _props: Node3D
var _cam_pos := Vector3(0, 2.6, 5)
var _look := Vector3(0.5, 1.1, 0)
var _t := 0.0
var _outline_mat: StandardMaterial3D
var _mats: Dictionary = {}


func _ready() -> void:
	_outline_mat = StandardMaterial3D.new()
	_outline_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	_outline_mat.albedo_color = OUTLINE
	_outline_mat.cull_mode = BaseMaterial3D.CULL_FRONT
	_outline_mat.grow = true
	_outline_mat.grow_amount = 0.022
	_build_environment()
	_build_room()
	_props = Node3D.new()
	add_child(_props)


# ------------------------------------------------------------------ building

func _mat(color: Color, outline: bool) -> StandardMaterial3D:
	var key := "%s|%s" % [color.to_html(), outline]
	if _mats.has(key):
		return _mats[key]
	var m := StandardMaterial3D.new()
	m.albedo_color = color
	m.roughness = 1.0
	m.metallic_specular = 0.0
	if outline:
		m.next_pass = _outline_mat
	_mats[key] = m
	return m


func _add(mesh: Mesh, color: Color, pos: Vector3, outline: bool = true, parent: Node3D = null) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	mi.material_override = _mat(color, outline)
	mi.position = pos
	(parent if parent else self).add_child(mi)
	return mi


static func box(w: float, h: float, d: float) -> BoxMesh:
	var b := BoxMesh.new()
	b.size = Vector3(w, h, d)
	return b


static func sphere(r: float) -> SphereMesh:
	var s := SphereMesh.new()
	s.radius = r
	s.height = r * 2.0
	s.radial_segments = 20
	s.rings = 12
	return s


static func cylinder(r: float, h: float) -> CylinderMesh:
	var c := CylinderMesh.new()
	c.top_radius = r
	c.bottom_radius = r
	c.height = h
	c.radial_segments = 16
	return c


func _build_environment() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color("#f3c98b")
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color.WHITE
	env.ambient_light_energy = 0.3
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)
	var sun := DirectionalLight3D.new()
	sun.light_color = Color("#ffe2b0")
	sun.light_energy = 0.45
	sun.shadow_enabled = true
	sun.directional_shadow_max_distance = 18.0
	add_child(sun)
	sun.look_at_from_position(Vector3(-3, 6, 5), Vector3.ZERO)
	camera = Camera3D.new()
	camera.fov = 50.0
	camera.near = 0.1
	camera.far = 60.0
	add_child(camera)
	camera.position = _cam_pos
	camera.look_at(_look)


func _build_room() -> void:
	# floor, back wall, window, notice board
	_add(box(14, 0.2, 8), Color("#f1e4cc"), Vector3(0, -0.1, 0), false)
	_add(box(14, 4.5, 0.2), Color("#AFC3F0"), Vector3(0, 2.1, -3), false)
	_add(box(1.8, 1.4, 0.1), Color("#ffc46b"), Vector3(-2.6, 2.4, -2.88))
	_add(box(0.08, 1.4, 0.12), Color("#ffffff"), Vector3(-2.6, 2.4, -2.84), false)
	_add(box(0.9, 0.6, 0.08), Color("#e8f3f2"), Vector3(0.4, 3.2, -2.88))
	# bed
	_add(box(2.4, 0.45, 1.05), Color("#8a98a3"), Vector3(0, 0.4, 0))
	_add(box(2.2, 0.22, 0.95), Color("#ffffff"), Vector3(0, 0.74, 0))
	_add(box(0.12, 0.9, 1.05), Color("#6b7a86"), Vector3(-1.25, 0.75, 0))
	_add(box(0.5, 0.12, 0.55), Color("#ffffff"), Vector3(-0.85, 0.9, 0))
	# Mr Amoah: a full figure lying on his back, head on the pillow, facing the nurse's side
	patient = Figure.new()
	patient.outfit = Color("#9ec3e6")       # hospital gown
	patient.trousers = Color("#9ec3e6")
	patient.hair_color = Color("#cfcfd4")
	patient.hair_style = "receding"
	patient.pose = "lie"
	patient.transform = Transform3D(Basis(Vector3(0, 0, -1), Vector3(-1, 0, 0), Vector3(0, 1, 0)) * 1.15, Vector3(1.02, 0.98, 0))
	add_child(patient)
	# blanket over the legs (his arms rest on top of it)
	_add(box(1.2, 0.26, 0.86), Color("#3B6FE0"), Vector3(0.45, 0.98, 0))
	_add(box(0.14, 0.265, 0.865), Color("#ffffff"), Vector3(-0.15, 0.98, 0), false)
	_add(box(0.4, 0.34, 0.86), Color("#3B6FE0"), Vector3(0.88, 1.0, 0))   # tented over his feet
	# tools (shown while in use; they follow his arm, finger and forehead)
	var cuff := _add(cylinder(0.075, 0.14), Color("#d94b4b"), Vector3.ZERO)
	var clip := _add(box(0.06, 0.05, 0.06), Color("#2d5bd6"), Vector3.ZERO)
	var thermo := _add(cylinder(0.018, 0.22), Color("#ffffff"), Vector3.ZERO)
	tools = {"cuff": cuff, "clip": clip, "thermo": thermo}
	for t in tools.values():
		t.visible = false
	# bedside table, monitor, drip stand, feet under the blanket
	_add(box(0.6, 0.8, 0.5), Color("#c89b6a"), Vector3(-1.8, 0.4, 0.8))
	_add(cylinder(0.08, 0.14), Color("#ffffff"), Vector3(-1.8, 0.87, 0.8))
	_add(box(0.5, 0.7, 0.06), Color("#1d2b36"), Vector3(-1.8, 2.1, -2.85))
	_add(cylinder(0.025, 2.2), Color("#b0b8c0"), Vector3(-1.45, 1.1, 0.65))
	_add(sphere(0.14), Color("#dff3ff"), Vector3(-1.45, 2.05, 0.65))
	# sink
	_add(box(1, 0.9, 0.7), Color("#ffffff"), Vector3(3.2, 0.45, -2.4))
	_add(box(0.7, 0.12, 0.5), Color("#b9d6e8"), Vector3(3.2, 0.95, -2.35))
	_add(cylinder(0.04, 0.3), Color("#9aa5ad"), Vector3(3.2, 1.15, -2.6))
	# curtain (slides closed)
	_curtain = _add(box(0.08, 2.6, 2.8), Color("#4C7BE0"), Vector3(2, 1.3, 0))
	var cm: StandardMaterial3D = (_curtain.material_override as StandardMaterial3D).duplicate()
	cm.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	cm.albedo_color.a = 0.92
	_curtain.material_override = cm
	_curtain.scale.z = 0.12


## Extra furniture for a shift (trolley, sharps bin, waiting patients...).
func set_props(props: Array) -> void:
	for c in _props.get_children():
		c.queue_free()
	_people.clear()
	for p in props:
		if String(p["shape"]) == "person":
			_add_person(p)
			continue
		if String(p["shape"]) == "chair":
			_add_chair(p)
			continue
		var pos: Array = p["pos"]
		var at := Vector3(float(pos[0]), float(pos[1]), float(pos[2]))
		var col := Color("#" + String(p["color"]))
		var mesh: Mesh
		match String(p["shape"]):
			"box":
				var s: Array = p["size"]
				mesh = box(float(s[0]), float(s[1]), float(s[2]))
			"sphere":
				mesh = sphere(float(p["radius"]))
			_:
				mesh = cylinder(float(p["radius"]), float(p["height"]))
		_add(mesh, col, at, true, _props)


## A waiting patient: {"shape": "person", "pos": [...], "pose": "stand|clutch_chest|sit|sit_ankle|tripod",
## "color": shirt, "mood", "hair", "skin", "sweat", "bandage", "female", "breath"}.
func _add_person(p: Dictionary) -> void:
	var f := Figure.new()
	f.outfit = Color("#" + String(p.get("color", "3B6FE0")))
	f.pose = String(p.get("pose", "stand"))
	f.mood = String(p.get("mood", "neutral"))
	f.skin = Color("#" + String(p.get("skin", "8a5a3c")))
	f.hair_color = Color("#" + String(p.get("hair", "1a1a1a")))
	f.hair_style = "bun" if bool(p.get("female", false)) else "short"
	f.sweat = bool(p.get("sweat", false))
	f.bandage_ankle = bool(p.get("bandage", false))
	f.breath_rate = float(p.get("breath", 16))
	var pos: Array = p["pos"]
	f.position = Vector3(float(pos[0]), float(pos[1]), float(pos[2]))
	f.rotation.y = float(p.get("turn", 0.0))
	_props.add_child(f)
	_people.append(f)


func _add_chair(p: Dictionary) -> void:
	var pos: Array = p["pos"]
	var at := Vector3(float(pos[0]), float(pos[1]), float(pos[2]))
	var col := Color("#" + String(p.get("color", "6b7a86")))
	_add(box(0.5, 0.06, 0.5), col, at + Vector3(0, 0.39, 0.08), true, _props)   # seat top 0.42: thighs rest on it, never sink in
	_add(box(0.5, 0.55, 0.06), col, at + Vector3(0, 0.72, -0.17), true, _props)
	for x in [-0.21, 0.21]:
		for z in [-0.12, 0.28]:
			_add(cylinder(0.022, 0.42), Color("#9aa5ad"), at + Vector3(x, 0.21, z), false, _props)


## The person standing at a triage spot (for reactions).
func person_near(x: float) -> Figure:
	for f in _people:
		if is_instance_valid(f) and absf((f as Figure).position.x - x) < 0.3:
			return f
	return null


# ------------------------------------------------------------------ hotspots

func clear_hotspots() -> void:
	for h in hotspots.values():
		h.queue_free()
	hotspots.clear()


## `at` is a point in metres, or the name of a place on Mr Amoah's body ("head", "mouth", "forehead",
## "chest", "upper_arm", "forearm", "wrist", "hand", "finger", "shoulder", "feet"), so the dots
## always sit on him.
func add_hotspot(id: String, at: Variant, radius: float = 0.11) -> void:
	var anchor_name := ""
	if at is String:
		anchor_name = String(at)
		at = patient.anchor(anchor_name)
	var m := StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.albedo_color = Color(1.0, 0.784, 0.227, 0.8)
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	m.no_depth_test = true
	m.render_priority = 10
	var mi := MeshInstance3D.new()
	mi.mesh = sphere(radius)
	mi.material_override = m
	mi.position = at
	mi.set_meta("radius", radius)
	mi.set_meta("anchor", anchor_name)   ## dots on his body ride along as he breathes
	add_child(mi)
	hotspots[id] = mi


func show_hotspot(id: String, on: bool) -> void:
	if hotspots.has(id):
		hotspots[id].visible = on


## Which visible hotspot is under this point of the 3D view (generous hit area for fingers).
func pick(screen_pos: Vector2) -> String:
	var origin := camera.project_ray_origin(screen_pos)
	var dir := camera.project_ray_normal(screen_pos)
	var best := ""
	var best_t := INF
	for id in hotspots.keys():
		var h: MeshInstance3D = hotspots[id]
		if not h.visible:
			continue
		var c := h.global_position
		var t := (c - origin).dot(dir)
		if t <= 0.0:
			continue
		var miss := (origin + dir * t).distance_to(c)
		var reach := float(h.get_meta("radius")) * 1.9 + 0.04
		if miss <= reach and t < best_t:
			best_t = t
			best = String(id)
	return best


func set_view(v: Variant) -> void:
	view = v


func show_tool(name: String, on: bool) -> void:
	if not tools.has(name):
		return
	var was: bool = tools[name].visible
	tools[name].visible = on
	if on and not was:
		# the tool is lowered into place and settles with a small bounce
		_tool_drop[name] = [0.22, 0.0]


## A gentle press on a gold dot: the dot squashes, and the body under it gives a little.
func poke(id: String) -> void:
	if _dot_vel.has(id):
		_dot_vel[id] = float(_dot_vel[id]) - 7.0
	if hotspots.has(id):
		var f := _figure_at(hotspots[id].global_position)
		if f:
			# Mr Amoah sinks a little into the mattress; a standing or seated patient sways back
			f.push(Vector3(0, 0, -0.25) if f == patient else Vector3(0, 0, -0.45))


func _figure_at(p: Vector3) -> Figure:
	var best: Figure = null
	var best_d := 0.9
	for f in [patient] + _people:
		if is_instance_valid(f):
			var g := (f as Figure).global_position
			# a standing or seated patient owns the dot above their head; Mr Amoah owns dots on his body
			var d := Vector2(g.x - p.x, g.z - p.z).length() if f != patient else (f as Figure).anchor("chest").distance_to(p)
			if d < best_d:
				best_d = d
				best = f
	return best


# ------------------------------------------------------------------ dragging the camera
# The view follows the finger exactly while dragging. Let go and it keeps turning with the speed
# of the swipe, slowing down with friction. Past the edges it resists (rubber band) and springs back.

const YAW_LIMIT := 1.3
const YAW_FRICTION := 4.5     ## how quickly a fling slows down (per second)
const YAW_EDGE := 40.0        ## spring stiffness pulling back from beyond the edge

var _dragging := false
var _drag_start_yaw := 0.0
var _drag_raw := 0.0          ## where the finger would put the camera, before the rubber band
var _yaw_vel := 0.0
var _vel_sample := 0.0
var _last_drag_yaw := 0.0


func drag_begin() -> void:
	_dragging = true
	_drag_start_yaw = yaw
	_drag_raw = yaw
	_yaw_vel = 0.0
	_vel_sample = 0.0
	_last_drag_yaw = yaw


func drag_to(dx_pixels: float) -> void:
	_drag_raw = _drag_start_yaw + dx_pixels * 0.006
	var over := absf(_drag_raw) - YAW_LIMIT
	if over > 0.0:
		# resistance: the further past the edge, the less it moves
		yaw = signf(_drag_raw) * (YAW_LIMIT + over / (1.0 + over * 3.0) * 0.6)
	else:
		yaw = _drag_raw


func drag_end() -> void:
	_dragging = false
	_yaw_vel = clampf(_vel_sample, -6.0, 6.0)


func _update_yaw(delta: float) -> void:
	var st := Motion.steps(delta)
	var h := float(st[1])
	if _dragging:
		# measure the swipe speed (smoothed so one jumpy event does not fling the camera)
		var inst := (yaw - _last_drag_yaw) / maxf(delta, 0.0001)
		_vel_sample = lerpf(_vel_sample, inst, 1.0 - exp(-delta * 25.0))
		_last_drag_yaw = yaw
		return
	if Style.reduced_motion():
		_yaw_vel = 0.0
		yaw = clampf(yaw, -YAW_LIMIT, YAW_LIMIT)
		return
	for i in int(st[0]):
		var over := absf(yaw) - YAW_LIMIT
		if over > 0.0:
			# past the edge: spring back, critically damped so it never wobbles
			var a := -signf(yaw) * over * YAW_EDGE - _yaw_vel * 2.0 * sqrt(YAW_EDGE)
			_yaw_vel += a * h
		else:
			_yaw_vel *= exp(-YAW_FRICTION * h)
		yaw += _yaw_vel * h
	if absf(_yaw_vel) < 0.002 and absf(yaw) <= YAW_LIMIT:
		_yaw_vel = 0.0


# ------------------------------------------------------------------ animation

var _look_vel := Vector3.ZERO
var _off := Vector3(0.4, 1.5, 5.0)   ## smoothed camera offset from the look point (before turning)
var _off_vel := Vector3.ZERO
var _cam_ready := false
var _curtain_vel := 0.0
var _tool_drop: Dictionary = {}      ## tool -> [height above its place, vertical speed]
var _dot_scale: Dictionary = {}
var _dot_vel: Dictionary = {}
var _last_beat := -1


func _process(delta: float) -> void:
	_t += delta
	var vp_size := get_viewport().get_visible_rect().size
	var aspect := vp_size.x / maxf(vp_size.y, 1.0)
	var v: Array = VIEWS[view] if view is String else view
	var look_at_pt: Vector3 = v[1]
	var o: Vector3 = v[0] - look_at_pt
	if view is String and view == "over":
		o.z *= 1.6 if aspect < 1.0 else 1.0
		if aspect < 1.0:
			o.y += 0.8
	elif aspect < 1.0:
		o *= 1.5  # phones: step back a little for close-ups
	# camera glides between views: it speeds up and slows down smoothly (critically damped spring)
	if not _cam_ready or Style.reduced_motion():
		_cam_ready = true
		_look = look_at_pt
		_off = o
		_look_vel = Vector3.ZERO
		_off_vel = Vector3.ZERO
	else:
		var r := Motion.spring_frame(_look, _look_vel, look_at_pt, 6.5, 1.0, delta)
		_look = r[0]
		_look_vel = r[1]
		r = Motion.spring_frame(_off, _off_vel, o, 6.5, 1.0, delta)
		_off = r[0]
		_off_vel = r[1]
	# turning is applied on top, so dragging stays locked to the finger
	_update_yaw(delta)
	var c := cos(yaw)
	var s := sin(yaw)
	var turned := Vector3(_off.x * c + _off.z * s, _off.y, -_off.x * s + _off.z * c)
	_cam_pos = _look + turned
	camera.position = _cam_pos
	if turned.length() > 0.01:
		camera.look_at(_look)
	# breathing: 16/min at rest, 24/min (his real rate, deeper so it is easy to count) while counting
	patient.breath_rate = 24.0 if breathing_fast else 16.0
	patient.breath_depth = 2.2 if breathing_fast else 1.0
	_place_tools(delta)
	_update_dots(delta)
	_update_curtain(delta)
	smile = maxf(0.0, smile - delta)
	patient.mood = "happy" if smile > 0.0 else ("worried" if dignity < 80.0 else "neutral")


## Gold dots breathe gently, squash when pressed and kick with each heartbeat while counting.
func _update_dots(delta: float) -> void:
	var calm := Style.reduced_motion()
	var beat := int(floor(_t * pulse_rate / 60.0)) if pulse_rate > 0.0 else -1
	var new_beat := beat != _last_beat and beat >= 0
	_last_beat = beat
	for id in hotspots.keys():
		var h: MeshInstance3D = hotspots[id]
		var an := String(h.get_meta("anchor", ""))
		if an != "":
			h.position = patient.anchor(an)
		if not _dot_scale.has(id):
			_dot_scale[id] = 1.0
			_dot_vel[id] = 0.0
		if id == "pulse" and new_beat:
			_dot_vel[id] = float(_dot_vel[id]) + 14.0
		var target := 1.0 if calm else 1.0 + 0.06 * sin(_t * 4.0)
		var r := Motion.spring_frame(float(_dot_scale[id]), float(_dot_vel[id]), target, 22.0, 0.32, delta)
		_dot_scale[id] = clampf(r[0], 0.55, 2.2)
		_dot_vel[id] = r[1]
		var sc: float = _dot_scale[id]
		# squash and stretch keep the volume roughly the same
		h.scale = Vector3(sc, 1.0 / maxf(sc, 0.3) * 0.35 + sc * 0.65, sc)
	for id in _dot_scale.keys():
		if not hotspots.has(id):
			_dot_scale.erase(id)
			_dot_vel.erase(id)


## The curtain is pulled along its rail: it overshoots a touch and the fabric swings.
func _update_curtain(delta: float) -> void:
	var target := 1.0 if curtain_closed else 0.12
	if Style.reduced_motion():
		_curtain.scale.z = target
		_curtain_vel = 0.0
	else:
		var r := Motion.spring_frame(_curtain.scale.z, _curtain_vel, target, 7.0, 0.6, delta)
		_curtain.scale.z = clampf(r[0], 0.1, 1.06)
		_curtain_vel = r[1]
		if _curtain.scale.z >= 1.06 or _curtain.scale.z <= 0.1:
			_curtain_vel *= -0.3   # stops at the end of the rail
	_curtain.position.z = -1.3 * (1.0 - (_curtain.scale.z - 0.12) / 0.88)
	# the hem trails behind the movement and settles
	_curtain.rotation.x = clampf(-_curtain_vel * 0.12, -0.18, 0.18)


func _place_tools(delta: float = 0.0) -> void:
	var j := patient.joints
	if j.is_empty():
		return
	# tools fall the last few centimetres under gravity and bounce to a stop on the skin
	var st := Motion.steps(delta)
	for name in _tool_drop.keys():
		var d: Array = _tool_drop[name]
		for i in int(st[0]):
			d[1] -= 9.8 * float(st[1])
			d[0] += d[1] * float(st[1])
			if d[0] <= 0.0:
				d[0] = 0.0
				d[1] = -d[1] * 0.3 if absf(d[1]) > 0.35 else 0.0
		if Style.reduced_motion() or (d[0] == 0.0 and d[1] == 0.0):
			_tool_drop.erase(name)
		else:
			_tool_drop[name] = d
	var sh: Vector3 = patient.to_global(j["sh_r"])
	var el: Vector3 = patient.to_global(j["el_r"])
	var cuff: MeshInstance3D = tools["cuff"]
	cuff.position = sh.lerp(el, 0.55) + Vector3.UP * _drop("cuff")
	cuff.basis = _along((el - sh).normalized())
	tools["clip"].position = patient.anchor("finger") + Vector3.UP * _drop("clip")
	var th: MeshInstance3D = tools["thermo"]
	th.position = patient.anchor("forehead") + Vector3(0, 0.03, 0.12) + Vector3.UP * _drop("thermo")
	th.basis = _along(Vector3(0.4, 0.2, 1).normalized())


func _drop(name: String) -> float:
	return float(_tool_drop[name][0]) if _tool_drop.has(name) else 0.0


static func _along(up: Vector3) -> Basis:
	var ref := Vector3(0, 0, 1) if absf(up.z) < 0.95 else Vector3(1, 0, 0)
	var x := up.cross(ref).normalized()
	return Basis(x, up, x.cross(up).normalized())


## True when the heart on screen should be "on" (for the pulse-counting game).
func beat_on(rate: float) -> bool:
	return rate > 0.0 and fmod(_t * rate / 60.0, 1.0) < 0.3
