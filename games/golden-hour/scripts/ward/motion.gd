class_name Motion
## Small physics helpers shared by the ward, the people and the tools.
##
## Everything is integrated in fixed sub-steps (at most 1/240 s each), so a spring, a fling or a
## falling tool behaves the same at 30, 60 or 144 frames per second. A long hitch (a slow frame
## or a tab coming back into focus) is capped so nothing ever jumps or explodes.

const MAX_STEP := 1.0 / 240.0
const MAX_FRAME := 0.1


## Split one frame into equal small steps: returns [step count, step length].
static func steps(delta: float) -> Array:
	var dt := clampf(delta, 0.0, MAX_FRAME)
	var n := maxi(1, ceili(dt / MAX_STEP))
	return [n, dt / n]


## One step of a damped spring (semi-implicit Euler). `freq` is the angular frequency
## (higher = snappier), `damping` 1.0 = no overshoot, below 1.0 = a little bounce.
## Returns [new value, new velocity]. Works for float and Vector3.
static func spring(x: Variant, v: Variant, target: Variant, freq: float, damping: float, h: float) -> Array:
	var a: Variant = (target - x) * (freq * freq) - v * (2.0 * damping * freq)
	v = v + a * h
	x = x + v * h
	return [x, v]


## Run a spring for a whole frame (fixed sub-steps inside).
static func spring_frame(x: Variant, v: Variant, target: Variant, freq: float, damping: float, delta: float) -> Array:
	var st := steps(delta)
	var r := [x, v]
	for i in int(st[0]):
		r = spring(r[0], r[1], target, freq, damping, float(st[1]))
	return r
