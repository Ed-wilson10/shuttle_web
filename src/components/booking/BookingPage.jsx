import { useState, useEffect } from "react";
import JourneyForm from "./JourneyForm";
import BookingSummary from "./BookingSummary";
import { supabase } from "../../lib/supabase";

function BookingPage({ user, onProceed, onBack }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    from: "Science Station", to: "NLT",
    date: today, time: "", busCode: "", plateNumber: "", slotId: "",
  });
  const [slots, setSlots]           = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => { if (form.date) fetchSlots(form.date); }, [form.date]);

  async function fetchSlots(date) {
    setLoadingSlots(true);
    const { data, error } = await supabase
      .from("time_slots")
      .select("id, departure_time, travel_date, buses(bus_code, plate_number, total_seats)")
      .eq("travel_date", date)
      .eq("is_open", true)
      .order("departure_time", { ascending: true });
    setLoadingSlots(false);

    if (!error && data && data.length > 0) {
      setSlots(data);
      const first = data[0];
      setForm((p) => ({ ...p, time: formatTime(first.departure_time), busCode: first.buses.bus_code, plateNumber: first.buses.plate_number, slotId: first.id }));
    } else {
      setSlots([]);
      setForm((p) => ({ ...p, time: "", busCode: "", plateNumber: "", slotId: "" }));
    }
  }

  function formatTime(t) {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr < 12 ? "AM" : "PM"}`;
  }

  const handleFormChange = (fields) => setForm((p) => ({ ...p, ...fields }));

  const handleSlotSelect = (slot) => {
    setForm((p) => ({ ...p, time: formatTime(slot.departure_time), busCode: slot.buses.bus_code, plateNumber: slot.buses.plate_number, slotId: slot.id }));
  };

  const handleProceed = () => {
    if (!form.slotId) { alert("No shuttle available for this date. Please pick another date."); return; }
    const price = form.from === "Science Station" ? "GH₵ 2.00" : "GH₵ 1.50";
    onProceed({ ...form, seat: "Auto", price });
  };

  return (
    <div id="page-booking">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Reserve Your Seat</h2>
      </div>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "0 2rem 2rem" }}>
        <JourneyForm form={form} onChange={handleFormChange} />

        {/* Departure time selector */}
        <div className="booking-panel" style={{ marginTop: "1rem", padding: "1.25rem" }}>
          <h3 style={{ fontSize: "0.8rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
            Select Departure Time
          </h3>

          {loadingSlots && (
            <p style={{ color: "var(--text2)", fontSize: "0.85rem", textAlign: "center" }}>Loading times...</p>
          )}
          {!loadingSlots && slots.length === 0 && (
            <p style={{ color: "var(--red)", fontSize: "0.85rem", textAlign: "center" }}>No shuttles available for this date.</p>
          )}

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                style={{
                  padding: "0.65rem 1.2rem",
                  borderRadius: "8px",
                  border: `1.5px solid ${form.slotId === slot.id ? "var(--accent)" : "var(--border2)"}`,
                  background: form.slotId === slot.id ? "rgba(245,166,35,0.1)" : "var(--bg3)",
                  color: form.slotId === slot.id ? "var(--accent)" : "var(--text2)",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {formatTime(slot.departure_time)}
                <div style={{ fontSize: "0.65rem", marginTop: "2px", color: "var(--text3)" }}>
                  {slot.buses.bus_code}
                </div>
              </button>
            ))}
          </div>

          {form.busCode && (
            <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "var(--text3)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "var(--green)", fontWeight: 600 }}>✓</span>
              {form.busCode} · {form.plateNumber} · Seat assigned on boarding
            </div>
          )}
        </div>

        <BookingSummary user={user} form={form} onProceed={handleProceed} />
      </div>
    </div>
  );
}

export default BookingPage;
