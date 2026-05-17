function Hero({ onBook, onSchedule }) {
  return (
    <div className="hero">
      <div className="hero-tag">
        <span className="dot"></span> Shuttle service active
      </div>

      <h1>
        Book Your
        <br />
        <span>Campus</span> Ride.
      </h1>

      <p>
        Reserve a seat on the UCC internal shuttle — connecting Science Station,
        New Site, Old Site, NLT and SWLT in minutes.
      </p>

      <div className="hero-cta">
        <button className="btn btn-primary" onClick={onBook}>
          Book a Ticket →
        </button>
        <button className="btn btn-outline" onClick={onSchedule}>
          View Schedules
        </button>
      </div>
    </div>
  );
}

export default Hero;
