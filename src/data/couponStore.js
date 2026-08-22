import { couponSeed } from "./coupons";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

export const couponStore = createStore(STORAGE_KEYS.COUPONS, () => couponSeed);
