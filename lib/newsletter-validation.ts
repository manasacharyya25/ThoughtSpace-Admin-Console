import { z } from "zod";

const shortText = z.string().min(1).max(500);
const mediumText = z.string().min(1).max(2000);
const urlText = z.string().min(1).max(2000);
const colorText = z.string().min(1).max(32);

const newsletterArticleSchema = z.object({
  id: z.string().min(1),
  tag: shortText,
  tagColor: colorText,
  tagTextColor: colorText,
  title: shortText,
  desc: mediumText,
  readTime: shortText,
  url: urlText,
  imageUrl: urlText,
});

const newsletterPromptSchema = z.object({
  id: z.string().min(1),
  num: shortText,
  initials: z.string().min(1).max(3),
  color: colorText,
  text: mediumText,
  time: shortText,
  tag: shortText,
  tagColor: colorText,
  tagTextColor: colorText,
});

const newsletterRecommendationSchema = z.object({
  type: shortText,
  title: shortText,
  creator: shortText,
  desc: mediumText,
  imageUrl: urlText,
  url: urlText,
  buttonText: shortText,
});

const newsletterCommunitySchema = z.object({
  title: shortText,
  desc: mediumText,
  buttonText: shortText,
  url: urlText,
});

export const newsletterStateSchema = z.object({
  issueNum: shortText,
  issueDate: shortText,
  badgeText: shortText,
  heroHeadlineBlack: shortText,
  heroHeadlineBlue: shortText,
  introText: mediumText,
  articles: z.array(newsletterArticleSchema).min(1).max(6),
  prompts: z.array(newsletterPromptSchema).min(1).max(4),
  recommendation: newsletterRecommendationSchema,
  community: newsletterCommunitySchema,
});

const publishAtSchema = z
  .string()
  .datetime({ offset: true })
  .nullable()
  .optional();

export const newsletterCreateSchema = z.object({
  state: newsletterStateSchema,
  publish_at: publishAtSchema,
});

export const newsletterPatchSchema = z.object({
  state: newsletterStateSchema.optional(),
  publish_at: publishAtSchema,
});

export type NewsletterCreateInput = z.infer<typeof newsletterCreateSchema>;
export type NewsletterPatchInput = z.infer<typeof newsletterPatchSchema>;
