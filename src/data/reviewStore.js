import { reviewSeed } from "./reviews";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

export const reviewStore = createStore(STORAGE_KEYS.REVIEWS, () => reviewSeed);
