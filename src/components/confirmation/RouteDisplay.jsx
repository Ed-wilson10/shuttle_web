import stationCode from "../../utils/stationCode";

function RouteDisplay({ from, to }) {
  return (
    <div className="bp-route">
      <div className="bp-station">
        <h2>{stationCode(from)}</h2>
        <p>{from}</p>
      </div>

      <div className="bp-arrow">——→</div>

      <div className="bp-station" style={{ textAlign: "right" }}>
        <h2>{stationCode(to)}</h2>
        <p>{to}</p>
      </div>
    </div>
  );
}

export default RouteDisplay;
