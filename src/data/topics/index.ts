// Registry of every PUBLISHED topic (lessons + question bank).
//
// To publish a topic (any subject): build it in data/topics/<topic>/ with
// data/topics/build.ts, add it below, and set its status to 'published'
// in data/content-catalog.ts. Topics that only have source material stay
// listed in the catalog until then.
import { bloodCoagulation } from '@/data/topics/blood-coagulation-and-fibrinolysis';
import type { BuiltTopic } from '@/data/topics/build';
import { cardiovascularGross } from '@/data/topics/cardiovascular-system-gross';
import { cardiovascularPhysiology } from '@/data/topics/cardiovascular-physiology';
import { cholesterolAndBileBiosynthesis } from '@/data/topics/cholesterol-and-bile-biosynthesis';
import { collagenAndElastin } from '@/data/topics/collagen-synthesis';
import { fattyAcidBiosynthesis } from '@/data/topics/fatty-acid-biosynthesis';
import { gastrointestinalGross } from '@/data/topics/gastrointestinal-system-gross';
import { headAndNeck } from '@/data/topics/head-and-neck';
import { hemeMetabolism } from '@/data/topics/heme-metabolism';
import { hormones } from '@/data/topics/hormones-endocrine-biochemistry';
import { inbornErrors } from '@/data/topics/inborn-errors-of-metabolism';
import { oxygenCarriers } from '@/data/topics/oxygen-carriers';
import { respiratoryGross } from '@/data/topics/respiratory-system-gross';
import { upperLimb } from '@/data/topics/upper-limb';
import { urinaryGross } from '@/data/topics/urinary-system-gross';

// Anatomy topics are in HB2 Gross Anatomy course order.
export const builtTopics: BuiltTopic[] = [fattyAcidBiosynthesis, cholesterolAndBileBiosynthesis, hemeMetabolism, oxygenCarriers, bloodCoagulation, hormones, inbornErrors, collagenAndElastin, cardiovascularPhysiology, upperLimb, cardiovascularGross, respiratoryGross, gastrointestinalGross, urinaryGross, headAndNeck];
