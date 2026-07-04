import { getCategoryTagStyle } from "@/lib/newsletter/category-tag-styles";
import type { BlogPostRow } from "@/types/blog";
import type { NewsletterArticle } from "@/types/newsletter";

function formatReadTime(minutes: number | null, excerpt: string): string {
  if (minutes && minutes > 0) {
    return `${minutes} min read`;
  }

  const words = excerpt.trim().split(/\s+/).filter(Boolean).length;
  const estimated = Math.max(1, Math.ceil(words / 200));
  return `${estimated} min read`;
}

export function blogPostToArticle(
  post: BlogPostRow,
  siteUrl: string
): NewsletterArticle {
  const styles = getCategoryTagStyle(post.category_id);
  const baseUrl = siteUrl.replace(/\/$/, "");

  return {
    id: `art-${post.id}`,
    tag: post.category_label.toUpperCase(),
    tagColor: styles.tagColor,
    tagTextColor: styles.tagTextColor,
    title: post.title,
    desc: post.excerpt,
    readTime: formatReadTime(post.read_time_minutes, post.excerpt),
    url: `${baseUrl}/blog/${post.slug}`,
    imageUrl: post.image_url,
  };
}
