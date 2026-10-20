# Pathway Lab (Godot 4.7)

Put 70 biochemistry, physiology, anatomy and immunology pathways back together.
Content: `data/pathways.json`, taken unchanged from the Pathway Lab HTML prototype.

- **Learn it first**: walk through a pathway one step at a time.
- **Fill the gaps**: drag (or tap, then tap) the missing pieces onto the line; decoys come from other pathways.
- **Arrange the order**: put the shuffled steps back in sequence, then Check order.
- Relaxed (no clock), Standard (3:00, the original rules) and Expert (2:00, more gaps).
- Combos, stars, best scores, a daily pathway with a streak, and practice on the steps you miss.

Rules: `scripts/core/pathway_round.gd` (checked by `tests/logic.tscn` for every pathway).
Web build: export the "Web" preset; it writes `public/game-builds/pathway-lab/` in GRATEAPEX.
