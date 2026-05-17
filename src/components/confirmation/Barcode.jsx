function Barcode() {
  const bars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    width: Math.random() < 0.4 ? 1 : Math.random() < 0.5 ? 2 : 3,
    marginRight: Math.random() < 0.5 ? 1 : 0,
    opacity: 0.4 + Math.random() * 0.6,
  }));

  return (
    <div className="bp-barcode">
      <div className="barcode-visual">
        {bars.map((bar) => (
          <div
            key={bar.id}
            style={{
              width: bar.width + "px",
              marginRight: bar.marginRight + "px",
              opacity: bar.opacity,
              height: "100%",
              borderRadius: "1px",
              background: "var(--text2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Barcode;
