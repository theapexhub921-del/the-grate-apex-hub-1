import type { Teaching } from '@/data/teaching/types';

export const teaching: Teaching = {
  'cholesterol-and-bile-biosynthesis-1': {
    0: [
      'Cholesterol has a bad reputation because high blood levels are linked to heart disease, but it is essential to life. Every animal cell membrane contains it, where it controls how fluid the membrane is. It is also the starting material for the steroid hormones (such as cortisol, aldosterone, testosterone and oestrogen), for vitamin D and for the bile acids that help us digest fat.',
      'The body can make all the cholesterol it needs, and it makes it from a very simple starting material: acetyl-CoA, the same two-carbon unit that is used to build fatty acids and is produced when sugars, fats and some amino acids are broken down. The pathway that builds cholesterol is called the mevalonate pathway, after one of its key intermediates, and it begins when two acetyl-CoA molecules join.',
      'This topic follows the journey from acetyl-CoA to cholesterol, then looks at how the cell controls the pathway so that it makes just the right amount, and finally at how the liver turns cholesterol into bile acids.',
    ],
    1: [
      'Cholesterol belongs to the steroids, a family of molecules that share the same core structure: four rings of carbon atoms fused together. Three of the rings have six carbons and one has five. This core is called the steroid nucleus, or by its chemical name, cyclopentanoperhydrophenanthrene ("cyclopentano" for the five-membered ring, "phenanthrene" for the three six-membered rings, and "perhydro" because they are fully saturated with hydrogen).',
      'It is important not to confuse these rings with benzene rings. A benzene ring is a flat, aromatic ring with alternating double bonds. The rings of the steroid nucleus are mostly saturated, with no aromatic character. Animals cannot make benzene rings at all, which is why we must obtain aromatic amino acids such as phenylalanine from our diet; steroid rings, by contrast, we can build ourselves.',
    ],
    2: [
      'When looking at a drawing of cholesterol, it helps to know a few landmarks. The rings are labelled A, B and C (the six-membered rings) and D (the five-membered ring), reading from left to right, and the carbons are numbered in a standard way.',
      'Ring A carries a hydroxyl (–OH) group on carbon 3. This makes cholesterol an alcohol (a sterol, from "steroid alcohol"), and it is the only part of the molecule that interacts with water, so in a membrane it points towards the watery surface while the rest of the molecule sits among the fatty chains. Ring B contains a double bond between carbons 5 and 6. Ring D carries a branched hydrocarbon side chain attached at carbon 17.',
      'Altogether, cholesterol has 27 carbon atoms. Recognising these features helps you understand how other steroids are made from it: hormones are made by shortening or removing the side chain and modifying the rings, while bile acids add more hydroxyl groups and shorten the side chain.',
    ],
    3: [
      'Almost every cell in the body contains cholesterol, and most cells can make some of it. Synthesis starts from acetate (as acetyl-CoA).',
      'The liver and the lining of the intestine are major sites of synthesis. The liver plays a central role because it not only makes cholesterol but also packages it into lipoproteins for transport in the blood and converts it into bile acids. Other tissues with a high rate of synthesis include the adrenal glands and the reproductive organs (ovaries and testes), which need cholesterol as the raw material for their steroid hormones.',
    ],
    4: [
      'Experiments using radioactively labelled acetate showed that every one of the 27 carbon atoms of cholesterol comes from acetate. Acetate has two carbons: a methyl carbon (–CH₃) and a carbonyl carbon (the C=O carbon). When acetate labelled on one carbon or the other was fed to animals, the label appeared at particular positions in cholesterol, and between them the two carbons accounted for the whole molecule.',
      'Inside the cell, acetate is used in its activated form, acetyl-CoA. So the complex four-ring structure of cholesterol is built entirely from two-carbon units, in the same way that fatty acids are, though by a very different route. This is why the pathway begins with acetyl-CoA.',
    ],
    5: [
      'Like fatty acid synthesis, cholesterol synthesis takes place outside the mitochondria, in the cytosol and on the endoplasmic reticulum. But acetyl-CoA is made mainly inside the mitochondria, and the inner mitochondrial membrane does not let it through. So cholesterol synthesis depends on the same shuttle that supplies fat synthesis, the pyruvate–malate cycle.',
      'Inside the mitochondria, acetyl-CoA is combined with oxaloacetate to form citrate, which can cross the mitochondrial membranes. In the cytosol, ATP-citrate lyase splits citrate back into acetyl-CoA and oxaloacetate, using ATP. The oxaloacetate is recycled: it is reduced to malate using NADH, and malic enzyme converts malate to pyruvate, generating NADPH. The pyruvate returns to the mitochondria and is turned back into oxaloacetate by pyruvate carboxylase.',
      'The cycle therefore supplies both things cholesterol synthesis needs: acetyl-CoA as the source of carbon, and NADPH as the source of electrons for the reduction steps, including the key reaction catalysed by HMG-CoA reductase.',
    ],
  },
  'cholesterol-and-bile-biosynthesis-2': {
    0: [
      'Building a 27-carbon, four-ring molecule from two-carbon pieces sounds daunting, but the pathway can be understood as five stages, each of which builds a bigger unit from smaller ones.',
      'In stage 1, three acetyl-CoA molecules are joined to make a six-carbon compound, HMG-CoA (3-hydroxy-3-methylglutaryl-CoA). In stage 2, HMG-CoA is reduced to mevalonate. In stage 3, mevalonate is converted into a five-carbon building block, isopentenyl pyrophosphate (IPP), losing one carbon as carbon dioxide; IPP is an "isoprene" unit, the basic building block of a huge family of natural compounds.',
      'In stage 4, six of these five-carbon isoprene units are joined to make squalene, a 30-carbon chain. In stage 5, squalene folds up and closes into the four rings of the steroid nucleus, and after a series of trimming steps that remove three carbons, cholesterol is formed.',
      'So the overall plan is: two carbons to six, six to five, five to thirty, and thirty to twenty-seven. Some textbooks group the first two stages together and describe four stages, but the reactions are the same.',
    ],
    1: [
      'The first stage joins acetyl-CoA units together. First, two acetyl-CoA molecules condense to form acetoacetyl-CoA, a four-carbon compound; one coenzyme A is released. The enzyme is thiolase, the same type of enzyme that splits off acetyl-CoA in β-oxidation, working here in reverse.',
      'Next, a third acetyl-CoA is added to acetoacetyl-CoA, along with a molecule of water, by the enzyme HMG-CoA synthase. The product is 3-hydroxy-3-methylglutaryl-CoA, HMG-CoA, a six-carbon compound with a branch (the methyl group) and a hydroxyl group. Its six carbons come from the three acetyl-CoA molecules, though two of the six will eventually be lost.',
    ],
    2: [
      'HMG-CoA is not only an intermediate in cholesterol synthesis; it also appears in a completely different pathway, ketone body formation. What happens to it depends on which part of the cell it is in.',
      'Inside the mitochondria of the liver, HMG-CoA is split by a cleavage enzyme (HMG-CoA lyase) into acetoacetate and acetyl-CoA. Acetoacetate is a ketone body, which the liver releases into the blood as a fuel for other tissues during fasting. This branch does not lead to cholesterol.',
      'Outside the mitochondria, HMG-CoA is reduced by HMG-CoA reductase to mevalonate, which leads on to cholesterol. The HMG-CoA for each pathway is made by a separate version (isozyme) of HMG-CoA synthase, one in the mitochondria and one in the cytosol, so the cell can control the two pathways independently. HMG-CoA reductase is anchored in the membrane of the endoplasmic reticulum, with its active site facing the cytosol.',
    ],
    3: [
      'The second stage is a single, crucial reaction. HMG-CoA reductase reduces HMG-CoA to mevalonate, using two molecules of NADPH as the source of electrons. The thioester group, which held the molecule on coenzyme A, is reduced all the way to an alcohol, and coenzyme A is released. Mevalonate gives the whole pathway its name.',
      'This reaction is the committed and rate-limiting step of cholesterol synthesis. "Committed" means that once mevalonate is made, it has no other major fate than to continue along the pathway. "Rate-limiting" means it is the slowest step, which sets the pace for the whole pathway.',
      'Because of this, HMG-CoA reductase is where the cell controls how much cholesterol it makes, and it is also the target of the most widely used cholesterol-lowering drugs, the statins, which inhibit it. The next lesson but one explains the many ways in which this enzyme is regulated.',
    ],
  },
  'cholesterol-and-bile-biosynthesis-3': {
    0: [
      'In stage 3, mevalonate (six carbons) is converted into the five-carbon building block isopentenyl pyrophosphate (IPP). The conversion takes three steps, and each one uses a molecule of ATP.',
      'In the first two steps, phosphate groups are added: mevalonate is phosphorylated to 5-phosphomevalonate, and then a second phosphate is added to give 5-pyrophosphomevalonate. These phosphate groups activate the molecule.',
      'In the third step, a third ATP is used as the molecule loses a carbon as carbon dioxide (it is decarboxylated) and its hydroxyl group, creating a double bond. The product is isopentenyl pyrophosphate, a five-carbon unit with a double bond and a pyrophosphate (two-phosphate) group. Some IPP is converted to its isomer, dimethylallyl pyrophosphate. These two molecules are called the "activated isoprenes", and they are the building blocks for the next stage.',
    ],
    1: [
      'In stage 4, the five-carbon isoprene units are joined together. The pyrophosphate group on each unit is important: it is a good "leaving group", meaning it easily departs, taking a pair of electrons with it.',
      'The joining reaction works like this. A molecule carrying a pyrophosphate next to a double bond (an allylic pyrophosphate, such as dimethylallyl pyrophosphate) loses its pyrophosphate. This leaves a positively charged carbon, a carbocation, which is very reactive. The double bond of an IPP molecule attacks this positive carbon, joining the two units together and releasing pyrophosphate.',
      'The first joining of two five-carbon units gives geranyl pyrophosphate, with ten carbons. It still has a pyrophosphate group next to a double bond, so it can react with another IPP in the same way, giving farnesyl pyrophosphate, with fifteen carbons. Finally, two farnesyl pyrophosphate molecules are joined head to head, giving squalene, a long linear molecule with thirty carbons.',
      'Each joining releases pyrophosphate, which is quickly broken down into two phosphates; this makes the reactions effectively irreversible and drives the pathway forward.',
    ],
    2: [
      'In stage 5, the long, straight squalene molecule is folded and closed into the four rings of the steroid nucleus. It is one of the most remarkable reactions in biochemistry: a single enzyme creates four rings at once.',
      'First, an oxygen atom is added to one end of squalene, using oxygen and NADPH, which forms an epoxide (squalene 2,3-epoxide). Then a cyclase enzyme holds the molecule folded in a precise shape and triggers a cascade of reactions in which the four rings close one after another. The product is lanosterol, the first compound in the pathway with the complete steroid nucleus.',
      'Lanosterol has 30 carbons, while cholesterol has 27. In a series of about twenty further reactions, three methyl groups are removed and double bonds are moved, converting lanosterol into cholesterol.',
    ],
    3: [
      'The cholesterol pathway is not just a route to cholesterol: several of its intermediates are used to make other important molecules, so the pathway serves many purposes.',
      'Geranyl and farnesyl pyrophosphate can be attached to proteins, a process called prenylation. The fatty isoprene chain acts as an anchor, holding the protein to a cell membrane, which is essential for many signalling proteins.',
      'Farnesyl pyrophosphate, the branch point just before squalene, is also used to make several other compounds: dolichol, which helps add sugar chains to proteins; ubiquinone (coenzyme Q), which carries electrons in the respiratory chain of the mitochondria; and the side chain of haem a, part of the enzyme cytochrome oxidase.',
      'Cholesterol itself has different fates in different tissues: in the liver it is converted into bile acids, and in endocrine glands such as the adrenal cortex and the gonads it is converted into steroid hormones. This branching is one reason why blocking the pathway early, with statins, can have effects beyond lowering cholesterol.',
    ],
  },
  'cholesterol-and-bile-biosynthesis-4': {
    0: [
      'Cells need enough cholesterol for their membranes, but too much is harmful: excess free cholesterol damages membranes and, in the blood, contributes to atherosclerosis. So the body controls its cholesterol supply carefully, balancing what it makes, what it takes in from the blood and what it gets rid of.',
      'Several mechanisms work together. The most important is control of HMG-CoA reductase, the rate-limiting enzyme of synthesis, both its activity and how much of it there is. When there is too much free cholesterol inside a cell, the enzyme ACAT (acyl-CoA:cholesterol acyltransferase) attaches a fatty acid to it, making cholesterol ester, which is stored in harmless droplets.',
      'The level of cholesterol in the blood is also controlled. Cells take up cholesterol from the blood by capturing LDL particles with LDL receptors; when a cell has enough cholesterol, it makes fewer receptors. HDL particles collect excess cholesterol from tissues and carry it back to the liver, a process called reverse cholesterol transport. Finally, cholesterol is used up, for example to make bile acids and hormones, and the cell constantly senses its sterol content and adjusts all these processes accordingly.',
    ],
    1: [
      'Because HMG-CoA reductase controls the rate of the whole pathway, it is regulated in several independent ways, which together give the cell very fine control.',
      'First, feedback inhibition: cholesterol and related products reduce the activity of the enzyme molecules already present. Second, gene expression: the cell can increase or decrease how much new enzyme it makes. Third, degradation: the cell can change how quickly existing enzyme molecules are destroyed. Fourth, covalent modification: adding a phosphate group to the enzyme switches it off, and removing it switches it back on.',
      'The first and fourth controls act within minutes, adjusting the activity of existing enzyme; the second and third act over hours, changing the amount of enzyme. Having several layers of control means the cell can respond both quickly and in a sustained way.',
    ],
    2: [
      'Cholesterol controls its own synthesis in a classic example of feedback. When cholesterol builds up in the cell, it inhibits HMG-CoA reductase molecules already present, reduces the making of new enzyme, and speeds up the destruction of existing enzyme. All three effects reduce cholesterol synthesis.',
      'The destruction works through the cell’s waste-disposal system. When sterols are plentiful, the enzyme is tagged with chains of a small protein called ubiquitin (polyubiquitination). This tag marks it for destruction by the proteasome, a large protein-digesting machine. The enzyme can detect sterols because it contains a sterol-sensing domain within its membrane-spanning part; when sterol levels rise, this domain triggers the enzyme’s rapid breakdown.',
      'The rate of degradation also follows how busy the pathway is. When a lot of material is flowing through the pathway, products accumulate and the enzyme is destroyed faster; when flow is low, it is destroyed more slowly. Statins illustrate this: by inhibiting the enzyme, they reduce the flow through the pathway, so fewer products build up and the enzyme is degraded more slowly. The cell also makes more of it. Even so, statins lower cholesterol overall, partly because the cell responds to its reduced cholesterol by making more LDL receptors and taking more cholesterol out of the blood.',
    ],
    3: [
      'A fast way of switching HMG-CoA reductase off is to add a phosphate group to it. The unmodified, dephosphorylated enzyme is active; the phosphorylated enzyme is much less active.',
      'The phosphate is added by AMP-activated protein kinase (AMPK). As its name suggests, AMPK is activated when AMP levels are high, which means that the cell is running low on energy. This makes sense: when energy is short, the cell should not spend ATP and NADPH making cholesterol. AMPK is itself switched on by being phosphorylated by another kinase, AMPK kinase.',
      'Phosphatases reverse these effects. HMG-CoA reductase phosphatase removes the phosphate from the reductase, switching it back on. Protein phosphatase 2C removes the phosphate from AMPK, switching AMPK off, which also favours an active reductase. The balance between the kinases and the phosphatases determines how active the enzyme is.',
    ],
    4: [
      'Hormones adjust cholesterol synthesis according to whether the body is fed or fasting. Insulin, which is high after a meal, increases cholesterol synthesis, just as it increases fatty acid synthesis: it promotes the removal of the phosphate from HMG-CoA reductase, keeping the enzyme active.',
      'Glucagon and adrenaline (epinephrine), which are high during fasting and stress, reduce cholesterol synthesis. They work by raising cyclic AMP inside the cell, which activates protein kinase A (PKA). PKA phosphorylates and activates a protein called phosphoprotein phosphatase inhibitor-1 (PPI-1).',
      'Once activated, PPI-1 blocks the phosphatases that would normally remove the phosphate from HMG-CoA reductase and AMPK. With the phosphatases blocked, the reductase stays phosphorylated and inactive, so less cholesterol is made. This is the same general strategy that glucagon uses to switch off other energy-consuming building pathways during fasting.',
    ],
  },
  'cholesterol-and-bile-biosynthesis-5': {
    0: [
      'The liver converts cholesterol into bile acids, which are then secreted in the bile to help digest fat. Bile acids are more water-soluble than cholesterol, because they carry extra hydroxyl groups and a shortened side chain ending in a charged group.',
      'The first step is the addition of a hydroxyl group at carbon 7 of the ring system, by the enzyme 7α-hydroxylase, using oxygen and NADPH. This produces 7-hydroxycholesterol. This step is the rate-limiting step of bile acid synthesis and the main point at which it is controlled: bile acids returning to the liver inhibit the enzyme, while cholesterol stimulates it.',
      'From 7-hydroxycholesterol, the pathway divides into two branches, each requiring further hydroxylations (using oxygen and NADPH) and the shortening of the side chain, which releases a three-carbon unit as propionyl-CoA. One branch produces cholyl-CoA, which carries three hydroxyl groups; the other produces chenodeoxycholyl-CoA, which carries two. These are the activated forms of the two primary bile acids, cholic acid and chenodeoxycholic acid.',
    ],
    1: [
      'Before bile acids are secreted, the liver joins them to one of two small molecules, the amino acid glycine or taurine (an amino acid derivative containing sulphur). This step, called conjugation, links the carboxyl group at the end of the bile acid’s side chain to the amino group of glycine or taurine by an amide (–CO–NH–) bond.',
      'Cholic acid joined to glycine becomes glycocholic acid, whose side chain ends in a carboxylic acid group. Joined to taurine, it becomes taurocholic acid, whose side chain ends in a sulphonic acid group.',
      'Conjugation makes the bile acids more acidic, so at the pH of the intestine they are almost completely ionised. In this charged form, called bile salts, they are more water-soluble and better detergents, and they are not easily absorbed until they reach the end of the small intestine, so they stay in the gut where they are needed to digest fat.',
    ],
    2: [
      'Bile acids have four important functions. First, they are the body’s only significant way of getting rid of excess cholesterol. Cholesterol cannot be broken down for energy, since animal cells cannot break its rings. Instead, the liver converts it into bile acids, and those that are lost in the faeces each day carry cholesterol out of the body. This is why drugs that bind bile acids in the gut and stop them being reabsorbed lower blood cholesterol: the liver must use more cholesterol to replace them.',
      'Second, bile acids keep cholesterol dissolved in the bile. Cholesterol itself is almost insoluble in water, but together with phospholipids, bile acids form tiny particles that hold it in solution. If there is too much cholesterol for the bile acids to keep dissolved, it crystallises in the gallbladder, forming gallstones.',
      'Third, bile acids are detergents. In the intestine, they coat droplets of dietary fat and break them into very small droplets (emulsification), creating a large surface on which pancreatic lipase can work. Fourth, they help absorb the products of fat digestion and the fat-soluble vitamins A, D, E and K, by carrying them in micelles to the intestinal lining.',
    ],
  },
};
