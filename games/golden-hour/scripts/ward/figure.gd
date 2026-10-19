class_name Figure
extends Node3D
## A stylised 3D person: head with a face, hair, neck, torso, arms (upper arm, forearm, hand) and
## legs (thigh, shin, foot). Joints are solved every frame with two-bone IK, so poses are described
## by where the hands and feet should be. Animated procedurally: breathing, blinking, idle sway,
## nods, head shakes and gestures (clutching the chest, the tripod position for breathlessness...).
## The figure faces +Z with its feet at the origin. Its right side is -X.

const OUTLINE := Color("#10202a")
const UPPER_ARM := 0.29
const FOREARM := 0.26
const THIGH := 0.45
const SHIN := 0.44

var skin := Color("#8a5a3c")
var outfit := Color("#3B6FE0")
var trousers := Color("#2f3b52")
var shoes := Color("#1d2430")
var hair_color := Color("#1a1a1a")
var hair_style := "short"     ## short, bun, receding
var dress := false            ## nurse's dress instead of trousers
var nurse_cap := false
var bandage_ankle := false
var pose := "stand"           ## stand, clutch_chest, sit_ankle, tripod, lie
var mood := "neutral"         ## neutral, happy, worried, pain
var breath_rate := 16.0
var breath_depth := 1.0
var sweat := false
## Lying pose: where the hands rest (figure-local coordinates).
var lie_hand_r := Vector3(-0.30, 0.86, 0.19)
var lie_hand_l := Vector3(0.06, 1.10, 0.20)

var joints: Dictionary = {}   ## last solved joint positions (figure-local)

var _parts: Dictionary = {}
var _head: Node3D
var _eyes: Array = []
var _brows: Array = []
var _mouth: Array = []
var _sweat_drops: Array = []
var _t := 0.0
var _seed := 0.0
var _next_blink := 2.0
var _blink := 0.0
var _talk := 0.0
var _react := ""
var _react_t := 0.0
var _breath_phase := 0.0
var _depth := 1.0
var _push_off := Vector3.ZERO
var _push_vel := Vector3.ZERO
var _head_rot := Vector3.ZERO
var _head_vel := Vector3.ZERO
var _posed := false

static var _mats: Dictionary = {}
static var _outline: StandardMaterial3D


func _ready() -> void:
	_seed = randf() * 10.0
	_next_blink = 1.0 + randf() * 3.0
	_build()
	update_pose(0.0)


# ------------------------------------------------------------------ materials and meshes

static func mat(color: Color, outline: bool = true) -> StandardMaterial3D:
	var key := "%s|%s" % [color.to_html(), outline]
	if _mats.has(key):
		return _mats[key]
	if _outline == null:
		_outline = StandardMaterial3D.new()
		_outline.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		_outline.albedo_color = OUTLINE
		_outline.cull_mode = BaseMaterial3D.CULL_FRONT
		_outline.grow = true
		_outline.grow_amount = 0.012
	var m := StandardMaterial3D.new()
	m.albedo_color = color
	m.roughness = 1.0
	m.metallic_specular = 0.0
	if outline:
		m.next_pass = _outline
	_mats[key] = m
	return m


func _mesh(name: String, mesh: Mesh, color: Color, parent: Node3D = null, outline: bool = true) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	mi.mesh = mesh
	mi.material_override = mat(color, outline)
	(parent if parent else self).add_child(mi)
	if name != "":
		_parts[name] = mi
	return mi


func _capsule(name: String, radius: float, length: float, color: Color) -> MeshInstance3D:
	var c := CapsuleMesh.new()
	c.radius = radius
	c.height = length + radius * 2.0
	c.radial_segments = 14
	c.rings = 6
	return _mesh(name, c, color)


static func _sphere(r: float) -> SphereMesh:
	var s := SphereMesh.new()
	s.radius = r
	s.height = r * 2.0
	s.radial_segments = 18
	s.rings = 10
	return s


static func _box(w: float, h: float, d: float) -> BoxMesh:
	var b := BoxMesh.new()
	b.size = Vector3(w, h, d)
	return b


func _build() -> void:
	var limb_bottom := skin if dress else trousers
	# torso, shoulders, neck
	_capsule("torso", 0.15, 0.40, outfit)
	_capsule("shoulders", 0.075, 0.30, outfit)
	_capsule("neck", 0.045, 0.08, skin)
	if dress:
		var skirt := CylinderMesh.new()
		skirt.top_radius = 0.17
		skirt.bottom_radius = 0.23
		skirt.height = 0.42
		_mesh("skirt", skirt, outfit)
	# arms: short sleeve, upper arm, forearm, hand
	for s in ["l", "r"]:
		_capsule("sleeve_" + s, 0.062, 0.12, outfit)
		_capsule("upper_" + s, 0.05, UPPER_ARM, skin)
		_capsule("fore_" + s, 0.045, FOREARM, skin)
		var hand := _mesh("hand_" + s, _sphere(0.05), skin)
		hand.scale = Vector3(0.8, 1.15, 0.6)
		_capsule("thigh_" + s, 0.075, THIGH, limb_bottom)
		_capsule("shin_" + s, 0.06, SHIN, limb_bottom)
		_mesh("foot_" + s, _box(0.1, 0.07, 0.22), Color("#f4f4f4") if dress else shoes)
	if bandage_ankle:
		var b := CylinderMesh.new()
		b.top_radius = 0.07
		b.bottom_radius = 0.07
		b.height = 0.1
		_mesh("bandage", b, Color("#ffffff"))
	# head and face
	_head = Node3D.new()
	add_child(_head)
	var head := _mesh("head", _sphere(0.115), skin, _head)
	head.scale = Vector3(1.0, 1.12, 1.02)
	for x in [-0.115, 0.115]:
		_mesh("", _sphere(0.026), skin, _head).position = Vector3(x, 0.0, -0.005)
	for x in [-0.042, 0.042]:
		var white := _mesh("", _sphere(0.022), Color.WHITE, _head, false)
		white.position = Vector3(x, 0.02, 0.098)
		white.scale = Vector3(1.0, 1.0, 0.5)
		var pupil := _mesh("", _sphere(0.012), Color("#1b1b1b"), white, false)
		pupil.position = Vector3(0, 0, 0.018)
		pupil.scale = Vector3(1.0, 1.0, 2.0)
		_eyes.append(white)
		var brow := _mesh("", _box(0.045, 0.009, 0.01), hair_color.darkened(0.2), _head, false)
		brow.position = Vector3(x, 0.056, 0.104)
		_brows.append(brow)
	var nose := _mesh("", _sphere(0.019), skin.darkened(0.08), _head, false)
	nose.position = Vector3(0, -0.012, 0.118)
	for i in 3:
		var m := _mesh("", _box(0.026 if i == 1 else 0.022, 0.008, 0.01), Color("#5a2420"), _head, false)
		_mouth.append(m)
	# hair
	if hair_style == "receding":
		var h := _mesh("hair", _sphere(0.121), hair_color, _head)
		h.position = Vector3(0, 0.0, -0.04)
		h.scale = Vector3(1.04, 0.95, 0.9)
	else:
		var h := _mesh("hair", _sphere(0.121), hair_color, _head)
		h.position = Vector3(0, 0.035, -0.012)
		h.scale = Vector3(1.04, 0.78, 1.06)
		if hair_style == "bun":
			_mesh("bun", _sphere(0.055), hair_color, _head).position = Vector3(0, 0.06, -0.12)
	if nurse_cap:
		var cap := _mesh("cap", _box(0.13, 0.05, 0.085), Color.WHITE, _head)
		cap.position = Vector3(0, 0.125, 0.02)
		cap.rotation.x = -0.25
		var c1 := _mesh("", _box(0.03, 0.01, 0.002), Color("#d23a3a"), cap, false)
		c1.position = Vector3(0, 0, 0.044)
		var c2 := _mesh("", _box(0.01, 0.03, 0.002), Color("#d23a3a"), cap, false)
		c2.position = Vector3(0, 0, 0.044)
	if sweat:
		for i in 2:
			var d := _mesh("", _sphere(0.012), Color("#a9dcff"), _head, false)
			d.position = Vector3(-0.05 + i * 0.1, 0.07, 0.09)
			d.scale = Vector3(0.8, 1.3, 0.8)
			_sweat_drops.append(d)


# ------------------------------------------------------------------ public

## Briefly nod ("yes") or shake the head ("no").
func react(kind: String) -> void:
	_react = kind
	_react_t = 0.0


## Give the body a nudge (a speed, in metres per second, in the figure's own directions:
## +Z is the way they face). The body sways with it and springs back.
func push(impulse: Vector3) -> void:
	if Style.reduced_motion():
		return
	_push_vel += impulse


## Move the mouth as if talking for a moment.
func talk(seconds: float = 1.5) -> void:
	_talk = seconds


## A point on the body in world space (for gold dots, tools and camera views).
func anchor(name: String) -> Vector3:
	var p: Vector3
	match name:
		"head": p = joints["head"] + Vector3(0, 0.02, 0.14)
		"forehead": p = joints["head"] + Vector3(0, 0.08, 0.12)
		"mouth": p = joints["head"] + Vector3(0, -0.05, 0.15)
		"chest": p = joints["chest"] + Vector3(0, -0.12, 0.2)
		"upper_arm": p = (joints["sh_r"] + joints["el_r"]) * 0.5 + Vector3(0, 0, 0.08)
		"forearm": p = (joints["el_r"] + joints["wr_r"]) * 0.5 + Vector3(0, 0, 0.07)
		"wrist": p = joints["wr_r"] + Vector3(0, 0, 0.07)
		"hand": p = joints["wr_r"] + (joints["wr_r"] - joints["el_r"]).normalized() * 0.06 + Vector3(0, 0, 0.07)
		"finger": p = joints["wr_r"] + (joints["wr_r"] - joints["el_r"]).normalized() * 0.1 + Vector3(0, 0, 0.06)
		"shoulder": p = joints["sh_r"] + Vector3(-0.04, -0.05, 0.09)
		"feet": p = (joints["an_l"] + joints["an_r"]) * 0.5 + Vector3(0, 0.05, 0.22)
		_: p = joints.get("chest", Vector3.ZERO)
	return to_global(p)


# ------------------------------------------------------------------ animation

func _process(delta: float) -> void:
	update_pose(delta)


static func _ik(root: Vector3, target: Vector3, l1: float, l2: float, pole: Vector3) -> Array:
	var d := target - root
	var dist := clampf(d.length(), 0.02, l1 + l2 - 0.002)
	var dir := d.normalized() if d.length() > 0.0001 else Vector3.DOWN
	var a := (l1 * l1 - l2 * l2 + dist * dist) / (2.0 * dist)
	var h := sqrt(maxf(0.0, l1 * l1 - a * a))
	var p := pole - dir * pole.dot(dir)
	if p.length() < 0.001:
		p = Vector3.FORWARD - dir * Vector3.FORWARD.dot(dir)
	p = p.normalized()
	return [root + dir * a + p * h, root + dir * dist]


func update_pose(delta: float) -> void:
	delta = clampf(delta, 0.0, Motion.MAX_FRAME)
	_t += delta
	var t := _t + _seed
	var calm := Style.reduced_motion()
	# Breathing advances a phase, so changing the rate (16 -> 24 a minute) speeds the breath up
	# smoothly instead of jumping the chest to a new position. The depth eases in too.
	_breath_phase = fmod(_breath_phase + delta * TAU * breath_rate / 60.0, TAU)
	_depth = lerpf(_depth, breath_depth, 1.0 - exp(-delta * 2.5)) if _posed else breath_depth
	var br := sin(_breath_phase + _seed) * _depth
	# a push (being touched) moves the upper body on a soft spring, and it settles back
	if delta > 0.0:
		var pr := Motion.spring_frame(_push_off, _push_vel, Vector3.ZERO, 9.0, 0.35, delta)
		_push_off = (pr[0] as Vector3).limit_length(0.08)
		_push_vel = pr[1]
	var po := _push_off
	var sway := 0.0 if calm else sin(t * 0.9) * 0.012

	var pelvis := Vector3(sway, 0.95, 0)
	var chest := Vector3(sway * 1.5, 1.42 + br * 0.006, 0)
	var head_tilt := Vector3.ZERO  # x = nod down, y = turn, z = roll
	var feet := [Vector3(0.1, 0.07, 0), Vector3(-0.1, 0.07, 0)]   # left, right
	var knee_pole := [Vector3(0, 0, 1), Vector3(0, 0, 1)]
	var hands := [Vector3(0.25, 0.93, 0.04), Vector3(-0.25, 0.93, 0.04)]
	var elbow_pole := [Vector3(0.4, 0, -1), Vector3(-0.4, 0, -1)]
	var shoulder_lift := 0.0
	var hip_y := 0.92

	match pose:
		"stand":
			var swing := 0.0 if calm else sin(t * 0.9) * 0.015
			hands = [Vector3(0.25, 0.93, 0.04 + swing), Vector3(-0.25, 0.93, 0.04 - swing)]
			head_tilt = Vector3(0, sin(t * 0.35) * 0.15, 0)
		"clutch_chest":
			chest = Vector3(sway, 1.39 + br * 0.008, 0.06)
			hands = [Vector3(0.05, 1.27, 0.19), Vector3(-0.02, 1.31, 0.18)]
			elbow_pole = [Vector3(1, -1, 0), Vector3(-1, -1, 0)]
			head_tilt = Vector3(0.1, 0, sin(t * 1.3) * 0.05)
			feet = [Vector3(0.11, 0.07, 0.03), Vector3(-0.11, 0.07, -0.02)]
			pelvis.y = 0.93
		"sit_ankle", "tripod", "sit":
			hip_y = 0.5
			pelvis = Vector3(0, 0.52, -0.02)
			feet = [Vector3(0.13, 0.07, 0.46), Vector3(-0.13, 0.07, 0.47)]
			knee_pole = [Vector3(0, 1, 1), Vector3(0, 1, 1)]
			if pose == "tripod":
				# leaning forward, hands braced on knees, shoulders up: working hard to breathe
				chest = Vector3(0, 0.93 + br * 0.012, 0.2)
				shoulder_lift = 0.035 + br * 0.01
				hands = [Vector3(0.14, 0.56, 0.38), Vector3(-0.14, 0.56, 0.38)]
				elbow_pole = [Vector3(1, 0, -0.3), Vector3(-1, 0, -0.3)]
				head_tilt = Vector3(-0.15, 0, 0)
			elif pose == "sit":
				# upright, a little breathless: hands on the thighs, shoulders rising with each breath
				chest = Vector3(0, 0.98 + br * 0.01, 0.06)
				shoulder_lift = 0.012 + br * 0.008
				hands = [Vector3(0.15, 0.6, 0.3), Vector3(-0.15, 0.6, 0.3)]
				elbow_pole = [Vector3(1, 0, -0.5), Vector3(-1, 0, -0.5)]
				head_tilt = Vector3(0, sin(t * 0.4) * 0.2, 0)
			else:
				chest = Vector3(0, 0.98 + br * 0.005, 0.03)
				hands = [Vector3(-0.03, 0.58, 0.42), Vector3(-0.12, 0.57, 0.38)]
				elbow_pole = [Vector3(1, -0.5, -0.4), Vector3(-1, -0.5, -0.4)]
				head_tilt = Vector3(0.12, 0.25, 0)
		"lie":
			chest = Vector3(0, 1.42, 0.01 + br * 0.012)
			feet = [Vector3(0.1, 0.03, 0.0), Vector3(-0.1, 0.03, 0.0)]
			hands = [lie_hand_l, lie_hand_r]
			elbow_pole = [Vector3(1, 0, 0.3), Vector3(-1, 0, 0.6)]
			head_tilt = Vector3(-0.1, -0.35, 0)

	# the upper body carries the push; the hips follow a little, hands resting on the body ride along
	chest += po
	pelvis += po * 0.3
	match pose:
		"clutch_chest":
			hands = [hands[0] + po, hands[1] + po]
		"lie":
			hands = [hands[0] + po, hands[1] + po * 0.4]
	# the head lags behind the body (whiplash), so a push makes it nod the other way
	head_tilt.x += clampf(-_push_vel.z * 0.5, -0.25, 0.25)

	# reactions
	if _react != "":
		_react_t += delta
		var k := clampf(1.0 - _react_t / 1.1, 0.0, 1.0)
		if _react == "yes":
			head_tilt.x += sin(_react_t * 14.0) * 0.22 * k
		elif _react == "no":
			head_tilt.y += sin(_react_t * 16.0) * 0.3 * k
		if _react_t > 1.1:
			_react = ""

	var neck := chest + Vector3(0, 0.07, 0)
	var head := neck + Vector3(0, 0.15, 0.0)
	if pose == "lie":
		head = Vector3(0, 1.63, 0.08) + po * 0.6
	var sh_l := chest + Vector3(0.19, -0.02 + shoulder_lift, 0)
	var sh_r := chest + Vector3(-0.19, -0.02 + shoulder_lift, 0)
	var hip_l := Vector3(pelvis.x + 0.09, hip_y, pelvis.z)
	var hip_r := Vector3(pelvis.x - 0.09, hip_y, pelvis.z)
	var arm_l := _ik(sh_l, hands[0], UPPER_ARM, FOREARM, elbow_pole[0])
	var arm_r := _ik(sh_r, hands[1], UPPER_ARM, FOREARM, elbow_pole[1])
	var leg_l := _ik(hip_l, feet[0], THIGH, SHIN, knee_pole[0])
	var leg_r := _ik(hip_r, feet[1], THIGH, SHIN, knee_pole[1])
	joints = {"pelvis": pelvis, "chest": chest, "neck": neck, "head": head, "sh_l": sh_l, "sh_r": sh_r,
		"el_l": arm_l[0], "wr_l": arm_l[1], "el_r": arm_r[0], "wr_r": arm_r[1],
		"hip_l": hip_l, "hip_r": hip_r, "kn_l": leg_l[0], "an_l": leg_l[1], "kn_r": leg_r[0], "an_r": leg_r[1]}

	_seg("torso", pelvis + Vector3(0, 0.02, 0), chest - Vector3(0, 0.02, 0), Vector3(1.12, 1, 0.72))
	_seg("shoulders", sh_r, sh_l, Vector3.ONE)
	_seg("neck", chest + Vector3(0, 0.04, 0), head - Vector3(0, 0.09, 0), Vector3.ONE)
	if _parts.has("skirt"):
		_seg("skirt", pelvis + Vector3(0, 0.05, 0), pelvis - Vector3(0, 0.37, 0), Vector3.ONE)
	for side in ["l", "r"]:
		var sh: Vector3 = joints["sh_" + side]
		var el: Vector3 = joints["el_" + side]
		var wr: Vector3 = joints["wr_" + side]
		_seg("upper_" + side, sh, el, Vector3.ONE)
		_seg("sleeve_" + side, sh, sh.lerp(el, 0.45), Vector3.ONE)
		_seg("fore_" + side, el, wr, Vector3.ONE)
		var hand: MeshInstance3D = _parts["hand_" + side]
		var dir := (wr - el).normalized()
		hand.position = wr + dir * 0.05
		hand.basis = _basis_along(dir, Vector3(0.8, 1.15, 0.6))
		var hip: Vector3 = joints["hip_" + side]
		var kn: Vector3 = joints["kn_" + side]
		var an: Vector3 = joints["an_" + side]
		_seg("thigh_" + side, hip, kn, Vector3.ONE)
		_seg("shin_" + side, kn, an, Vector3.ONE)
		var foot: MeshInstance3D = _parts["foot_" + side]
		foot.position = an + Vector3(0, -0.03, 0.06)
		foot.basis = Basis()
		if side == "r" and _parts.has("bandage"):
			_parts["bandage"].position = an + Vector3(0, 0.03, 0)

	# head, face
	_head.position = head
	# the head turns with weight: it accelerates and settles instead of snapping to a new angle
	if not _posed or calm:
		_head_rot = head_tilt
		_head_vel = Vector3.ZERO
	elif delta > 0.0:
		var hr := Motion.spring_frame(_head_rot, _head_vel, head_tilt, 24.0, 0.75, delta)
		_head_rot = hr[0]
		_head_vel = hr[1]
	_head.rotation = _head_rot
	_posed = true
	_animate_face(delta, br)


func _basis_along(up: Vector3, sc: Vector3) -> Basis:
	var ref := Vector3(0, 0, 1) if absf(up.dot(Vector3(0, 0, 1))) < 0.95 else Vector3(1, 0, 0)
	var x := up.cross(ref).normalized()
	var z := x.cross(up).normalized()
	return Basis(x * sc.x, up * sc.y, z * sc.z)


func _seg(name: String, a: Vector3, b: Vector3, sc: Vector3) -> void:
	var mi: MeshInstance3D = _parts.get(name)
	if mi == null:
		return
	var d := b - a
	var len := d.length()
	if len < 0.0001:
		return
	mi.position = (a + b) * 0.5
	# capsules are built for a fixed bone length; stretch slightly when the gap differs (torso, neck)
	var mesh_len := 0.0
	if mi.mesh is CapsuleMesh:
		var c: CapsuleMesh = mi.mesh
		mesh_len = c.height - c.radius * 2.0
	elif mi.mesh is CylinderMesh:
		mesh_len = (mi.mesh as CylinderMesh).height
	var stretch := len / mesh_len if mesh_len > 0.0 else 1.0
	mi.basis = _basis_along(d / len, Vector3(sc.x, sc.y * clampf(stretch, 0.6, 1.6), sc.z))


func _animate_face(delta: float, br: float) -> void:
	# blinking
	_next_blink -= delta
	if _next_blink <= 0.0:
		_blink = 0.14
		_next_blink = 2.0 + randf() * 3.5
	_blink = maxf(0.0, _blink - delta)
	for e in _eyes:
		(e as MeshInstance3D).scale.y = 0.12 if _blink > 0.0 else 1.0
	# mouth shape from mood; talking or breathless opens it
	var side_y := 0.0
	var side_rot := 0.0
	var open := 1.0
	match mood:
		"happy":
			side_y = 0.006
			side_rot = 0.5
		"worried":
			side_y = -0.005
			side_rot = -0.35
		"pain":
			side_y = -0.008
			side_rot = -0.55
			open = 1.8
	if _talk > 0.0:
		_talk -= delta
		open = 1.0 + absf(sin(_t * 18.0)) * 2.4
	if pose == "tripod":
		open = 2.2 + br * 0.6
	elif pose == "sit" and _talk <= 0.0:
		open = 1.5 + br * 0.4
	var c: MeshInstance3D = _mouth[1]
	c.position = Vector3(0, -0.058, 0.106)
	c.scale = Vector3(1, open, 1)
	for i in [0, 2]:
		var s := -1.0 if i == 0 else 1.0
		var m: MeshInstance3D = _mouth[i]
		m.position = Vector3(s * 0.022, -0.058 + side_y, 0.103)
		m.rotation.z = s * side_rot
	# eyebrows
	for i in _brows.size():
		var s := -1.0 if i == 0 else 1.0
		var b: MeshInstance3D = _brows[i]
		var r := 0.0
		if mood == "pain" or mood == "worried":
			r = -s * 0.35
		elif mood == "happy":
			r = s * 0.12
		b.rotation.z = r
	for i in _sweat_drops.size():
		var d: MeshInstance3D = _sweat_drops[i]
		d.position.y = 0.07 - fmod(_t * 0.05 + i * 0.5, 0.08)
