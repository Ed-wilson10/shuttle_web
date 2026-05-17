import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// ── Full ticket detail overlay ────────────────────────────────────────────────
function TicketDetail({ booking, user, onClose }) {
  function formatTime(t) {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr < 12 ? "AM" : "PM"}`;
  }
  function formatDate(d) {
    if (!d) return "";
    return new Date(d + "T00:00:00").toLocaleDateString("en-GH", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  }

  const statusColors = {
    confirmed: "#22c55e", boarded: "#3b82f6",
    cancelled: "#ef4444", no_show: "#f59e0b",
  };

  const cells = [
    ["SEAT",      String(booking.seat_number || 0).padStart(2, "0"), true],
    ["BUS",       booking.time_slots?.buses?.bus_code || "—",        false],
    ["DEPARTURE", formatTime(booking.time_slots?.departure_time),    false],
    ["PLATE",     booking.time_slots?.buses?.plate_number || "—",   false],
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999, padding: "1.5rem", overflowY: "auto",
    }}>
      <div style={{ width: "100%", maxWidth: "400px", margin: "auto" }}>

        {/* Status banner */}
        <div style={{
          background: statusColors[booking.status] || "#888",
          textAlign: "center", padding: "8px", borderRadius: "12px 12px 0 0",
          fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem",
          fontWeight: 700, letterSpacing: "0.15em", color: "#fff",
        }}>
          {(booking.status || "").toUpperCase()}
        </div>

        {/* Ticket card — white */}
        <div id="printable-ticket" style={{ background: "#fafaf8", color: "#111", borderRadius: "0 0 20px 20px", overflow: "hidden" }}>

          {/* Dark header */}
          <div style={{ background: "#111", padding: "1.1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.15rem", color: "#f5a623", letterSpacing: "2px" }}>
              🚌 ShuttlePass · UCC
            </span>
            <span style={{ fontSize: "0.7rem", color: "#aaa", fontFamily: "JetBrains Mono, monospace" }}>
              {formatDate(booking.time_slots?.travel_date)}
            </span>
          </div>

          {/* Big ticket number */}
          <div style={{ padding: "1.5rem", textAlign: "center", borderBottom: "2px dashed #ddd" }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", color: "#999", fontFamily: "JetBrains Mono, monospace", margin: "0 0 6px" }}>TICKET NUMBER</p>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "2.6rem", fontWeight: 700, color: "#111", letterSpacing: "0.08em", lineHeight: 1 }}>
              {booking.ticket_number}
            </div>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", color: "#999", fontFamily: "JetBrains Mono, monospace", margin: "14px 0 5px" }}>UNIQUE CODE</p>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.5rem", fontWeight: 700, color: "#555", letterSpacing: "0.2em", background: "#f0f0ee", display: "inline-block", padding: "4px 18px", borderRadius: "8px" }}>
              {booking.unique_code}
            </div>
          </div>

          {/* Details 2x2 grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px dashed #ddd" }}>
            {cells.map(([label, val, big], i) => (
              <div key={label} style={{
                padding: "0.85rem 1.25rem",
                borderRight: i % 2 === 0 ? "1px solid #eee" : "none",
                borderBottom: i < 2 ? "1px solid #eee" : "none",
              }}>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", color: "#999", fontFamily: "JetBrains Mono, monospace", margin: 0 }}>{label}</p>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: big ? "1.6rem" : "0.92rem", fontWeight: 700, color: big ? "#f5a623" : "#111", margin: "4px 0 0" }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Passenger */}
          <div style={{ padding: "0.9rem 1.5rem", textAlign: "center", borderBottom: "1px solid #eee" }}>
            <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "#111" }}>{user.name}</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem", color: "#777", marginTop: "3px" }}>{user.index}</div>
          </div>

          {/* Footer */}
          <div style={{ background: "#f5f5f3", padding: "0.75rem 1.5rem", textAlign: "center", fontSize: "0.7rem", color: "#999", lineHeight: 1.6 }}>
            Show this ticket to your driver when boarding · shuttle@ucc.edu.gh
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <button
            onClick={() => window.print()}
            style={{ flex: 1, padding: "0.85rem", background: "#f5a623", color: "#000", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem" }}
          >
            Save / Print
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "0.85rem", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border2)", borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "0.95rem" }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Print: show only the ticket card */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-ticket, #printable-ticket * { visibility: visible; }
          #printable-ticket {
            position: fixed !important;
            top: 0; left: 0; right: 0;
            margin: 2rem auto !important;
            max-width: 400px !important;
            border-radius: 12px !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
function MyTicketsPage({ user, onBack }) {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [viewing, setViewing]     = useState(null);

  useEffect(() => { loadBookings(); }, []);

  async function loadBookings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id, ticket_number, unique_code, seat_number, status, booked_at,
        time_slots (
          departure_time, travel_date,
          buses ( bus_code, plate_number )
        )
      `)
      .eq("student_id", user.id)
      .order("booked_at", { ascending: false });
    setLoading(false);
    if (!error) setBookings(data || []);
  }

  function formatTime(t) {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr < 12 ? "AM" : "PM"}`;
  }

  function formatDate(d) {
    if (!d) return "";
    return new Date(d + "T00:00:00").toLocaleDateString("en-GH", {
      weekday: "short", month: "short", day: "numeric",
    });
  }

  const statusColors = {
    confirmed: "#22c55e", boarded: "#3b82f6",
    cancelled: "#ef4444", no_show: "#f59e0b",
  };

  return (
    <div id="page-mytickets" style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {viewing && <TicketDetail booking={viewing} user={user} onClose={() => setViewing(null)} />}

      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>My Tickets</h2>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem 2rem 4rem" }}>

        {loading && (
          <div style={{ color: "var(--text2)", textAlign: "center", padding: "3rem", fontFamily: "JetBrains Mono, monospace" }}>
            Loading tickets...
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text2)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎟</div>
            <p>No tickets yet.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "var(--text3)" }}>
              Book a shuttle to see your tickets here.
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((b) => (
            <div key={b.id} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", overflow: "hidden",
            }}>
              {/* Card header */}
              <div style={{
                background: "var(--bg2)", padding: "0.85rem 1.25rem",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: "1px dashed var(--border2)",
              }}>
                <div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "2px" }}>
                    {b.ticket_number}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "2px" }}>Ticket Number</div>
                </div>
                <div style={{
                  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px",
                  color: statusColors[b.status] || "var(--text2)",
                  background: `${statusColors[b.status]}22`,
                  padding: "0.25rem 0.6rem", borderRadius: "999px", textTransform: "uppercase",
                }}>
                  {b.status}
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                {[
                  ["Date",  formatDate(b.time_slots?.travel_date)],
                  ["Time",  formatTime(b.time_slots?.departure_time)],
                  ["Seat",  String(b.seat_number || 0).padStart(2, "0"), true],
                  ["Bus",   b.time_slots?.buses?.bus_code || "—"],
                  ["Plate", b.time_slots?.buses?.plate_number || "—"],
                  ["Code",  b.unique_code || "—", false, true],
                ].map(([label, val, accent, mono]) => (
                  <div key={label}>
                    <div style={{ fontSize: "0.65rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>{label}</div>
                    <div style={{
                      fontSize: "0.88rem",
                      fontWeight: accent ? 700 : 500,
                      color: accent ? "var(--accent)" : "var(--text)",
                      fontFamily: mono ? "JetBrains Mono, monospace" : "inherit",
                    }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* View button */}
              <div style={{ padding: "0 1.25rem 1rem", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setViewing(b)}
                  style={{
                    background: "rgba(245,166,35,0.1)",
                    border: "1px solid rgba(245,166,35,0.3)",
                    borderRadius: "8px", color: "var(--accent)",
                    padding: "0.45rem 1.1rem", fontSize: "0.82rem",
                    fontFamily: "DM Sans, sans-serif", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  View Ticket →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyTicketsPage;
