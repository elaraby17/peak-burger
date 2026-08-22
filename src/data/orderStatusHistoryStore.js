import { orderStatusHistorySeed } from "./orderStatusHistory";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

export const orderStatusHistoryStore = createStore(
  STORAGE_KEYS.ORDER_STATUS_HISTORY,
  () => orderStatusHistorySeed
);
