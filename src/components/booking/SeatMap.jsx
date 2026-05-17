import Seat from "./Seat";

const TAKEN_SEATS = [2, 5, 9, 14, 18, 22, 27, 31, 35, 38, 42, 46];

function SeatMap({ selectedSeat, onSelect }) {
  const getSeatStatus = (num) => {
    if (TAKEN_SEATS.includes(num)) return "taken";
    if (selectedSeat === num) return "selected";
    return "available";
  };

  const renderSeats = () => {
    const rows = [];
    for (let i = 1; i <= 50; i++) {
      const col = (i - 1) % 4;

      if (col === 0) {
        rows.push(
          <Seat
            key={i}
            number={i}
            status={getSeatStatus(i)}
            onSelect={onSelect}
          />,
        );
      } else if (col === 1) {
        rows.push(
          <Seat
            key={i}
            number={i}
            status={getSeatStatus(i)}
            onSelect={onSelect}
          />,
        );
        rows.push(<div key={`aisle-${i}`} className="seat aisle" />);
      } else {
        rows.push(
          <Seat
            key={i}
            number={i}
            status={getSeatStatus(i)}
            onSelect={onSelect}
          />,
        );
      }
    }
    return rows;
  };

  return (
    <div className="booking-panel">
      <h3>
        Choose a Seat{" "}
        <span
          style={{ fontSize: ".78rem", color: "var(--text2)", fontWeight: 400 }}
        >
          (50 seats)
        </span>
      </h3>

      <div className="seat-legend">
        <div className="seat-legend-item">
          <div
            className="legend-dot"
            style={{
              background: "rgba(34,197,94,.2)",
              border: "1px solid rgba(34,197,94,.5)",
            }}
          />
          Available
        </div>
        <div className="seat-legend-item">
          <div
            className="legend-dot"
            style={{
              background: "rgba(239,68,68,.15)",
              border: "1px solid rgba(239,68,68,.3)",
            }}
          />
          Taken
        </div>
        <div className="seat-legend-item">
          <div
            className="legend-dot"
            style={{
              background: "rgba(245,166,35,.2)",
              border: "1px solid var(--accent)",
            }}
          />
          Selected
        </div>
      </div>

      <div className="shuttle-visual">
        <div className="shuttle-front">◄ FRONT — DRIVER CABIN ►</div>
        <div className="driver-area">🚌 Driver</div>
        <div className="seats-grid">{renderSeats()}</div>
      </div>

      <div
        style={{
          fontSize: ".82rem",
          color: "var(--text2)",
          textAlign: "center",
          padding: ".5rem 0",
        }}
      >
        {selectedSeat
          ? `Seat ${selectedSeat} selected ✓`
          : "Tap a seat to select it"}
      </div>
    </div>
  );
}

export default SeatMap;
