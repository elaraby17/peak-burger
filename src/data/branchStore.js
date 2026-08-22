import { branchSeed } from "./branches";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

export const branchStore = createStore(STORAGE_KEYS.BRANCHES, () => branchSeed);
