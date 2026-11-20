// Yoga Pose Geometry and Automatic Asana Recognition Engine
import { APP_IMAGES } from "./appImages";

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface RecognizedPose {
  id: string;
  sanskritName: string;
  englishName: string;
  devaScript: string;
  targetChakra: string;
  targetMantra: string;
  alignmentScore: number; // 0 to 100
  holdTargetSeconds: number;
  corrections: string[];
  keyAngles: { [key: string]: number };
  artImage?: string;
}

// MediaPipe 33 Landmark indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

// Skeleton Bone Connections
export const SKELETON_CONNECTIONS: [number, number][] = [
  // Torso
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
  // Left Arm
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
  [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
  // Right Arm
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
  [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
  // Left Leg
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
  [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
  [POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.LEFT_FOOT_INDEX],
  // Right Leg
  [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
  [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
  [POSE_LANDMARKS.RIGHT_ANKLE, POSE_LANDMARKS.RIGHT_FOOT_INDEX],
  // Head
  [POSE_LANDMARKS.LEFT_EAR, POSE_LANDMARKS.LEFT_EYE],
  [POSE_LANDMARKS.RIGHT_EAR, POSE_LANDMARKS.RIGHT_EYE],
  [POSE_LANDMARKS.NOSE, POSE_LANDMARKS.LEFT_SHOULDER],
  [POSE_LANDMARKS.NOSE, POSE_LANDMARKS.RIGHT_SHOULDER],
];

/**
 * Calculates angle between three points (A -> B -> C) at vertex B in degrees (0 - 180)
 */
export function calculateJointAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle);
}

/**
 * Calculates Euclidean distance between two 2D points normalized to body scale
 */
export function calculateDistance(a: Landmark, b: Landmark): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

/**
 * Determines whether key landmarks are present and clearly visible
 */
export function checkBodyVisibility(landmarks: Landmark[]): {
  isFullyVisible: boolean;
  missingParts: string[];
  averageConfidence: number;
} {
  if (!landmarks || landmarks.length < 33) {
    return { isFullyVisible: false, missingParts: ["Full Body"], averageConfidence: 0 };
  }

  const missing: string[] = [];
  const requiredParts = [
    { name: "Shoulders", indices: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER] },
    { name: "Hips", indices: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP] },
    { name: "Knees", indices: [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE] },
    { name: "Feet", indices: [POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.RIGHT_ANKLE] },
  ];

  let totalVis = 0;
  landmarks.forEach(l => {
    totalVis += l.visibility ?? 0.8;
  });
  const avgVis = totalVis / landmarks.length;

  for (const part of requiredParts) {
    const isMissing = part.indices.some(idx => {
      const lm = landmarks[idx];
      return !lm || (lm.visibility !== undefined && lm.visibility < 0.45);
    });
    if (isMissing) {
      missing.push(part.name);
    }
  }

  return {
    isFullyVisible: missing.length === 0,
    missingParts: missing,
    averageConfidence: Math.round(avgVis * 100),
  };
}

/**
 * Evaluates real-time pose and matches it against verified classical Yoga Asanas
 */
export function recognizeYogaAsana(landmarks: Landmark[]): RecognizedPose | null {
  if (!landmarks || landmarks.length < 33) return null;

  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
  const rightElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
  const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
  const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
  const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
  const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
  const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
  const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
  const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

  // Calculate critical joint angles
  const leftElbowAngle = calculateJointAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateJointAngle(rightShoulder, rightElbow, rightWrist);
  const leftShoulderAngle = calculateJointAngle(leftHip, leftShoulder, leftElbow);
  const rightShoulderAngle = calculateJointAngle(rightHip, rightShoulder, rightElbow);

  const leftKneeAngle = calculateJointAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateJointAngle(rightHip, rightKnee, rightAnkle);
  const leftHipAngle = calculateJointAngle(leftShoulder, leftHip, leftKnee);
  const rightHipAngle = calculateJointAngle(rightShoulder, rightHip, rightKnee);

  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
  const hipMidY = (leftHip.y + rightHip.y) / 2;
  const ankleMidY = (leftAnkle.y + rightAnkle.y) / 2;
  const ankleDist = Math.abs(leftAnkle.x - rightAnkle.x);
  const hipDist = Math.max(0.05, Math.abs(leftHip.x - rightHip.x));

  const keyAngles = {
    "Left Knee": leftKneeAngle,
    "Right Knee": rightKneeAngle,
    "Left Elbow": leftElbowAngle,
    "Right Elbow": rightElbowAngle,
    "Left Shoulder": leftShoulderAngle,
    "Right Shoulder": rightShoulderAngle,
    "Left Hip": leftHipAngle,
    "Right Hip": rightHipAngle,
  };

  const isStanding = ankleMidY > hipMidY && hipMidY > shoulderMidY;

  // 1. VRIKSHASANA (Tree Pose / वृक्षासन)
  // One straight leg (knee > 155), one bent leg (knee < 120), foot elevated above opposite ankle
  const leftLegBent = leftKneeAngle < 120 && leftAnkle.y < rightKnee.y + 0.12;
  const rightLegBent = rightKneeAngle < 120 && rightAnkle.y < leftKnee.y + 0.12;
  const isOneLegStanding = (leftLegBent && rightKneeAngle > 155) || (rightLegBent && leftKneeAngle > 155);

  if (isStanding && isOneLegStanding) {
    const corrections: string[] = [];
    let score = 80;

    const standingLegAngle = leftLegBent ? rightKneeAngle : leftKneeAngle;
    if (standingLegAngle < 165) {
      corrections.push("Straighten your standing leg firmly into the ground");
      score -= 10;
    }

    // Check arms: raised overhead or prayer hands
    const wristsAboveHead = leftWrist.y < shoulderMidY && rightWrist.y < shoulderMidY;
    if (!wristsAboveHead) {
      const handsTogether = Math.abs(leftWrist.x - rightWrist.x) < 0.15;
      if (handsTogether) {
        corrections.push("Hold Anjali Mudra (prayer hands) steady at chest center");
      } else {
        corrections.push("Bring palms together at heart or reach arms high overhead");
        score -= 15;
      }
    } else {
      if (leftElbowAngle < 140 || rightElbowAngle < 140) {
        corrections.push("Lengthen both elbows toward the sky");
        score -= 5;
      }
    }

    if (corrections.length === 0) {
      corrections.push("Splendid balance! Fix gaze (Drishti) on one point.");
    }

    return {
      id: "vrikshasana",
      sanskritName: "वृक्षासन",
      englishName: "Vrikshasana (Tree Pose)",
      devaScript: "वृक्षासन",
      targetChakra: "Anahata & Ajna",
      targetMantra: "ॐ शान्ताय नमः (Om Shantaya Namaha)",
      alignmentScore: Math.max(50, Math.min(100, score)),
      holdTargetSeconds: 30,
      corrections,
      keyAngles,
      artImage: APP_IMAGES.poseVrikshasanaTree,
    };
  }

  // 2. VIRABHADRASANA II (Warrior II / वीरभद्रासन २)
  // Wide stance, one knee bent 90-125, other leg straight > 155, arms extended horizontally (> 70 shoulder angle)
  const isWideStance = ankleDist > hipDist * 2.2;
  const leftFrontBent = leftKneeAngle >= 80 && leftKneeAngle <= 135 && rightKneeAngle > 150;
  const rightFrontBent = rightKneeAngle >= 80 && rightKneeAngle <= 135 && leftKneeAngle > 150;

  if (isStanding && isWideStance && (leftFrontBent || rightFrontBent)) {
    const corrections: string[] = [];
    let score = 85;

    const bentKneeAngle = leftFrontBent ? leftKneeAngle : rightKneeAngle;
    if (bentKneeAngle > 115) {
      corrections.push("Sink hips lower so front thigh is closer to parallel");
      score -= 10;
    } else if (bentKneeAngle < 85) {
      corrections.push("Ease up slightly so front knee does not overshoot ankle");
      score -= 5;
    }

    // Arm heights
    const armsHorizontal =
      leftShoulderAngle > 70 &&
      leftShoulderAngle < 115 &&
      rightShoulderAngle > 70 &&
      rightShoulderAngle < 115;

    if (!armsHorizontal) {
      corrections.push("Extend both arms parallel to the earth at shoulder level");
      score -= 15;
    } else {
      if (leftElbowAngle < 155 || rightElbowAngle < 155) {
        corrections.push("Reach actively through fingertips to straighten elbows");
        score -= 5;
      }
    }

    if (corrections.length === 0) {
      corrections.push("Formidable Warrior II! Gaze steadfastly over front fingers.");
    }

    return {
      id: "virabhadrasana-2",
      sanskritName: "वीरभद्रासन २",
      englishName: "Virabhadrasana II (Warrior II)",
      devaScript: "वीरभद्रासन द्वितीय",
      targetChakra: "Muladhara & Manipura",
      targetMantra: "ॐ वीराय नमः (Om Veeraya Namaha)",
      alignmentScore: Math.max(50, Math.min(100, score)),
      holdTargetSeconds: 45,
      corrections,
      keyAngles,
      artImage: APP_IMAGES.aarogyaVinyasaWarriorArt,
    };
  }

  // 3. UTKATASANA (Chair Pose / उत्कटासन)
  // Both knees bent (85 - 140), hips flexed, both legs symmetrical, arms up
  const bothKneesBent =
    leftKneeAngle >= 85 &&
    leftKneeAngle <= 140 &&
    rightKneeAngle >= 85 &&
    rightKneeAngle <= 140;
  const bothHipsBent = leftHipAngle < 145 && rightHipAngle < 145;

  if (isStanding && bothKneesBent && bothHipsBent && !isWideStance) {
    const corrections: string[] = [];
    let score = 85;

    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    if (avgKneeAngle > 130) {
      corrections.push("Sit deeper into your imaginary chair");
      score -= 10;
    }

    const armsOverhead = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
    if (!armsOverhead) {
      corrections.push("Raise your arms alongside your ears toward the sky");
      score -= 15;
    } else if (leftElbowAngle < 140 || rightElbowAngle < 140) {
      corrections.push("Lengthen through elbows with palms facing each other");
      score -= 5;
    }

    if (corrections.length === 0) {
      corrections.push("Powerful Chair Pose! Keep weight grounded in heels.");
    }

    return {
      id: "utkatasana",
      sanskritName: "उत्कटासन",
      englishName: "Utkatasana (Chair Pose)",
      devaScript: "उत्कटासन",
      targetChakra: "Manipura & Muladhara",
      targetMantra: "ॐ तेजसे नमः (Om Tejase Namaha)",
      alignmentScore: Math.max(50, Math.min(100, score)),
      holdTargetSeconds: 30,
      corrections,
      keyAngles,
      artImage: APP_IMAGES.poseHastauttanaArch,
    };
  }

  // 4. UTTHITA TRIKONASANA (Triangle Pose / त्रिकोणासन)
  // Both legs straight (> 155), wide stance, one arm pointing down, other arm pointing straight up
  const bothLegsStraight = leftKneeAngle > 155 && rightKneeAngle > 155;
  const oneArmDownOneUp =
    (leftWrist.y < shoulderMidY && rightWrist.y > hipMidY) ||
    (rightWrist.y < shoulderMidY && leftWrist.y > hipMidY);

  if (isStanding && isWideStance && bothLegsStraight && oneArmDownOneUp) {
    const corrections: string[] = [];
    let score = 85;

    const isLeftArmUp = leftWrist.y < rightWrist.y;
    const upElbowAngle = isLeftArmUp ? leftElbowAngle : rightElbowAngle;

    if (upElbowAngle < 155) {
      corrections.push("Reach your skyward arm straight toward the ceiling");
      score -= 10;
    }

    corrections.push("Spiral your upper chest toward the sky and keep both side waists long");

    return {
      id: "trikonasana",
      sanskritName: "त्रिकोणासन",
      englishName: "Utthita Trikonasana (Triangle Pose)",
      devaScript: "त्रिकोणासन",
      targetChakra: "Manipura (Solar Plexus)",
      targetMantra: "ॐ अग्नये नमः (Om Agnaye Namaha)",
      alignmentScore: Math.max(50, Math.min(100, score)),
      holdTargetSeconds: 30,
      corrections,
      keyAngles,
      artImage: APP_IMAGES.poseTrikonasanaTriangle,
    };
  }

  // 5. ADHO MUKHA SVANASANA (Downward-Facing Dog / अधोमुखश्वानासन)
  // Inverted V shape: hips are higher than shoulders and feet (hipMidY < shoulderMidY and hipMidY < ankleMidY)
  const isHipsPeak = hipMidY < shoulderMidY && hipMidY < ankleMidY;
  if (isHipsPeak) {
    const corrections: string[] = [];
    let score = 85;

    if (leftElbowAngle < 150 || rightElbowAngle < 150) {
      corrections.push("Press firmly through palms to straighten arms");
      score -= 10;
    }
    if (leftKneeAngle < 150 || rightKneeAngle < 150) {
      corrections.push("Lengthen back of legs and send sit bones high");
      score -= 5;
    }

    corrections.push("Melt chest gently toward shins to decompress spine");

    return {
      id: "adho-mukha",
      sanskritName: "अधोमुखश्वानासन",
      englishName: "Adho Mukha Svanasana (Downward-Facing Dog)",
      devaScript: "अधोमुखश्वानासन",
      targetChakra: "Sahasrara & Vishuddha",
      targetMantra: "ॐ सूर्याय नमः (Om Suryaya Namaha)",
      alignmentScore: Math.max(50, Math.min(100, score)),
      holdTargetSeconds: 45,
      corrections,
      keyAngles,
      artImage: APP_IMAGES.poseParvatasanaDownward,
    };
  }

  // 6. BHUJANGASANA (Cobra Pose / भुजङ्गासन)
  // Prone posture: hips and feet low to ground, shoulders lifted higher than hips, chest arching up
  const isProne = shoulderMidY < hipMidY && Math.abs(hipMidY - ankleMidY) < 0.25;
  if (isProne && !isStanding) {
    const corrections: string[] = [];
    let score = 80;

    if (leftShoulderAngle < 35 && rightShoulderAngle < 35) {
      corrections.push("Roll shoulder blades down away from ears");
      score -= 5;
    }
    corrections.push("Engage spinal erectors and press pubic bone into mat");

    return {
      id: "bhujangasana",
      sanskritName: "भुजङ्गासन",
      englishName: "Bhujangasana (Cobra Pose)",
      devaScript: "भुजङ्गासन",
      targetChakra: "Anahata (Heart Chakra)",
      targetMantra: "ॐ सर्पाय नमः (Om Sarpaya Namaha)",
      alignmentScore: Math.max(50, Math.min(100, score)),
      holdTargetSeconds: 30,
      corrections,
      keyAngles,
      artImage: APP_IMAGES.poseBhujangasanaCobra,
    };
  }

  // 7. VIRABHADRASANA I (Warrior I / वीरभद्रासन १)
  // Lunge with front knee bent (85-135), back leg straight, both arms raised overhead
  const armsHighOverhead = leftWrist.y < leftShoulder.y - 0.15 && rightWrist.y < rightShoulder.y - 0.15;
  if (isStanding && isWideStance && (leftFrontBent || rightFrontBent) && armsHighOverhead) {
    const corrections: string[] = [];
    let score = 85;

    corrections.push("Square hips forward and press outer back heel down");
    if (leftElbowAngle < 150 || rightElbowAngle < 150) {
      corrections.push("Fully extend arms upward with relaxed shoulders");
      score -= 5;
    }

    return {
      id: "virabhadrasana-1",
      sanskritName: "वीरभद्रासन १",
      englishName: "Virabhadrasana I (Warrior I)",
      devaScript: "वीरभद्रासन प्रथम",
      targetChakra: "Muladhara & Vishuddha",
      targetMantra: "ॐ वीर्याय नमः (Om Veeryaya Namaha)",
      alignmentScore: Math.max(50, Math.min(100, score)),
      holdTargetSeconds: 30,
      corrections,
      keyAngles,
      artImage: APP_IMAGES.aarogyaVinyasaWarriorArt,
    };
  }

  // 8. TADASANA / SAMASTHITI (Mountain Pose / ताड़ासन)
  // Standing tall, legs straight (> 165), feet together or hip-width, torso vertical
  if (isStanding && bothLegsStraight && !isWideStance) {
    const corrections: string[] = [];
    let score = 90;

    const handsOverhead = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
    const handsAtCenter = Math.abs(leftWrist.x - rightWrist.x) < 0.12 && Math.abs(leftWrist.y - shoulderMidY) < 0.2;

    if (handsOverhead) {
      corrections.push("Hastauttana alignment: elongate spine skyward from feet to fingertips");
    } else if (handsAtCenter) {
      corrections.push("Pranamasana alignment: serene heart center prayer");
    } else {
      corrections.push("Keep arms relaxed at sides with palms turned subtly forward");
    }

    if (leftKneeAngle < 165 || rightKneeAngle < 165) {
      corrections.push("Engage quadriceps to gently lift kneecaps");
      score -= 5;
    }

    return {
      id: "tadasana",
      sanskritName: "ताड़ासन",
      englishName: "Tadasana (Mountain Pose)",
      devaScript: "ताड़ासन",
      targetChakra: "Muladhara (Root Chakra)",
      targetMantra: "स्थिरसुखमासनम् (Steadiness and Ease)",
      alignmentScore: Math.max(60, Math.min(100, score)),
      holdTargetSeconds: 30,
      corrections,
      keyAngles,
      artImage: APP_IMAGES.poseTadasanaMountain,
    };
  }

  // 9. SUKHASANA / PADMASANA (Seated Meditative Posture / सुखासन)
  // Seated posture where hips are on ground, knees bent outward, spine upright
  const isSeated = !isStanding && hipMidY > shoulderMidY && Math.abs(leftKnee.y - rightKnee.y) < 0.15;
  if (isSeated) {
    return {
      id: "sukhasana",
      sanskritName: "सुखासन",
      englishName: "Sukhasana (Easy Meditative Posture)",
      devaScript: "सुखासन",
      targetChakra: "Sahasrara & Muladhara",
      targetMantra: "ॐ तत् सत् (Om Tat Sat)",
      alignmentScore: 88,
      holdTargetSeconds: 60,
      corrections: [
        "Align crown of head directly over pelvic floor",
        "Rest hands in Jnana Mudra with index and thumb touching",
        "Deepen abdominal diaphragmatic breathing",
      ],
      keyAngles,
      artImage: APP_IMAGES.aarogyaPadmasanaLotusArt,
    };
  }

  return null;
}

// Full Reference Catalog of Supported Asanas with Alignment Targets
export interface SupportedAsanaGuide {
  id: string;
  sanskritName: string;
  englishName: string;
  devaScript: string;
  targetChakra: string;
  targetMantra: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  keyAlignmentRules: string[];
  contraindications: string;
  artImage: string;
}

export const SUPPORTED_ASANAS_CATALOG: SupportedAsanaGuide[] = [
  {
    id: "tadasana",
    sanskritName: "ताड़ासन (Tadasana)",
    englishName: "Mountain Pose / Samasthiti",
    devaScript: "ताड़ासन",
    targetChakra: "Muladhara (Root)",
    targetMantra: "स्थिरसुखमासनम्",
    difficulty: "Beginner",
    keyAlignmentRules: [
      "Both legs straight (knee angles > 165°)",
      "Spine tall, shoulders rolled back and down",
      "Hands along thighs or joined at heart center in Anjali Mudra"
    ],
    contraindications: "Acute vertigo, severe low blood pressure.",
    artImage: APP_IMAGES.poseTadasanaMountain,
  },
  {
    id: "vrikshasana",
    sanskritName: "वृक्षासन (Vrikshasana)",
    englishName: "Tree Pose",
    devaScript: "वृक्षासन",
    targetChakra: "Anahata & Ajna",
    targetMantra: "ॐ शान्ताय नमः",
    difficulty: "Beginner",
    keyAlignmentRules: [
      "Standing leg vertical and straight (> 165°)",
      "Bent leg knee turned outward (< 120°)",
      "Hands in prayer at heart or arms extended overhead"
    ],
    contraindications: "Recent ankle or knee trauma.",
    artImage: APP_IMAGES.poseVrikshasanaTree,
  },
  {
    id: "virabhadrasana-2",
    sanskritName: "वीरभद्रासन २ (Virabhadrasana II)",
    englishName: "Warrior II",
    devaScript: "वीरभद्रासन द्वितीय",
    targetChakra: "Muladhara & Manipura",
    targetMantra: "ॐ वीराय नमः",
    difficulty: "Intermediate",
    keyAlignmentRules: [
      "Front knee bent at 90° - 120°, stacked over ankle",
      "Back leg fully extended and locked straight (> 160°)",
      "Both arms extended horizontally at shoulder level"
    ],
    contraindications: "High blood pressure (keep hands at waist).",
    artImage: APP_IMAGES.aarogyaVinyasaWarriorArt,
  },
  {
    id: "virabhadrasana-1",
    sanskritName: "वीरभद्रासन १ (Virabhadrasana I)",
    englishName: "Warrior I",
    devaScript: "वीरभद्रासन प्रथम",
    targetChakra: "Muladhara & Vishuddha",
    targetMantra: "ॐ वीर्याय नमः",
    difficulty: "Intermediate",
    keyAlignmentRules: [
      "Front knee bent near 90°, hips squared forward",
      "Back heel pressed down, back leg straight",
      "Both arms raised straight overhead with biceps near ears"
    ],
    contraindications: "Neck injury (gaze forward rather than up).",
    artImage: APP_IMAGES.aarogyaVinyasaWarriorArt,
  },
  {
    id: "trikonasana",
    sanskritName: "त्रिकोणासन (Utthita Trikonasana)",
    englishName: "Extended Triangle Pose",
    devaScript: "त्रिकोणासन",
    targetChakra: "Manipura (Solar Plexus)",
    targetMantra: "ॐ अग्नये नमः",
    difficulty: "Beginner",
    keyAlignmentRules: [
      "Both legs straight (> 160°) in wide stance",
      "Lower hand resting on shin/ankle without leaning weight",
      "Upper arm reaching vertically straight to ceiling"
    ],
    contraindications: "Acute migraine or severe neck strain.",
    artImage: APP_IMAGES.poseTrikonasanaTriangle,
  },
  {
    id: "utkatasana",
    sanskritName: "उत्कटासन (Utkatasana)",
    englishName: "Chair Pose / Fierce Posture",
    devaScript: "उत्कटासन",
    targetChakra: "Manipura & Muladhara",
    targetMantra: "ॐ तेजसे नमः",
    difficulty: "Beginner",
    keyAlignmentRules: [
      "Both knees bent between 90° and 130°",
      "Hips back as if sitting in an imaginary low chair",
      "Torso angled forward slightly, arms raised high overhead"
    ],
    contraindications: "Severe insomnia or acute lower back sprain.",
    artImage: APP_IMAGES.poseHastauttanaArch,
  },
  {
    id: "adho-mukha",
    sanskritName: "अधोमुखश्वानासन (Adho Mukha Svanasana)",
    englishName: "Downward-Facing Dog",
    devaScript: "अधोमुखश्वानासन",
    targetChakra: "Sahasrara & Vishuddha",
    targetMantra: "ॐ सूर्याय नमः",
    difficulty: "Beginner",
    keyAlignmentRules: [
      "Inverted 'V' shape with hips as the apex",
      "Arms and legs straight, fingers spread wide",
      "Chest pressing gently toward thighs to decompress spine"
    ],
    contraindications: "Late pregnancy or detached retina.",
    artImage: APP_IMAGES.poseParvatasanaDownward,
  },
  {
    id: "bhujangasana",
    sanskritName: "भुजङ्गासन (Bhujangasana)",
    englishName: "Cobra Pose",
    devaScript: "भुजङ्गासन",
    targetChakra: "Anahata (Heart)",
    targetMantra: "ॐ सर्पाय नमः",
    difficulty: "Beginner",
    keyAlignmentRules: [
      "Prone with pelvis and tops of feet grounded",
      "Chest lifted forward and upward using back muscles",
      "Elbows lightly bent and hugged close to torso"
    ],
    contraindications: "Abdominal surgery or acute lumbar herniation.",
    artImage: APP_IMAGES.poseBhujangasanaCobra,
  },
  {
    id: "sukhasana",
    sanskritName: "सुखासन / पद्मासन (Sukhasana)",
    englishName: "Easy Meditative Pose",
    devaScript: "सुखासन",
    targetChakra: "Sahasrara & Muladhara",
    targetMantra: "ॐ तत् सत्",
    difficulty: "Beginner",
    keyAlignmentRules: [
      "Cross-legged seated with upright effortless spine",
      "Shoulders stacked above hips, chin parallel to earth",
      "Hands in Jnana or Chin Mudra resting on knees"
    ],
    contraindications: "Severe knee arthritis.",
    artImage: APP_IMAGES.aarogyaPadmasanaLotusArt,
  },
];

/**
 * Renders the virtual glowing skeleton on the given 2D canvas context
 */
export function drawPoseSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  canvasWidth: number,
  canvasHeight: number,
  alignmentScore: number = 85
) {
  ctx.save();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Dynamic color according to alignment score
  // Green (#22c55e) for >= 80%, Amber (#f59e0b) for 65-79%, Orange/Red (#ef4444) for < 65%
  const strokeColor =
    alignmentScore >= 80
      ? "rgba(34, 197, 94, 0.9)"
      : alignmentScore >= 65
      ? "rgba(245, 158, 11, 0.9)"
      : "rgba(239, 68, 68, 0.9)";

  const glowColor =
    alignmentScore >= 80
      ? "rgba(34, 197, 94, 0.5)"
      : alignmentScore >= 65
      ? "rgba(245, 158, 11, 0.5)"
      : "rgba(239, 68, 68, 0.5)";

  // Draw Connected Bones
  ctx.lineWidth = 4;
  ctx.strokeStyle = strokeColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10;
  ctx.lineCap = "round";

  for (const [startIdx, endIdx] of SKELETON_CONNECTIONS) {
    const p1 = landmarks[startIdx];
    const p2 = landmarks[endIdx];

    if (!p1 || !p2) continue;
    if ((p1.visibility ?? 1) < 0.4 || (p2.visibility ?? 1) < 0.4) continue;

    ctx.beginPath();
    ctx.moveTo(p1.x * canvasWidth, p1.y * canvasHeight);
    ctx.lineTo(p2.x * canvasWidth, p2.y * canvasHeight);
    ctx.stroke();
  }

  // Draw Key Joint Nodes
  for (let i = 0; i < landmarks.length; i++) {
    // Only draw major joints (skip facial details except nose)
    if (i > 0 && i < 11) continue;

    const lm = landmarks[i];
    if (!lm || (lm.visibility ?? 1) < 0.4) continue;

    const x = lm.x * canvasWidth;
    const y = lm.y * canvasHeight;

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = strokeColor;
    ctx.fill();
  }

  ctx.restore();
}
