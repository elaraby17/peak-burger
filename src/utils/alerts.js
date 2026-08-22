// src/utils/alerts.js
import Swal from "sweetalert2";

// رسالة نجاح
export function toastSuccess(message = "تم بنجاح!") {
    return Swal.fire({
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });
}

// رسالة خطأ
export function toastError(message = "حدث خطأ ما!") {
    return Swal.fire({
        icon: "error",
        title: message,
        showConfirmButton: true,
        confirmButtonText: "حسناً",
    });
}

// نافذة تأكيد (للحذف أو التعديل)
export async function confirmDialog(options = {}) {
    const result = await Swal.fire({
        title: options.title || "هل أنت متأكد؟",
        text: options.text || "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: options.confirmText || "تأكيد",
        cancelButtonText: options.cancelText || "إلغاء",
    });
    return result.isConfirmed;
}

// نافذة نجاح تفصيلية
export function successDialog(message = "تم بنجاح!") {
    return Swal.fire({
        icon: "success",
        title: message,
        confirmButtonText: "حسناً",
    });
}

// نافذة خطاء تفصيلية
export function errorDialog(message = "حدث خطاء ما!") {
    return Swal.fire({
        icon: "error",
        title: message,
        confirmButtonText: "حسناً",
    });
}