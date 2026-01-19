
import React, { createContext, useMemo, useState } from "react";
import { createEvent, deleteEvent, listEvents, updateEvent } from "../services/eventService";

export const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [version, setVersion] = useState(0);

  const value = useMemo(() => ({
    list: () => listEvents(),
    create: (payload) => { const e = createEvent(payload); setVersion(v => v + 1); return e; },
    update: (id, patch) => { const e = updateEvent(id, patch); setVersion(v => v + 1); return e; },
    remove: (id) => { deleteEvent(id); setVersion(v => v + 1); return true; },
    version,
  }), [version]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}
