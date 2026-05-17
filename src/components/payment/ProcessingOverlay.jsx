function ProcessingOverlay() {
  return (
    <div className="processing">
      <div className="spinner"></div>
      <div style={{ fontSize: ".9rem", color: "var(--text2)" }}>
        Processing payment…
      </div>
      <div
        style={{
          fontSize: ".78rem",
          color: "var(--text3)",
          marginTop: ".4rem",
        }}
      >
        A prompt has been sent to your phone
      </div>
    </div>
  );
}

export default ProcessingOverlay;
