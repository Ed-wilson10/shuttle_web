import { useState, useEffect } from "react";

const departures = [
  {
    route: "Sci. Stn → NLT",
    time: "07:30",
    seats: "18 left",
    status: "OPEN",
    statusClass: "status-available",
  },
  {
    route: "New Site → NLT",
    time: "07:45",
    seats: "4 left",
    status: "LIMITED",
    statusClass: "status-limited",
  },
  {
    route: "Old Site → SWLT",
    time: "08:00",
    seats: "0 left",
    status: "FULL",
    statusClass: "status-full",
  },
  {
    route: "Sci. Stn → SWLT",
    time: "08:15",
    seats: "32 left",
    status: "OPEN",
    statusClass: "status-available",
  },
  {
    route: "New Site → Sci.",
    time: "08:30",
    seats: "12 left",
    status: "OPEN",
    statusClass: "status-available",
  },
];

function DepartureBoard() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-GH", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section">
      <div className="section-title">Live Shuttle Board</div>
      <div className="status-board">
        <div className="status-header">
          <span className="status-title">▶ Departures</span>
          <span className="status-time">{time}</span>
        </div>
        <div className="status-row header">
          <span>Route</span>
          <span>Departs</span>
          <span>Seats</span>
          <span>Status</span>
        </div>
        {departures.map((d, i) => (
          <div className="status-row" key={i}>
            <span>{d.route}</span>
            <span>{d.time}</span>
            <span>{d.seats}</span>
            <span className={d.statusClass}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartureBoard;
