export type PaymentStatus =
  | "unprocessed"
  | "processed"
  | "paid"
  | "failed"
  | "pastDue";

export const STATUS_BADGES: Record<
  PaymentStatus,
  { color?: "blue" | "green" | "red"; icon: string; label: string }
> = {
  unprocessed: { icon: "flag", label: "Unprocessed" },
  processed: { color: "blue", icon: "in-progress", label: "Processing" },
  paid: { color: "green", icon: "check-circle", label: "Paid" },
  failed: { color: "red", icon: "exclamation-circle", label: "Failed" },
  pastDue: { color: "red", icon: "calendar", label: "Past Due" },
};
