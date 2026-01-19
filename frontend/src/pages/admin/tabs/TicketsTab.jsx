
import React from "react";
import { setCheckedIn } from "../../../services/ticketService";

export default function TicketsTab({
    tickets,
    events,
    refresh
}) {
    return (
        <div>
            <div className="sectionSubtitle">View registrations and check-in attendees</div>
            <div className="hr" />
            <div style={{ display: "grid", gap: ".75rem" }}>
                {tickets.map(t => {
                    const ev = events.find(e => e.id === t.eventId);
                    return (
                        <div
                            key={t.id}
                            className="card"
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                            <div>
                                <div style={{ fontWeight: 900 }}>{ev?.title || "Event"}</div>
                                <div className="sectionSubtitle">{t.name} • {t.rollNo} • {t.email}</div>
                            </div>
                            <button
                                className={`btn ${t.checkedIn ? "btnGhost" : "btnPrimary"}`}
                                onClick={() => { setCheckedIn(t.id, !t.checkedIn); refresh(); }}
                                aria-label={t.checkedIn ? "Mark as not checked in" : "Check in attendee"}
                            >
                                {t.checkedIn ? "✓ Checked In" : "Check In"}
                            </button>
                        </div>
                    );
                })}
                {tickets.length === 0 && (
                    <div className="sectionSubtitle">No tickets yet. Registrations will appear here.</div>
                )}
            </div>
        </div>
    );
}
