export type NewsletterArticle = {
  id: string;
  tag: string;
  tagColor: string;
  tagTextColor: string;
  title: string;
  desc: string;
  readTime: string;
  url: string;
  imageUrl: string;
};

export type NewsletterPrompt = {
  id: string;
  num: string;
  initials: string;
  color: string;
  text: string;
  time: string;
  tag: string;
  tagColor: string;
  tagTextColor: string;
};

export type NewsletterRecommendation = {
  type: string;
  title: string;
  creator: string;
  desc: string;
  imageUrl: string;
  url: string;
  buttonText: string;
};

export type NewsletterCommunity = {
  title: string;
  desc: string;
  buttonText: string;
  url: string;
};

export type NewsletterState = {
  issueNum: string;
  issueDate: string;
  badgeText: string;
  heroHeadlineBlack: string;
  heroHeadlineBlue: string;
  introText: string;
  articles: NewsletterArticle[];
  prompts: NewsletterPrompt[];
  recommendation: NewsletterRecommendation;
  community: NewsletterCommunity;
};

export type AccordionSection = "meta" | "essays" | "reflect" | "recs" | "cta";

export type AccordionState = Record<AccordionSection, boolean>;
