import type { Teaching } from '@/data/teaching/types';

export const teaching: Teaching = {
  'blood-coagulation-and-fibrinolysis-1': {
    0: [
      'Blood must stay liquid inside the vessels but turn solid within minutes when a vessel is cut. To achieve this, the body keeps a set of clotting proteins circulating in an inactive form, ready to be switched on. Most of them are enzymes of a particular type, serine proteases, which cut other proteins at specific points, in this case at bonds next to the amino acid arginine.',
      'The clotting factors are arranged in a cascade: each activated enzyme activates the next one in the chain. Because one enzyme molecule can activate many molecules of the next, the signal is amplified at every step, like a pyramid. A tiny trigger, involving only trace amounts of the first factors, produces a huge response at the end, converting the large amount of fibrinogen in the plasma into a clot within minutes.',
      'Such a powerful amplifier is dangerous if it fires by accident, so it is tightly controlled. Inhibitors in the blood mop up small amounts of activated factors, so a weak stimulus, below a threshold, does not start the cascade. Once clotting starts, it is kept local because flowing blood carries the activated factors away, and they are inactivated and cleared, largely by the liver.',
      'Clotting is not the only cascade of this kind in the blood. Similar chains of protease activation dissolve clots (fibrinolysis), produce kinins such as bradykinin, which dilate blood vessels, and activate complement, part of the immune system.',
    ],
    1: [
      'Haemostasis means stopping bleeding, and it happens in three overlapping steps. First, the damaged blood vessel constricts, reducing the flow of blood through it.',
      'Second, platelets stick to the exposed tissue at the wound and to each other, forming a soft plug that temporarily seals the hole. Platelets are activated by contact with collagen in the vessel wall, and they release substances that attract and activate more platelets.',
      'Third, the coagulation cascade produces fibrin, a tough protein mesh that reinforces the platelet plug, trapping red cells and forming a stable clot. This system is life-saving at a wound, but the same process can go wrong inside an intact vessel, forming a clot that blocks the flow, called a thrombus, which can cause heart attacks and strokes.',
    ],
    2: [
      'The cascade can be started in two ways, called the intrinsic and extrinsic pathways, which meet in a final common pathway.',
      'The intrinsic pathway is triggered when blood touches an abnormal surface, such as collagen exposed by damage. Factor XII (Hageman factor) is activated on the surface, helped by kallikrein and kininogen. Factor XIIa activates factor XI, which activates factor IX (Christmas factor). Factor IXa then activates factor X, but only effectively when it forms a complex with its partner, factor VIIIa, on a phospholipid surface in the presence of calcium. Factor VIII speeds this step about a thousand-fold, which is why its absence (haemophilia A) causes such severe bleeding.',
      'The extrinsic pathway is triggered by tissue damage. Damaged tissue exposes tissue factor (factor III), which binds factor VII and activates it. The tissue factor–VIIa complex then activates factor X directly. This route is short and fast, and it is the main way clotting is started in the body.',
      'Both pathways lead to activated factor X. In the common pathway, factor Xa, with its partner factor Va, converts prothrombin (factor II) into thrombin. Thrombin cuts fibrinogen (factor I) into fibrin, which forms the clot. Finally, factor XIIIa cross-links the fibrin, making the clot strong. Not every factor is an enzyme: factors V and VIII and tissue factor are helper proteins (cofactors) that speed up the enzymes.',
    ],
    3: [
      'The intrinsic pathway begins when factor XII meets a surface it recognises as abnormal. In the body, such surfaces include collagen and other components of the vessel wall that are exposed when the lining is damaged, toxins from bacteria (endotoxins from gram-negative bacteria and wall products of gram-positive bacteria), some fatty acids and antigen–antibody complexes.',
      'In the laboratory, glass and kaolin (a type of clay) activate factor XII, which is why blood clots quickly in a glass tube. Surfaces such as silicone and some plastics do not, so they are used to collect blood that must stay liquid.',
      'Factor XII works together with prekallikrein and high-molecular-weight kininogen, forming the "contact system". Once a little factor XII is activated, it activates kallikrein, which activates more factor XII, so the system amplifies itself. As well as starting clotting, it helps activate the clot-dissolving system, produces bradykinin and activates parts of complement. Curiously, people who lack factor XII or its partners do not bleed abnormally, which shows that the extrinsic pathway is the main starter of clotting in the body.',
    ],
    4: [
      'The clotting factors were named with Roman numerals in roughly the order they were discovered, which is why the numbers do not follow the sequence of the cascade. Most also have older names, often after the patients in whom their deficiency was first found.',
      'Factor I is fibrinogen, the protein that becomes fibrin. Factor II is prothrombin, the precursor of the enzyme thrombin. Factor III is tissue factor, which starts the extrinsic pathway. Factor IV is simply calcium. Factors V (proaccelerin) and VIII (antihaemophilic factor) are cofactors. Factors VII, IX (Christmas factor), X (Stuart–Prower factor), XI and XII (Hageman factor) are serine proteases. Factor XIII (fibrin-stabilising factor) is a transglutaminase that cross-links fibrin. There is no factor VI; that number turned out to be activated factor V.',
      'Most of the clotting factors are made in the liver, so severe liver disease causes bleeding. Four of them, factors II, VII, IX and X, need vitamin K for their production, which, as a later lesson explains, is why vitamin K deficiency and drugs such as warfarin impair clotting. Von Willebrand factor, which helps platelets stick, is made by the lining of the blood vessels.',
    ],
  },
  'blood-coagulation-and-fibrinolysis-2': {
    0: [
      'Platelets (thrombocytes) are small fragments of cells, shaped like discs, that circulate in the blood. They are pinched off from large cells in the bone marrow called megakaryocytes. They have no nucleus, but they contain mitochondria and other structures, so they are metabolically active. There is roughly one platelet for every twenty red cells.',
      'Platelets carry stores of chemicals in their granules, which they release when they are activated. Dense granules contain ADP, ATP, calcium and serotonin: ADP attracts and activates more platelets, calcium is needed for clotting, and serotonin constricts blood vessels. α-Granules contain proteins, including platelet factor 4, β-thromboglobulin, platelet-derived growth factor (which helps heal the wound), fibrinogen and von Willebrand factor.',
      'Platelets have several functions in haemostasis. They stick to exposed collagen at a wound, with the help of von Willebrand factor; they change shape, release their granules and stick to each other, forming a plug; and their membranes provide the phospholipid surface on which clotting factors assemble. The lecture asks you to read further on platelet function, which is central to understanding bleeding disorders and anti-platelet drugs.',
    ],
    1: [
      'Fibrinogen is the raw material of the clot. It is a large, elongated protein made of six chains: two each of three different chains, called Aα, Bβ and γ. These are arranged symmetrically, with the two halves joined at the middle. Under the electron microscope, a fibrinogen molecule looks like three knobs joined by two rods: a central knob, where the two halves meet, and two knobs at the ends.',
      'Fibrinogen is present in high concentration in the plasma. As long as it remains intact, it stays dissolved and does not clump. Thrombin turns it into fibrin by cutting four specific peptide bonds, each between an arginine and a glycine, near the middle of the molecule.',
    ],
    2: [
      'Thrombin’s four cuts release four small peptides from the central part of fibrinogen: two A peptides from the Aα chains and two B peptides from the Bβ chains. These are the fibrinopeptides. What remains, still containing almost all of the original molecule, is the fibrin monomer.',
      'The fibrinopeptides are the key to why fibrinogen does not clot on its own. They carry a large negative charge, because they are rich in aspartate and glutamate, and fibrinopeptide B also contains a sulphated tyrosine. Since all fibrinogen molecules carry these negative charges on their central knob, they repel each other and stay apart in solution.',
      'Once the fibrinopeptides are removed, the repulsion disappears, and binding sites that were previously covered are exposed. The fibrin monomers then spontaneously stick to each other, end to middle, building up long strands. These strands branch and join into a mesh of fibrin fibres that traps blood cells and forms the clot.',
    ],
    3: [
      'The first fibrin mesh is held together only by weak, non-covalent attractions, so it is soft and easily broken apart. To make it strong, the clot is reinforced by covalent bonds.',
      'This is the job of factor XIII. Thrombin activates it to factor XIIIa, a transglutaminase. It forms a bond between the side chain of a glutamine on one fibrin molecule and the side chain of a lysine on a neighbouring molecule, releasing ammonia. These cross-links tie the fibrin molecules together, turning the soft mesh into a firm, stable clot that can withstand the pressure of the blood.',
      'People who lack factor XIII form clots that are too weak, so they bleed after the clot has apparently formed, and their wounds heal poorly.',
    ],
  },
  'blood-coagulation-and-fibrinolysis-3': {
    0: [
      'Thrombin is the central enzyme of clotting. It circulates as an inactive precursor, prothrombin (factor II). Factor Xa, working with factor Va on a phospholipid surface, activates prothrombin by cutting it at two places, releasing the active enzyme, thrombin.',
      'Thrombin has two chains, A and B, and its B chain closely resembles the digestive enzymes trypsin, chymotrypsin and elastase. Like them, it is a serine protease, with a serine in its active site that does the cutting. Thrombin specifically cuts bonds between arginine and glycine.',
      'Thrombin does far more than convert fibrinogen into fibrin. It also activates factors V, VIII and XIII, and it activates platelets, so it accelerates its own production in a powerful positive feedback loop. Because of this central role, it is the target of several anticoagulant drugs.',
    ],
    1: [
      'The clotting reactions do not happen freely in the blood; they happen on surfaces, mainly the phospholipid membranes of activated platelets at the site of injury. When platelets are activated, negatively charged phospholipids that are normally hidden inside their membranes become exposed on the surface. Clotting factors bind to this surface, which brings them together and concentrates them enormously, speeding up their reactions. Because the surface is only present where platelets have been activated, clotting is confined to the site of injury.',
      'Calcium is essential for this binding: it acts as a bridge between the negatively charged clotting factors and the negatively charged phospholipid. Without calcium, the factors cannot bind to the surface, and clotting stops.',
      'This is the basis of the anticoagulants used in blood tubes and stored blood. Citrate, oxalate and EDTA all bind calcium tightly, removing it from the plasma, so the blood cannot clot. Adding calcium back allows clotting to resume, which is how clotting tests are started in the laboratory.',
    ],
    2: [
      'Factors II, VII, IX and X (the prothrombin complex) must bind calcium in order to anchor to phospholipid surfaces, and they are only able to do so because of a special modification. Near the start of each of these proteins, several glutamate residues are converted into γ-carboxyglutamate: an extra carboxyl group is added to each.',
      'This modification is made after the protein has been built (post-translationally), in the liver, by an enzyme that needs vitamin K. An ordinary glutamate, with a single carboxyl group in its side chain, binds calcium weakly. γ-Carboxyglutamate, with two neighbouring carboxyl groups, forms a pincer that grips calcium strongly. Through these calcium ions, the clotting factors attach to the phospholipid membrane, where they can be activated.',
      'Without vitamin K, the factors are still made but lack the extra carboxyl groups, so they cannot bind calcium and do not work. Drugs that block the recycling of vitamin K, such as warfarin and dicoumarol, exploit this: they are used as anticoagulants to prevent thrombosis, and in larger doses as rat poisons, which kill by causing bleeding. Because they act on the making of new factors, they take days to work; when a rapid effect is needed, heparin is used instead.',
    ],
    3: [
      'Vitamin K deficiency causes bleeding, because the vitamin K-dependent factors cannot work. Vitamin K comes from green vegetables and is also made by bacteria in the gut. Since it is fat-soluble, its absorption depends on bile.',
      'So deficiency occurs when bile cannot reach the intestine, as in obstructive jaundice, and when absorption of fat is impaired, as in malabsorption, and with poor nutrition.',
      'Newborn babies are particularly at risk. Little vitamin K crosses the placenta, the mother’s intake may be low, the baby’s immature liver makes little bile, so fat-soluble vitamins are poorly absorbed, and the newborn gut has no bacteria yet to make vitamin K. This is why babies are routinely given an injection of vitamin K at birth, to prevent haemorrhagic disease of the newborn.',
    ],
    4: [
      'Haemophilia is an inherited bleeding disorder caused by lack of a clotting factor. The commonest forms, haemophilia A and B, are inherited as X-linked recessive traits. Because the gene is on the X chromosome, men, who have only one X, are affected if they inherit a faulty copy, while women with one faulty copy are usually carriers without symptoms.',
      'Haemophilia A, the commonest, accounting for over 80% of cases, is caused by a faulty factor VIII. Haemophilia B (Christmas disease), about 15%, is caused by lack of factor IX. Since both factors act together to activate factor X in the intrinsic pathway, both diseases have similar effects. Rarer conditions include haemophilia C, lack of factor XI, and congenital parahaemophilia, lack of factor V.',
      'People with haemophilia bleed excessively after injuries or surgery, and they suffer spontaneous bleeding deep in the body, especially into joints (haemarthrosis), which damages them over time, and into muscles. Bleeding in the head and neck can block the airway; bleeding into the brain can be fatal; and blood may appear in the urine. Treatment is to replace the missing factor.',
    ],
    5: [
      'Von Willebrand factor (vWF) is a large glycoprotein made by the lining of blood vessels and by megakaryocytes. It is not an enzyme; it is a sticky bridge. It has two main jobs. It helps platelets stick to exposed collagen at a wound, especially in fast-flowing blood, and it carries factor VIII in the blood, protecting it from being broken down.',
      'When von Willebrand factor is lacking or faulty, as in von Willebrand disease, the most common inherited bleeding disorder, platelets do not stick properly and factor VIII levels may fall, so the patient bleeds easily, for example from the gums and nose and with heavy periods. Abnormalities of vWF are also involved in other diseases, such as thrombotic thrombocytopenic purpura, and high levels, found in many cardiovascular, cancer and connective tissue diseases, may increase the risk of thrombosis.',
      'Kallikreins are another family of serine proteases. Plasma kallikrein, part of the contact system, cuts kininogen to release bradykinin, which dilates blood vessels and makes them leaky, causing the redness, swelling and pain of acute inflammation.',
    ],
  },
  'blood-coagulation-and-fibrinolysis-4': {
    0: [
      'Once clotting begins, it must be kept to the site of injury. If the cascade spread throughout the circulation, the blood would solidify. Several mechanisms prevent this.',
      'Fibrin itself helps: as the clot forms, it binds thrombin, holding it within the clot and limiting how much escapes into the circulation. In this way, clot formation removes the last active enzyme of the cascade.',
      'Activated clotting factors are also short-lived. Flowing blood dilutes them and carries them away from the wound; specific inhibitors in the plasma inactivate them; the liver and the macrophages of the reticuloendothelial system remove them from the blood; and other proteases break them down. The result is that clotting is intense at the wound but does not extend far beyond it.',
    ],
    1: [
      'The most important natural inhibitor of clotting is antithrombin III, a protein in the plasma. It binds to thrombin and permanently inactivates it, by forming an irreversible complex. It also inhibits several other activated clotting factors, IXa, Xa and XIa, and plasmin.',
      'On its own, antithrombin works fairly slowly. Its action is greatly accelerated by heparin, a negatively charged polysaccharide (a glycosaminoglycan) found in mast cells near blood vessels and on the surface of the blood vessel lining. Heparin binds to antithrombin and changes its shape, increasing its affinity for the clotting enzymes about a hundred-fold, so thrombin is neutralised almost instantly.',
      'This is how heparin works as an anticoagulant drug: it acts within minutes, unlike warfarin, so it is used when rapid anticoagulation is needed, for example to treat a blood clot in the lung or leg. People with an inherited lack of antithrombin III are prone to dangerous thrombosis.',
    ],
    2: [
      'Clots are not permanent: once a wound has healed, the clot must be removed, and the body must be able to clear unwanted clots. This is done by fibrinolysis, the dissolving of fibrin. The enzyme responsible is plasmin (fibrinolysin), a protease similar to trypsin. It circulates in an inactive form, plasminogen.',
      'Plasminogen is converted into plasmin by activators. The most important is tissue plasminogen activator (TPA), released by the lining of the blood vessels, especially when they are damaged. Others include an activator generated in the blood by factor XII and kallikrein, and urokinase, made by the kidney, which keeps the urinary tract free of clots.',
      'The system is cleverly targeted to the clot. When fibrin forms, plasminogen sticks to it, becoming incorporated into the clot. TPA also binds strongly to fibrin, and it activates plasminogen much more efficiently when both are on the fibrin. So plasmin is produced on the clot, where it is needed, and the plasmin formed binds tightly to the fibrin.',
      'Plasmin cuts the insoluble fibrin into small soluble pieces, called fibrin degradation products, dissolving the clot. Any plasmin that escapes into the general circulation is rapidly inactivated by inhibitors, the antiplasmins (including α₂-macroglobulin), so it does not destroy clotting factors throughout the body.',
    ],
    3: [
      'Understanding the clotting and fibrinolytic systems explains how several important drugs work. Aspirin is an anti-platelet drug. When platelets are activated, they convert arachidonic acid into thromboxane A₂, which makes other platelets aggregate; the key enzyme is cyclo-oxygenase-1 (COX-1).',
      'Aspirin permanently blocks this enzyme by attaching an acetyl group to a serine in its active site. Platelets have no nucleus, so they cannot make new enzyme, and the effect lasts for the platelet’s whole life of about ten days. A small daily dose is enough to stop platelets making thromboxane, which is why low-dose aspirin is used to prevent heart attacks and strokes.',
      'Thrombolytic drugs ("clot-busters") work by activating plasminogen, so that plasmin dissolves existing clots. Examples include streptokinase (made by streptococcus bacteria), urokinase and tissue plasminogen activator. They are given soon after a heart attack or stroke caused by a clot, to reopen the blocked artery, and are also used for clots in the lungs (pulmonary embolism), deep veins and catheters. Their main risk is bleeding.',
    ],
  },
};
