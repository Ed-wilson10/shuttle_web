function RouteCard({ from, to, toFull, price, onSelect }) {
  return (
    <div className="route-card" onClick={() => onSelect({ from, to, price })}>
      <div className="route-badge">Available</div>
      <div className="route-from-to">
        {from} <span className="route-arrow">→</span> {to}
      </div>
      <div className="route-meta">{toFull} · {price}</div>
    </div>
  )
}

export default RouteCard