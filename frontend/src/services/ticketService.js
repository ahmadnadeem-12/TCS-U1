
import { v4 as uuid } from "uuid";
import { LS_KEYS } from "../utils/constants";
import { getLS, setLS } from "../utils/helpers";

export function listTickets() {
  return getLS(LS_KEYS.TICKETS, []);
}


export function createTicket({ userId, eventId, name, agNo, email, department, semester, publicTicketId }) {
  const tickets = listTickets();

  // 1 ticket per event per student (AG No)
  const exists = tickets.find(t => t.eventId === eventId && (t.agNo || "").toLowerCase() === (agNo || "").toLowerCase());
  if (exists) {
    throw new Error("You already generated a ticket for this event.");
  }

  const safeName = (name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  const finalPublicId = publicTicketId || `${safeName || "student"}-${(agNo || "0000-AG-0000")}-${ts}-${rand}`;

  const ticket = {
    id: uuid(),
    publicTicketId: finalPublicId,
    userId,
    eventId,
    name,
    agNo,
    email,
    department,
    semester,
    createdAt: new Date().toISOString(),
    checkedIn: false,
  };

  setLS(LS_KEYS.TICKETS, [ticket, ...tickets]);
  return ticket;
}


export function setCheckedIn(ticketId, checkedIn) {
  const tickets = listTickets().map(t => (t.id === ticketId ? { ...t, checkedIn } : t));
  setLS(LS_KEYS.TICKETS, tickets);
  return tickets.find(t => t.id === ticketId) || null;
}


export function setTicketCheckedIn(ticketId, checkedIn){
  const tickets = listTickets();
  const next = tickets.map(t => t.id === ticketId ? { ...t, checkedIn: !!checkedIn } : t);
  setLS(LS_KEYS.TICKETS, next);
  return next.find(t => t.id === ticketId);
}
