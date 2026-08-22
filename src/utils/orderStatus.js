// src/utils/orderStatus.js

export const statusLabels = {
    pending: "قيد الانتظار",
    processing: "جاري التجهيز",
    completed: "تم التوصيل",
    cancelled: "ملغي",
};

export const statusTone = {
    pending: "warning",
    processing: "info",
    completed: "success",
    cancelled: "danger",
};

export const ORDER_STATUSES = [
    { id: "pending", name: "قيد الانتظار" },
    { id: "processing", name: "جاري التجهيز" },
    { id: "completed", name: "تم التوصيل" },
    { id: "cancelled", name: "ملغي" },
];

// أضف هذه الخريطة أو الدالة لتحديد رقم الخطوة:
export const statusStepIndex = {
    pending: 0,
    processing: 1,
    completed: 2,
    cancelled: -1,
};
