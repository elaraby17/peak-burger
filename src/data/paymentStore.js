import { paymentSeed } from "./payments";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

export const paymentStore = createStore(STORAGE_KEYS.PAYMENTS, () => paymentSeed);
