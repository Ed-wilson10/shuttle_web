function CodesSection({ bookingId, busCode, plateNumber }) {
  return (
    <div className="bp-codes">
      <div className="bp-code-box">
        <label>Booking ID</label>
        <div className="code">{bookingId}</div>
      </div>
      <div className="bp-code-box">
        <label>Bus · Plate</label>
        <div className="code" style={{ fontSize: "1rem", letterSpacing: "1px" }}>
          {busCode || "BUS-A"}
        </div>
        <div style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.78rem",
          color: "var(--text2)",
          marginTop: "0.25rem",
          letterSpacing: "1px"
        }}>
          {plateNumber || "GR-1234-24"}
        </div>
      </div>
    </div>
  );
}

export default CodesSection;
