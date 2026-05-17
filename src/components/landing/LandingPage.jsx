import Hero from "./Hero";
import RoutesGrid from "./RoutesGrid";
import DepartureBoard from "./DepartureBoard";

function LandingPage({ onBook, onSelectRoute, onSchedule }) {
  return (
    <div id="page-landing">
      <Hero onBook={onBook} onSchedule={onSchedule} />
      <RoutesGrid onSelect={onSelectRoute} />
      <DepartureBoard />
    </div>
  );
}

export default LandingPage;
