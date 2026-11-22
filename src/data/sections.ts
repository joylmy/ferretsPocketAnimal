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
    'Are you considering getting a pet ferret? Here’s everything you need to know.',
  stickerImageUrl: '/assets/aistudio/ferretHero_8f5a07bc.jpg',
  speechBubbleMain: 'Dook dook!',
  speechBubbleSub: '(Happy ferret sound)',
  soundUrl: 'https://www.google.com/logos/fnbx/animal_sounds/ferret.mp3',
  profileCardTitle: 'Ferret Profile',
  profileStats: [
    { label: 'Lifespan', value: '5–10 Years' },
    { label: 'Weight', value:'Male:0.9-2.0kg, Female:0.6-1.0kg'},
    { label: 'Size', value:'body 33-45 cm plus 7-15 cm tail'},
    { label: 'Sleep', value: '12–18 hrs/day' },
    { label: 'Diet', value: 'Carnivore' },
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

export interface HandlingStep {
  id: string;
  stepLabel: string;
  text: string;
  subBullet?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface HandlingTopicCard {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface HandlingContent {
  steps: HandlingStep[];
  scruffWarningHeading: string;
  scruffWarningText: string;
  topicCards: HandlingTopicCard[];
}

export interface VeterinaryDiseaseItem {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface VeterinaryContent {
  overviewBullets: string[];
  diseases: VeterinaryDiseaseItem[];
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
  handlingContent?: HandlingContent;
  veterinaryContent?: VeterinaryContent;
}

export const VETERINARY_CONTENT: VeterinaryContent = {
  overviewBullets: [
    'Common conditions of pet ferrets include diarrhea, intestinal foreign bodies, parasites, heart disease, and various tumors.',
    'Ferrets are extremely susceptible to stress-related gastric ulcers.',
  ],
  diseases: [
    {
      id: 'vet-foreign-object',
      heading: 'Foreign object ingestion',
      paragraphs: [
        'Foreign object ingestion is a common problem in ferrets, especially ferrets less than one year old.',
        'Common signs of foreign object ingestion are the same as many other diseases, including anorexia, vomiting, lethargy, diarrhea, and progressive weight loss.',
      ],
    },
    {
      id: 'vet-heart-failure',
      heading: 'Congestive heart failure',
      paragraphs: [
        'Ferrets can develop congestive heart failure due to cardiomyopathy (improper function of the heart muscle), usually when they are over three years old. They can also develop heart failure due to heartworm infection. All ferrets should be on a monthly heartworm preventive.',
      ],
    },
    {
      id: 'vet-cancer',
      heading: 'Cancer',
      paragraphs: [
        'Ferrets commonly develop cancer somewhat early in life. Since early detection is critical to survival, every ferret should have yearly health examinations.',
        'The three most common types of cancer are pancreatic adenocarcinoma (insulinoma), adrenal gland tumors, and lymphosarcoma (cancer of the lymph nodes and lymphocytic white blood cells). Common skin tumors are basal cell carcinoma, hemangioma, and mast cell tumors.',
      ],
    },
    {
      id: 'vet-aleutian-disease',
      heading: 'Aleutian disease',
      paragraphs: [
        'Aleutian disease is caused by the same parvovirus that causes Aleutian disease in mink, however, the disease is quite different between these two species. In mink, AD results in rapidly life-threatening immune-mediated glomerulonephritis, vasculitis, and hypergammaglobulinemia. In ferrets, there are notable similarities, including a hypergammaglobulinemia, and in late stages of the disease, an immune complex glomerulonephritis; however, the disease is much more insidious, with a progression of as long as 2 years.',
      ],
    },
    {
      id: 'vet-ece',
      heading: 'Epizootic catarrhal enteritis',
      paragraphs: [
        'Epizootic catarrhal enteritis is a diarrheal disease of ferrets which causes epizootics of high morbidity (up to 100%), but low mortality. The diarrhea is rapidly dehydrating and most mortalities occur in older animals with concurrent illness.',
      ],
    },
    {
      id: 'vet-aae',
      heading: 'Adrenal-associated endocrinopathy',
      paragraphs: [
        'Adrenal-associated endocrinopathy is a common endocrine disorder of middle aged to older ferrets. The syndrome is the result of proliferative lesions in the adrenal cortex which secrete excess amounts of estrogenic hormones. As a result of this excess estrogen, affected ferrets exhibit a range of cutaneous, behavioral, and reproductive signs.',
      ],
    },
    {
      id: 'vet-proliferative-colitis',
      heading: 'Proliferative colitis',
      paragraphs: [
        'Proliferative colitis is an uncommon disease which is usually seen in male ferrets under one year of age. The disease is sporadic. Clinical signs include tenesmus and production of small, frequent bowel movements which often contain frank blood and mucus. The disease is caused by a campylobacter-like organism which results in asymmetrical proliferation of immature epithelium, causing marked thickening of the wall.',
      ],
    },
  ],
};

export const HANDLING_CONTENT: HandlingContent = {
  steps: [
    {
      id: 'handling-step-1',
      stepLabel: 'Step One',
      text: 'Approach the cage calmly and quietly. Ferrets are very inquisitive animals, so as you open the cage, allow or encourage the ferret to come to you. Remember – ferrets have poor eyesight, so they may bite by mistake if you reach into a cage too suddenly.',
    },
    {
      id: 'handling-step-2',
      stepLabel: 'Step Two',
      text: 'Lift the ferret from the cage by grasping around the shoulders and neck with one hand and supporting the hindquarters with the other. It is important to ensure the hindquarters are well supported as ferrets can be very wriggly and you want to avoid serious injury through their long bodies twisting.',
      subBullet:
        'If the ferret is trying to bite, hold around its shoulders and neck and place your thumb (of the same hand) under its chin to prevent it from dropping its head down to bite.',
      imageUrl: '/Handling/picture/step2-handling.png',
      imageAlt:
        'Proper two-handed ferret hold supporting the shoulders and neck with one hand and hindquarters with the other',
    },
  ],
  scruffWarningHeading: 'Never pick up a ferret by scruffing',
  scruffWarningText:
    'Never pick up a ferret by scruffing alone, as their full body weight hanging from the scruff causes discomfort and teaches them to associate being lifted with unpleasant sensations.',
  topicCards: [
    {
      id: 'handling-topic-socialization',
      heading: 'How socialization impacts ferrets',
      paragraphs: [
        'Socialization involves the systematic exposure to varied experiences, people, environments, and stimuli that creates confident, adaptable ferrets capable of coping with the demands of domestic life.',
        'Well-handled, thoroughly socialized ferrets enjoy a dramatically higher quality of life than their poorly adjusted counterparts.',
        'Undersocialized ferrets experience chronic stress when confronted with novel situations their limited experience has not prepared them to handle. This stress affects immune function, digestive health, and overall physical wellbeing in addition to psychological welfare.',
      ],
    },
    {
      id: 'handling-topic-trust-handling',
      heading: 'Trust handling',
      paragraphs: [
        'Ferrets who have learned to trust handling become genuinely affectionate companions who seek out contact rather than merely tolerating it.',
        'Watch for any signs of reduced tolerance that might indicate pain, illness, or developing fearfulness requiring attention.',
      ],
    },
    {
      id: 'handling-topic-environmental-factors',
      heading: 'Environmental factors',
      paragraphs: [
        'Environmental factors significantly impact handling and socialization success. Ferrets handled only when tired or full may associate handling with these low-energy states rather than developing active engagement.',
      ],
    },
    {
      id: 'handling-topic-food-rewards',
      heading: 'High-value food rewards',
      paragraphs: [
        'High-value food rewards provide the essential motivation for building positive handling associations. Most ferrets respond powerfully to salmon oil, which can be dispensed from squeeze bottles or droppers for precise delivery during handling. Freeze-dried meat treats, particularly those made from rabbit, chicken, or duck, offer convenient rewards that most ferrets find highly appealing.',
      ],
    },
    {
      id: 'handling-topic-blanket-handling',
      heading: 'Blanket handling',
      paragraphs: [
        'Ferrets often enjoy burrowing into soft materials, making blanket handling sessions particularly rewarding. Wrapping a ferret in a towel provides secure restraint for grooming procedures with less stress than manual holding alone.',
      ],
    },
  ],
};

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
    label: 'Temperature must < 32°C',
    text: 'Ferrets are very sensitive to heatstroke. Keep the temperature below 32°C.',
    x: 53,
    y: 7,
  },
  {
    id: 'hotspot-litter-box',
    index: 7,
    point: 'litter box',
    label: 'A litter Box at coner',
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
    label: 'A heavy Ceramic Bowl',
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
    subtitle: '',
    introPlaceholder: '',
    subtopics: [],
    notesPlaceholder: '',
    handlingContent: HANDLING_CONTENT,
  },
  {
    id: 'veterinary-issues',
    number: '04',
    navLabel: 'Significant Veterinary Issues',
    title: 'Significant Veterinary Issues',
    subtitle: '',
    introPlaceholder: '',
    subtopics: [],
    notesPlaceholder: '',
    veterinaryContent: VETERINARY_CONTENT,
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
