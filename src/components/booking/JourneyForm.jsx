const STATIONS = ["Science Station", "New Site Station", "Old Site Station"];

const DESTINATIONS = [
  { value: "NLT", label: "NLT — New Lecture Theatre" },
  { value: "SWLT", label: "SWLT — South West Lecture Theatre" },
  { value: "Science Station", label: "Science Station" },
];

const TIME_SLOTS = [
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
];

function JourneyForm({ form, onChange }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-panel" style={{ marginBottom: "1rem" }}>
      <h3>Journey Details</h3>

      <div className="field-group">
        <div className="form-label">From</div>
        <select
          className="input-sm"
          value={form.from}
          onChange={(e) => onChange({ from: e.target.value })}
        >
          {STATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <div className="form-label">To</div>
        <select
          className="input-sm"
          value={form.to}
          onChange={(e) => onChange({ to: e.target.value })}
        >
          {DESTINATIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <div className="form-label">Date</div>
        <input
          type="date"
          className="input-sm"
          value={form.date}
          min={today}
          onChange={(e) => onChange({ date: e.target.value })}
        />
      </div>

      <div className="field-group">
        <div className="form-label">Time Slot</div>
        <select
          className="input-sm"
          value={form.time}
          onChange={(e) => onChange({ time: e.target.value })}
        >
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default JourneyForm;
