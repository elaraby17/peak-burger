// src/utils/alerts.js

export function confirmDialog(message = "هل أنت متأكد؟") {
    return window.confirm(message);
}

export function toastSuccess(message) {
    console.log("SUCCESS:", message);
    alert(message);
}

export function toastError(message) {
    console.error("ERROR:", message);
    alert(message);
}
// أضف هذه الدالة لحل المشكلة الحالية:
export function successDialog(message = "تم بنجاح!") {
  return window.alert(message);
}