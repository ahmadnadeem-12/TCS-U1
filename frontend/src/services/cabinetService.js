
import { v4 as uuid } from "uuid";
import { LS_KEYS } from "../utils/constants";
import { getLS, setLS } from "../utils/helpers";

export function listCabinet() { return getLS(LS_KEYS.CABINET, []); }

export function createCabinetMember(payload) {
  const items = listCabinet();
  const item = { id: uuid(), ...payload };
  setLS(LS_KEYS.CABINET, [item, ...items]);
  return item;
}

export function updateCabinetMember(id, patch) {
  const items = listCabinet().map(i => (i.id === id ? { ...i, ...patch } : i));
  setLS(LS_KEYS.CABINET, items);
  return items.find(i => i.id === id) || null;
}

export function deleteCabinetMember(id) {
  setLS(LS_KEYS.CABINET, listCabinet().filter(i => i.id !== id));
}

export function reorderCabinet(ids) {
  const items = listCabinet();
  const map = new Map(items.map(i => [i.id, i]));
  const reordered = ids.map(id => map.get(id)).filter(Boolean);
  setLS(LS_KEYS.CABINET, reordered);
  return reordered;
}
