import type { BlogPostCategoryId } from "@/types/blog";

export type CategoryTagStyle = {
  tagColor: string;
  tagTextColor: string;
};

export const CATEGORY_TAG_STYLES: Record<BlogPostCategoryId, CategoryTagStyle> =
  {
    philosophy: { tagColor: "#eff6ff", tagTextColor: "#1e40af" },
    connection: { tagColor: "#fdf2f8", tagTextColor: "#9d174d" },
    privacy: { tagColor: "#f0fdf4", tagTextColor: "#166534" },
    product: { tagColor: "#faf5ff", tagTextColor: "#6b21a8" },
  };

export function getCategoryTagStyle(
  categoryId: BlogPostCategoryId
): CategoryTagStyle {
  return CATEGORY_TAG_STYLES[categoryId];
}
