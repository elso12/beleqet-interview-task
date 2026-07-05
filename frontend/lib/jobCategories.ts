/** Shown when API returns no categories — resolved to real IDs on submit */
export const FALLBACK_JOB_CATEGORIES = [
  "Information Technology",
  "Software Design And Development",
  "Marketing And Advertisement",
  "Accounting And Finance",
  "Human Resource And Talent Management",
  "Creative Art And Design",
  "Customer Service And Care",
  "Sales And Promotion",
  "Health Care",
  "Education And Training",
  "Engineering",
  "Other",
];

export function isPendingCategoryId(id: string): boolean {
  return id.startsWith("pending:");
}

export function pendingCategoryLabel(id: string): string {
  return id.replace(/^pending:/, "");
}

export function toPendingCategoryId(label: string): string {
  return `pending:${label}`;
}
