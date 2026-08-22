
export function generateOrderId() {
  return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
}

// أضف هذه الدالة لتنسيق الأسعار:
export function formatPrice(price) {
  return Number(price || 0).toFixed(2) + " ج.م"; // أو العملة التي تفضلها
}
// أضف هذه الدالة لتنسيق التواريخ:
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}