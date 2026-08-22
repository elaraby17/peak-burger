import { offerSeed } from "./offers";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

export const offersStore = createStore(STORAGE_KEYS.OFFERS, () => offerSeed);
