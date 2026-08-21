import Swal from "sweetalert2";

const brandTheme = {
  confirmButtonColor: "#D71920",
  cancelButtonColor: "#1A1512",
  background: "#FFFBF3",
  color: "#1A1512",
};

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  ...brandTheme,
  didOpen: (el) => {
    el.addEventListener("mouseenter", Swal.stopTimer);
    el.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export function toastSuccess(title) {
  return Toast.fire({ icon: "success", title });
}

export function toastInfo(title) {
  return Toast.fire({ icon: "info", title });
}

export async function confirmDialog({ title, text, confirmText = "Yes", cancelText = "Cancel" }) {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    ...brandTheme,
  });
  return result.isConfirmed;
}

export async function successDialog({ title, text, confirmText = "OK" }) {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: confirmText,
    ...brandTheme,
  });
}
