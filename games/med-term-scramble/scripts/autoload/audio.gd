extends Node
## Synthesised sound effects and a soft ambient music loop, so the game ships with no audio files.
## To use real recordings later, put .ogg/.wav files in res://audio and load them in _ready().

const RATE := 22050

## Each sound effect as [segments, volume, soft_square] (see _synth).
const SOUNDS := {
	"click": [[[880, 880, 0.04]], 0.10],
	"letter": [[[620, 700, 0.05]], 0.12],
	"back": [[[520, 440, 0.05]], 0.10],
	"correct": [[[523, 523, 0.08], [784, 784, 0.09], [1047, 1047, 0.16]], 0.16],
	"wrong": [[[220, 180, 0.12], [165, 150, 0.16]], 0.15, true],
	"timeout": [[[330, 260, 0.18], [196, 180, 0.28]], 0.14, true],
	"tick": [[[1320, 1320, 0.025]], 0.06],
	"streak": [[[523, 523, 0.07], [659, 659, 0.07], [784, 784, 0.07], [1047, 1047, 0.22]], 0.16],
	"start": [[[392, 392, 0.09], [523, 523, 0.09], [784, 784, 0.2]], 0.14],
	"results": [[[523, 523, 0.12], [659, 659, 0.12], [784, 784, 0.12], [1047, 1319, 0.35]], 0.14],
	"rush": [[[660, 990, 0.12]], 0.12],
}


var _sounds: Dictionary = {}
var _players: Array[AudioStreamPlayer] = []
var _music: AudioStreamPlayer


func _ready() -> void:
	for i in 6:
		var p := AudioStreamPlayer.new()
		add_child(p)
		_players.append(p)
	_music = AudioStreamPlayer.new()
	add_child(_music)
	_prepare()


## Making the sounds takes a moment (seconds on a phone in the browser), so it
## happens after the first screen is showing, a little each frame, instead of
## holding up the start of the game.
func _prepare() -> void:
	await get_tree().process_frame
	await get_tree().process_frame
	for sound in SOUNDS:
		_sound(sound)
		await get_tree().process_frame
	_music.stream = await _make_music()
	apply_settings()


## The sound, made now if it has not been made yet.
func _sound(sound: String) -> AudioStream:
	if not _sounds.has(sound) and SOUNDS.has(sound):
		var spec: Array = SOUNDS[sound]
		_sounds[sound] = _synth(spec[0], spec[1], spec.size() > 2 and bool(spec[2]))
	return _sounds.get(sound)


func play(sound: String) -> void:
	if not bool(SaveData.settings.get("sfx", true)):
		return
	var s: AudioStream = _sound(sound)
	if s == null:
		return
	var vol := linear_to_db(maxf(0.001, float(SaveData.settings.get("volume", 0.8))))
	for p in _players:
		if not p.playing:
			p.stream = s
			p.volume_db = vol
			p.play()
			return
	_players[0].stream = s
	_players[0].volume_db = vol
	_players[0].play()


func apply_settings() -> void:
	if _music.stream == null:
		return  # Still being made; _prepare() applies the settings when it is ready.
	var on := bool(SaveData.settings.get("music", true))
	_music.volume_db = linear_to_db(maxf(0.001, float(SaveData.settings.get("music_volume", 0.4)) * float(SaveData.settings.get("volume", 0.8))))
	if on and not _music.playing:
		_music.play()
	elif not on and _music.playing:
		_music.stop()


## segments: [[start_hz, end_hz, seconds], ...] played back to back with a soft envelope.
func _synth(segments: Array, amp: float, soft_square: bool = false) -> AudioStreamWAV:
	var total := 0
	for seg in segments:
		total += int(float(seg[2]) * RATE)
	var bytes := PackedByteArray()
	bytes.resize(total * 2)
	var offset := 0
	var phase := 0.0
	for seg in segments:
		var n := int(float(seg[2]) * RATE)
		var f0 := float(seg[0])
		var f1 := float(seg[1])
		for i in n:
			var t := float(i) / float(n)
			phase += TAU * lerpf(f0, f1, t) / RATE
			var attack := minf(1.0, float(i) / (0.004 * RATE))
			var env := attack * pow(1.0 - t, 1.6)
			var v := sin(phase) + 0.25 * sin(phase * 2.0)
			if soft_square:
				v = clampf(v * 1.6, -1.0, 1.0)
			bytes.encode_s16(offset, int(clampf(v * amp * env, -1.0, 1.0) * 32767.0))
			offset += 2
	return _wav(bytes, false, 0)


func _make_music() -> AudioStreamWAV:
	# Slow, quiet pad: Am - F - C - G, 2.4 s per chord.
	var chords := [[220.0, 261.63, 329.63], [174.61, 220.0, 261.63], [196.0, 261.63, 329.63], [196.0, 246.94, 293.66]]
	var per := int(2.4 * RATE)
	var total := per * chords.size()
	var bytes := PackedByteArray()
	bytes.resize(total * 2)
	var offset := 0
	for c in chords:
		for i in per:
			if i % 8192 == 0:
				await get_tree().process_frame  # a small piece per frame, so the game keeps running
			var t := float(i) / float(per)
			var env := sin(PI * t)
			var time := float(i) / RATE
			var v := 0.0
			for f in c:
				v += sin(TAU * float(f) * time) + 0.3 * sin(TAU * float(f) * 2.0 * time)
			bytes.encode_s16(offset, int(clampf(v * 0.06 * env, -1.0, 1.0) * 32767.0))
			offset += 2
	return _wav(bytes, true, total)


func _wav(bytes: PackedByteArray, loop: bool, frames: int) -> AudioStreamWAV:
	var w := AudioStreamWAV.new()
	w.format = AudioStreamWAV.FORMAT_16_BITS
	w.mix_rate = RATE
	w.stereo = false
	w.data = bytes
	if loop:
		w.loop_mode = AudioStreamWAV.LOOP_FORWARD
		w.loop_begin = 0
		w.loop_end = frames
	return w
