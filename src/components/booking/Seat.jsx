function Seat({ number, status, onSelect }) {
  return (
    <div
      className={`seat ${status}`}
      onClick={() => status === "available" && onSelect(number)}
    >
      {number}
    </div>
  )
}

export default Seat