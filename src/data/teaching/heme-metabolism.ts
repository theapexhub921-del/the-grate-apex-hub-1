import type { Teaching } from '@/data/teaching/types';

export const teaching: Teaching = {
  'heme-metabolism-1': {
    0: [
      'Haem is a small, flat molecule with an iron atom at its centre, and it is one of the most versatile tools in biology. It is not a protein itself; it is a prosthetic group, a non-protein part that is tightly attached to a protein and gives it its function. The protein around it decides what job the haem does.',
      'In haemoglobin in red blood cells and myoglobin in muscle, haem binds oxygen reversibly, so it can be carried and stored. In the cytochromes of the mitochondrial respiratory chain, the iron in haem switches back and forth between two charge states, passing electrons along to make ATP.',
      'Haem is also found in many enzymes. Catalase and peroxidases use it to break down hydrogen peroxide; tryptophan pyrrolase uses it to break down the amino acid tryptophan; cytochrome P450 enzymes use it to modify drugs and toxins; and nitric oxide synthase and guanylyl cyclase use it to make and sense the signalling gas nitric oxide. Because so many vital proteins depend on haem, nearly every cell can make it.',
    ],
    1: [
      'Haem belongs to a family of molecules called porphyrins, and all of them are built on the same basic framework, porphin. Porphin is a large ring (a macrocycle) made of four smaller rings called pyrroles. Each pyrrole is a five-membered ring containing four carbons and one nitrogen.',
      'The four pyrroles are joined in a circle by four one-carbon bridges (methene bridges, –CH=). The result is a large, flat ring with many alternating double bonds (it is highly unsaturated). These alternating double bonds absorb visible light strongly, which is why porphyrins are intensely coloured: haem makes blood red, and the related chlorophyll makes plants green.',
      'At the centre of the ring, the four pyrrole nitrogens point inwards, creating a perfect pocket for a metal ion. Iron in haem, magnesium in chlorophyll and cobalt in vitamin B₁₂ all sit in this pocket. Porphin itself has no side chains; the different porphyrins are made by attaching different groups around its edge.',
    ],
    2: [
      'Each pyrrole in a porphyrin has two outer positions where side chains can be attached, giving eight in all. The type of porphyrin is named after its side chains, and during haem synthesis the side chains are changed step by step, so the pathway passes through three types in order.',
      'Uroporphyrin carries one acetate group (–CH₂–COO⁻) and one propionate group (–CH₂–CH₂–COO⁻) on each pyrrole. In the next type, coproporphyrin, the acetate groups have lost a carbon dioxide each and become methyl groups (–CH₃), so each pyrrole carries one methyl and one propionate.',
      'In protoporphyrin, two of the four propionates have been converted into vinyl groups (–CH=CH₂), so it carries four methyls, two vinyls and two propionates. The names come from where these compounds were first found: uroporphyrin in urine and coproporphyrin in faeces ("copro" means dung), which is also where they appear in diseases of haem synthesis.',
    ],
    3: [
      'Because each pyrrole carries two different side chains, those side chains can be arranged around the ring in more than one order, giving different isomers. With an acetate (A) and a propionate (P) on each pyrrole, there are four possible arrangements, called uroporphyrins I to IV.',
      'In type I, the pattern repeats regularly all the way round: AP-AP-AP-AP, a symmetrical arrangement. In type III, one pyrrole is turned round, so the pattern reads AP-AP-AP-PA, which is asymmetrical. Only types I and III occur in nature, and only type III leads to haem.',
      'Coproporphyrins have the same problem, since each pyrrole still carries two different groups (a methyl and a propionate), so there are also four coproporphyrins. Protoporphyrins carry three different kinds of side chain, which can be arranged in fifteen ways. The ninth of these, protoporphyrin IX, is the one found in haem and in all haem proteins.',
    ],
    4: [
      'Protoporphyrin IX can be recognised by the positions of its side chains, numbered from 1 to 8 around the ring: methyl groups at 1, 3, 5 and 8; vinyl groups at 2 and 4; and propionate groups at 6 and 7. The two propionates are the longest side chains and carry negative charges; in haemoglobin they point out towards the water, while the rest of the haem is tucked inside the protein.',
      'Haem is protoporphyrin IX with an iron atom in its centre: ferroprotoporphyrin IX. The iron binds the four nitrogens of the ring. Iron can form six bonds in all: four in the plane of the ring, and one above and one below it. In haemoglobin, one of these extra positions is held by a histidine from the protein, and the other is where oxygen binds.',
      'The iron can exist in two states: ferrous (Fe²⁺) or ferric (Fe³⁺). Only ferrous iron can bind oxygen. If the iron of haemoglobin is oxidised to the ferric state, the molecule becomes methaemoglobin, which cannot carry oxygen. Red cells contain enzymes that constantly reduce methaemoglobin back to the ferrous form.',
    ],
  },
  'heme-metabolism-2': {
    0: [
      'The haem molecule is built from two very common starting materials: the amino acid glycine and succinyl-CoA, an intermediate of the citric acid (TCA) cycle. The first step joins them together.',
      'The enzyme δ-aminolevulinate synthase (ALA synthase) joins glycine to the succinyl group of succinyl-CoA. In the process, coenzyme A is released, and the carboxyl group of glycine is lost as carbon dioxide. The product is δ-aminolevulinic acid (ALA), a five-carbon compound with an amino group at one end and a keto group in the middle.',
      'ALA synthase works inside the mitochondria, where succinyl-CoA is made. It needs pyridoxal phosphate (the active form of vitamin B₆) as a cofactor, which is why vitamin B₆ deficiency can cause anaemia. This is the committed step of haem synthesis: once ALA is made, its only fate is to continue towards haem, so this is the step where the pathway is controlled.',
    ],
    1: [
      'Experiments using radioactively labelled glycine and acetate showed exactly where each atom of haem comes from. All four nitrogen atoms of haem come from glycine: each of the four pyrroles of the ring carries one nitrogen, and each was originally the amino group of a glycine molecule.',
      'Haem has 34 carbons. Eight of them come from glycine, specifically from its central (α) carbon; none come from glycine’s carboxyl carbon, because that is the one lost as carbon dioxide in the first step. The other 26 carbons come from succinyl-CoA. Since succinyl-CoA is made in the TCA cycle from acetyl-CoA, these carbons ultimately come from acetate.',
      'So the TCA cycle in the mitochondria supplies succinyl-CoA, and the pathway of haem synthesis is closely linked to energy metabolism.',
    ],
    2: [
      'In the second step, two molecules of ALA are joined together to make porphobilinogen (PBG), the first molecule in the pathway with a pyrrole ring. The enzyme is ALA dehydratase (also called ALA dehydrase or porphobilinogen synthase).',
      'The two ALA molecules condense, losing two molecules of water, and their atoms rearrange to form a five-membered pyrrole ring carrying side chains: an acetate, a propionate and an aminomethyl group (which will later form the bridges between pyrroles). Four PBG molecules will eventually make up the porphyrin ring.',
      'ALA dehydratase works in the cytosol, so ALA must leave the mitochondria. The enzyme needs zinc to work. This is important clinically: lead can displace zinc from the enzyme and block it, which is one of the main effects of lead poisoning.',
    ],
    3: [
      'In the third step, four porphobilinogen molecules are joined in a line by the enzyme porphobilinogen deaminase (also called uroporphyrinogen I synthase). As each PBG is added, its aminomethyl group forms a bridge to the next pyrrole, and its amino group is released as ammonium; hence the name deaminase.',
      'The enzyme has a clever way of holding the growing chain. It carries a built-in primer, a dipyrromethane (two pyrroles joined together), attached to the enzyme through the sulphur of a cysteine. Remarkably, the enzyme makes this primer itself from two PBG molecules. New PBG units are then added one at a time to the end of the primer until the chain has six pyrroles, a linear hexapyrrole, still attached to the enzyme.',
      'The enzyme then cuts the chain between the second and third pyrroles, releasing the four newest pyrroles as a linear tetrapyrrole called hydroxymethylbilane. The original two-pyrrole primer stays on the enzyme, ready for the next round.',
    ],
    4: [
      'Hydroxymethylbilane is a straight chain of four pyrroles, and it must be bent round and closed into a ring. This could happen without any enzyme: the chain closes spontaneously. But if it does, the side chains remain in their regular order, AP-AP-AP-AP, producing uroporphyrinogen I, the symmetrical isomer, which cannot be made into haem.',
      'To make the correct isomer, the enzyme uroporphyrinogen III synthase (or cosynthase) is needed. As it closes the ring, it flips the last pyrrole over, reversing the order of its side chains, probably via an unusual spiro-shaped intermediate. The product is uroporphyrinogen III, with the asymmetric pattern AP-AP-AP-PA, which is the precursor of haem.',
      'Normally, the cosynthase works fast enough that nearly all the hydroxymethylbilane goes down the type III route. If the cosynthase is deficient, as in the disease congenital erythropoietic porphyria, the type I isomer accumulates. It cannot be made into haem, so it builds up and is excreted, and its derivatives cause severe light sensitivity.',
      'Note that uroporphyrinogen differs from uroporphyrin: the "-ogen" form has fewer double bonds and is colourless. The intermediates of the pathway are all porphyrinogens; only when they are oxidised, at the end of the pathway or abnormally, do they become coloured porphyrins.',
    ],
  },
  'heme-metabolism-3': {
    0: [
      'The next steps modify the side chains of uroporphyrinogen III to produce the side chains of haem. In step five, uroporphyrinogen decarboxylase removes a carbon dioxide from each of the four acetate side chains, turning each one into a methyl group.',
      'The product is coproporphyrinogen III, with one methyl and one propionate on each pyrrole. This enzyme works in the cytosol, like the previous three. Its deficiency causes porphyria cutanea tarda, as described in a later lesson.',
    ],
    1: [
      'In step six, coproporphyrinogen moves back into the mitochondria, where coproporphyrinogen oxidase acts on two of its four propionate side chains, those at positions 2 and 4.',
      'Each of these propionate groups (–CH₂–CH₂–COO⁻) loses a carbon dioxide and two hydrogens, so it becomes a vinyl group (–CH=CH₂). Because the reaction combines a decarboxylation with an oxidation, it is called an oxidative decarboxylation.',
      'The product is protoporphyrinogen IX. The two vinyl groups of haem have now been formed; the two remaining propionates, at positions 6 and 7, stay in the finished haem.',
    ],
    2: [
      'Two more steps complete the pathway, both in the mitochondria. In step seven, protoporphyrinogen oxidase removes six hydrogen atoms from protoporphyrinogen IX, creating the full system of alternating double bonds around the ring. The colourless porphyrinogen becomes protoporphyrin IX, an intensely coloured porphyrin.',
      'In the final step, ferrochelatase (also called haem synthase), which sits on the inner mitochondrial membrane, inserts a ferrous iron (Fe²⁺) into the centre of protoporphyrin IX, where it binds to the four nitrogens. The result is haem.',
      'So the iron is added only at the very end, after the porphyrin ring has been fully built. If iron is lacking, or ferrochelatase is blocked, as in lead poisoning, protoporphyrin builds up in red cells, and zinc may be inserted instead of iron, forming zinc protoporphyrin, a useful laboratory marker.',
    ],
    3: [
      'Haem synthesis is unusual because it moves between two compartments of the cell. It starts in the mitochondria, moves out to the cytosol for the middle steps, and returns to the mitochondria to finish.',
      'The first step (ALA synthase) is in the mitochondria, because that is where succinyl-CoA is made. ALA then leaves for the cytosol, where the next four enzymes act: ALA dehydratase, PBG deaminase, uroporphyrinogen III synthase and uroporphyrinogen decarboxylase. Coproporphyrinogen then returns to the mitochondria for the last three steps: coproporphyrinogen oxidase, protoporphyrinogen oxidase and ferrochelatase.',
      'This arrangement has consequences. Haem is needed in the mitochondria for the cytochromes, and the final iron-inserting step happens there. And mature red blood cells, which have lost their mitochondria, can no longer make haem, although they still contain the four cytosolic enzymes, which is why some of these enzymes can be measured in red cells. Of all the enzymes, only ALA dehydratase needs a metal, zinc, to work.',
    ],
  },
  'heme-metabolism-4': {
    0: [
      'Haem is essential, but its precursors are toxic when they accumulate, and free haem itself can damage cells. So haem synthesis must be closely matched to need. The pathway is controlled mainly at its first, committed step, ALA synthase, which is usually the slowest step and so sets the rate of the whole pathway.',
      'In most cells, including the liver, haem controls ALA synthase by feedback. When haem is plentiful, it represses the transcription of the ALA synthase gene, so less enzyme is made. Excess haem also inhibits the enzyme already present, and it can block the transport of the newly made enzyme into the mitochondria. When haem is used up, for example when the liver makes more cytochrome P450 to break down a drug, the repression is lifted and more ALA synthase is made.',
      'Developing red cells use a different version of ALA synthase. Its production is controlled mainly by the supply of iron, sensed as iron–sulphur clusters. This makes sense: in red cells, haem synthesis must match the iron available to make haemoglobin, rather than being shut down by the large amounts of haem the cell is producing.',
    ],
    1: [
      'Two tissues make most of the body’s haem, and they use it for different purposes. Developing red cells in the bone marrow make by far the most, about 85% of the total, to build haemoglobin. In these cells, haem also stimulates the making of globin, so that haem and protein are produced together. When the red cell matures and loses its mitochondria and nucleus, haem synthesis stops for good.',
      'The liver is the other main producer. It uses most of its haem to make the cytochrome P450 enzymes that break down drugs and toxins. The liver’s demand for haem changes greatly, because many drugs increase the production of cytochrome P450, so its synthesis is controlled mainly at ALA synthase, the rate-limiting step.',
      'In red cells, control is spread over several steps, including ferrochelatase and PBG deaminase, as well as the iron-sensitive form of ALA synthase. This difference explains why certain drugs that induce liver enzymes can trigger attacks of the liver (hepatic) porphyrias.',
    ],
    2: [
      'A developing red cell must make haem and globin in matching amounts, because haemoglobin needs one haem for every globin chain. If it made too much globin, the chains would precipitate; if too much haem, free haem would damage the cell. The cell keeps the two in balance using a form of haem called hemin.',
      'When free haem accumulates, it is oxidised to hemin (haem with ferric iron). Hemin acts in two ways. First, it represses ALA synthase, slowing the making of new haem.',
      'Second, it stimulates the making of globin. In red-cell precursors, a kinase can switch off protein synthesis by phosphorylating a factor needed to start translation (eIF2). Hemin inhibits this kinase, so eIF2 stays active and globin is made. The extra globin then combines with the excess haem. When haem is scarce, the kinase becomes active, protein synthesis stops, and no globin is made without haem to pair with it.',
    ],
    3: [
      'The feedback control of haem synthesis can be used as a treatment. Hemin, haem with ferric iron and a chloride, is available as a drug (Panhematin) and is given by intravenous infusion to treat acute attacks of porphyria, especially acute intermittent porphyria.',
      'In these attacks, the toxic precursors ALA and PBG build up in the liver. The infused hemin is taken up by the liver, where it acts like the body’s own haem: it represses ALA synthase, so less ALA and PBG are made, and their levels fall.',
      'Hematin is a similar compound in which the chloride is replaced by a hydroxide; the two names are sometimes used interchangeably. Hematin is also the "X factor" that the bacterium Haemophilus influenzae needs to grow, because it cannot make haem itself; that is why it is grown on agar containing blood.',
    ],
  },
  'heme-metabolism-5': {
    0: [
      'Inherited diseases of metabolism follow a common logic. A metabolic pathway is a chain of reactions, each catalysed by an enzyme, and if one enzyme is missing or faulty, the chain is broken at that point. Many of the disease’s features can be predicted from where the break is.',
      'Material before the block cannot be processed, so the substrate and intermediates upstream build up. Less of the final product is made. The accumulating intermediates may be diverted into another pathway, producing an unusual product. And the accumulated substances may be excreted in the urine or deposited in tissues, where they can cause damage.',
      'Applying this logic to haem synthesis explains the porphyrias: each porphyria results from a deficiency of one enzyme, and the intermediates that accumulate depend on which enzyme is affected.',
    ],
    1: [
      'The porphyrias are a group of rare diseases, each caused by deficiency of one of the enzymes of haem synthesis. Most are inherited in an autosomal dominant way: the person has one faulty copy of the gene and one normal copy, so they have about half the normal amount of the enzyme. This is usually enough to make sufficient haem, so many carriers never have symptoms.',
      'Problems arise when the demand for haem increases. Some drugs (for example barbiturates), chemicals, alcohol, fasting and hormonal changes increase the liver’s need for cytochrome P450, which lifts the repression of ALA synthase. More ALA is made, but the partly blocked enzyme cannot keep up, so the precursors before the block accumulate. These porphyrins and precursors are toxic in high concentrations, and attacks can also be triggered by sunlight in the forms affecting the skin.',
      'The symptoms depend on what accumulates. Excess ALA and PBG affect the nervous system, causing abdominal pain and neuropsychiatric symptoms. Excess porphyrins, which absorb light, cause skin damage on exposure to sunlight. Treatment of acute attacks uses hemin, which represses ALA synthase and stops the precursors from accumulating; avoiding triggers is also important.',
    ],
    2: [
      'Each step of haem synthesis has its own porphyria, named after its main features. Deficiency of ALA dehydratase causes ALA dehydratase porphyria, a very rare condition. Deficiency of PBG deaminase causes acute intermittent porphyria.',
      'Deficiency of uroporphyrinogen III cosynthase causes congenital erythropoietic porphyria, in which the type I isomers accumulate. Deficiency of uroporphyrinogen decarboxylase causes porphyria cutanea tarda. Deficiency of coproporphyrinogen oxidase causes hereditary coproporphyria, and deficiency of protoporphyrinogen oxidase causes variegate porphyria. Finally, deficiency of ferrochelatase causes erythropoietic protoporphyria.',
      'A helpful pattern: blocks early in the pathway cause buildup of ALA and PBG, which are not light-sensitive, so they produce neurological and abdominal symptoms. Blocks later in the pathway cause buildup of porphyrins, which are, so they produce skin symptoms. Some blocks, such as those in hereditary coproporphyria and variegate porphyria, can produce both.',
    ],
    3: [
      'Acute intermittent porphyria is caused by deficiency of porphobilinogen deaminase, the enzyme that joins PBG units into a chain. It is a hepatic porphyria (the main problem is in the liver) and is inherited as an autosomal dominant trait.',
      'Because the block comes early in the pathway, the substances before it accumulate: PBG and ALA (and some uroporphyrin), which appear in the blood and urine. The urine may darken on standing as the PBG oxidises. Since ALA and PBG are not light-sensitive, the skin is not affected.',
      'Instead, the patient suffers attacks of neurovisceral symptoms: severe abdominal pain, vomiting and constipation, together with neuropsychiatric symptoms such as anxiety, confusion, hallucinations, and weakness from damage to the nerves. Attacks are triggered by drugs, alcohol, fasting and hormonal changes, and are treated with hemin and glucose, which both reduce ALA synthase.',
    ],
    4: [
      'Porphyria cutanea tarda is caused by deficiency of uroporphyrinogen decarboxylase. It is a hepatic porphyria, and the inherited form is autosomal dominant, though acquired forms, associated with alcohol, liver disease and excess iron, are common.',
      'Because the block comes later in the pathway, uroporphyrinogen accumulates and is excreted in the urine. The main problem is the skin. Porphyrinogens deposited in the skin are oxidised to porphyrins, which absorb light. When light strikes them, they react with oxygen to form reactive oxygen species (oxygen radicals), which damage the skin.',
      'Patients therefore develop cutaneous photosensitivity: blisters, fragile skin and scarring on sun-exposed areas, such as the backs of the hands. Avoiding sunlight is part of the treatment. "Tarda" means late, because symptoms typically begin in adulthood.',
    ],
    5: [
      'Lead poisoning interferes with haem synthesis, and its effects resemble a porphyria. Lead mainly blocks two enzymes: ALA dehydratase, most strongly, and ferrochelatase. ALA dehydratase normally contains zinc held by sulphur-containing cysteine groups; lead binds strongly to these same sites in place of zinc, inactivating the enzyme.',
      'With ALA dehydratase blocked, ALA accumulates in the blood and is excreted in the urine. ALA levels rise even further because less haem is made, so the repression of ALA synthase is lifted. With ferrochelatase blocked, protoporphyrin cannot receive iron and accumulates in red cells, where zinc is inserted instead, forming zinc protoporphyrin. Coproporphyrin also appears in the urine. Since less haem is made, the patient becomes anaemic.',
      'The high ALA is thought to cause some of the neurological symptoms of lead poisoning, which resemble those of acute intermittent porphyria: abdominal pain and nerve damage. ALA resembles the brain’s inhibitory transmitter GABA, so it may interfere with nerve signalling, and it can generate reactive oxygen species. Lead also damages the nervous system directly.',
      'These changes give useful laboratory tests. Raised ALA in the urine and reduced ALA dehydratase activity in red cells reflect recent exposure, while raised zinc protoporphyrin in red cells reflects exposure over the life of the red cells, months.',
    ],
  },
  'heme-metabolism-6': {
    0: [
      'Red blood cells live for about 120 days. As they age, they become stiffer and are removed from the circulation by macrophages of the reticuloendothelial system, especially in the spleen. Their haemoglobin is broken down, and this is the main source of haem for catabolism.',
      'Smaller amounts of haem come from the breakdown of other haem proteins, such as the cytochrome P450 enzymes of the liver, myoglobin, catalase and the respiratory chain cytochromes. Some also comes from red cells that are destroyed while still developing in the bone marrow (ineffective erythropoiesis), which increases greatly in diseases such as pernicious anaemia and thalassaemia.',
      'Altogether, the body breaks down enough haem each day to produce about 250–300 mg of bilirubin, most of it from the haemoglobin of old red cells.',
    ],
    1: [
      'The breakdown of haem begins with the enzyme haem oxygenase, which opens the porphyrin ring. It cuts the ring at one specific bridge, the α-methene bridge between the two pyrroles that carry vinyl groups, using oxygen and electrons from NADPH.',
      'Opening the ring releases two things. The carbon of the bridge is released as carbon monoxide (CO), and the iron is released from the centre of the ring. This is the only reaction in the body that produces carbon monoxide, which is breathed out through the lungs; a small fraction of the body’s haemoglobin always carries this carbon monoxide. The iron is recycled to make new haem.',
      'Haem oxygenase has some other notable features. It is induced by its substrate: when more haem needs to be broken down, more enzyme is made. And it acts only on haem: protoporphyrin without iron is not broken down by it.',
    ],
    2: [
      'When haem oxygenase opens the ring, the result is a straight chain of four pyrroles called biliverdin IXα. Biliverdin is green. It is then reduced by biliverdin reductase, an enzyme in the cytosol that uses NADPH, which adds hydrogen to the central bridge. The product is bilirubin IXα, an orange-yellow pigment.',
      'These colour changes can be seen in a bruise. Blood leaking into the tissues makes the bruise purple-black (haemoglobin). Over the following days, as the haem is broken down, it turns green (biliverdin), then yellow (bilirubin), before fading away.',
    ],
    3: [
      'The breakdown of an old red cell happens inside a macrophage. The macrophage engulfs the red cell (phagocytosis) and digests it within a phagolysosome, separating haemoglobin into its haem and globin parts.',
      'The globin is a protein, so it is simply broken down into amino acids, which are reused. The iron released from haem is valuable and is not wasted: it may be stored inside the macrophage as ferritin or haemosiderin, or released into the blood, where it binds the carrier protein transferrin, a process helped by the copper-containing protein ceruloplasmin. Transferrin carries the iron to the bone marrow to make new red cells.',
      'The porphyrin ring is converted to bilirubin, which leaves the macrophage. This bilirubin has not yet been modified by the liver, so it is called unconjugated bilirubin. Because it is insoluble in water, it travels in the blood bound to albumin.',
    ],
  },
  'heme-metabolism-7': {
    0: [
      'Unconjugated bilirubin is poorly soluble in water and is toxic, especially to the brain. So it does not travel freely in the blood; it is carried bound to albumin (and to some α-globulins) from the spleen and other sites to the liver.',
      'Binding to albumin keeps it in solution and stops it from crossing into tissues such as the brain. At the liver, bilirubin is released from albumin and taken up across the membrane of the liver cells facing the blood. Inside the liver cell, it is bound by carrier proteins such as ligandin, which hold it in the cell and bring it to the enzymes that will process it.',
    ],
    1: [
      'To get rid of bilirubin, the liver must make it water-soluble, so that it can be excreted in the bile. It does this by conjugation: attaching two molecules of glucuronic acid, a sugar acid, to the bilirubin molecule.',
      'Each of bilirubin’s two propionate side chains is joined by an ester bond to a glucuronic acid. The glucuronic acid is supplied in an activated form, UDP-glucuronate, and the enzyme is UDP-glucuronyl transferase (UGT), located in the endoplasmic reticulum of the liver cell. The product is bilirubin diglucuronide, called conjugated bilirubin.',
      'Conjugated bilirubin is water-soluble. The liver cell actively pumps it into the bile canaliculi, from where it flows with the bile into the intestine. Since it is water-soluble, conjugated bilirubin can also appear in the urine if it accumulates in the blood, while unconjugated bilirubin, bound to albumin, cannot.',
    ],
    2: [
      'When conjugated bilirubin reaches the intestine, it is not absorbed well by the intestinal lining. Further down the gut, in the end of the small intestine and the colon, bacterial enzymes remove the glucuronic acid groups, and bacteria then reduce the bilirubin to a group of colourless compounds called urobilinogens (stercobilinogens).',
      'Most urobilinogen stays in the gut and is oxidised to coloured compounds, the stercobilins, which give faeces their brown colour. This is why the stools become pale when bile cannot reach the gut, for example when the bile duct is blocked.',
      'Some urobilinogen is absorbed back into the blood and carried to the liver, which re-excretes most of it into the bile; this circuit is called the enterohepatic circulation. A small amount escapes into the general circulation and is excreted by the kidneys; in the urine, it is oxidised to urobilin, which gives urine its yellow colour.',
    ],
    3: [
      'Jaundice is the yellow colour of the skin and the whites of the eyes caused by too much bilirubin in the blood. It is a sign rather than a disease, and the way to understand its causes is to ask where along the path of bilirubin the problem lies: before the liver, in the liver or after the liver.',
      'In prehepatic jaundice, too much bilirubin is produced, usually because red cells are being destroyed too fast (haemolysis). Examples include blood group incompatibility (ABO or Rhesus), G6PD deficiency, sickle cell disease and thalassaemia. The liver cannot conjugate it fast enough, so unconjugated bilirubin rises.',
      'In hepatic jaundice, the liver itself is at fault. Infections such as viral hepatitis, and drugs and chemicals such as alcohol and paracetamol overdose, damage the liver cells. Inherited defects can affect particular steps: in Gilbert’s and Crigler–Najjar syndromes, the uptake or conjugation of bilirubin is reduced, so unconjugated bilirubin rises; in Dubin–Johnson and Rotor syndromes, the excretion of conjugated bilirubin is impaired. Other diseases, such as Wilson’s disease, α₁-antitrypsin deficiency and autoimmune hepatitis, also damage the liver.',
      'In posthepatic (obstructive) jaundice, bile cannot drain, either within the liver or in the ducts outside it. Within the liver, drugs such as oral contraceptives, primary biliary cirrhosis and inflammation of the bile ducts can obstruct the flow; outside the liver, gallstones and tumours, such as cancer of the head of the pancreas, block the bile duct. Conjugated bilirubin backs up into the blood, darkening the urine, and the stools become pale.',
    ],
    4: [
      'Many newborn babies become slightly yellow in their first days of life. Before birth, the placenta removed bilirubin from the fetus, but after birth the baby’s liver must do the job, and the enzyme that conjugates bilirubin (UDP-glucuronyl transferase) is not yet fully active. At the same time, the baby is breaking down extra red cells. So unconjugated bilirubin builds up.',
      'Usually this is harmless and fades as the liver matures. But if unconjugated bilirubin rises very high, it can cross into the baby’s brain and damage it, a condition called kernicterus. So high levels must be treated.',
      'Phototherapy is the main treatment. The baby is placed under blue light, which penetrates the skin and changes the shape of the bilirubin molecules there, converting them into photoisomers that are more water-soluble and less toxic. These can be excreted in bile and urine without needing to be conjugated, so the bilirubin level falls.',
    ],
  },
};
