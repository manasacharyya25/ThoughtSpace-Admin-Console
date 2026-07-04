import type { AccordionState, NewsletterState } from "@/types/newsletter";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thoughtspace.online";

export function createDefaultNewsletterState(): NewsletterState {
  return {
    issueNum: "04",
    issueDate: "JULY 2026",
    badgeText: "✦ A NEW WAY TO CONNECT ✦",
    heroHeadlineBlack: "Explore the Quiet Complexities",
    heroHeadlineBlue: "of Being Human.",
    introText:
      "Every week, we unpack the thoughts, emotions and questions that often go unspoken—through essays, reflections and meaningful conversations. Our hope is simple: to create a safe space where we can connect through our shared human experience.",
    articles: [
      {
        id: "art-1",
        tag: "PHILOSOPHY",
        tagColor: "#eff6ff",
        tagTextColor: "#1e40af",
        title: "The Subtle Tyranny of Modern Audiences",
        desc: "Why sharing creative ideas without an audience might be the most liberating self-reflective act of our decade.",
        readTime: "5 min read",
        url: SITE_URL,
        imageUrl:
          "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "art-2",
        tag: "MINDFULNESS",
        tagColor: "#fdf2f8",
        tagTextColor: "#9d174d",
        title: "Solitude vs. Loneliness in the Connected Age",
        desc: "An exploration of how hyper-connectivity erodes our capacity for deep introspection and psychological resilience.",
        readTime: "7 min read",
        url: SITE_URL,
        imageUrl:
          "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "art-3",
        tag: "COMMUNITY",
        tagColor: "#f0fdf4",
        tagTextColor: "#166534",
        title: "How Anonymity Fosters Real Trust",
        desc: "An analytical deep dive into why eliminating profiles opens a window for authentic human intimacy.",
        readTime: "6 min read",
        url: SITE_URL,
        imageUrl:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400",
      },
    ],
    prompts: [
      {
        id: "prm-1",
        num: "REFLECTION #1",
        initials: "LK",
        color: "#3b82f6",
        text: "What is a core conviction you hold today that you would have argued passionately against five years ago?",
        time: "Posted 12m ago",
        tag: "#longing",
        tagColor: "#eff6ff",
        tagTextColor: "#1e40af",
      },
      {
        id: "prm-2",
        num: "REFLECTION #2",
        initials: "MR",
        color: "#a855f7",
        text: "If your current emotional space was a physical weather pattern, what would it look like and why?",
        time: "Posted 1h ago",
        tag: "#wonder",
        tagColor: "#faf5ff",
        tagTextColor: "#6b21a8",
      },
    ],
    recommendation: {
      type: "BOOK RECOMMENDATION",
      title: "The Courage to Be Disliked",
      creator: "Ichiro Kishimi & Fumitake Koga",
      desc: "A powerful dialogue demonstrating how to unlock the courage to change and discover true freedom. Adlerian psychology applied simply to modern existential struggles.",
      imageUrl:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
      url: SITE_URL,
      buttonText: "Read or Listen",
    },
    community: {
      title: "Continue the Conversation",
      desc: "The thoughts we carry become lighter when they're shared. Join a community of thoughtful people exploring the questions, emotions and experiences that quietly connect us all.",
      buttonText: "Join the Community →",
      url: SITE_URL,
    },
  };
}

export const DEFAULT_ACCORDION_STATE: AccordionState = {
  meta: true,
  essays: false,
  reflect: false,
  recs: false,
  cta: false,
};

export const PROMPT_COLORS = ["#3b82f6", "#a855f7", "#e11d48", "#0d9488"];
