import { APP_IMAGES } from "./appImages";

export interface ContextualTheme {
  id: string;
  label: string;
  image: string;
  kineticType: "lifter" | "sprinter" | "scanner" | "agility" | "mobility" | "zen";
  gearHint: string;
}

export const CONTEXTUAL_THEMES: ContextualTheme[] = [
  { 
    id: "dumbbell", 
    label: "Dumbbell Free-Weights Studio", 
    image: APP_IMAGES.dumbbellHypertrophyHd, 
    kineticType: "lifter",
    gearHint: "Dumbbells & Adjustable Bench"
  },
  { 
    id: "kettlebell", 
    label: "Kettlebell Conditioning Floor", 
    image: APP_IMAGES.kettlebellConditioningHd, 
    kineticType: "agility",
    gearHint: "Cast Iron Kettlebells & Chalk"
  },
  { 
    id: "calisthenics", 
    label: "Calisthenics Ring Studio", 
    image: APP_IMAGES.calisthenicsBodyweightHd, 
    kineticType: "agility",
    gearHint: "Gymnastic Rings & Dip Bars"
  },
  { 
    id: "barbell", 
    label: "Heavy Barbell Platform", 
    image: APP_IMAGES.barbellStrengthHd, 
    kineticType: "lifter",
    gearHint: "Olympic Barbell & Bumper Plates"
  },
  { 
    id: "cardio", 
    label: "Hybrid Cardio & Ergometer Deck", 
    image: APP_IMAGES.hybridCardioHd, 
    kineticType: "sprinter",
    gearHint: "Curved Treadmill & Rower"
  },
  { 
    id: "hypertrophy", 
    label: "Hypertrophy PPL Muscle Studio", 
    image: APP_IMAGES.hypertrophyPplHd, 
    kineticType: "lifter",
    gearHint: "Cables, Free Weights & Machines"
  },
  { 
    id: "mobility", 
    label: "Mobility & Restoration Zone", 
    image: APP_IMAGES.mobilityAgingHd, 
    kineticType: "mobility",
    gearHint: "Resistance Bands & Mats"
  },
  { 
    id: "powerbuilding", 
    label: "Powerbuilding Compound Arena", 
    image: APP_IMAGES.powerbuildingEliteHd, 
    kineticType: "lifter",
    gearHint: "Heavy Racks & Iron Plates"
  },
  { 
    id: "youth", 
    label: "Youth Athletic Agility Field", 
    image: APP_IMAGES.youthAthleticHd, 
    kineticType: "agility",
    gearHint: "Cones, Bodyweight & Agility Ladder"
  }
];

/**
 * Returns a high-definition image that is directly in context with the generated program,
 * matching its equipment, movements, training modality, and split.
 */
export function getContextualProgramImage(program: any): string {
  if (!program) return APP_IMAGES.strengthFoundationHd;

  // 1. If explicit hdImage is provided and valid
  if (program.hdImage && typeof program.hdImage === "string" && !program.hdImage.includes("avatar")) {
    return program.hdImage;
  }

  // 2. If explicit imageContext matches one of our defined themes
  if (program.imageContext) {
    const match = CONTEXTUAL_THEMES.find(t => t.id === program.imageContext);
    if (match) return match.image;
  }

  // 3. Contextual text analysis across name, prompt, description, exercises, equipment
  const textParts: string[] = [
    program.name || "",
    program.desc || "",
    program.extendedDesc || "",
    program.category || "",
    program.primaryEquipment || "",
    program.visualAtmosphere || ""
  ];

  if (Array.isArray(program.days)) {
    for (const day of program.days) {
      if (day.title) textParts.push(day.title);
      if (Array.isArray(day.exercises)) {
        textParts.push(...day.exercises);
      }
    }
  }

  const combined = textParts.join(" ").toLowerCase();

  // Kettlebell context
  if (combined.includes("kettlebell") || combined.includes("kb ") || combined.includes("kb swing") || combined.includes("turkish get") || combined.includes("snatch")) {
    return APP_IMAGES.kettlebellConditioningHd;
  }

  // Dumbbell context
  if (combined.includes("dumbbell") || combined.includes("db press") || combined.includes("db row") || combined.includes("db curl") || combined.includes("bicep") || combined.includes("tricep") || combined.includes("lateral raise")) {
    return APP_IMAGES.dumbbellHypertrophyHd;
  }

  // Calisthenics / bodyweight context
  if (combined.includes("calisthenic") || combined.includes("bodyweight") || combined.includes("ring") || combined.includes("pull-up") || combined.includes("pullup") || combined.includes("chin-up") || combined.includes("dip") || combined.includes("pushup") || combined.includes("push-up") || combined.includes("handstand") || combined.includes("muscle-up")) {
    return APP_IMAGES.calisthenicsBodyweightHd;
  }

  // Barbell / Olympic lifting / heavy powerlifting
  if (combined.includes("barbell") || combined.includes("5x5") || combined.includes("deadlift") || combined.includes("squat rack") || combined.includes("bench press") || combined.includes("powerlifting") || combined.includes("clean and jerk") || combined.includes("bumper")) {
    return APP_IMAGES.barbellStrengthHd;
  }

  // Cardio / conditioning / sprints / runner / rowing
  if (combined.includes("cardio") || combined.includes("hiit") || combined.includes("sprint") || combined.includes("running") || combined.includes("runner") || combined.includes("treadmill") || combined.includes("rower") || combined.includes("rowing") || combined.includes("ergometer") || combined.includes("fat burn") || combined.includes("tabata")) {
    return APP_IMAGES.hybridCardioHd;
  }

  // Mobility / aging / yoga / recovery
  if (combined.includes("mobility") || combined.includes("joint") || combined.includes("stretching") || combined.includes("stretch") || combined.includes("yoga") || combined.includes("aging") || combined.includes("senior") || combined.includes("rehab") || combined.includes("longevity")) {
    return APP_IMAGES.mobilityAgingHd;
  }

  // Youth athletic
  if (combined.includes("youth") || combined.includes("junior") || combined.includes("kid") || combined.includes("teen") || combined.includes("ladder")) {
    return APP_IMAGES.youthAthleticHd;
  }

  // Powerbuilding / heavy hybrid
  if (combined.includes("powerbuilding") || combined.includes("compound") || combined.includes("iron")) {
    return APP_IMAGES.powerbuildingEliteHd;
  }

  // Hypertrophy / muscle building
  if (combined.includes("hypertrophy") || combined.includes("ppl") || combined.includes("push pull") || combined.includes("mass") || combined.includes("muscle gain")) {
    return APP_IMAGES.hypertrophyPplHd;
  }

  return APP_IMAGES.strengthFoundationHd;
}
