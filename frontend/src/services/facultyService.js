
import { v4 as uuid } from "uuid";
import { LS_KEYS } from "../utils/constants";
import { getLS, setLS } from "../utils/helpers";

export function listFaculty() { return getLS(LS_KEYS.FACULTY, []); }

export function createFaculty(payload) {
  const items = listFaculty();
  const item = { id: uuid(), ...payload };
  setLS(LS_KEYS.FACULTY, [item, ...items]);
  return item;
}

export function updateFaculty(id, patch) {
  const items = listFaculty().map(i => (i.id === id ? { ...i, ...patch } : i));
  setLS(LS_KEYS.FACULTY, items);
  return items.find(i => i.id === id) || null;
}

export function deleteFaculty(id) {
  setLS(LS_KEYS.FACULTY, listFaculty().filter(i => i.id !== id));
}

export function reorderFaculty(ids) {
  const items = listFaculty();
  const map = new Map(items.map(i => [i.id, i]));
  const reordered = ids.map(id => map.get(id)).filter(Boolean);
  setLS(LS_KEYS.FACULTY, reordered);
  return reordered;
}
