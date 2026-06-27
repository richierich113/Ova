import { CyclePhaseType, WellnessAdvice, SymptomLog } from './types';

export const PHASE_DETAILS: Record<CyclePhaseType, {
  displayName: string;
  description: string;
  colorClass: string;
  accentBg: string;
  glowClass: string;
  borderColor: string;
  bgGradient: string;
}> = {
  Menstrual: {
    displayName: 'Menstrual Phase',
    description: 'A sacred time for rest, physical renewal, and deep intuition.',
    colorClass: 'text-rose-400',
    accentBg: 'bg-rose-500',
    glowClass: 'shadow-rose-500/10',
    borderColor: 'border-rose-500/20',
    bgGradient: 'from-rose-500/10 via-rose-500/5 to-transparent'
  },
  Follicular: {
    displayName: 'Follicular Phase',
    description: 'Rising estrogen brings dynamic energy, planning, and high creativity.',
    colorClass: 'text-teal-400',
    accentBg: 'bg-teal-400',
    glowClass: 'shadow-teal-400/10',
    borderColor: 'border-teal-400/20',
    bgGradient: 'from-teal-400/10 via-teal-400/5 to-transparent'
  },
  Ovulatory: {
    displayName: 'Ovulatory Phase',
    description: 'Estrogen peaks, fueling maximum social confidence, stamina, and charisma.',
    colorClass: 'text-orange-400',
    accentBg: 'bg-orange-500',
    glowClass: 'shadow-orange-500/10',
    borderColor: 'border-orange-500/20',
    bgGradient: 'from-orange-500/10 via-orange-500/5 to-transparent'
  },
  Luteal: {
    displayName: 'Luteal Phase',
    description: 'Progesterone guides you to wind down, organize, and focus on self-soothing.',
    colorClass: 'text-indigo-400',
    accentBg: 'bg-indigo-500',
    glowClass: 'shadow-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    bgGradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent'
  }
};

export const WELLNESS_ADVICE_BY_PHASE: Record<CyclePhaseType, WellnessAdvice> = {
  Menstrual: {
    movement: {
      title: 'Restorative & Deep Stretch',
      description: 'Prioritize physical decompression and lower pelvic relief.',
      tips: [
        'Gentle restorative yoga (Child’s pose, Reclined Butterfly)',
        'Slow, mindful outdoor walks to boost circulation',
        'Incorporate 10–15 min of focused breathing or total rest'
      ],
      iconName: 'Sparkles'
    },
    nutrition: {
      title: 'Warm & Remineralizing',
      description: 'Replenish iron and minerals lost during menstruation.',
      tips: [
        'Iron-rich foods: leafy greens, grass-fed beef, or dark lentils',
        'Warm, soothing bone broths, ginger tea, and stews',
        'Magnesium-dense foods like dark cacao (85%+) to ease uterine contractions'
      ],
      iconName: 'Flame'
    },
    mindset: {
      title: 'Inward Vision & Intention',
      description: 'Your brain’s left and right hemispheres communicate most now.',
      tips: [
        'Ideal time for honest journaling and reflecting on the past month',
        'Set high-level monthly intentions and strategic life goals',
        'Decline non-essential social calls to honor your personal boundaries'
      ],
      iconName: 'Moon'
    }
  },
  Follicular: {
    movement: {
      title: 'Cardio & Strength Building',
      description: 'Your muscles recover faster with rising estrogen levels.',
      tips: [
        'Light to moderate running or cycling workouts',
        'Introduction of progressive overload resistance training',
        'Energizing Vinyasa flows or athletic styling workouts'
      ],
      iconName: 'Activity'
    },
    nutrition: {
      title: 'Fresh, Vibrant & Fermented',
      description: 'Support estrogen metabolism with raw, light ingredients.',
      tips: [
        'Fermented foods (kimchi, sauerkraut, kefir) for gut microflora',
        'Phytoestrogen foods: ground flaxseed, sesame seeds, and edamame',
        'Lean proteins with cruciferous vegetables to optimize liver enzymes'
      ],
      iconName: 'Grape'
    },
    mindset: {
      title: 'Strategic Planning & Ideation',
      description: 'Mental openness and high cognitive curiosity are at their peak.',
      tips: [
        'Brainstorm new business concepts, writing, or creative endeavors',
        'Pitch new ideas, plan the upcoming weeks, and schedule workshops',
        'Say "yes" to novel experiences and learn something challenging'
      ],
      iconName: 'Compass'
    }
  },
  Ovulatory: {
    movement: {
      title: 'Peak Intensity (HIIT & Heavy Lift)',
      description: 'Maximum cardiovascular capacity and high energy thresholds.',
      tips: [
        'High-Intensity Interval Training (HIIT) or sprinting',
        'PR-chasing heavy weightlifting and strength circuits',
        'Group fitness classes or high-energy team athletic activities'
      ],
      iconName: 'Zap'
    },
    nutrition: {
      title: 'Hydrating & Liver-Supporting',
      description: 'Help the liver break down the peak surge of estrogen.',
      tips: [
        'Raw salads, sprouts, and hydrating fruits (berries, watermelon)',
        'Cruciferous vegetables: broccoli, Brussels sprouts, and cauliflower',
        'High fiber to physically bind and eliminate excess estrogen'
      ],
      iconName: 'Apple'
    },
    mindset: {
      title: 'Magnetic Social & Charisma',
      description: 'Verbal skills and social confidence are naturally elevated.',
      tips: [
        'Schedule public speaking, crucial negotiations, or hard meetings',
        'Perfect window for networking mixers, active dating, and socials',
        'Express your love and hold deeply connecting conversations'
      ],
      iconName: 'Users'
    }
  },
  Luteal: {
    movement: {
      title: 'Steady Strength & Pilates/Barre',
      description: 'Maintain fitness, then transition to slow recovery as PMS approaches.',
      tips: [
        'Strength training focusing on controlled, slow concentric movements',
        'Sculpting Pilates, Barre, or active stretching',
        'Switch to yoga as your stamina decreases in the latter days'
      ],
      iconName: 'Dumbbell'
    },
    nutrition: {
      title: 'Blood-Sugar Balancing & Fiber',
      description: 'Keep your blood sugar extremely stable to mitigate PMS symptoms.',
      tips: [
        'Slow complex carbohydrates (sweet potato, squash, quinoa) to avoid sugar crashes',
        'Healthy fats (avocado, raw nuts, ghee) to support progesterone synthesis',
        'Anti-inflammatory spices (turmeric, ginger) to combat bloating'
      ],
      iconName: 'Soup'
    },
    mindset: {
      title: 'Completion, Detail-Work & Nesting',
      description: 'Your focus naturally shifts to details, organization, and coziness.',
      tips: [
        'Tie up loose ends of active projects and organize your space',
        'Perfect time for editing, bookkeeping, and precise admin tasks',
        'Practice self-soothing rituals and create a warm, calm environment'
      ],
      iconName: 'CheckSquare'
    }
  }
};

// Mock history entries representing realistic cycle data
export const INITIAL_SYMPTOM_LOGS: SymptomLog[] = [
  {
    id: '1',
    date: '2026-06-25',
    cycleDay: 26,
    phase: 'Luteal',
    moods: ['😴 Fatigued', '😔 Anxious'],
    physical: ['Bloating', 'Cramps'],
    notes: 'Feeling a bit low on energy today. Cozy evening with hot chamomile tea helped.'
  },
  {
    id: '2',
    date: '2026-06-20',
    cycleDay: 21,
    phase: 'Luteal',
    moods: ['⚡ Focused'],
    physical: ['None'],
    notes: 'Highly productive at work today. Organized the storage closet.'
  },
  {
    id: '3',
    date: '2026-06-15',
    cycleDay: 16,
    phase: 'Ovulatory',
    moods: ['😊 Active'],
    physical: ['None'],
    notes: 'Ran 5k and hit a personal record. Social evening went super well!'
  },
  {
    id: '4',
    date: '2026-06-11',
    cycleDay: 12,
    phase: 'Ovulatory',
    moods: ['😊 Active', '⚡ Focused'],
    physical: ['None'],
    notes: 'Felt very charismatic during my presentation. High energy all day.'
  },
  {
    id: '5',
    date: '2026-06-05',
    cycleDay: 6,
    phase: 'Follicular',
    moods: ['😊 Active'],
    physical: ['None'],
    notes: 'Woke up excited. Did a great yoga flow and prepped some dynamic meals!'
  }
];
