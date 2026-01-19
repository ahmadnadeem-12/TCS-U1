
import React, { useContext, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { EventContext } from "../context/EventContext";
import { createTicket, listTickets } from "../services/ticketService";
import { formatDate } from "../utils/helpers";
import "../assets/styles/pages/tickets.css";

const DEPARTMENTS = ["CS", "SE", "Data Science", "AI", "IT", "Bioinformatics"];
const AG_REGEX = /^\d{4}-AG-\d{4,5}$/;

function slug(s) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Tickets() {
  const { user, isAuthed } = useAuth();
  const nav = useNavigate();
  const eventsCtx = useContext(EventContext);

  const events = useMemo(
    () => eventsCtx.list().filter((e) => e.status !== "past"),
    [eventsCtx, eventsCtx.version]
  );

  const [form, setForm] = useState({
    fullName: user?.name || "",
    agNo: "",
    email: user?.email || "",
    eventId: events?.[0]?.id || "",
    department: "CS",
    semester: "1",
  });

  // Auto-format AG Number: 2022 + 4/5 digits -> 2022-AG-XXXX
  const handleAgNoChange = (value) => {
    // Remove all non-digits first
    let digits = value.replace(/[^0-9]/g, "");

    // If user has typed enough digits, format automatically
    if (digits.length >= 8) {
      // First 4 digits = year, last 4-5 digits = number
      const year = digits.slice(0, 4);
      const number = digits.slice(4, 9); // Max 5 digits after year
      const formatted = `${year}-AG-${number}`;
      setForm({ ...form, agNo: formatted });
    } else if (digits.length > 4) {
      // Partial format while typing
      const year = digits.slice(0, 4);
      const number = digits.slice(4);
      const formatted = `${year}-AG-${number}`;
      setForm({ ...form, agNo: formatted });
    } else {
      // Just digits, no formatting yet
      setForm({ ...form, agNo: digits });
    }
  };

  const [ticket, setTicket] = useState(null);
  const [err, setErr] = useState("");

  const selectedEvent = events.find((e) => e.id === form.eventId);

  const myTickets = useMemo(() => {
    if (!user) return [];
    return listTickets().filter((t) => t.userId === user.id);
  }, [user, ticket]);

  if (!isAuthed) {
    return (
      <section className="section">
        <div className="sectionTitle">Tickets & Registration</div>
        <div className="sectionSubtitle" style={{ marginTop: ".35rem" }}>
          Student must login first to register & generate QR ticket.
        </div>
        <div style={{ marginTop: ".9rem", display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <button className="btn btnPrimary" onClick={() => nav("/login")}>Login</button>
          <button className="btn btnGhost" onClick={() => nav("/register")}>Register</button>
        </div>
      </section>
    );
  }

  const onGenerate = () => {
    setErr("");
    try {
      if (!form.fullName.trim()) throw new Error("Full Name is required.");
      if (!form.email.trim()) throw new Error("Email is required.");
      if (!form.agNo.trim()) throw new Error("AG No is required.");
      if (!AG_REGEX.test(form.agNo.trim().toUpperCase()))
        throw new Error("AG No format must be YYYY-AG-XXXX or YYYY-AG-XXXXX (digits).");
      if (!form.eventId) throw new Error("Event is required.");

      // 1 ticket = 1 event (per AG No)
      const ag = form.agNo.trim().toUpperCase();
      const already = listTickets().find(
        (t) => t.eventId === form.eventId && (t.agNo || "").toUpperCase() === ag
      );
      if (already) throw new Error("This AG No already has a ticket for this event.");

      // Get event name for ticket ID
      const eventName = selectedEvent?.title || "event";
      const eventSlug = slug(eventName).slice(0, 20); // Max 20 chars
      const random = Math.floor(Math.random() * 9000) + 1000;

      // Unique Ticket ID = event + name + AG + random
      const publicTicketId = `${eventSlug}-${slug(form.fullName)}-${ag}-${random}`;

      const t = createTicket({
        userId: user.id,
        eventId: form.eventId,
        name: form.fullName.trim(),
        agNo: ag,
        email: form.email.trim(),
        department: form.department,
        semester: form.semester,
        publicTicketId,
      });

      setTicket(t);
    } catch (e) {
      setErr(e?.message || "Failed to create ticket.");
    }
  };

  const qrPayload = ticket
    ? JSON.stringify({
      ticketId: ticket.id,
      publicTicketId: ticket.publicTicketId,
      userId: ticket.userId,
      eventId: ticket.eventId,
      agNo: ticket.agNo,
      email: ticket.email,
      department: ticket.department,
      semester: ticket.semester,
    })
    : "";

  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <div className="sectionTitle">Tickets & Registration</div>
          <div className="sectionSubtitle">
            Required fields shown with <b className="reqStar">*</b> • 1 ticket = 1 event
          </div>
        </div>
        <div className="pill pillRed">QR Ticket</div>
      </div>

      <div className="ticketsGrid">
        <div className="card">
          <div style={{ fontWeight: 900, marginBottom: ".2rem" }}>Register for Event</div>
          <div className="sectionSubtitle">
            AG Number format: <b>YYYY-AG-XXXX</b> / <b>YYYY-AG-XXXXX</b>
          </div>

          <div className="hr" />

          <div className="formRow">
            <div>
              <div className="label">Full Name<span className="reqStar">*</span></div>
              <input
                className="input"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <div className="label">AG No<span className="reqStar">*</span></div>
              <input
                className="input"
                value={form.agNo}
                onChange={(e) => handleAgNoChange(e.target.value)}
                placeholder="20227993 → 2022-AG-7993"
                maxLength={14}
              />
            </div>
          </div>

          <div className="formRow" style={{ marginTop: ".7rem" }}>
            <div>
              <div className="label">Email<span className="reqStar">*</span></div>
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@gmail.com"
              />
            </div>
            <div>
              <div className="label">Event<span className="reqStar">*</span></div>
              <select
                className="input"
                value={form.eventId}
                onChange={(e) => setForm({ ...form, eventId: e.target.value })}
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="formRow" style={{ marginTop: ".7rem" }}>
            <div>
              <div className="label">Department<span className="reqStar">*</span></div>
              <select
                className="input"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="label">Semester<span className="reqStar">*</span></div>
              <select
                className="input"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {err && <div style={{ marginTop: ".8rem", color: "#ffd2d7" }}>{err}</div>}

          <div style={{ marginTop: "1rem", display: "flex", gap: ".6rem", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <button className="btn btnPrimary" onClick={onGenerate}>
              Get Ticket
            </button>
            <div className="sectionSubtitle">
              Logged in as: <b>{user.email}</b>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 900, marginBottom: ".25rem" }}>Your QR Ticket</div>

          {ticket ? (
            <>
              <div className="ticketMock">
                <div className="ticketMockLeft">
                  <div className="ticketMockTitle">{selectedEvent?.title || "Event"}</div>
                  <div className="ticketMockMeta">
                    <div><span>Date</span>{selectedEvent ? formatDate(selectedEvent.date) : "—"} • {selectedEvent?.time || "—"}</div>
                    <div><span>Dept</span>{ticket.department}</div>
                    <div><span>Semester</span>{ticket.semester}</div>
                  </div>
                  <div className="ticketMockIssuer">Issued to: <b>{ticket.fullName}</b></div>
                </div>

                <div className="ticketMockRight">
                  <div className="ticketMockQr">
                    <QRCodeCanvas value={ticket.id} size={176} includeMargin={true} />
                  </div>
                  <div className="ticketMockSmall">Scan at entry</div>
                </div>

                <div className="ticketMockStrip">
                  Ticket ID: <span>{ticket.publicTicketId || ticket.id}</span>
                </div>
              </div>
            </>
          ) : (

            <div className="sectionSubtitle">Generate ticket to see QR here.</div>
          )}

          <div className="hr" />
          <div style={{ fontWeight: 900, marginBottom: ".35rem" }}>My Tickets</div>
          <div style={{ display: "grid", gap: ".5rem" }}>
            {myTickets.slice(0, 4).map((t) => {
              const ev = eventsCtx.list().find((e) => e.id === t.eventId);
              return (
                <div
                  key={t.id}
                  style={{
                    padding: ".6rem .7rem",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(0,0,0,0.35)",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: ".9rem" }}>{ev?.title || "Event"}</div>
                  <div className="sectionSubtitle" style={{ marginTop: ".15rem" }}>
                    Ticket: {t.publicTicketId || t.id}
                  </div>
                </div>
              );
            })}
            {myTickets.length === 0 && <div className="sectionSubtitle">No tickets yet.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
