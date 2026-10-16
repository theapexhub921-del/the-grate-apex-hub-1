# Anatomy model credits

## Source

The 3D anatomy models in this viewer come from the **Z-Anatomy** project
(https://github.com/LluisV/Z-Anatomy). Z-Anatomy is itself derived from **BodyParts3D**.

## Licence

The models are licensed under the **Creative Commons Attribution-ShareAlike 4.0 International** licence
(CC BY-SA 4.0): https://creativecommons.org/licenses/by-sa/4.0/

You must give appropriate credit, link to the licence, and indicate if changes were made. If you adapt the
models, you must distribute your contributions under the same licence. See the licence text for the full terms.

## Changes made to the original models

- Converted from FBX to glTF (GLB) and compressed with Meshopt.
- Removed label and leader-line helper meshes and unused texture coordinates.
- Provided a lighter copy for phones, simplified to about half the triangle count (`lite/` folder).
- Added landmark data (`landmarks.json`) recording which structure each landmark belongs to.
- Colours and lighting are applied by the viewer at runtime and are not part of the model files.

The modified model files (`*.glb`, including those in `lite/`) and `landmarks.json` are shared under the same
CC BY-SA 4.0 licence.

## Suggested text for an in-app credits screen

> 3D anatomy models: Z-Anatomy (github.com/LluisV/Z-Anatomy), derived from BodyParts3D, licensed under
> CC BY-SA 4.0 (creativecommons.org/licenses/by-sa/4.0). The models were converted, compressed and simplified
> for this app, and landmark data was added. The modified models are shared under the same licence.

## Female reproductive organs

The uterus, ovaries and fallopian tubes (`reproductive/*.glb`) are 3D reference objects from the HuBMAP Human
Reference Atlas (CCF 3D Reference Object Library), built from the Visible Human Female dataset provided by the
National Library of Medicine. The uterus and ovary objects are listed on NIH 3D (uterus 3DPX-020996, ovaries
3DPX-020979 and 3DPX-020980) under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/

These files are used here with their positions and names changed for this viewer: each organ was offset into the
pelvis and its name converted to the viewer's label format. Attribution text: "Female reproductive organs: HuBMAP
Human Reference Atlas 3D reference objects (Visible Human Female, National Library of Medicine), CC BY 4.0."

## Vagina and ligaments

`reproductive/vagina-ligaments.glb` contains the vagina and the uterine, ovarian and broad ligaments, extracted from the
HuBMAP Human Reference Atlas female united reference set (Visible Human Female, National Library of Medicine), CC BY 4.0.

## Female pelvic bones

`reproductive/pelvis-bones.glb` contains the sacrum, coccyx and iliac parts of the hip bones, extracted from the same
HuBMAP Human Reference Atlas female reference set (Visible Human Female), CC BY 4.0.

## Female pelvic bones

`reproductive/pelvis-bones.glb` (sacrum, coccyx and ilium) is extracted from the HuBMAP Human Reference Atlas female
united reference set (Visible Human Female, National Library of Medicine), CC BY 4.0. It replaces the skeleton's
pelvic bones when the Female pelvis option is selected.

The female pelvis option now uses only the female sacrum and coccyx from that file; the male hip bones are kept in both
modes because the female reference set doesn't provide separate hip bones.