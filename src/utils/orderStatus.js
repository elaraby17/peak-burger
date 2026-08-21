export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const statusLabels = {
  pending: { en: "Pending", ar: "قيد الانتظار" },
  confirmed: { en: "Confirmed", ar: "تم التأكيد" },
  preparing: { en: "Preparing", ar: "جاري التحضير" },
  out_for_delivery: { en: "Out for Delivery", ar: "في الطريق إليك" },
  delivered: { en: "Delivered", ar: "تم التوصيل" },
  cancelled: { en: "Cancelled", ar: "ملغي" },
};

export const statusTone = {
  pending: "outline",
  confirmed: "primary",
  preparing: "primary",
  out_for_delivery: "secondary",
  delivered: "ink",
  cancelled: "outline",
};

export function statusStepIndex(status) {
  return ORDER_STATUSES.indexOf(status);
}
