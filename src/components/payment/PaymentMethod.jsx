function PaymentMethod({ id, icon, name, sub, isActive, onSelect }) {
  return (
    <div
      className={`pay-method ${isActive ? "active" : ""}`}
      onClick={() => onSelect(id)}
    >
      <div className="method-icon">{icon}</div>
      <div className="method-name">{name}</div>
      <div className="method-sub">{sub}</div>
    </div>
  );
}

export default PaymentMethod;
