export const colors = {
  brand: "#ea580c",
  brandDark: "#c2410c",
  brandLight: "#fff7ed",
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#f59e0b",
  dark: "#0f172a",
};

export function formatPrice(price: number) {
  return "₹" + Math.round(price).toLocaleString("en-IN");
}
