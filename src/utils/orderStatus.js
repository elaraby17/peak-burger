// src/utils/orderStatus.js

export const statusLabels = {
    pending: { en: "Pending", ar: "قيد الانتظار" },
    processing: { en: "Preparing", ar: "جاري التجهيز" },
    completed: { en: "Delivered", ar: "تم التوصيل" },
    cancelled: { en: "Cancelled", ar: "ملغي" },
};

export const statusTone = {
    pending: "warning",
    processing: "info",
    completed: "success",
    cancelled: "danger",
};

export const ORDER_STATUSES = [
    { id: "pending", name: { en: "Pending", ar: "قيد الانتظار" } },
    { id: "processing", name: { en: "Preparing", ar: "جاري التجهيز" } },
    { id: "completed", name: { en: "Delivered", ar: "تم التوصيل" } },
    { id: "cancelled", name: { en: "Cancelled", ar: "ملغي" } },
];

// أضف هذه الخريطة أو الدالة لتحديد رقم الخطوة:
export const statusStepIndex = {
    pending: 0,
    processing: 1,
    completed: 2,
    cancelled: -1,
};
