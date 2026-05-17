import RouteCard from "./RouteCard";
import routes from "../../data/routes";

function RoutesGrid({ onSelect }) {
  return (
    <div className="section">
      <div className="section-title">Available Routes</div>
      <div className="routes-grid">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            from={route.from}
            to={route.to}
            toFull={route.toFull}
            price={route.price}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default RoutesGrid;
