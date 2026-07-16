import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Globe2,
  HeartHandshake,
  Languages,
  Menu,
  MessageCircle,
  Music2,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";

export const navigation = [
  { label: "Explore skills", href: "/#skills" },
  { label: "Discover", href: "/discover" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Community", href: "/#community" },
  { label: "Safety", href: "/#safety" },
];

export const categories = [
  {
    title: "Design",
    description: "UI/UX, branding and visual design",
    members: "4.8k members",
    icon: Palette,
    iconClassName: "bg-violet-50 text-violet-600",
  },
  {
    title: "Development",
    description: "Web, mobile, AI and no-code",
    members: "6.3k members",
    icon: Code2,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    title: "Business",
    description: "Marketing, strategy and sales",
    members: "3.9k members",
    icon: BriefcaseBusiness,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  {
    title: "Languages",
    description: "Speaking, writing and fluency",
    members: "5.1k members",
    icon: Languages,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Music",
    description: "Instruments, vocals and production",
    members: "2.7k members",
    icon: Music2,
    iconClassName: "bg-rose-50 text-rose-600",
  },
  {
    title: "Education",
    description: "Tutoring, mentoring and learning",
    members: "4.2k members",
    icon: BookOpen,
    iconClassName: "bg-cyan-50 text-cyan-600",
  },
];
export const steps = [
  {
    number: "01",
    title: "Create your skill profile",
    description:
      "Show what you can teach, what you want to learn and how you prefer to connect.",
  },
  {
    number: "02",
    title: "Discover the right people",
    description:
      "Browse trusted members and find exchanges where both sides bring meaningful value.",
  },
  {
    number: "03",
    title: "Connect and exchange",
    description:
      "Schedule a session, share your knowledge and grow together without using money.",
  },
];

export const members = [
  {
    name: "Maya Chen",
    role: "Product designer",
    location: "Singapore",
    initials: "MC",
    rating: "4.9",
    offers: "UI/UX design",
    learning: "Spanish",
    gradient: "from-violet-500 to-indigo-600",
  },
  {
    name: "Daniel Brooks",
    role: "Growth strategist",
    location: "London",
    initials: "DB",
    rating: "5.0",
    offers: "Growth marketing",
    learning: "Photography",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Sofia Mendes",
    role: "Language coach",
    location: "Lisbon",
    initials: "SM",
    rating: "4.8",
    offers: "Portuguese",
    learning: "Web development",
    gradient: "from-pink-500 to-rose-500",
  },
];

export const testimonials = [
  {
    quote:
      "I traded brand strategy sessions for conversational French. It felt more valuable and personal than another online course.",
    name: "Amelia Ross",
    role: "Founder at North Studio",
    initials: "AR",
  },
  {
    quote:
      "I found a developer who helped me launch my portfolio while I helped him improve his presentation skills.",
    name: "Jordan Lee",
    role: "Creative director",
    initials: "JL",
  },
  {
    quote:
      "The community feels professional and safe. Every exchange starts with clear expectations from both people.",
    name: "Nina Patel",
    role: "Community builder",
    initials: "NP",
  },
];

export const floatingProfiles = [
  {
    initials: "AK",
    label: "Photography",
    position: "left-[0%] top-[15%]",
    delay: 0,
  },
  {
    initials: "LM",
    label: "Spanish",
    position: "right-[0%] top-[12%]",
    delay: 0.3,
  },
  {
    initials: "JT",
    label: "Web development",
    position: "left-[2%] bottom-[14%]",
    delay: 0.6,
  },
  {
    initials: "SR",
    label: "Public speaking",
    position: "right-[0%] bottom-[12%]",
    delay: 0.9,
  },
];

export const footerLinks = [
  {
    title: "Platform",
    links: ["Explore", "How it works", "Community", "Safety"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Stories", "Contact"],
  },
  {
    title: "Resources",
    links: ["Help centre", "Guidelines", "Blog", "Events"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Accessibility"],
  },
];
