export const DEFAULT_JOB_CATEGORIES: { label: string; icon?: string }[] = [
  { label: "Information Technology", icon: "laptop" },
  { label: "Software Design And Development", icon: "laptop" },
  { label: "Marketing And Advertisement", icon: "megaphone" },
  { label: "Accounting And Finance", icon: "landmark" },
  { label: "Human Resource And Talent Management", icon: "users" },
  { label: "Creative Art And Design", icon: "palette" },
  { label: "Customer Service And Care", icon: "headphones" },
  { label: "Sales And Promotion", icon: "trending-up" },
  { label: "Health Care", icon: "heart-pulse" },
  { label: "Education And Training", icon: "graduation-cap" },
  { label: "Engineering", icon: "cog" },
  { label: "Other", icon: "more-horizontal" },
];

export function categoryLabelToSlug(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
