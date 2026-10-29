import type { Teaching } from '@/data/teaching/types';

export const teaching: Teaching = {
  'fatty-acid-biosynthesis-1': {
    0: [
      'Fat is the body’s long-term energy store. When we eat more than we need, the surplus is turned into fatty acids and stored as triglyceride in fat tissue; when we are short of fuel, those fatty acids are broken down again to release energy. To understand how fat is made, it helps to start with how it is broken down, because the two processes mirror each other.',
      'A fatty acid is a long chain of carbon atoms, usually with an even number of them. In β-oxidation, which happens inside mitochondria, this chain is cut up into two-carbon pieces, each of which leaves as acetyl-CoA. Acetyl-CoA can then be burned in the citric acid (TCA) cycle to release energy.',
      'Fatty acid synthesis does the opposite: it takes two-carbon units from acetyl-CoA and joins them together, step by step, to build a long chain. So acetyl-CoA sits at the crossroads: it is the end product of fat breakdown and the starting material for fat synthesis. As this topic will show, however, the cell does not simply run β-oxidation backwards; it uses a separate set of enzymes in a different part of the cell.',
    ],
    1: [
      'Biochemistry introduces many enzyme names, and memorising them one by one is hard. It is much easier once you realise that most names are built to a pattern: the first part names the substance the enzyme works on, and the ending names the kind of reaction it carries out, finishing in "-ase". Learn the reaction words and you can work out what an unfamiliar enzyme does from its name alone.',
      'A kinase moves a phosphate group from one molecule (usually ATP) to another, so it is a kind of transferase. A synthase joins smaller pieces together into a bigger molecule. A hydrolase breaks a bond by adding a molecule of water across it, the reaction called hydrolysis, which is how digestive enzymes break down food.',
      'A hydratase also involves water, but in a different way: it adds water across a carbon–carbon double bond, turning it into a single bond carrying an –OH group, without splitting the molecule. Hydratases belong to the group of enzymes called lyases, which make or break bonds without using water to cut or adding electrons.',
    ],
    2: [
      'Two enzyme names that are easy to confuse are synthase and synthetase. Both build a new molecule by forming chemical bonds, so the names sound almost interchangeable. The difference lies in where the energy comes from.',
      'Building bonds usually requires energy. A synthetase gets that energy by breaking down ATP during the reaction itself: it cannot work without splitting ATP. A synthase does not split ATP; the reaction it catalyses is driven in some other way, for example because one of its substrates was already "energised" earlier.',
      'This distinction matters in this topic. The large enzyme complex that builds fatty acids does not itself use ATP; the ATP is spent beforehand, when acetyl-CoA is activated to malonyl-CoA. So the correct name for the complex is fatty acid synthase, which is the term used throughout this course, even though the slides sometimes call it a synthetase.',
    ],
    3: [
      'Another pair of names that confuses students is hydratase and dehydratase. They sound alike, but they do opposite things, and both appear in this topic.',
      'The prefix "de-" means removal. A hydratase adds water across a double bond, so the double bond disappears and an –OH group appears. A dehydratase removes water from a molecule, taking an –OH group and a neighbouring hydrogen away, which creates a double bond.',
      'You will see both in the fat pathways. In β-oxidation, enoyl-CoA hydratase adds water to a double bond. In fatty acid synthesis, β-hydroxyacyl-ACP dehydratase does the reverse, removing water to make a double bond. The same "de-" rule applies elsewhere: a dehydrogenase removes hydrogen (that is, electrons) from its substrate.',
    ],
    4: [
      'Every enzyme in fatty acid metabolism can be decoded with the same naming logic, which makes the pathway far easier to remember. Read the first part of the name to find what the enzyme acts on, and the ending to find what it does.',
      'A carboxylase adds a carboxyl group, made from carbon dioxide: acetyl-CoA carboxylase adds one to acetyl-CoA. A transacylase moves an acyl group (a fatty acid chain or a piece of one) from one carrier to another, which is how acetyl and malonyl groups are loaded onto the synthase. A synthase joins two groups, so ketoacyl-ACP synthase creates the new carbon–carbon bond that lengthens the chain.',
      'A reductase adds electrons to its substrate, here supplied by NADPH, which reduces a keto group or a double bond. A dehydratase removes water, and a dehydrogenase removes electrons and hands them to a carrier such as NAD⁺ or FAD. A thioesterase breaks a thioester bond (the bond that holds the chain on its carrier) by adding water, so it releases the finished fatty acid. A lyase splits a molecule without using water or oxidation, as ATP-citrate lyase does when it splits citrate.',
    ],
  },
  'fatty-acid-biosynthesis-2': {
    0: [
      'Metabolism has two directions. Catabolic pathways break large molecules into smaller ones and release energy; anabolic pathways build large molecules from small ones and consume energy. Fatty acid synthesis is anabolic: it takes two-carbon units and links them into a long chain, which costs both energy (ATP) and reducing power (electrons, carried by NADPH).',
      'Because it consumes resources, the body only runs this pathway when resources are plentiful, in the fed state, after a meal. At that time, the liver takes up glucose from the blood. Some is stored as glycogen, but the liver’s glycogen store is small. The excess glucose is broken down to acetyl-CoA, which is then turned into fatty acids, packaged into triglyceride and sent to fat tissue for storage.',
      'The process starts in the mitochondria. Glucose is broken down to pyruvate, which enters the mitochondria and becomes acetyl-CoA; acetyl-CoA joins oxaloacetate to form citrate in the TCA cycle. When the cell has plenty of energy, the TCA cycle slows and citrate builds up. This excess citrate leaves the mitochondria and carries acetyl groups out into the cytosol, where the enzymes of fatty acid synthesis are located. The final lesson of this topic shows exactly how this shuttle works.',
    ],
    1: [
      'Since β-oxidation removes two carbons at a time, it seems reasonable to suppose that the cell could make fatty acids by simply running β-oxidation in reverse. But a pathway that runs equally well in both directions cannot be controlled: the cell could not decide whether to store or burn fat, and would waste energy cycling between the two. So synthesis must differ in ways that make it run firmly in one direction.',
      'Two key changes achieve this. First, the two-carbon building block is "activated": instead of using acetyl-CoA directly, the cell first attaches a carbon dioxide to it, making malonyl-CoA. This costs ATP, and it makes the chain-joining step energetically downhill.',
      'Second, the reductions are carried out with NADPH. β-Oxidation removes electrons using FAD and NAD⁺; synthesis puts electrons back using NADPH, a strong electron donor kept at a high level in the cytosol. Add to this that synthesis happens in the cytosol while breakdown happens in the mitochondria, and the two pathways are kept apart and can be controlled independently.',
    ],
    2: [
      'Fatty acid synthesis works as a repeating cycle. Each turn of the cycle adds two carbons to the chain, and it then goes round again until the chain is long enough.',
      'Each turn has five stages. First, transfer: the building blocks, an acetyl group (to start the chain) and a malonyl group (to extend it), are loaded onto the synthase enzyme. Second, elongation: the two are joined together, and the chain becomes two carbons longer.',
      'The joining step leaves a keto (C=O) group in the chain, which a finished fatty acid does not have. The next three stages remove it. Reduction turns the keto group into an alcohol (–OH) using NADPH. Dehydration removes water to create a double bond. A second reduction, again with NADPH, removes the double bond, leaving a saturated chain.',
      'The cycle then repeats, with the growing chain taking the place of the original acetyl group. After enough turns, the chain reaches 16 carbons, and it is released from the enzyme as palmitate, the main product of fatty acid synthesis.',
    ],
  },
  'fatty-acid-biosynthesis-3': {
    0: [
      'The first committed step of fatty acid synthesis prepares the building blocks. Acetyl-CoA on its own is not reactive enough to drive chain building, so it is "activated" by attaching a carbon dioxide molecule to it. The enzyme that does this is acetyl-CoA carboxylase; as its name tells you, it adds a carboxyl group to acetyl-CoA.',
      'The product is malonyl-CoA. Its acyl part has three carbons: the two of the original acetyl group plus the new carboxyl carbon. Malonyl-CoA is the activated donor that will supply two carbons in every turn of the synthesis cycle.',
      'Because this is the first step that commits acetyl-CoA to fat synthesis, it is the main control point of the pathway. When the body is fed and insulin is high, acetyl-CoA carboxylase is switched on; during fasting, hormones such as glucagon switch it off.',
    ],
    1: [
      'Acetyl-CoA carboxylase uses a helper molecule, biotin (a B vitamin), which is attached to the enzyme and acts as a temporary carrier for carbon dioxide. The reaction happens in two halves.',
      'In the first half, carbon dioxide from bicarbonate is attached to biotin. This step needs energy, which comes from breaking down a molecule of ATP. In the second half, the enzyme swings the loaded biotin over to acetyl-CoA and passes the carbon dioxide on to it, forming malonyl-CoA. The reaction cannot easily run backwards.',
      'This is where the energy for fatty acid synthesis is spent: one ATP is used for every malonyl-CoA that is made. Because each turn of the synthesis cycle uses one malonyl-CoA, every two carbons added to a fatty acid costs one ATP at this step.',
    ],
    2: [
      'It might seem strange to add a carbon dioxide to acetyl-CoA, only to lose it again. But this temporary carboxyl group is exactly what makes chain building possible.',
      'Joining two acyl groups together to form a carbon–carbon bond is energetically uphill: on its own, the reaction would not go. When the malonyl group is joined to the growing chain, its carboxyl group is released as carbon dioxide. The loss of carbon dioxide releases energy, and the electrons from the broken bond are used to attack the growing chain and form the new carbon–carbon bond. Coupling the two makes the joining reaction strongly favourable.',
      'So the cell adds carbon dioxide in one step in order to remove it in another. The carbon dioxide acts like a loaded spring: energy (from ATP) is stored when it is attached, and released when it leaves, driving the bond formation. In the first turn of the cycle, joining an acetyl group to a malonyl group this way produces a four-carbon chain, acetoacetyl-ACP.',
    ],
  },
  'fatty-acid-biosynthesis-4': {
    0: [
      'In animals, all the reactions that build the fatty acid chain are carried out by a single large protein, the fatty acid synthase complex, which has several active sites, each catalysing one step. A key feature is that the growing chain is never released between steps: it stays attached to the complex throughout, so the intermediates are not lost and the steps follow each other efficiently.',
      'The chain is held on the complex by two attachment points, which the lecture calls ACP₁ and ACP₂. ACP₁ holds the chain through the –SH group of a cysteine; it acts as a parking place for the acetyl group at the start, and later for the growing chain, while the next malonyl group is loaded.',
      'ACP₂ holds the chain through the –SH at the end of a long, flexible arm, phosphopantetheine. This arm is what carries the chain from one active site to the next during the joining and reduction reactions, like a crane arm moving a load between workstations. Textbooks call ACP₂ the acyl carrier protein itself, and ACP₁ the cysteine of the ketoacyl synthase; the chemistry is the same, only the labels differ.',
    ],
    1: [
      'Before the first chain-building reaction, both attachment points on the synthase must be loaded. The building blocks arrive attached to coenzyme A, so they must be transferred from CoA onto the enzyme. The enzymes that do this are transacylases, which move acyl groups from one carrier to another.',
      'First, acetyl-CoA:ACP transacylase transfers an acetyl group from CoA to the cysteine –SH of ACP₁. This acetyl group is the starting point, or primer, of the chain: its two carbons will end up at the far end of the finished fatty acid.',
      'Second, malonyl-CoA:ACP transacylase transfers a malonyl group from CoA to the –SH at the end of the phosphopantetheine arm of ACP₂. Now the acetyl and malonyl groups are held side by side, ready to be joined.',
    ],
    2: [
      'With the acetyl group on ACP₁ and the malonyl group on ACP₂, the ketoacyl-ACP synthase joins them. This is the step that actually lengthens the chain, the elongation stage of the cycle.',
      'The malonyl group loses its extra carboxyl group as carbon dioxide; this is the same carbon that acetyl-CoA carboxylase attached. The energy released, and the electrons from the broken bond, are used to attack the acetyl group on ACP₁, forming a new carbon–carbon bond. The acetyl group moves across to join the malonyl remnant on ACP₂.',
      'The product carries a keto (C=O) group on its β-carbon (the third carbon from the attachment point), so it is called a β-ketoacyl group. In the first round, a two-carbon acetyl group plus a three-carbon malonyl group, minus one carbon lost as carbon dioxide, gives a four-carbon chain, acetoacetyl-ACP.',
      'Every condensation adds exactly two carbons, which is why natural fatty acids usually have an even number of carbons. The keto group must now be removed, by the three steps described in the next lesson, which are the reverse of three steps in β-oxidation.',
    ],
  },
  'fatty-acid-biosynthesis-5': {
    0: [
      'After the condensation step, the chain carries a keto (C=O) group on its β-carbon. But a saturated fatty acid has no oxygen along its chain; it is made only of –CH₂– units. Before the next two carbons can be added, the keto group must be turned into a plain –CH₂– group.',
      'This is done in three steps: a reduction, a dehydration and a second reduction. Together they remove the oxygen and add the hydrogens needed to saturate the carbon.',
      'These three steps are essentially the reverse of three steps of β-oxidation. In β-oxidation, a –CH₂–CH₂– bond is oxidised to a double bond, water is added, and the result is oxidised to a keto group. In synthesis, the keto group is reduced, water is removed, and the double bond is reduced. The chemistry mirrors itself, but different enzymes and carriers are used.',
    ],
    1: [
      'In the first round, the chain is acetoacetyl-ACP, with four carbons and a keto group. Three enzymes on the synthase complex convert it to butyryl-ACP, a saturated four-carbon chain.',
      'First, β-ketoacyl-ACP reductase (KR) reduces the keto group to an alcohol (–OH), using NADPH as the electron donor. The product is D-β-hydroxybutyryl-ACP. Note the "D": the synthesis pathway makes the D form, whereas β-oxidation makes the L form, a sign that different enzymes are involved.',
      'Second, β-hydroxyacyl-ACP dehydratase (DH) removes a molecule of water, taking the –OH group and a hydrogen from the neighbouring carbon. This creates a double bond between the second and third carbons, in the trans configuration, giving crotonyl-ACP (trans-Δ²-butenoyl-ACP).',
      'Third, enoyl-ACP reductase (ER) reduces the double bond, again using NADPH, adding two hydrogen atoms to make a saturated chain: butyryl-ACP. In β-oxidation, the corresponding double bond was created by an FAD-linked enzyme; here, NADPH provides the electrons to remove it. Each round therefore uses two NADPH.',
    ],
    2: [
      'At the end of the first round, the saturated four-carbon chain is attached to the phosphopantetheine arm of ACP₂. But ACP₂ is the site where the next malonyl group must be loaded. So before the cycle can continue, the chain must move.',
      'An acyltransferase moves the chain from ACP₂ to the cysteine –SH of ACP₁, the parking place where the original acetyl group sat. ACP₂ is now free to accept a new malonyl group from malonyl-CoA.',
      'The cycle then repeats: condensation joins the chain on ACP₁ to the new malonyl group, adding two carbons; then reduction, dehydration and reduction saturate it. Each round lengthens the chain by two carbons: four, six, eight, and so on, up to sixteen.',
    ],
    3: [
      'Each turn of the cycle follows the same pattern. After two carbons are added, the β-keto group is fully saturated by three activities working in order: the ketoreductase (KR), the dehydratase (DH) and the enoyl reductase (ER). The chain moves between these active sites while attached to the flexible phosphopantetheine arm of the acyl carrier protein, which swings it from one site to the next.',
      'When the chain reaches 16 carbons, the cycle stops. In animals, the synthase’s active site cannot accommodate a longer chain, and a final enzyme, the thioesterase (TE), now acts. It breaks the thioester bond holding the chain on the carrier by adding water, releasing free palmitate (a saturated 16-carbon fatty acid) and freeing the carrier for the next round of synthesis.',
      'In bacteria such as E. coli, the chain is not released as free palmitate; instead, palmitoyl-ACP is passed directly into the synthesis of membrane lipids such as triglycerides and phospholipids.',
    ],
    4: [
      'It is useful to be able to add up what is needed to make one molecule of palmitate. The chain is started by one acetyl group (from acetyl-CoA), which provides two carbons. The remaining fourteen carbons come from seven malonyl-CoA, two carbons each. So seven turns of the cycle are needed: the first worked example (acetyl to butyryl, four carbons), then six more turns to reach sixteen.',
      'Each turn has two reductions, and each uses one NADPH, so making palmitate uses fourteen NADPH. Each turn also releases one carbon dioxide during condensation, so seven carbon dioxides are released, the same seven that were added when the malonyl-CoA was made.',
      'The energy cost comes earlier: making each of the seven malonyl-CoA molecules uses one ATP, so seven ATP are spent. Putting it together, eight acetyl-CoA, seven ATP and fourteen NADPH produce one palmitate. This shows why synthesis needs a well-fed cell, with plenty of acetyl-CoA, ATP and NADPH.',
    ],
  },
  'fatty-acid-biosynthesis-6': {
    0: [
      'To compare synthesis with breakdown, we need to recall how β-oxidation works. It happens inside mitochondria, with the fatty acid attached to coenzyme A, and each round removes two carbons in four reactions.',
      'First, acyl-CoA dehydrogenase removes two hydrogens from the chain, creating a double bond between the second and third carbons; the electrons go to FAD, making FADH₂. Second, enoyl-CoA hydratase adds water across this double bond, creating an –OH group on the third carbon (the β-carbon), in the L configuration.',
      'Third, L-3-hydroxyacyl-CoA dehydrogenase removes two more hydrogens, turning the –OH group into a keto (C=O) group; the electrons go to NAD⁺, making NADH. Fourth, the enzyme thiolase (acetyl-CoA acyltransferase) uses a new coenzyme A to cut off the last two carbons as acetyl-CoA, leaving a chain that is two carbons shorter, ready for another round. The FADH₂ and NADH carry their electrons to the respiratory chain to make ATP.',
    ],
    1: [
      'Lay the two pathways side by side and the mirror image becomes clear. Read the synthesis cycle backwards, and each of its steps undoes a step of β-oxidation.',
      'β-Oxidation begins by creating a double bond with FAD; synthesis ends by removing a double bond with NADPH (enoyl-ACP reductase). β-Oxidation adds water to the double bond; synthesis removes water to create it (dehydratase). β-Oxidation oxidises an –OH group to a keto group with NAD⁺; synthesis reduces a keto group to an –OH group with NADPH (ketoacyl reductase). And β-oxidation cuts off a two-carbon unit as acetyl-CoA, whereas synthesis adds a two-carbon unit from malonyl, losing carbon dioxide in the process (ketoacyl synthase).',
      'So the chemistry is the same in reverse, but every step uses a different enzyme, and the electron carriers differ. This is the key point: the cell uses separate machinery for the two directions, so it can switch one on while keeping the other off.',
    ],
    2: [
      'The differences between synthesis and β-oxidation can be summarised by asking a series of questions about each pathway. In which direction does the chain change? Synthesis adds two carbons per turn, supplied by malonyl; β-oxidation removes two carbons per turn, released as acetyl-CoA.',
      'Where does it happen? Synthesis takes place in the cytosol; β-oxidation in the mitochondria. Keeping them in separate compartments stops them from undoing each other. What holds the intermediates? In synthesis, the acyl carrier protein (ACP) of the synthase; in β-oxidation, coenzyme A.',
      'Which electron carriers are used? Synthesis uses NADPH to reduce the chain; β-oxidation uses FAD and NAD⁺ to oxidise it. Even the intermediates differ in shape: synthesis makes a D-hydroxy intermediate, while β-oxidation makes an L-hydroxy intermediate, showing that different enzymes handle them. These differences are what make the two pathways separate, controllable processes.',
    ],
    3: [
      'Why does synthesis use NADPH rather than NADH or FADH₂? The two molecules NADH and NADPH are almost identical chemically; the difference is a single phosphate group, which acts as a tag that lets enzymes tell them apart.',
      'The cell uses this tag to keep two separate pools of electron carriers. NAD⁺ is used mainly in breakdown pathways, where it accepts electrons and is turned into NADH, which then feeds the respiratory chain. NADPH is used mainly in building pathways, where it donates electrons. In the cytosol, most of the NADP is kept in its reduced form, NADPH, so it is always ready to donate electrons.',
      'Synthesis needs to put electrons into the chain twice in every turn, reducing a keto group and a double bond. NADPH is a stronger reducing agent in these conditions than FADH₂, so it can drive these reductions effectively. Having a separate carrier also means that fat synthesis does not compete with energy production for electrons.',
    ],
    4: [
      'So, is fatty acid synthesis just β-oxidation run backwards? The honest answer is "partly". The chemistry of the reduction, dehydration and reduction steps is indeed the reverse of three steps of β-oxidation, so the lecture can describe them as a reversal.',
      'But in every other important way, synthesis is a distinct pathway. Its two-carbon unit is first activated to malonyl-CoA, spending ATP. It uses NADPH, not FAD and NAD⁺. Its intermediates are held on ACP, not coenzyme A. Its enzymes form one complex, in the cytosol rather than the mitochondria.',
      'This separation is what allows the body to control fat metabolism: after a meal, it can switch on synthesis and switch off breakdown, and during fasting do the opposite, without the two pathways cancelling each other out.',
    ],
  },
  'fatty-acid-biosynthesis-7': {
    0: [
      'The fatty acid synthase complex stops when the chain reaches 16 carbons, so its product is always palmitate. Yet the body contains fatty acids of many different lengths, including some shorter and many longer than palmitate, and many with double bonds.',
      'Palmitate is therefore the starting point for making the others. Shorter fatty acids can be made by trimming palmitate with β-oxidation, removing two carbons at a time. Longer fatty acids are made by separate elongation systems, which add further two-carbon units to palmitate. Other enzymes, desaturases, can introduce double bonds.',
    ],
    1: [
      'The main system for making fatty acids longer than palmitate is located on the endoplasmic reticulum (ER). It works on fatty acids attached to coenzyme A, so palmitate must first be activated to palmitoyl-CoA.',
      'The chemistry of each round is the same as in the synthase: two carbons are donated by malonyl-CoA, with loss of carbon dioxide; then the keto group is reduced, water is removed and the double bond is reduced, using NADPH. The difference is that each step is carried out by a separate enzyme rather than by one large complex, and the chain is carried on coenzyme A rather than on ACP.',
      'The elongation enzymes work best on chains of up to 16 carbons. So the main product of adding one more round to palmitoyl-CoA is stearoyl-CoA, an 18-carbon saturated fatty acid. Stearate is very common in the body, and it can be desaturated to make oleate, the most common monounsaturated fatty acid.',
    ],
    2: [
      'Because the ER elongation enzymes prefer chains of 16 carbons or fewer, long saturated chains are poor substrates and are rarely elongated beyond 18 carbons. Unsaturated fatty acids behave differently.',
      'Natural unsaturated fatty acids have their double bonds in the cis configuration, which puts a kink in the chain. A kinked chain is more compact; to the enzyme, it effectively looks shorter than its number of carbons suggests. So a long unsaturated fatty acid can still fit into the enzyme and be elongated further.',
      'As a result, the body can make unsaturated fatty acids of 20, 22 and 24 carbons, and most very long fatty acids are polyunsaturated. These very long polyunsaturated fatty acids are important components of cell membranes, especially in the brain and retina, and are precursors of signalling molecules.',
    ],
    3: [
      'A second elongation system exists inside the mitochondria, in the mitochondrial matrix. Its role is probably to make long fatty acids for the mitochondria’s own structures, such as their membranes.',
      'Interestingly, this system works by reusing most of the enzymes of β-oxidation in reverse: the thiolase, the hydroxyacyl dehydrogenase and the hydratase can all run in the direction of synthesis. The one step that cannot be reversed is the first step of β-oxidation, the FAD-linked dehydrogenase. So the mitochondrial system replaces it with a different enzyme, an enoyl-CoA reductase that uses NADPH to reduce the double bond.',
    ],
    4: [
      'Deck B includes an extra chart summarising fatty acid elongation in the ER. It is a screenshot added to the slides rather than part of the lecture, so it should be treated as background reading until the lecturer confirms that it is examinable.',
      'The chart shows the same logic described in this lesson. A long-chain fatty acid is first activated by attaching coenzyme A, using the energy of ATP. It is then condensed with malonyl-CoA, adding two carbons, and the keto group is removed by reduction, dehydration and reduction.',
      'The chart also shows what can happen next. Stearoyl-CoA can be desaturated to oleoyl-CoA by stearoyl-CoA desaturase, an enzyme that uses oxygen and NADPH, with electrons passed through cytochrome b5 and its reductase. And long-chain acyl-CoAs can be used to make sphingolipids such as ceramide and sphingomyelin, or attached to proteins.',
    ],
  },
  'fatty-acid-biosynthesis-8': {
    0: [
      'Fatty acid synthesis faces a practical problem of geography. The synthase and all the synthesis reactions are in the cytosol. But acetyl-CoA, the raw material, is mainly made inside the mitochondria, from pyruvate (from glucose) and from amino acids. And the inner mitochondrial membrane does not let acetyl-CoA through.',
      'The cell solves this with a shuttle, the pyruvate–malate cycle, also called the citrate–pyruvate cycle. Instead of exporting acetyl-CoA directly, it packages the acetyl group into citrate, which can leave the mitochondria, and then unpacks it in the cytosol.',
      'The shuttle does two jobs at once. It delivers acetyl groups to the cytosol, and as the carrier molecules are recycled, it converts NADH into NADPH, supplying some of the reducing power that synthesis needs. Because the shuttle starts with pyruvate from glycolysis, it also links fat synthesis to the breakdown of glucose.',
    ],
    1: [
      'The cycle is easiest to follow starting from glucose after a meal. In the cytosol, glycolysis breaks glucose down to pyruvate, which enters the mitochondria. There, the pyruvate dehydrogenase complex converts pyruvate into acetyl-CoA, and citrate synthase joins acetyl-CoA to oxaloacetate to make citrate, the first step of the TCA cycle.',
      'When the cell has plenty of energy, citrate accumulates. A carrier in the mitochondrial membrane exports it to the cytosol. There, ATP-citrate lyase splits citrate back into acetyl-CoA and oxaloacetate; this reaction needs energy from ATP to proceed. The acetyl-CoA is now in the cytosol, ready to be made into malonyl-CoA and then into fatty acids.',
      'The oxaloacetate cannot return to the mitochondria directly, so it is recycled. Malate dehydrogenase reduces it to malate, using electrons from NADH. Then malic enzyme oxidises malate to pyruvate, releasing carbon dioxide and passing the electrons to NADP⁺ to form NADPH.',
      'Pyruvate re-enters the mitochondria, where pyruvate carboxylase, using ATP and carbon dioxide, turns it back into oxaloacetate, ready to accept another acetyl group. The cycle is complete.',
    ],
    2: [
      'It helps to keep track of where each step happens and what it costs or produces, because the cycle crosses the mitochondrial membrane twice.',
      'In the mitochondria, three enzymes act. Pyruvate dehydrogenase turns pyruvate into acetyl-CoA, releasing carbon dioxide and producing NADH. Pyruvate carboxylase turns pyruvate into oxaloacetate, using ATP. Citrate synthase joins acetyl-CoA and oxaloacetate to form citrate.',
      'In the cytosol, three more enzymes act. ATP-citrate lyase splits citrate into acetyl-CoA and oxaloacetate, using ATP. Malate dehydrogenase turns oxaloacetate into malate, using NADH. Malic enzyme turns malate into pyruvate, releasing carbon dioxide and making NADPH.',
      'Overall, the cycle uses two ATP for every acetyl group delivered (one at ATP-citrate lyase and one at pyruvate carboxylase) and turns one NADH into one NADPH.',
    ],
    3: [
      'The most elegant part of the cycle is how it changes the type of electron carrier. In the cytosol, malate dehydrogenase takes electrons from NADH and puts them into oxaloacetate, making malate. Malic enzyme then takes electrons from malate and puts them onto NADP⁺, making NADPH.',
      'So the electrons start on NADH and end on NADPH; malate is just the intermediate that carries them. This is what is meant by providing NADPH from NADH. Since NADH is produced in glycolysis, when glucose is plentiful, the cell can turn the reducing power from glucose breakdown into the form that fat synthesis needs.',
      'Malic enzyme is one of the two major sources of NADPH in the cytosol of liver and fat cells. The other is the pentose phosphate pathway, which produces NADPH from glucose-6-phosphate. Together they supply the fourteen NADPH needed for each palmitate.',
    ],
    4: [
      'The pyruvate–malate cycle ties fatty acid synthesis to the rest of metabolism in several ways. First, it solves the compartment problem: acetyl groups made in the mitochondria are delivered, as citrate, to the cytosol, where the synthase is. Second, it helps supply the NADPH that the two reduction steps of each cycle require, by converting NADH into NADPH through malic enzyme.',
      'Third, it links fat synthesis to glucose use. Fatty acids are made when glucose is abundant: glycolysis supplies pyruvate to feed the cycle, and citrate only accumulates and leaves the mitochondria when the cell has more energy than it needs. This is why a diet rich in carbohydrate leads to fat being made and stored.',
      'Finally, the cycle has a cost: it uses ATP at two points, at ATP-citrate lyase and pyruvate carboxylase. Making fat is an energy-consuming investment that the body makes only when it is well fed.',
    ],
  },
};
