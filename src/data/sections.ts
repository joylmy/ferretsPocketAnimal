export interface HeroProfileStat {
  label: string;
  value: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  intro: string;
  stickerImageUrl: string;
  speechBubbleMain: string;
  speechBubbleSub: string;
  soundUrl: string;
  profileCardTitle: string;
  profileStats: HeroProfileStat[];
}

export const HERO_CONTENT: HeroContent = {
  eyebrow: '',
  title: 'The Essential Pet Ferret Care Guide',
  intro:
    'This single-page guide provides a clear, practical foundation for understanding and caring for pet ferrets across four core areas: Housing, Nutrition, Handling, and Significant Veterinary Issues. Explore the quick profile card on the right or jump directly to any topic below.',
  stickerImageUrl: '/assets/aistudio/ferretHero_8f5a07bc.jpg',
  speechBubbleMain: 'Dook dook!',
  speechBubbleSub: '(Happy ferret sound)',
  soundUrl: 'https://www.google.com/logos/fnbx/animal_sounds/ferret.mp3',
  profileCardTitle: 'Pocket Animal Profile',
  profileStats: [
    { label: 'Lifespan', value: '5–10 Years' },
    { label: 'Sleep', value: '12–18 hrs/day' },
    { label: 'Diet', value: 'Obligate Carnivore' },
    { label: 'Social', value: 'Lives in pairs/groups' },
  ],
};

export interface SubtopicPlaceholder {
  id: string;
  heading: string;
  placeholderLead: string;
  placeholderBody: string;
  imagePlaceholderCaption: string;
}

export interface HousingHotspot {
  id: string;
  index: number;
  point: string;
  label: string;
  text: string;
  /** Horizontal coordinate in percentage (0 to 100) on cagePic.webp */
  x: number;
  /** Vertical coordinate in percentage (0 to 100) on cagePic.webp */
  y: number;
}

export interface NutritionQAItem {
  id: string;
  question: string;
  answers: string[];
}

export interface FerretSection {
  id: string;
  number: string;
  navLabel: string;
  title: string;
  subtitle: string;
  introPlaceholder: string;
  subtopics: SubtopicPlaceholder[];
  notesPlaceholder: string;
  hotspots?: HousingHotspot[];
  hotspotImageUrl?: string;
  additionalNotesTitle?: string;
  additionalNotes?: string[];
  qaItems?: NutritionQAItem[];
  featureImageUrl?: string;
  featureImageAlt?: string;
  featureImageCaption?: string;
}

export const NUTRITION_QA_ITEMS: NutritionQAItem[] = [
  {
    id: 'nutrition-q1',
    question: 'What should I feed my ferret?',
    answers: [
      'Balanced commercial ferret diets are highly recommended for ferrets. The ideal diet ratio should be 30–35% protein, 15–30% fat, and low in fiber. The protein source should be meat-based rather than grains. Meat and its by-products should be the top ingredients in any ferret food.',
      'An adult ferret needs around 43 g/kg of dry food and 200–300 calories/kg per day.',
    ],
  },
  {
    id: 'nutrition-q2',
    question: 'How often should I feed my ferret?',
    answers: [
      "It's best to leave food out so they can have their meals 24 hours a day, because ferrets have a very short gut transit time.",
    ],
  },
  {
    id: 'nutrition-q3',
    question: "Can I change my ferret's diet frequently?",
    answers: [
      "Do not change a ferret's diet frequently. Most ferrets enjoy one brand of commercial diet for their entire lives. Changing their diet can lead to an upset stomach, diarrhea, and pancreatic problems.",
    ],
  },
  {
    id: 'nutrition-q4',
    question: 'How often should I feed my ferret if it develops low blood sugar?',
    answers: [
      'Ferrets with hypoglycemia (low blood sugar) should be fed several small meals throughout the day.',
    ],
  },
  {
    id: 'nutrition-q5',
    question: "What should I avoid in my ferret's diet/treats?",
    answers: [
      'Avoid feeding sweets, dairy products, raisins, fruits, and vegetables to your ferrets. These foods may cause diarrhea. Do not feed chocolate, as it can be fatal to ferrets.',
    ],
  },
  {
    id: 'nutrition-q6',
    question: 'How much water does my ferret need during the day?',
    answers: [
      'Make sure clean water is available 24 hours a day. Most ferrets prefer a heavy bowl over a sipper bottle. Change the water daily to prevent bacteria and yeast from growing.',
    ],
  },
];

export const HOUSING_ADDITIONAL_NOTES: string[] = [
  'Block all openings (holes) that lead to areas you cannot reach. Ferrets can squeeze through surprisingly small openings.',
  'To prevent ferrets from burrowing into the foam inside couches, chairs, and mattresses, block access to these areas with thin plywood or hardware cloth.',
  "Keep foam, plastic, and rubber objects like earplugs, erasers, and headphones out of ferrets' reach. Swallowing these items can completely block the intestines, which can be fatal.",
  'Older ferrets should be caged separately since they sleep more.',
  'Clean litter boxes and remove uneaten food daily.',
  'Clean the cage with soap and water at least weekly, and rinse well.',
];

export const HOUSING_HOTSPOTS: HousingHotspot[] = [
  {
    id: 'hotspot-ferret-head',
    index: 1,
    point: 'two ferrets together',
    label: 'Social Animal',
    text: 'Ferrets are social animals, so the cage should be large enough to hold more than two ferrets.',
    x: 24,
    y: 38,
  },
  {
    id: 'hotspot-cage-door',
    index: 2,
    point: 'at the cage door',
    label: 'Secure Door & Lock',
    text: 'The cage must be securely closed and locked. Wires should be very narrow to prevent ferrets from escaping.',
    x: 56,
    y: 52,
  },
  {
    id: 'hotspot-stair',
    index: 3,
    point: 'one stair',
    label: 'Ferret Nation',
    text: 'Multilevel cages, commonly called "Ferret Nation" cages, are great for up to four ferrets in one enclosure.',
    x: 44,
    y: 48,
  },
  {
    id: 'hotspot-bottom-floor',
    index: 4,
    point: 'the bottom of the cage',
    label: 'Solid Plastic Flooring',
    text: 'Provide a sturdy, solid floor. Plastic flooring is preferred since it is easy to clean and disinfect. Avoid wooden flooring since it is hard to clean urine and feces.',
    x: 40,
    y: 96,
  },
  {
    id: 'hotspot-left-side',
    index: 5,
    point: 'left side of cage',
    label: 'Ventilation',
    text: 'The cage should be well ventilated.',
    x: 12,
    y: 45,
  },
  {
    id: 'hotspot-window',
    index: 6,
    point: 'at window',
    label: 'Temperature Control (< 32°C)',
    text: 'Ferrets are very sensitive to heatstroke. Keep the temperature below 32°C.',
    x: 53,
    y: 7,
  },
  {
    id: 'hotspot-litter-box',
    index: 7,
    point: 'litter box',
    label: 'Corner Litter Box',
    text: 'Keep the litter box in a corner for ferrets to defecate and urinate.',
    x: 27,
    y: 91,
  },
  {
    id: 'hotspot-blanket',
    index: 8,
    point: 'one blanket',
    label: 'Towel & Blanket Bedding',
    text: 'Towels and blankets are used for bedding.',
    x: 16,
    y: 55,
  },
  {
    id: 'hotspot-green-hammock',
    index: 9,
    point: 'one green hammock',
    label: 'A Dark Sleeping Area',
    text: 'Ferrets sleep 12 to 18 hours a day. They may sleep inside a T-shirt, towel, blanket, ferret tent, or hammock. If you see your ferret chewing on its bedding, remove it immediately.',
    x: 57,
    y: 27,
  },
  {
    id: 'hotspot-ceramic-bowl',
    index: 10,
    point: 'left ceramic bowl',
    label: 'Heavy Ceramic Bowl',
    text: 'Ferrets easily tip over their dishes. Use heavy ceramic bowls that attach securely to the cage. Also, it is easier for them to drink from a heavy ceramic bowl than a sipper bottle.',
    x: 22,
    y: 50,
  },
];

export const FERRET_SECTIONS: FerretSection[] = [
  {
    id: 'housing',
    number: '01',
    navLabel: 'Housing',
    title: 'Housing',
    subtitle:
      'Explore the essential elements of an ideal ferret enclosure—click the blue dots below to inspect each housing feature.',
    introPlaceholder: '',
    subtopics: [],
    notesPlaceholder: '',
    hotspotImageUrl: '/Housing/picture/cagePic.webp',
    hotspots: HOUSING_HOTSPOTS,
    additionalNotesTitle: 'What Else Should You Keep in Mind?',
    additionalNotes: HOUSING_ADDITIONAL_NOTES,
  },
  {
    id: 'nutrition',
    number: '02',
    navLabel: 'Nutrition',
    title: 'Nutrition',
    subtitle: '',
    introPlaceholder: '',
    subtopics: [],
    notesPlaceholder: '',
    qaItems: NUTRITION_QA_ITEMS,
    featureImageUrl:
      'https://storage.googleapis.com/decennium-global.appspot.com/knowledge_assets/care_guides/myths-about-ferrets-raw-diet-safety-checklist/hero-g-1784413440446.png',
    featureImageAlt: 'Domestic ferrets eating their meal together',
    featureImageCaption:
      'Meat-based commercial diet with 30–35% protein, 15–30% fat, and fresh water available 24 hours a day.',
  },
  {
    id: 'handling',
    number: '03',
    navLabel: 'Handling',
    title: 'Handling',
    subtitle:
      'Safe physical restraint, socialization techniques, body language interpretation, and bite training',
    introPlaceholder:
      '[Placeholder — Handling Overview] This section will describe proper techniques for approaching, lifting, and supporting a ferret safely, alongside behavioral cues during play and clinical examination. Replace this text with your handling protocols.',
    subtopics: [
      {
        id: 'handling-support',
        heading: 'Physical Support & Restraint Techniques',
        placeholderLead:
          '[Placeholder — Lifting & Holding] Insert step-by-step instructions on two-handed chest and hindquarter support, as well as gentle scruffing for veterinary or grooming procedures.',
        placeholderBody:
          'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.',
        imagePlaceholderCaption:
          'Figure 3.1 Placeholder — Reserved for photograph demonstrating proper two-handed anatomical support.',
      },
      {
        id: 'handling-behavior',
        heading: 'Behavioral Cues, Socialization & Routine Grooming',
        placeholderLead:
          '[Placeholder — Behavior & Grooming] Insert notes on vocalizations, war-dance posture, kit nipping training, nail trimming, and ear cleaning here.',
        placeholderBody:
          'Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.',
        imagePlaceholderCaption:
          'Figure 3.2 Placeholder — Reserved for grooming restraint or behavioral posture reference image.',
      },
    ],
    notesPlaceholder:
      '[Placeholder — Key Handling Summary] Add key handling safety reminders and socialization milestones here.',
  },
  {
    id: 'veterinary-issues',
    number: '04',
    navLabel: 'Significant Veterinary Issues',
    title: 'Significant Veterinary Issues',
    subtitle:
      'Endocrine disorders, neoplasms, viral pathologies, gastrointestinal emergencies, and preventive care',
    introPlaceholder:
      '[Placeholder — Veterinary Issues Overview] This section will cover the major clinical conditions encountered in domestic ferrets, alongside vaccination schedules and routine diagnostic screening. Replace this paragraph with your clinical overview.',
    subtopics: [
      {
        id: 'vet-endocrine-neoplasia',
        heading: 'Adrenal Disease, Insulinoma & Lymphoma',
        placeholderLead:
          '[Placeholder — Endocrine & Neoplastic Conditions] Insert etiology, clinical signs (alopecia, lethargy, hypoglycemia), diagnostic workups, and medical/surgical management here.',
        placeholderBody:
          'Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam.',
        imagePlaceholderCaption:
          'Figure 4.1 Placeholder — Reserved for clinical presentation reference photo or endocrine diagnostic pathway diagram.',
      },
      {
        id: 'vet-infectious-preventive',
        heading: 'Infectious Diseases, GI Foreign Bodies & Preventive Medicine',
        placeholderLead:
          '[Placeholder — Infectious & Emergency Care] Insert details on Canine Distemper Virus, Influenza, Epizootic Catarrhal Enteritis (ECE), gastrointestinal obstructions, and annual checkups here.',
        placeholderBody:
          'Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus.',
        imagePlaceholderCaption:
          'Figure 4.2 Placeholder — Reserved for preventive vaccination timeline or clinical examination photograph.',
      },
    ],
    notesPlaceholder:
      '[Placeholder — Key Veterinary Summary] Add emergency red-flag symptoms and annual vaccination / bloodwork schedule details here.',
  },
];

export function getSectionById(id: string): FerretSection | undefined {
  const normalized = id.replace(/^#/, '').trim().toLowerCase();
  return FERRET_SECTIONS.find((section) => section.id === normalized);
}

export function resolveActiveSectionId(
  scrollY: number,
  sectionOffsets: ReadonlyArray<{ id: string; top: number }>,
  viewportOffset = 160
): string {
  if (sectionOffsets.length === 0) {
    return FERRET_SECTIONS[0].id;
  }

  const adjustedScroll = scrollY + viewportOffset;
  let activeId = sectionOffsets[0].id;

  for (const item of sectionOffsets) {
    if (adjustedScroll >= item.top) {
      activeId = item.id;
    } else {
      break;
    }
  }

  return activeId;
}

/**
 * Calculates reading progress percentage (0 to 100) from scroll position and document/viewport heights.
 */
export function calculateReadingProgress(
  scrollY: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) {
    return 0;
  }
  const raw = (scrollY / maxScroll) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
}
