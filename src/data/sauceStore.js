import { sauceSeed } from "./sauces";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

export const sauceStore = createStore(STORAGE_KEYS.SAUCES, () => sauceSeed);
