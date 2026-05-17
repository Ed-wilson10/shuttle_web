function TripDetails({ user, bookingData }) {
  return (
    <div className="bp-details">
      <div className="bp-detail">
        <label>Passenger</label>
        <span>{user.name}</span>
      </div>
      <div className="bp-detail">
        <label>Seat</label>
        <span>Seat {bookingData.seat}</span>
      </div>
      <div className="bp-detail">
        <label>Departs</label>
        <span>{bookingData.time}</span>
      </div>
      <div className="bp-detail">
        <label>Index No.</label>
        <span>{user.index}</span>
      </div>
      <div className="bp-detail">
        <label>Date</label>
        <span>{bookingData.date}</span>
      </div>
      <div className="bp-detail">
        <label>Amount</label>
        <span style={{ color: "var(--green)" }}>{bookingData.price}</span>
      </div>
    </div>
  );
}

export default TripDetails;
