class_name Scramble
extends RefCounted


## Returns the letters of `word` in a shuffled order that differs from the original.
static func shuffle(word: String, rng: RandomNumberGenerator) -> Array:
	var arr: Array = []
	for ch in word:
		arr.append(ch)
	if arr.size() < 2:
		return arr
	for attempt in 10:
		for i in range(arr.size() - 1, 0, -1):
			var j := rng.randi_range(0, i)
			var tmp: Variant = arr[i]
			arr[i] = arr[j]
			arr[j] = tmp
		if "".join(PackedStringArray(arr)) != word:
			break
	return arr
