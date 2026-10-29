import type { Teaching } from '@/data/teaching/types';

export const teaching: Teaching = {
  'oxygen-carriers-1': {
    0: [
      'Oxygen dissolves poorly in water, so plasma alone could carry only a tiny fraction of what the body needs. Animals solve this with oxygen-binding proteins. Two of them are studied together because they are so similar in structure and yet so different in behaviour: myoglobin and haemoglobin.',
      'Myoglobin is found in muscle, especially red muscle such as the heart and muscles used for sustained activity. It is a single protein chain and acts as an oxygen store inside the muscle cell, releasing oxygen when the cell’s supply runs low, and it helps oxygen move through the cell to the mitochondria.',
      'Haemoglobin, in red blood cells, is a transport protein: it collects oxygen in the lungs and delivers it to the tissues. It also carries carbon dioxide and hydrogen ions, and these affect how strongly it binds oxygen, whereas they hardly affect myoglobin. Both proteins bind oxygen through the same non-protein group, haem, so the differences between them must come from their protein parts. Understanding these differences explains how blood delivers oxygen so efficiently.',
    ],
    1: [
      'The oxygen-binding site of both proteins is the iron atom at the centre of haem. The iron is held by the four nitrogen atoms of the porphyrin ring, which lie in a plane around it. Iron can form six bonds altogether, so it has two more positions available, one on each side of the ring, called the fifth and sixth coordination positions.',
      'Iron can be in two oxidation states. In the ferrous state (Fe²⁺), it can bind oxygen reversibly. In the ferric state (Fe³⁺), it cannot. The names of the proteins follow the state of their iron: haemoglobin with ferrous iron is ferrohaemoglobin, and with ferric iron, ferrihaemoglobin, better known as methaemoglobin. Myoglobin is named the same way: ferromyoglobin and ferrimyoglobin.',
      'So a central job of the protein is to keep the iron in the ferrous state, as the next lesson explains. If too much haemoglobin becomes methaemoglobin, the blood carries less oxygen and the patient may look blue.',
    ],
    2: [
      'Myoglobin was the first protein whose three-dimensional structure was worked out, by X-ray crystallography. It is a compact, roughly globular molecule, and most of its chain, about three-quarters, is folded into α-helices. There are eight of them, labelled A to H in order from the start of the chain.',
      'Residues are named by their position in these helices. So A1 is the opening residue of helix A, A2 follows it, and the numbering carries on along each helix. Stretches between helices are named after the two helices they connect, so the stretch between C and D is CD, and its first residue CD1. The few residues before helix A are NA, and those after helix H are HC.',
      'This system is very useful because the same naming can be used for myoglobin and for the chains of haemoglobin from any species, even though their exact sequences and lengths differ. A residue with the same name, such as F8, occupies the same position in the folded structure, so it can be compared directly.',
    ],
    3: [
      'Why does an α-helix stop where it does? This is not fully understood, but some residues are known to break helices. The best known is proline. Proline’s side chain loops back and joins its own backbone nitrogen, forming a rigid five-membered ring. This ring prevents the backbone from twisting into the helical shape and removes the hydrogen that would normally form a hydrogen bond in the helix. So proline does not fit inside a helix and is found only at its ends.',
      'Proline cannot explain everything, though: myoglobin has eight helices but only four prolines. Other factors must also end helices. One example is the side chain of serine or threonine, whose hydroxyl group can form a hydrogen bond with a backbone carbonyl group, taking the place of the bond that would continue the helix and so terminating it.',
    ],
    4: [
      'The way a protein folds is largely determined by which amino acids want to avoid water. Myoglobin shows this principle beautifully. Its interior consists almost entirely of nonpolar residues, such as leucine, valine, methionine and phenylalanine, which pack together away from the surrounding water. Its surface carries both polar and nonpolar residues.',
      'Charged residues (glutamate, aspartate, lysine and arginine) and residues with polar amide groups (glutamine and asparagine) are not found inside the molecule; their charges and polar groups need to interact with water. Residues that have both a polar and a nonpolar part, such as threonine, tyrosine and tryptophan, are oriented so that their nonpolar part faces inwards and their polar part outwards.',
      'There are only two polar residues in the interior: two histidines. Their presence in this water-free pocket is a clue that they must have a special role, and indeed they form the oxygen-binding site, around the haem.',
    ],
  },
  'oxygen-carriers-2': {
    0: [
      'The haem sits in a pocket of the protein, between helices E and F, and two histidines line this pocket on either side of the haem plane. They have very different roles.',
      'The proximal histidine, F8, is bonded directly to the iron, occupying its fifth coordination position. This is the only bond holding the haem to the protein. Without oxygen, the iron sits slightly out of the plane of the ring, pulled towards this histidine.',
      'On the opposite side of the haem, the sixth coordination position is where oxygen binds. The distal histidine, E7, lies nearby on this side but is not bonded to the iron. It shapes the space where oxygen binds: it forms a hydrogen bond with the bound oxygen, stabilising it, and, as we will see, it protects the iron from oxidation and makes it harder for carbon monoxide to bind.',
    ],
    1: [
      'Haem on its own cannot be a useful oxygen carrier. If free haem is placed in water, it binds oxygen only for a moment before its iron is oxidised to the ferric state, forming methaem, which cannot bind oxygen. This happens because two haem molecules can come together with an oxygen molecule sandwiched between them (haem–O₂–haem), and in this arrangement an electron is transferred from the iron, oxidising it.',
      'In myoglobin and haemoglobin, the haem is buried in a pocket of the protein, and the distal histidine and other residues around the oxygen-binding site physically prevent a second haem from approaching. The sandwich cannot form, so the iron is protected from oxidation and stays in the ferrous state.',
      'This is a good example of why proteins matter: the protein chain does not bind oxygen itself, but it provides a sheltered environment that lets the haem bind oxygen reversibly, over and over, for the whole life of the molecule.',
    ],
    2: [
      'Carbon monoxide is dangerous because it binds haem iron much more tightly than oxygen does. Free haem in solution binds carbon monoxide about twenty-five thousand times more strongly than oxygen. If the same were true in the body, the small amounts of carbon monoxide that we make ourselves, from breaking down haem, would block a large fraction of our haemoglobin.',
      'In myoglobin and haemoglobin, the preference for carbon monoxide is reduced to about two hundred times. The reason is geometry. Carbon monoxide prefers to bind with the iron, carbon and oxygen atoms in a straight line, standing straight up from the haem. Oxygen naturally binds at an angle. In the protein, the distal histidine sits right above the iron, so there is no room for carbon monoxide to stand straight up; it is forced to bind at an angle, which weakens its bond. Oxygen, which binds at an angle anyway, is not affected.',
      'This protection is not complete, which is why carbon monoxide poisoning is still dangerous, but without it even our own carbon monoxide would be poisonous.',
    ],
    3: [
      'Comparing the sequences of haemoglobin chains from many different species is a powerful way of discovering which residues matter. Over millions of years of evolution, most positions have changed from species to species, showing they are not critical. But a few positions have the same amino acid in all or nearly all species. These conserved residues must be essential, because any change to them would have been harmful and eliminated.',
      'Several of the conserved residues are at the oxygen-binding site: the proximal histidine F8, which holds the iron; the distal histidine E7, which shapes the oxygen site; and phenylalanine CD1 and leucine F4, which contact the haem and help hold it in its pocket.',
      'Others are needed for the structure. Glycine B6 is conserved because helices B and E cross each other at this point, so close together that there is no room for a side chain larger than glycine’s single hydrogen. Proline C2 terminates a helix, and tyrosine HC2 forms a bond linking helices H and F. Two others, threonine C4 and lysine H10, are conserved for reasons that are not yet clear.',
    ],
  },
  'oxygen-carriers-3': {
    0: [
      'Haemoglobin is built from four protein chains, each folded much like a myoglobin molecule and each carrying its own haem. In normal adult haemoglobin (haemoglobin A), there are two α chains and two β chains, written α₂β₂. The α chains have 141 amino acids and the β chains 146.',
      'The four chains pack together into a roughly spherical molecule. The four haems sit in pockets near the surface, quite far apart from each other. Each α chain is in contact with both β chains.',
      'Although each chain could bind oxygen on its own, the fact that four are packed together is what gives haemoglobin its special properties. As we will see, the chains influence each other, so binding oxygen to one changes how the others behave. This is what makes haemoglobin so much better than myoglobin at delivering oxygen.',
    ],
    1: [
      'An allosteric protein is one in which the binding of a molecule at one site affects a different, distant site on the protein. The word means "other shape": the bound molecule changes the protein’s shape, and this shape change is transmitted to the other site.',
      'Haemoglobin is the classic allosteric protein. Besides oxygen, it carries hydrogen ions and carbon dioxide, and it binds 2,3-bisphosphoglycerate (2,3-BPG, also called 2,3-DPG), an organic phosphate made in red cells. None of these binds at the haem, yet each changes how strongly the haems bind oxygen.',
      'Oxygen itself acts allosterically on haemoglobin too: binding oxygen to one haem changes the affinity of the other haems. These allosteric effects let haemoglobin respond to the conditions in the tissues, releasing oxygen where it is most needed.',
    ],
    2: [
      'Haemoglobin exists in two main shapes. Deoxyhaemoglobin, without oxygen, has a tense (T) shape, held together by many bonds between the chains: hydrogen bonds, salt bridges (attractions between oppositely charged groups) and other weak forces. The T shape has a low affinity for oxygen. Oxyhaemoglobin has a relaxed (R) shape, in which many of those bonds have been broken; the R shape has a high affinity for oxygen.',
      'The contacts between the chains are of two kinds. The contact between α₁ and β₁ (and α₂ and β₂) is large and changes little: it holds each αβ pair together. The contact between α₁ and β₂ is where the shape change happens. When oxygen binds, the two αβ pairs rotate relative to each other, and at this interface they slide across one another.',
      'The interface is shaped like interlocking teeth (dovetailed), so it can only exist in two positions. In the T form, a tyrosine on α₁ forms a hydrogen bond with an aspartate on β₂; in the R form, these bonds are broken, and a different pair forms instead, an aspartate on α₁ with an asparagine on β₂. The molecule snaps between the two positions, with no stable halfway state.',
      'When oxygen binds to the iron, the iron moves into the plane of the haem, pulling the proximal histidine and its helix with it. This movement is passed on to the interfaces between the chains, breaking the salt bridges that held the T state together and pushing the whole molecule towards the R state.',
    ],
    3: [
      'Myoglobin and haemoglobin both bind oxygen at a haem, but they behave very differently, and the difference comes from haemoglobin’s four chains.',
      'Haemoglobin binds oxygen cooperatively: binding the first oxygen makes it easier to bind the next. The first oxygen has to bind to the T state, which has a low affinity and is held together by many bonds. Breaking those bonds costs energy, so the first oxygen binds weakly. But each oxygen that binds breaks some of the bonds and pushes the molecule towards the high-affinity R state, so the later oxygens bind more easily. Myoglobin, a single chain, shows no cooperativity.',
      'Haemoglobin is also affected by pH and carbon dioxide, and regulated by 2,3-BPG, because all three stabilise its T state. Myoglobin is not affected by any of these. These differences suit their roles: myoglobin stores oxygen and holds it until the cell is very short, while haemoglobin must load oxygen in the lungs and unload it in the tissues.',
    ],
    4: [
      'The oxygen dissociation curve shows how the fraction of binding sites occupied by oxygen (the saturation) depends on the partial pressure of oxygen. It is the best way to see the difference between myoglobin and haemoglobin.',
      'Myoglobin’s curve is hyperbolic: it rises steeply even at very low oxygen pressures and then levels off. Its P50, the pressure at which half the sites are occupied, is about 1 torr, very low, meaning myoglobin has a very high affinity for oxygen. Haemoglobin’s curve is sigmoid (S-shaped), because of cooperativity, and lies to the right, with a P50 of about 26 torr.',
      'Now consider the oxygen pressures in the body: about 100 torr in the lungs and about 20 torr in the capillaries of working muscle. Myoglobin would be almost fully saturated at both pressures, so it would pick up oxygen in the lungs but release almost none in the tissues. Haemoglobin is nearly saturated at 100 torr, but at 20 torr it is much less saturated, so it releases a large part of its oxygen. Its P50 lies between the two pressures, on the steep part of the curve, which is exactly what is needed for loading in the lungs and unloading in the tissues.',
      'Myoglobin, in turn, has a higher affinity than haemoglobin at every pressure, so it can take oxygen from haemoglobin in the muscle capillaries and hold it for the muscle’s use.',
    ],
  },
  'oxygen-carriers-4': {
    0: [
      'Haemoglobin’s affinity for oxygen depends on the acidity and carbon dioxide level of its surroundings. A fall in pH (more hydrogen ions) or a rise in carbon dioxide shifts the dissociation curve to the right, meaning haemoglobin binds oxygen less strongly. This is the Bohr effect. Myoglobin shows no such effect.',
      'This is exactly what the body needs. Active tissues produce carbon dioxide and acid, so the blood in their capillaries has a low pH and a high carbon dioxide level. There, the curve shifts to the right and haemoglobin releases more oxygen, so the tissues working hardest automatically receive more oxygen.',
      'In the lungs, carbon dioxide is breathed out, so its level falls and the pH rises. The curve shifts to the left, and haemoglobin’s affinity increases, so it loads oxygen more completely. The reverse relationship, in which binding oxygen makes haemoglobin release hydrogen ions and carbon dioxide, is the Haldane effect. Together, they mean that oxygen and carbon dioxide help each other to be exchanged in both the lungs and the tissues.',
    ],
    1: [
      'The Bohr effect works because certain chemical groups on haemoglobin can pick up or release hydrogen ions, and their tendency to do so depends on whether haemoglobin is in the T or R state. In the T state (deoxyhaemoglobin), these groups bind hydrogen ions more strongly, because they form salt bridges that stabilise the T state.',
      'Not every group that can bind hydrogen ions contributes. Groups that are too basic bind hydrogen ions so strongly that they stay protonated even in the lungs, so they never release them. Groups that are too acidic never bind hydrogen ions at all, even in the tissues.',
      'Only groups whose binding strength lies in just the right range can bind hydrogen ions in the tissues and release them in the lungs, and these groups are responsible for the Bohr effect. By binding hydrogen ions in the tissues, they also act as a buffer, helping to keep the pH of the blood steady as acid is produced.',
    ],
    2: [
      '2,3-Bisphosphoglycerate (2,3-BPG) is a small, highly negatively charged molecule made in red cells. One molecule binds to each haemoglobin molecule, in a cavity at the centre of the molecule, between the two β chains.',
      'The cavity is lined with positively charged groups, three from each β chain: the amino group at the start of the chain (and the histidine NA2), lysine 82 and histidine 143. These six positive charges attract the negative charges of 2,3-BPG, holding it in place.',
      'The cavity is wide only in the T state. When haemoglobin switches to the R state, the β chains move closer together, narrowing the cavity so that 2,3-BPG no longer fits. So 2,3-BPG binds only to deoxyhaemoglobin, and by cross-linking the two β chains it stabilises the T state. Binding oxygen and binding 2,3-BPG are mutually exclusive: when 2,3-BPG is bound, oxygen binds less readily. Red cells contain about as much 2,3-BPG as haemoglobin, so it has a large effect.',
    ],
    3: [
      'Without 2,3-BPG, haemoglobin would bind oxygen almost as tightly as myoglobin, with a P50 of about 1 torr. With 2,3-BPG, its P50 rises to about 26 torr, a 26-fold drop in affinity.',
      'This matters enormously. In the capillaries of the tissues, the oxygen pressure is about 26 torr. Without 2,3-BPG, haemoglobin would remain fully saturated at this pressure and release no oxygen to the tissues. With 2,3-BPG, it is only about half saturated at this pressure, so it releases half its oxygen. 2,3-BPG is thus essential for oxygen delivery.',
      'The body adjusts the amount of 2,3-BPG to its needs. When oxygen is in short supply, for example at high altitude, in chronic lung disease or in anaemia, red cells make more 2,3-BPG within a day or two. This shifts the curve further to the right, so more oxygen is released to the tissues. Conversely, blood stored for transfusion gradually loses its 2,3-BPG, so its haemoglobin holds on to oxygen more tightly, until the transfused red cells rebuild their supply.',
    ],
    4: [
      'Before birth, the fetus must obtain its oxygen from its mother’s blood across the placenta. For oxygen to move from the mother’s haemoglobin to the fetus’s, the fetal haemoglobin must bind oxygen more tightly. Fetal haemoglobin (HbF) achieves this with a different chain: instead of two β chains, it has two γ chains, so it is α₂γ₂.',
      'The key difference is at one position in the 2,3-BPG-binding cavity. In the β chain of adult haemoglobin, position 143 (H21) is histidine, which carries a positive charge and helps hold 2,3-BPG. In the γ chain, this position is serine, which has no positive charge. With fewer positive charges in the cavity, 2,3-BPG binds less strongly to fetal haemoglobin.',
      'Since 2,3-BPG lowers oxygen affinity, binding less of it means fetal haemoglobin has a higher affinity for oxygen, and its dissociation curve lies to the left of the mother’s. At the oxygen pressures of the placenta, the mother’s haemoglobin releases oxygen and the fetal haemoglobin takes it up. After birth, γ chains are gradually replaced by β chains, and adult haemoglobin takes over.',
    ],
  },
};
