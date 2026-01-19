
import { v4 as uuid } from "uuid";
import { LS_KEYS } from "../utils/constants";
import { getLS, setLS } from "../utils/helpers";

export function listEvents() {
  return getLS(LS_KEYS.EVENTS, []);
}

export function getEventById(id) {
  return listEvents().find(e => e.id === id) || null;
}

export function createEvent(payload) {
  const events = listEvents();
  const event = { id: uuid(), ...payload };
  setLS(LS_KEYS.EVENTS, [event, ...events]);
  return event;
}

export function updateEvent(id, patch) {
  const events = listEvents().map(e => (e.id === id ? { ...e, ...patch } : e));
  setLS(LS_KEYS.EVENTS, events);
  return events.find(e => e.id === id) || null;
}

export function deleteEvent(id) {
  const events = listEvents().filter(e => e.id !== id);
  setLS(LS_KEYS.EVENTS, events);
  return true;
}
