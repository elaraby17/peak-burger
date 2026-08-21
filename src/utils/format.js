import { CURRENCY } from "../data/products";

export function formatPrice(value, { lang = "en" } = {}) {
  if (value === null || value === undefined) {
    return lang === "ar" ? "السعر غير محدد" : "Price TBD";
  }
  const num = Number(value).toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  return lang === "ar" ? `${num} ${CURRENCY}` : `${CURRENCY} ${num}`;
}

export function formatDate(isoString, { lang = "en" } = {}) {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function generateOrderId() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PB-${rand}`;
}
