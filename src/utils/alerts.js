import Swal from "sweetalert2";

const baseConfig = {
    background: "#111111",
    color: "#FFFFFF",

    customClass: {
        popup: "peak-alert-popup",
        title: "peak-alert-title",
        htmlContainer: "peak-alert-text",
        confirmButton: "peak-alert-confirm",
        cancelButton: "peak-alert-cancel",
    },

    buttonsStyling: false,
};

export function toastSuccess(message = "تم بنجاح!") {
    return Swal.fire({
        ...baseConfig,
        toast: true,
        position: "top-end",

        icon: "success",
        title: message,

        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,

        customClass: {
            ...baseConfig.customClass,
            popup: "peak-alert-popup peak-alert-toast",
        },
    });
}

export function toastError(message = "حدث خطأ ما!") {
    return Swal.fire({
        ...baseConfig,

        icon: "error",
        title: message,

        showConfirmButton: true,
        confirmButtonText: "حسناً",
    });
}

export async function confirmDialog(options = {}) {
    const result = await Swal.fire({
        ...baseConfig,

        title: options.title || "هل أنت متأكد؟",
        text: options.text || "",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: options.confirmText || "تأكيد",
        cancelButtonText: options.cancelText || "إلغاء",

        reverseButtons: true,

        customClass: {
            ...baseConfig.customClass,
            confirmButton: "peak-alert-confirm peak-alert-danger-confirm",
            cancelButton: "peak-alert-cancel",
        },
    });

    return result.isConfirmed;
}

export function successDialog(message = "تم بنجاح!") {
    return Swal.fire({
        ...baseConfig,

        icon: "success",
        title: message,

        confirmButtonText: "حسناً",
    });
}

export function errorDialog(message = "حدث خطأ ما!") {
    return Swal.fire({
        ...baseConfig,

        icon: "error",
        title: message,

        confirmButtonText: "حسناً",
    });
}
