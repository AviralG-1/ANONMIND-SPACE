export interface BlogSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  reviewedBy: string;
  date: string;
  reviewedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  audience: string;
  takeaways: string[];
  content: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "understanding-depression",
    title: "Understanding Depression: Breaking Through The Silence",
    excerpt:
      "Depression often looks like exhaustion, numbness, and disconnection long before someone has words for it.",
    author: "SafeSpace Editorial Team",
    reviewedBy: "Reviewed by licensed mental health advisors",
    date: "2026-03-12",
    reviewedAt: "2026-03-18",
    readTime: "8 min",
    category: "Mental Health",
    tags: ["Depression", "Awareness", "Getting Help"],
    featured: true,
    audience: "For anyone trying to understand low mood, fatigue, or emotional numbness.",
    takeaways: [
      "Depression is more than sadness.",
      "Naming the pattern can reduce shame.",
      "Persistent hopelessness deserves urgent support.",
    ],
    content: [
      {
        title: "What it can feel like",
        paragraphs: [
          "Depression can show up as losing interest in ordinary routines, struggling to answer messages, or feeling detached from your own life.",
          "Because these shifts often happen slowly, people blame themselves before they recognize a mental health pattern.",
        ],
      },
      {
        title: "When it is time to reach out",
        paragraphs: [
          "A hard week is human. Ongoing changes in sleep, appetite, concentration, or hope deserve more support than self-criticism.",
        ],
        bullets: [
          "Feeling drained all the time",
          "Losing interest in work, hobbies, or relationships",
          "Thinking harshly about yourself or feeling like a burden",
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "anxiety-in-the-digital-age",
    title: "Anxiety In The Digital Age",
    excerpt:
      "When your mind is already overloaded, constant notifications can keep your nervous system on high alert.",
    author: "SafeSpace Editorial Team",
    reviewedBy: "Reviewed by licensed mental health advisors",
    date: "2026-03-08",
    reviewedAt: "2026-03-17",
    readTime: "6 min",
    category: "Anxiety",
    tags: ["Anxiety", "Digital Wellness", "Boundaries"],
    featured: false,
    audience: "For people who spiral after long stretches online.",
    takeaways: [
      "High stimulation can intensify anxiety.",
      "Reducing input can be a healthy reset.",
      "Small boundaries are easier to keep than extreme detox plans.",
    ],
    content: [
      {
        title: "Why it feels so sticky",
        paragraphs: [
          "Phones compress news, work, entertainment, and social comparison into one place. That leaves very little recovery space.",
          "If anxiety is already present, fast-moving feeds can keep your body scanning for the next threat.",
        ],
      },
      {
        title: "A gentler reset",
        paragraphs: [
          "Try smaller boundaries first. Most people do better with repeatable habits than all-or-nothing plans.",
        ],
        bullets: [
          "Mute non-essential notifications",
          "Delay news and social feeds in the morning",
          "Swap one doom-scroll window for a grounding routine",
        ],
      },
    ],
  },
  {
    id: "3",
    slug: "building-resilience",
    title: "Building Resilience: Small Steps, Big Changes",
    excerpt:
      "Resilience is not pretending everything is fine. It is learning how to recover with a little more steadiness each time.",
    author: "SafeSpace Editorial Team",
    reviewedBy: "Reviewed by licensed mental health advisors",
    date: "2026-03-04",
    reviewedAt: "2026-03-16",
    readTime: "7 min",
    category: "Self-Help",
    tags: ["Resilience", "Recovery", "Habits"],
    featured: true,
    audience: "For people rebuilding routines after burnout or stress.",
    takeaways: [
      "Resilience grows from repetition, not pressure.",
      "Recovery works better with smaller routines.",
      "Structure can matter more than motivation.",
    ],
    content: [
      {
        title: "What resilience is",
        paragraphs: [
          "Resilience usually looks like flexibility, self-awareness, and returning to basics sooner after a setback.",
          "You do not become resilient by never struggling. You become resilient by learning how to recover.",
        ],
      },
      {
        title: "Micro-routines that help",
        paragraphs: [
          "The best routines are the ones you can keep on an ordinary day, not the ones that only work when you feel perfect.",
        ],
        bullets: [
          "A short morning reset before checking your phone",
          "One anchor meal or tea break at the same time each day",
          "A simple evening review of what helped and what drained you",
        ],
      },
    ],
  },
  {
    id: "4",
    slug: "supporting-a-loved-one",
    title: "Supporting A Loved One Through Mental Health Challenges",
    excerpt:
      "Wanting to help is natural. The challenge is staying compassionate without trying to carry the whole situation alone.",
    author: "SafeSpace Editorial Team",
    reviewedBy: "Reviewed by licensed mental health advisors",
    date: "2026-02-20",
    reviewedAt: "2026-03-13",
    readTime: "9 min",
    category: "Support",
    tags: ["Caregiving", "Boundaries", "Relationships"],
    featured: false,
    audience: "For friends, partners, and family members supporting someone they care about.",
    takeaways: [
      "Listening well can matter more than perfect advice.",
      "Supporters need boundaries too.",
      "Urgent safety concerns should move faster than comfort.",
    ],
    content: [
      {
        title: "Lead with steadiness",
        paragraphs: [
          "Short, calm check-ins are usually easier to receive than emotional speeches or pressure to feel better quickly.",
          "Curiosity often helps more than correction.",
        ],
      },
      {
        title: "Know your role",
        paragraphs: [
          "Being supportive does not mean becoming the only support system. Encourage professional help when the situation is ongoing or affects safety.",
        ],
        bullets: [
          "Offer practical help with appointments or calls",
          "Ask direct safety questions if you are worried",
          "Reach out for emergency support if there is immediate risk",
        ],
      },
    ],
  },
];

export const blogCategories = ["All", "Mental Health", "Anxiety", "Self-Help", "Support"];
