export type HelplineType = "crisis" | "support" | "specialized";

export interface EmergencyResource {
  name: string;
  number: string;
  description: string;
  hours: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface HelplineResource {
  id: string;
  name: string;
  number: string;
  description: string;
  hours: string;
  location: string;
  languages: string[];
  specialization: string[];
  type: HelplineType;
  bestFor: string;
  verifiedAt: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const emergencyResource: EmergencyResource = {
  name: "Emergency Response Support System",
  number: "112",
  description:
    "Use for immediate danger or urgent medical, police, fire, or rescue support in India.",
  hours: "24/7",
  sourceLabel: "Government of India ERSS 112",
  sourceUrl: "https://www.112.gov.in/about",
};

export const helplineResources: HelplineResource[] = [
  {
    id: "vandrevala",
    name: "Vandrevala Foundation",
    number: "+91 9999 666 555",
    description: "Free mental health support with pan-India access.",
    hours: "24/7",
    location: "Pan India",
    languages: ["Multiple Indian languages"],
    specialization: ["Crisis support", "Emotional distress", "Immediate listening"],
    type: "crisis",
    bestFor: "Round-the-clock support when you need to talk to someone now.",
    verifiedAt: "2026-03-24",
    sourceLabel: "Vandrevala Foundation official contact page",
    sourceUrl: "https://www.vandrevalafoundation.com/free-counseling/contact-us",
  },
  {
    id: "aasra",
    name: "AASRA",
    number: "022-27546669",
    description: "Long-running emotional support and suicide prevention helpline.",
    hours: "24 hours, 7 days a week",
    location: "Navi Mumbai, Maharashtra",
    languages: ["English", "Hindi"],
    specialization: ["Suicide prevention", "Emotional support", "Crisis listening"],
    type: "crisis",
    bestFor: "24/7 confidential listening during intense emotional distress.",
    verifiedAt: "2026-03-24",
    sourceLabel: "AASRA official helpline page",
    sourceUrl: "https://www.aasra.info/helpline.html",
  },
  {
    id: "sumaitri",
    name: "Sumaitri",
    number: "011-46018404 / +91-9315767849",
    description: "Delhi-based crisis intervention centre for people in distress.",
    hours: "12:30 PM - 5:00 PM, 7 days a week",
    location: "New Delhi",
    languages: ["English", "Hindi"],
    specialization: ["Crisis intervention", "Depression", "Suicidal thoughts"],
    type: "crisis",
    bestFor: "People looking for a dedicated suicide intervention service in Delhi.",
    verifiedAt: "2026-03-24",
    sourceLabel: "Sumaitri official contact page",
    sourceUrl: "https://sumaitri.net/contact/",
  },
  {
    id: "cooj",
    name: "COOJ Mental Health Foundation",
    number: "63 6161 2525",
    description: "Distress helpline and community mental health support from Goa.",
    hours: "Monday to Friday, 1:00 PM - 7:00 PM",
    location: "Goa",
    languages: ["English"],
    specialization: ["Distress support", "Suicide prevention", "Community counseling"],
    type: "support",
    bestFor: "People who want structured listening support during working hours.",
    verifiedAt: "2026-03-24",
    sourceLabel: "COOJ suicide prevention program page",
    sourceUrl: "https://cooj.co.in/suicide-prevention/",
  },
  {
    id: "mann-talks",
    name: "Mann Talks",
    number: "8686 139 139",
    description: "Free psycho-social tele-counselling by trained professionals.",
    hours: "9:00 AM - 8:00 PM, every day",
    location: "India",
    languages: ["English", "Hindi", "Marathi", "Gujarati"],
    specialization: ["Tele-counselling", "Professional support", "Ongoing concerns"],
    type: "specialized",
    bestFor: "People who want to speak with a trained mental health professional by phone.",
    verifiedAt: "2026-03-24",
    sourceLabel: "Mann Talks services page",
    sourceUrl: "https://www.manntalks.org/our-services/",
  },
];

export const helplineTypeMeta: Record<
  HelplineType,
  {
    label: string;
    badgeClassName: string;
    borderClassName: string;
    buttonClassName: string;
  }
> = {
  crisis: {
    label: "Crisis Support",
    badgeClassName: "border border-emergency/30 bg-emergency/10 text-emergency",
    borderClassName: "border-emergency/20",
    buttonClassName: "border-emergency/30 text-emergency hover:bg-emergency/10",
  },
  support: {
    label: "Support Line",
    badgeClassName: "border border-primary/30 bg-primary/10 text-primary",
    borderClassName: "border-primary/20",
    buttonClassName: "border-primary/30 text-primary hover:bg-primary/10",
  },
  specialized: {
    label: "Specialized Care",
    badgeClassName: "border border-healing/30 bg-healing/10 text-healing",
    borderClassName: "border-healing/20",
    buttonClassName: "border-healing/30 text-healing hover:bg-healing/10",
  },
};

export const helplineLanguages = [
  "All",
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Multiple Indian languages",
];
