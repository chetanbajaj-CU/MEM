import { APP_IMAGES } from "./appImages";

export interface AsanaItem {
  id: string;
  sanskritName: string;
  englishName: string;
  devaScript: string;
  difficulty: "Beginner (आरम्भिक)" | "Intermediate (मध्यम)" | "Advanced (प्रवीण)";
  chakra: string;
  duration: string;
  benefits: string[];
  cues: string[];
  contraindications: string;
  mantra?: string;
  artImage: string;
  artTheme: string;
  artDescription: string;
}

export interface PranayamaPractice {
  id: string;
  name: string;
  sanskrit: string;
  ratio: string; // e.g. 4:4:4:4 or 4:0:4:0
  inhaleSec: number;
  holdSec: number;
  exhaleSec: number;
  holdEmptySec: number;
  benefits: string;
  technique: string;
  bestTime: string;
  artImage: string;
  artTheme: string;
  artDescription: string;
}

export interface ChakraNode {
  number: number;
  name: string;
  sanskrit: string;
  color: string;
  glowHex: string;
  location: string;
  seedMantra: string;
  element: string;
  petals: number;
  attribute: string;
  imbalanceSign: string;
  balanceBenefit: string;
  artImage: string;
}

export interface YogaDiscipline {
  id: string;
  titleEnglish: string;
  titleSanskrit: string;
  tagline: string;
  overview: string;
  historicalRoot: string;
  artImage: string;
  artTheme: string;
  badge: string;
}

export interface YogaArtPiece {
  id: string;
  title: string;
  sanskritTitle: string;
  theme: string;
  category: string;
  description: string;
  spiritualSignificance: string;
  mantra: string;
  image: string;
}

export const YOGA_ARTS_COLLECTION: YogaArtPiece[] = [
  {
    id: "art-surya",
    title: "Surya Namaskar at Dawn Ganges",
    sanskritTitle: "सूर्यनमस्कार प्रभात गङ्गा साधना",
    theme: "surya",
    category: "Hatha Yoga & Solar Salutation",
    description: "Vibrant dawn light breaking over the sacred Ganges river ghats in Varanasi, radiating warm golden saffron illumination as the yogi salutes the rising sun.",
    spiritualSignificance: "Awakens solar prana (Pingala nadi), dissolves lethargy, and kindles the sacred fire of inner vitality (Agni).",
    mantra: "ॐ सूर्याय नमः (Om Suryaya Namaha)",
    image: APP_IMAGES.aarogyaSuryaNamaskarArt
  },
  {
    id: "art-padmasana",
    title: "Padmasana Temple Lotus Sanctum",
    sanskritTitle: "पद्मासन देवालय कमल साधना",
    theme: "lotus",
    category: "Classical Asana & Meditation",
    description: "An Indian yogi in classical Padmasana Lotus posture in an ancient carved stone temple courtyard surrounded by warm glowing brass oil lamps, fragrant incense smoke, and blooming pink lotuses.",
    spiritualSignificance: "Locks prana within the pelvic basin to channel upward through the Sushumna nadi, grounding the physical vessel in effortless stillness.",
    mantra: "ॐ शान्तिः शान्तिः शान्तिः (Om Shantih, Shantih, Shantih)",
    image: APP_IMAGES.aarogyaPadmasanaLotusArt
  },
  {
    id: "art-kundalini",
    title: "Kundalini 7 Chakras & Sri Yantra",
    sanskritTitle: "कुण्डलिनी सप्तचक्र श्रीयन्त्र साधना",
    theme: "kundalini",
    category: "Kundalini & Chakra Alchemy",
    description: "Luminous representation of the seven cosmic chakras ascending along the central spinal axis, haloed by intricate golden Sri Yantra sacred geometry and astral cosmic mandalas.",
    spiritualSignificance: "Represents the union of Shakti (energy) ascending from Muladhara to merge with Shiva (pure consciousness) at the crown Sahasrara.",
    mantra: "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे (Om Aim Hreem Kleem)",
    image: APP_IMAGES.aarogyaKundaliniEnergyArt
  },
  {
    id: "art-natarajasana",
    title: "Natarajasana Lord of the Dance at Dusk",
    sanskritTitle: "नटराजासन सन्ध्या घट प्रवाह",
    theme: "natarajasana",
    category: "Ashtanga & Dynamic Balance",
    description: "Majestic silhouette of Natarajasana atop a sacred riverbank pedestal during evening Ganga Aarti, with sacred havan fire embers and twilight temple spires reflected on the water.",
    spiritualSignificance: "Symbolizes cosmic balance, poise amidst eternal universal motion, and graceful surrender of ego through sacred movement.",
    mantra: "ॐ नमः शिवाय (Om Namah Shivaya)",
    image: APP_IMAGES.aarogyaNatarajasanaArt
  },
  {
    id: "art-rishi",
    title: "Himalayan Rishi Meditation under Sacred Banyan",
    sanskritTitle: "हिमालय ऋषि ध्यान वटवृक्ष साधना",
    theme: "rishi",
    category: "Dhyana & Vedic Wisdom",
    description: "Serene Indian Rishi seated in tranquil contemplation beneath an ancient holy banyan tree by the crystal Himalayan riverbank at dawn, framed in classical Vedic miniature border.",
    spiritualSignificance: "Embraces the lineage of Vedic seers who received the Upanishads and Yoga Sutras through unclouded direct spiritual perception.",
    mantra: "योगश्चित्तवृत्तिनिरोधः (Yoga is the stilling of mental patterns)",
    image: APP_IMAGES.aarogyaRishiMeditationArt
  },
  {
    id: "art-mudra",
    title: "Sacred Mudras & Golden Prana Life-Force",
    sanskritTitle: "मुद्रा विज्ञान एवं दिव्य प्राण प्रवाह",
    theme: "mudra",
    category: "Mudra & Subtle Energy Seals",
    description: "Fine art study of Gyan and Prana Mudra hands adorned with intricate traditional mehndi, with radiant streams of golden prana energy flowing between fingertips amidst floating lotus petals.",
    spiritualSignificance: "Directs neural circuits and subtle energetic prana back into higher brain centers, sealing vital life force against depletion.",
    mantra: "सो ऽहम् (So Hum - I am That Divine Life)",
    image: APP_IMAGES.aarogyaMudraPranaArt
  },
  {
    id: "art-pranayama",
    title: "Pranayama & Nadi Shodhana Sacred Breathwork",
    sanskritTitle: "प्राणायाम नाडी शोधन प्राण शुद्धि",
    theme: "pranayama",
    category: "Pranayama & Swara Yoga",
    description: "Serene mountain ashram at dawn where rhythmic breathing harmonizes the subtle wind element (Vayu) and cleanses all 72,000 nadis.",
    spiritualSignificance: "Balances the solar (Pingala) and lunar (Ida) channels, opening the royal Sushumna channel for peaceful spiritual awareness.",
    mantra: "प्राणस्येदं वशे सर्वं (All that exists is governed by Prana)",
    image: APP_IMAGES.aarogyaPranayamaBreathArt
  },
  {
    id: "art-warrior",
    title: "Virabhadrasana Tapas & Inner Courage",
    sanskritTitle: "वीरभद्रासन तपस् एवं आन्तरिक शौर्य",
    theme: "vinyasa",
    category: "Ashtanga & Heroic Sadhana",
    description: "Daring heroic stance of Virabhadrasana radiating unshakeable mental fortitude, physical stability, and spiritual tapas (sacred purifying fire).",
    spiritualSignificance: "Cultivates spiritual warrior courage to conquer internal demons of doubt, lethargy, and ego.",
    mantra: "ॐ वीराय नमः (Salutations to the Divine Heroic Spirit)",
    image: APP_IMAGES.aarogyaVinyasaWarriorArt
  },
  {
    id: "art-dhyana",
    title: "Dhyana & Transcendental Samadhi Stillness",
    sanskritTitle: "ध्यान एवं समाधि प्रशान्ति साधना",
    theme: "dhyana",
    category: "Dhyana & Raja Yoga",
    description: "An unbroken luminous beam of concentrated consciousness expanding into cosmic light, silencing all thought waves in deep Samadhi.",
    spiritualSignificance: "The mind dissolves into the supreme witness self; observer, observation, and observed become unified.",
    mantra: "ॐ तत् सत् (Om Tat Sat - The Supreme Truth)",
    image: APP_IMAGES.aarogyaDhyanaMeditationArt
  },
  {
    id: "art-nidra",
    title: "Yoga Nidra Cosmic Starlight Rejuvenation",
    sanskritTitle: "योग निद्रा दिव्य विश्राम एवं अमृत चेतना",
    theme: "nidra",
    category: "Yoga Nidra & Psychic Rest",
    description: "Conscious floating in the celestial starry cosmos in effortless Savasana, resting beyond time while traversing the five Pancha Koshas.",
    spiritualSignificance: "Dissolves deep subconscious karmic impressions (samskaras) and restores the cellular nervous system in theta brainwave peace.",
    mantra: "सुषुप्तौ तु परमानन्दः (In conscious sleep lies supreme bliss)",
    image: APP_IMAGES.aarogyaYogaNidraRestArt
  }
];

export const AAROGYA_DISCIPLINES: YogaDiscipline[] = [
  {
    id: "hatha",
    titleEnglish: "Hatha Yoga & Surya Namaskar",
    titleSanskrit: "हठ योग एवं सूर्यनमस्कार",
    tagline: "Union of Sun (Ha) and Moon (Tha) Energies",
    overview: "Classical physical purification and asana mastery designed to balance active solar prana and reflective lunar consciousness.",
    historicalRoot: "Rooted in Hatha Yoga Pradipika by Yogi Svatmarama & Gorakhnath lineage.",
    artImage: APP_IMAGES.aarogyaSuryaNamaskarArt,
    artTheme: "surya",
    badge: "Foundational Sadhana"
  },
  {
    id: "ashtanga",
    titleEnglish: "Ashtanga & Classical Asanas",
    titleSanskrit: "अष्टाङ्ग योग एवं वीर साधना",
    tagline: "Eight-Limbed Disciplined Dynamic Flow",
    overview: "Dynamic synchronization of breath with progressive postures, building internal tapas (sacred fire), joint durability, and mental drishti.",
    historicalRoot: "Patanjali Maharishi's Yoga Sutras & Mysore Gurukula lineage.",
    artImage: APP_IMAGES.aarogyaNatarajasanaArt,
    artTheme: "natarajasana",
    badge: "Strength & Tapas"
  },
  {
    id: "kundalini",
    titleEnglish: "Kundalini & Chakra Alchemy",
    titleSanskrit: "कुण्डलिनी जागरण एवं चक्र साधना",
    tagline: "Awakening of the Coiled Serpent Life-Force",
    overview: "Transmutation of primal spiritual energy through the 7 major chakras and 3 nadis (Ida, Pingala, Sushumna) using kriya, mantra, and bandhas.",
    historicalRoot: "Tantric Agamas and the ancient Sat-Chakra-Nirupana treatise.",
    artImage: APP_IMAGES.aarogyaKundaliniEnergyArt,
    artTheme: "kundalini",
    badge: "Subtle Energy Alchemy"
  },
  {
    id: "pranayama",
    titleEnglish: "Pranayama & Swara Yoga",
    titleSanskrit: "प्राणायाम एवं स्वर विज्ञान",
    tagline: "Mastery of the Vital Breath Force",
    overview: "Subtle breath regulation that purifies the 72,000 nadis (energy channels), harmonizing sympathetic and parasympathetic rhythms.",
    historicalRoot: "Fourth limb of Patanjali Ashtanga Yoga; life-force control.",
    artImage: APP_IMAGES.aarogyaPranayamaBreathArt,
    artTheme: "pranayama",
    badge: "Breath & Vital Force"
  },
  {
    id: "dhyana",
    titleEnglish: "Dhyana & Raja Yoga",
    titleSanskrit: "ध्यान एवं राजयोग समाधि",
    tagline: "Transcendental Consciousness & Royal Mind Mastery",
    overview: "Unbroken stream of awareness focused on the supreme self, leading through Dharana (concentration) to Dhyana (meditation) and Samadhi.",
    historicalRoot: "Upanishadic contemplation and Patanjali's Raja Yoga.",
    artImage: APP_IMAGES.aarogyaRishiMeditationArt,
    artTheme: "rishi",
    badge: "Deep Inner Stillness"
  },
  {
    id: "nidra",
    titleEnglish: "Yoga Nidra & Restorative",
    titleSanskrit: "योग निद्रा एवं दिव्य विश्राम",
    tagline: "Cosmic Conscious Sleep & Cellular Rejuvenation",
    overview: "State of dynamic psychic rest where the body sleeps while consciousness remains vividly awake, releasing deep-seated samskaras.",
    historicalRoot: "Mandukya Upanishad and Swami Satyananda Saraswati's tantric research.",
    artImage: APP_IMAGES.aarogyaYogaNidraRestArt,
    artTheme: "nidra",
    badge: "Subconscious Healing"
  },
  {
    id: "mudra",
    titleEnglish: "Mudra & Bandha Vigyan",
    titleSanskrit: "मुद्रा एवं बन्ध विज्ञान",
    tagline: "Sacred Energy Seals & Prana Circuitry",
    overview: "Gestures of hands and locks of the body (Mula, Uddiyana, Jalandhara) that seal vital prana against downward leakage and direct it to higher brain lobes.",
    historicalRoot: "Gheranda Samhita and Shiva Samhita esoteric scriptures.",
    artImage: APP_IMAGES.aarogyaMudraPranaArt,
    artTheme: "mudra",
    badge: "Prana Seals"
  },
  {
    id: "bhakti",
    titleEnglish: "Bhakti & Sacred Mantra Yoga",
    titleSanskrit: "भक्ति योग एवं नाद ब्रह्म",
    tagline: "Path of Divine Love & Sacred Sonic Vibration",
    overview: "Chanting of primordial seed mantras and devotional surrender that opens the Anahata heart chakra into pure bliss.",
    historicalRoot: "Narada Bhakti Sutras and Bhagavad Gita Chapter 12.",
    artImage: APP_IMAGES.aarogyaPadmasanaLotusArt,
    artTheme: "lotus",
    badge: "Heart Devotion"
  }
];

export const SURYA_NAMASKAR_STEPS = [
  { step: 1, sanskrit: "प्रणामासन (Pranamasana)", english: "Prayer Pose", mantra: "ॐ मित्राय नमः (Om Mitraya Namaha)", breath: "Exhale & Center", chakra: "Anahata (Heart)", artTheme: "lotus", artImage: APP_IMAGES.poseTadasanaMountain },
  { step: 2, sanskrit: "हस्तउत्तानासन (Hastauttanasana)", english: "Raised Arms Pose", mantra: "ॐ रवये नमः (Om Ravaye Namaha)", breath: "Deep Inhale", chakra: "Vishuddha (Throat)", artTheme: "surya", artImage: APP_IMAGES.poseHastauttanaArch },
  { step: 3, sanskrit: "पादहस्तासन (Padahastasana)", english: "Hand to Foot Pose", mantra: "ॐ सूर्याय नमः (Om Suryaya Namaha)", breath: "Full Exhale", chakra: "Svadhisthana (Sacral)", artTheme: "vinyasa", artImage: APP_IMAGES.posePadahastasanaFold },
  { step: 4, sanskrit: "अश्व सञ्चालनासन (Ashwa Sanchalanasana)", english: "Equestrian Pose", mantra: "ॐ भानवे नमः (Om Bhanave Namaha)", breath: "Inhale & Gaze Up", chakra: "Ajna (Third Eye)", artTheme: "surya", artImage: APP_IMAGES.poseAshwaSanchalan },
  { step: 5, sanskrit: "दण्डासन (Dandasana)", english: "Plank / Stick Pose", mantra: "ॐ खगाय नमः (Om Khagaya Namaha)", breath: "Retain Breath", chakra: "Manipura (Solar Plexus)", artTheme: "vinyasa", artImage: APP_IMAGES.poseDandasanaPlank },
  { step: 6, sanskrit: "अष्टाङ्ग नमस्कार (Ashtanga Namaskara)", english: "Salute with 8 Parts", mantra: "ॐ पूष्णे नमः (Om Pushne Namaha)", breath: "Exhale Gently", chakra: "Manipura (Solar Plexus)", artTheme: "lotus", artImage: APP_IMAGES.poseAshtangaNamaskar },
  { step: 7, sanskrit: "भुजङ्गासन (Bhujangasana)", english: "Cobra Pose", mantra: "ॐ हिरण्यगर्भाय नमः (Om Hiranyagarbhaya Namaha)", breath: "Inhale Arch Chest", chakra: "Anahata (Heart)", artTheme: "surya", artImage: APP_IMAGES.poseBhujangasanaCobra },
  { step: 8, sanskrit: "पर्वतासन (Parvatasana / Adho Mukha)", english: "Mountain / Downward Dog", mantra: "ॐ मरीचये नमः (Om Marichaye Namaha)", breath: "Full Exhale", chakra: "Vishuddha (Throat)", artTheme: "vinyasa", artImage: APP_IMAGES.poseParvatasanaDownward },
  { step: 9, sanskrit: "अश्व सञ्चालनासन (Ashwa Sanchalanasana)", english: "Equestrian Pose (Opposite)", mantra: "ॐ आदित्याय नमः (Om Adityaya Namaha)", breath: "Inhale Step Forward", chakra: "Ajna (Third Eye)", artTheme: "surya", artImage: APP_IMAGES.poseAshwaSanchalan },
  { step: 10, sanskrit: "पादहस्तासन (Padahastasana)", english: "Hand to Foot Forward Fold", mantra: "ॐ सवित्रे नमः (Om Savitre Namaha)", breath: "Exhale Bow Deep", chakra: "Svadhisthana (Sacral)", artTheme: "vinyasa", artImage: APP_IMAGES.posePadahastasanaFold },
  { step: 11, sanskrit: "हस्तउत्तानासन (Hastauttanasana)", english: "Raised Arms Pose", mantra: "ॐ अर्काय नमः (Om Arkaya Namaha)", breath: "Inhale Arch Skyward", chakra: "Vishuddha (Throat)", artTheme: "surya", artImage: APP_IMAGES.poseHastauttanaArch },
  { step: 12, sanskrit: "ताड़ासन / प्रणामासन (Tadasana / Pranam)", english: "Mountain Prayer Completion", mantra: "ॐ भास्कराय नमः (Om Bhaskaraya Namaha)", breath: "Exhale & Return", chakra: "Anahata (Heart)", artTheme: "lotus", artImage: APP_IMAGES.poseTadasanaMountain }
];

export const CLASSICAL_ASANAS: AsanaItem[] = [
  {
    id: "asana-1",
    sanskritName: "ताड़ासन",
    englishName: "Tadasana (Mountain Pose)",
    devaScript: "ताड़ासन",
    difficulty: "Beginner (आरम्भिक)",
    chakra: "Muladhara (Root Chakra)",
    duration: "1 - 2 mins",
    benefits: ["Improves posture and spinal elongation", "Strengthens thighs, knees, and ankles", "Cultivates rooted stability and mental calm"],
    cues: ["Distribute weight evenly across 4 corners of feet", "Engage quadriceps and tuck pelvis neutrally", "Roll shoulder blades back and down"],
    contraindications: "Severe headache, acute low blood pressure.",
    mantra: "स्थिरसुखमासनम् (Posture is steady and comfortable)",
    artImage: APP_IMAGES.poseTadasanaMountain,
    artTheme: "lotus",
    artDescription: "Rooted standing mountain pose with palms joined at the heart in respectful prayer mudra."
  },
  {
    id: "asana-2",
    sanskritName: "वृक्षासन",
    englishName: "Vrikshasana (Tree Pose)",
    devaScript: "वृक्षासन",
    difficulty: "Beginner (आरम्भिक)",
    chakra: "Anahata & Ajna",
    duration: "45-60 sec / side",
    benefits: ["Calibrates neuromuscular equilibrium and balance", "Tones leg tendons and opens hip pelvic girdle", "Sharpens single-pointed focus (Ekagrata)"],
    cues: ["Press standing foot deeply into earth", "Place sole of other foot against inner thigh (never knee)", "Draw hands into Anjali Mudra overhead"],
    contraindications: "Recent knee trauma or acute vertigo.",
    mantra: "ॐ शान्ताय नमः",
    artImage: APP_IMAGES.poseVrikshasanaTree,
    artTheme: "rishi",
    artDescription: "Classic one-legged tree pose with arms overhead, rooted like a sacred banyan tree on temple stone."
  },
  {
    id: "asana-3",
    sanskritName: "नटराजासन",
    englishName: "Natarajasana (Lord of the Dance Pose)",
    devaScript: "नटराजासन",
    difficulty: "Advanced (प्रवीण)",
    chakra: "Anahata & Manipura",
    duration: "30-45 sec / side",
    benefits: ["Builds immense athletic balance, elegance, and mental poise", "Deep backbend opening shoulders and chest", "Strengthens ankles, quadriceps, and spinal stabilizers"],
    cues: ["Fix drishti on an unmoving point straight ahead", "Kick back foot firmly into palm to expand chest arch", "Keep standing knee micro-soft to protect joints"],
    contraindications: "Severe lower back or ankle instability.",
    mantra: "ॐ नमः शिवाय (Salutations to Shiva the Cosmic Dancer)",
    artImage: APP_IMAGES.aarogyaNatarajasanaArt,
    artTheme: "natarajasana",
    artDescription: "Dynamic cosmic balance at dusk ghats against twilight temple fires."
  },
  {
    id: "asana-4",
    sanskritName: "वीरभद्रासन द्वितीय",
    englishName: "Virabhadrasana II (Warrior II)",
    devaScript: "वीरभद्रासन",
    difficulty: "Intermediate (मध्यम)",
    chakra: "Muladhara & Manipura",
    duration: "45-60 sec / side",
    benefits: ["Builds immense athletic stamina and mental courage", "Strengthens quadriceps, glutes, and shoulders", "Enhances hip mobility and joint durability"],
    cues: ["Front thigh parallel to floor, knee tracking over 2nd toe", "Extend arms actively from heart center", "Fix fierce, calm gaze over front middle finger"],
    contraindications: "High blood pressure (keep arms at hips).",
    mantra: "ॐ वीराय नमः",
    artImage: APP_IMAGES.aarogyaVinyasaWarriorArt,
    artTheme: "vinyasa",
    artDescription: "Heroic warrior lunge with arms extended wide, channeling tapas and unwavering discipline."
  },
  {
    id: "asana-5",
    sanskritName: "पद्मासन",
    englishName: "Padmasana (Lotus Pose)",
    devaScript: "पद्मासन",
    difficulty: "Intermediate (मध्यम)",
    chakra: "Sahasrara & Muladhara",
    duration: "5-20 mins meditation",
    benefits: ["Ultimate classical posture for deep Dhyana meditation", "Traps prana within pelvic floor to ascend Sushumna", "Soothes the brain's autonomic stress signals"],
    cues: ["Ensure hips are warm before entering full bind", "Spine upright, chin slightly tucked in Jalandhara cue", "Rest hands in Gyan or Chin Mudra"],
    contraindications: "Knee or ankle injury (practice Sukhasana instead).",
    mantra: "ॐ तत् सत्",
    artImage: APP_IMAGES.aarogyaPadmasanaLotusArt,
    artTheme: "lotus",
    artDescription: "Classical cross-legged lotus seat with hands in dhyana mudra in sacred temple peace."
  },
  {
    id: "asana-6",
    sanskritName: "भुजङ्गासन",
    englishName: "Bhujangasana (Cobra Pose)",
    devaScript: "भुजङ्गासन",
    difficulty: "Beginner (आरम्भिक)",
    chakra: "Anahata (Heart Chakra)",
    duration: "30-60 sec",
    benefits: ["Strengthens the entire spinal column", "Elevates mood and combats sedentary fatigue", "Massages liver, kidneys, and adrenals"],
    cues: ["Press tops of feet and pubic bone into mat", "Lift chest using back muscles before pressing hands", "Keep elbows gently bent and hugged to ribs"],
    contraindications: "Pregnancy or acute carpal tunnel syndrome.",
    mantra: "ॐ सर्पाय नमः",
    artImage: APP_IMAGES.poseBhujangasanaCobra,
    artTheme: "surya",
    artDescription: "Prone backbend arching chest upward gracefully like a cobra, opening thoracic cavity to the morning sun."
  },
  {
    id: "asana-7",
    sanskritName: "शीर्षासन",
    englishName: "Sirsasana (Headstand / King of Asanas)",
    devaScript: "शीर्षासन",
    difficulty: "Advanced (प्रवीण)",
    chakra: "Sahasrara & Ajna",
    duration: "1 - 3 mins",
    benefits: ["Inverts venous blood flow to supercharge brain oxygenation", "Stimulates pituitary and pineal endocrine master glands", "Builds shoulder girdle durability and core stability"],
    cues: ["Crown of head rests gently in interlaced fingers cradle", "Press 85% of weight into forearms, minimal on skull", "Engage core and inner thighs as a single column"],
    contraindications: "High blood pressure, glaucoma, neck injuries.",
    mantra: "ॐ सहस्रार प्रदीप्तये नमः",
    artImage: APP_IMAGES.poseSirsasanaHeadstand,
    artTheme: "kundalini",
    artDescription: "Full vertical inverted headstand supported on forearms in serene temple pillar stillness."
  },
  {
    id: "asana-8",
    sanskritName: "पश्चिमोत्तानासन",
    englishName: "Paschimottanasana (Seated Forward Bend)",
    devaScript: "पश्चिमोत्तानासन",
    difficulty: "Intermediate (मध्यम)",
    chakra: "Svadhisthana & Manipura",
    duration: "1 - 3 mins",
    benefits: ["Stretches entire posterior chain from heels to crown", "Massages abdominal viscera and stimulates digestion", "Induces tranquil introspection and lowers heart rate"],
    cues: ["Hinge strictly from hips with elongated lumbar spine", "Lead forward with chest rather than rounding forehead down", "Relax jaw and breathe deeply into lower kidneys"],
    contraindications: "Acute lumbar disc herniation or sciatica.",
    mantra: "ॐ शान्तात्मने नमः",
    artImage: APP_IMAGES.posePaschimottanasana,
    artTheme: "rishi",
    artDescription: "Deep seated forward fold over extended legs with hands clasping feet in meditative surrender."
  },
  {
    id: "asana-9",
    sanskritName: "त्रिकोणासन",
    englishName: "Utthita Trikonasana (Extended Triangle)",
    devaScript: "त्रिकोणासन",
    difficulty: "Beginner (आरम्भिक)",
    chakra: "Manipura (Solar Plexus)",
    duration: "30-45 sec / side",
    benefits: ["Lengthens hamstrings, calves, and spine", "Stimulates abdominal digestive organs and Agni", "Expands thoracic lungs for deeper oxygen uptake"],
    cues: ["Keep both side waists long and uncollapsed", "Rotate chest skyward toward top thumb", "Ground firmly through back heel"],
    contraindications: "Diarrhea or acute neck pain (gaze down).",
    mantra: "ॐ अग्नये नमः",
    artImage: APP_IMAGES.poseTrikonasanaTriangle,
    artTheme: "vinyasa",
    artDescription: "Lateral triangular extension with one arm touching ankle and upper arm pointing vertically to heaven."
  },
  {
    id: "asana-10",
    sanskritName: "गोमुखासन",
    englishName: "Gomukhasana (Cow Face Pose)",
    devaScript: "गोमुखासन",
    difficulty: "Intermediate (मध्यम)",
    chakra: "Anahata (Heart)",
    duration: "1 min / side",
    benefits: ["Deeply opens tight rotator cuffs and latissimus dorsi", "Relieves sciatic hip tightness and opens piriformis", "Broadens chest cavity for deeper diaphragmatic breathing"],
    cues: ["Stack knees directly over each other with feet flanking hips", "Clasp fingers behind back or use a strap", "Keep chest proud without flaring lower ribs"],
    contraindications: "Severe shoulder impingement or knee tears.",
    mantra: "ॐ सौम्याय नमः",
    artImage: APP_IMAGES.poseGomukhasanaCow,
    artTheme: "lotus",
    artDescription: "Seated upright with stacked knees and arms clasped behind spine in symmetrical tranquility."
  },
  {
    id: "asana-11",
    sanskritName: "धनुरासन",
    englishName: "Dhanurasana (Bow Pose)",
    devaScript: "धनुरासन",
    difficulty: "Intermediate (मध्यम)",
    chakra: "Manipura & Anahata",
    duration: "30-45 sec",
    benefits: ["Rejuvenates entire spinal column and counteracts desk slouch", "Massages abdominal organs to combat constipation", "Expands chest and improves vital lung capacity"],
    cues: ["Grasp outer ankles with knees hip-width apart", "Kick shins back and up to pull chest off mat", "Rock gently on navel with rhythmic breath"],
    contraindications: "Recent abdominal surgery, hernia, pregnancy.",
    mantra: "ॐ धनुर्धराय नमः",
    artImage: APP_IMAGES.poseDhanurasanaBow,
    artTheme: "natarajasana",
    artDescription: "Prone backward arch holding ankles with chest and thighs lifted like an archer's bow."
  },
  {
    id: "asana-12",
    sanskritName: "शवासन",
    englishName: "Savasana (Corpse / Cosmic Integration)",
    devaScript: "शवासन",
    difficulty: "Beginner (आरम्भिक)",
    chakra: "All 7 Chakras Integration",
    duration: "5-15 mins",
    benefits: ["Deep autonomic nervous system reset", "Lowers cortisol and normalizes arterial blood pressure", "Integrates pranic energetic changes into the nervous system"],
    cues: ["Feet fall open naturally, arms 45 degrees from torso", "Close eyes, unclench jaw and tongue", "Observe natural breath without trying to modify it"],
    contraindications: "None. Back discomfort can be relieved with a bolster under knees.",
    mantra: "ॐ पूर्णमदः पूर्णमिदम् (Wholeness in Being)",
    artImage: APP_IMAGES.aarogyaYogaNidraRestArt,
    artTheme: "nidra",
    artDescription: "Conscious stillness in the starlight: dissolving all tension into cosmic peace."
  }
];

export const PRANAYAMA_PRACTICES: PranayamaPractice[] = [
  {
    id: "nadi-shodhana",
    name: "Nadi Shodhana (Anulom Vilom)",
    sanskrit: "नाडी शोधन प्राणायाम",
    ratio: "4 : 4 : 4 : 4",
    inhaleSec: 4,
    holdSec: 4,
    exhaleSec: 4,
    holdEmptySec: 4,
    benefits: "Purifies the 72,000 nadis, balances the left (Ida) and right (Pingala) cerebral hemispheres, inducing profound emotional serenity.",
    technique: "Close right nostril with thumb, inhale left. Close both, hold. Exhale right with ring finger. Inhale right, hold, exhale left.",
    bestTime: "Dawn or twilight, on empty stomach.",
    artImage: APP_IMAGES.aarogyaPranayamaBreathArt,
    artTheme: "pranayama",
    artDescription: "Subtle breath weaving between solar and lunar currents at mountain dawn."
  },
  {
    id: "bhramari",
    name: "Bhramari (Humming Bee Breath)",
    sanskrit: "भ्रामरी प्राणायाम",
    ratio: "4 : 0 : 8 : 0",
    inhaleSec: 4,
    holdSec: 0,
    exhaleSec: 8,
    holdEmptySec: 0,
    benefits: "Generates therapeutic nitric oxide in nasal cavities, soothes the vagus nerve, relieves mental migraines and anxiety instantly.",
    technique: "Close ears with thumbs in Shanmukhi Mudra, inhale deeply through nose, and exhale producing a smooth, low-pitched humming sound 'Mmmmmm'.",
    bestTime: "Night time before sleep or when feeling agitated.",
    artImage: APP_IMAGES.aarogyaMudraPranaArt,
    artTheme: "mudra",
    artDescription: "Internal sonic resonance soothing brainwaves and awakening inner sound (Nada)."
  },
  {
    id: "kapalabhati",
    name: "Kapalabhati (Skull-Shining Kriya)",
    sanskrit: "कपालभाति प्राणायाम",
    ratio: "1 : 0 : 1 : 0",
    inhaleSec: 1,
    holdSec: 0,
    exhaleSec: 1,
    holdEmptySec: 0,
    benefits: "Expels carbon dioxide, fires digestive Agni, clears respiratory sinuses, and revitalizes sluggish cerebral blood flow.",
    technique: "Passive inhalation followed by rapid, forceful abdominal contractions pushing air through nostrils rhythmically.",
    bestTime: "Early morning before any meals.",
    artImage: APP_IMAGES.aarogyaSuryaNamaskarArt,
    artTheme: "surya",
    artDescription: "Solar breath burning away mental fog with dynamic internal bellows."
  },
  {
    id: "ujjayi",
    name: "Ujjayi (Victorious Ocean Breath)",
    sanskrit: "उज्जायी प्राणायाम",
    ratio: "5 : 0 : 5 : 0",
    inhaleSec: 5,
    holdSec: 0,
    exhaleSec: 5,
    holdEmptySec: 0,
    benefits: "Builds internal thermal tapas, regulates blood pressure, and provides an audible sonic anchor during physical asana flows.",
    technique: "Slightly constrict the epiglottis in the back of the throat, producing a soft ocean wave sound on both inhale and exhale.",
    bestTime: "Throughout any physical yoga practice or meditation.",
    artImage: APP_IMAGES.aarogyaRishiMeditationArt,
    artTheme: "rishi",
    artDescription: "The whispers of ocean waves within the throat chamber centering the mind."
  },
  {
    id: "sheetali",
    name: "Sheetali (Cooling Nectar Breath)",
    sanskrit: "शीतली प्राणायाम",
    ratio: "4 : 2 : 6 : 0",
    inhaleSec: 4,
    holdSec: 2,
    exhaleSec: 6,
    holdEmptySec: 0,
    benefits: "Cools internal Pitta fire, reduces fever and body heat, quenches thirst, and induces tranquil mental stillness.",
    technique: "Roll tongue into a straw tube, inhale cool air over the wet tongue, close mouth, hold briefly, exhale warm air through nostrils.",
    bestTime: "Hot afternoons or during intense emotional heat.",
    artImage: APP_IMAGES.aarogyaPadmasanaLotusArt,
    artTheme: "lotus",
    artDescription: "Nectar cooling water currents washing away heated irritability."
  }
];

export const CHAKRA_SYSTEM: ChakraNode[] = [
  {
    number: 1,
    name: "Muladhara (Root Chakra)",
    sanskrit: "मूलाधार चक्र",
    color: "Deep Crimson Red",
    glowHex: "#DC2626",
    location: "Base of the spine / Perineum",
    seedMantra: "लं (LAM)",
    element: "Prithvi (Earth - पृथिवी)",
    petals: 4,
    attribute: "Survival, Grounding, Stability, Courage",
    imbalanceSign: "Fear, insecurity, restlessness, lower back stiffness",
    balanceBenefit: "Firm sense of safety, vitality, physical durability, rooted confidence",
    artImage: APP_IMAGES.aarogyaKundaliniEnergyArt
  },
  {
    number: 2,
    name: "Svadhisthana (Sacral Chakra)",
    sanskrit: "स्वाधिष्ठान चक्र",
    color: "Warm Vermillion Orange",
    glowHex: "#EA580C",
    location: "Lower abdomen / 2 inches below navel",
    seedMantra: "वं (VAM)",
    element: "Jala (Water - जल)",
    petals: 6,
    attribute: "Creativity, Emotional Flow, Sensuality, Adaptability",
    imbalanceSign: "Emotional rigidity, guilt, creative blocks, pelvic stagnation",
    balanceBenefit: "Fluid creativity, joyous vitality, harmonious emotional relationships",
    artImage: APP_IMAGES.aarogyaKundaliniEnergyArt
  },
  {
    number: 3,
    name: "Manipura (Solar Plexus Chakra)",
    sanskrit: "मणिपूर चक्र",
    color: "Radiant Golden Yellow",
    glowHex: "#EAB308",
    location: "Navel center / Solar plexus",
    seedMantra: "रं (RAM)",
    element: "Agni (Fire - अग्नि)",
    petals: 10,
    attribute: "Willpower, Personal Power, Digestive Fire, Tapas",
    imbalanceSign: "Low self-worth, anger, sluggish digestion, lack of drive",
    balanceBenefit: "Radiant charisma, resolute discipline, dynamic metabolism, inner warrior strength",
    artImage: APP_IMAGES.aarogyaSuryaNamaskarArt
  },
  {
    number: 4,
    name: "Anahata (Heart Chakra)",
    sanskrit: "अनाहत चक्र",
    color: "Emerald Healing Green",
    glowHex: "#16A34A",
    location: "Center of the chest",
    seedMantra: "यं (YAM)",
    element: "Vayu (Air - वायु)",
    petals: 12,
    attribute: "Universal Love, Compassion, Forgiveness, Equanimity",
    imbalanceSign: "Grief, detachment, jealousy, shallow breathing, chest tightness",
    balanceBenefit: "Deep unconditional empathy, peaceful resilience, open heart posture",
    artImage: APP_IMAGES.aarogyaPadmasanaLotusArt
  },
  {
    number: 5,
    name: "Vishuddha (Throat Chakra)",
    sanskrit: "विशुद्ध चक्र",
    color: "Celestial Azure Blue",
    glowHex: "#0284C7",
    location: "Throat cavity / Thyroid",
    seedMantra: "हं (HAM)",
    element: "Akasha (Ether / Space - आकाश)",
    petals: 16,
    attribute: "Authentic Expression, Truth (Satya), Sonic Vibration",
    imbalanceSign: "Fear of speaking truth, social anxiety, throat constriction",
    balanceBenefit: "Eloquent, truthful speech, resonant vocal timbre, artistic voice",
    artImage: APP_IMAGES.aarogyaMudraPranaArt
  },
  {
    number: 6,
    name: "Ajna (Third Eye Chakra)",
    sanskrit: "आज्ञा चक्र",
    color: "Deep Indigo Sapphire",
    glowHex: "#4F46E5",
    location: "Between the eyebrows (Bhrumadhya)",
    seedMantra: "ॐ (AUM)",
    element: "Manas (Cosmic Mind - महत)",
    petals: 2,
    attribute: "Intuition, Inner Wisdom, Clairvoyance, Mental Clarity",
    imbalanceSign: "Mental fog, cynicism, nightmares, obsessive overthinking",
    balanceBenefit: "Sharp intuitive perception, clear foresight, quiet mind, transcendent focus",
    artImage: APP_IMAGES.aarogyaRishiMeditationArt
  },
  {
    number: 7,
    name: "Sahasrara (Crown of Transcendence)",
    sanskrit: "सहस्रार चक्र",
    color: "Luminous Violet & Golden White",
    glowHex: "#9333EA",
    location: "Brahmarandhra / Crown apex above head",
    seedMantra: "Silence / Universal Vibration",
    element: "Cosmic Consciousness (चिदाकाश)",
    petals: 1000,
    attribute: "Unity with the Divine, Spiritual Liberation (Moksha), Samadhi",
    imbalanceSign: "Spiritual alienation, existential despair, nihilism",
    balanceBenefit: "Supreme peace, cosmic oneness, transcendence of ego, radiant bliss",
    artImage: APP_IMAGES.aarogyaKundaliniEnergyArt
  }
];

export const VEDIC_PHILOSOPHY_QUOTES = [
  {
    sanskrit: "योगश्चित्तवृत्तिनिरोधः",
    transliteration: "Yogaś citta-vṛtti-nirodhaḥ",
    translation: "Yoga is the intentional stilling of the fluctuations and patterns of consciousness.",
    source: "Patanjali Yoga Sutras 1.2"
  },
  {
    sanskrit: "स्थिरसुखमासनम्",
    transliteration: "Sthira-sukham āsanam",
    translation: "Postures must embody both unshakeable steadiness and effortless ease.",
    source: "Patanjali Yoga Sutras 2.46"
  },
  {
    sanskrit: "योगः कर्मसु कौशलम्",
    transliteration: "Yogaḥ karmasu kauśalam",
    translation: "Yoga is supreme skill, awareness, and poise in every action of life.",
    source: "Bhagavad Gita 2.50"
  },
  {
    sanskrit: "समत्वं योग उच्यते",
    transliteration: "Samatvaṁ yoga ucyate",
    translation: "Evenness of mind and unwavering equanimity in all conditions is called Yoga.",
    source: "Bhagavad Gita 2.48"
  },
  {
    sanskrit: "चले वाते चलं चित्तं निश्चले निश्चलं भवेत्",
    transliteration: "Cale vāte calaṁ cittaṁ niścale niścalaṁ bhavet",
    translation: "When the breath wavers, the mind wavers. When the breath is stilled, the mind becomes calm and serene.",
    source: "Hatha Yoga Pradipika 2.2"
  }
];

/**
 * Returns the matching Indian Yoga art image based on theme or description
 */
export function getYogaArtThemeImage(themeOrText?: string): string {
  if (!themeOrText) return APP_IMAGES.aarogyaPadmasanaLotusArt;
  const str = themeOrText.toLowerCase();

  if (str.includes("lotus") || str.includes("padmasana") || str.includes("temple") || str.includes("bhakti")) {
    return APP_IMAGES.aarogyaPadmasanaLotusArt;
  }
  if (str.includes("kundalini") || str.includes("chakra") || str.includes("sriyantra") || str.includes("energy") || str.includes("sirsasana") || str.includes("crown")) {
    return APP_IMAGES.aarogyaKundaliniEnergyArt;
  }
  if (str.includes("nataraja") || str.includes("dance") || str.includes("ashtanga") || str.includes("vinyasa") || str.includes("dusk") || str.includes("balance")) {
    return APP_IMAGES.aarogyaNatarajasanaArt;
  }
  if (str.includes("rishi") || str.includes("sage") || str.includes("himalaya") || str.includes("dhyana") || str.includes("meditat") || str.includes("banyan") || str.includes("buddha")) {
    return APP_IMAGES.aarogyaRishiMeditationArt;
  }
  if (str.includes("mudra") || str.includes("prana") || str.includes("hand") || str.includes("bandha") || str.includes("bhramari")) {
    return APP_IMAGES.aarogyaMudraPranaArt;
  }
  if (str.includes("pranayam") || str.includes("breath") || str.includes("inhale") || str.includes("nadi") || str.includes("swara")) {
    return APP_IMAGES.aarogyaPranayamaBreathArt;
  }
  if (str.includes("warrior") || str.includes("virabhadra") || str.includes("tapas") || str.includes("strength") || str.includes("hero")) {
    return APP_IMAGES.aarogyaVinyasaWarriorArt;
  }
  if (str.includes("nidra") || str.includes("sleep") || str.includes("rest") || str.includes("savasana") || str.includes("corpse") || str.includes("relax")) {
    return APP_IMAGES.aarogyaYogaNidraRestArt;
  }
  if (str.includes("surya") || str.includes("sun") || str.includes("hatha") || str.includes("namaskar") || str.includes("dawn") || str.includes("morning")) {
    return APP_IMAGES.aarogyaSuryaNamaskarArt;
  }

  return APP_IMAGES.aarogyaPadmasanaLotusArt;
}

/**
 * Plays an authentic sacred Tibetan singing bowl / Vedic chime frequency
 * using Web Audio API (432Hz harmonic meditation tone)
 */
export function playSingingBowlChime(freq = 432, duration = 3.5) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Fundamental tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Harmonic overtone (octave + fifth)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);

    // Subtle third harmonic
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(freq * 2.76, ctx.currentTime);

    const now = ctx.currentTime;
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.85);

    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.06, now + 0.15);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);
    gain3.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);
  } catch (e) {
    // Audio contexts may be blocked by autoplay policies
  }
}
