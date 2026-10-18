class_name Scoring
extends RefCounted
## Deterministic scoring: base (by difficulty) + speed bonus + streak bonus + one-off combo milestones.

const BASE: Array[int] = [100, 150, 220, 300]
const TIME: Array[float] = [24.0, 21.0, 18.0, 16.0]
const RUSH_BONUS := 120
const RUSH_TIME := 9.0
const MILESTONES := {3: 100, 5: 250, 10: 600}


static func time_limit(difficulty: int, length: int) -> float:
	return TIME[clampi(difficulty, 1, 4) - 1] + maxf(0.0, float(length - 8)) * 0.8


static func streak_rate(streak: int) -> float:
	if streak >= 10:
		return 0.5
	if streak >= 5:
		return 0.3
	if streak >= 3:
		return 0.15
	return 0.0


static func score(difficulty: int, time_left: float, limit: float, streak_after: int) -> Dictionary:
	var base := BASE[clampi(difficulty, 1, 4) - 1]
	var speed := int(round(base * 0.6 * clampf(time_left / maxf(limit, 0.01), 0.0, 1.0)))
	var streak_bonus := int(round(base * streak_rate(streak_after)))
	var milestone := int(MILESTONES.get(streak_after, 0))
	if streak_after > 10 and streak_after % 10 == 0:
		milestone = MILESTONES[10]
	return {"base": base, "speed": speed, "streak": streak_bonus, "milestone": milestone,
		"total": base + speed + streak_bonus + milestone}
