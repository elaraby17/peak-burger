import api from "./api";

function normalizeSauce(raw) {
  if (!raw) return null;

  return {
    id: raw.id,
    nameEn: raw.name_en,
    nameAr: raw.name_ar,
    icon: raw.icon,
    active: Boolean(Number(raw.active ?? 0)),
    order: raw.order,
  };
}

const unwrap = (res) => res.data.data;

export const sauceService = {
  // Get all sauces from Laravel API
  getAll: () =>
    api
      .get("/sauces")
      .then(unwrap)
      .then((rows) => rows.map(normalizeSauce)),
};