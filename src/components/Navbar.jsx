import { useState, useRef, useEffect } from "react";

function Navbar({ user, onLogout, onMyTickets }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav id="main-nav">
      <div className="nav-logo">
        Shuttle<span>Pass</span>
      </div>

      {/* My Tickets button in nav */}
      <button
        onClick={onMyTickets}
        style={{
          background: "rgba(245,166,35,0.1)",
          border: "1px solid rgba(245,166,35,0.3)",
          borderRadius: "8px",
          color: "var(--accent)",
          padding: "0.45rem 1rem",
          fontSize: "0.85rem",
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          marginLeft: "auto",
          marginRight: "1rem",
        }}
        onMouseEnter={(e) => (e.target.style.background = "rgba(245,166,35,0.18)")}
        onMouseLeave={(e) => (e.target.style.background = "rgba(245,166,35,0.1)")}
      >
        🎟 My Tickets
      </button>

      <div className="nav-user" ref={ref} style={{ position: "relative" }}>
        <div
          style={{ textAlign: "right", cursor: "pointer" }}
          onClick={() => setOpen((o) => !o)}
        >
          <div style={{ fontWeight: 500, fontSize: ".88rem" }}>{user.name}</div>
          <div style={{ fontSize: ".75rem", color: "var(--text3)" }}>
            {user.index}
          </div>
        </div>
        <div
          className="nav-avatar"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen((o) => !o)}
        >
          {initials}
        </div>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + .75rem)",
              right: 0,
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              borderRadius: "var(--radius)",
              padding: ".5rem",
              minWidth: "180px",
              zIndex: 200,
            }}
          >
            <div
              style={{
                padding: ".6rem .85rem",
                fontSize: ".82rem",
                color: "var(--text2)",
                borderBottom: "1px solid var(--border)",
                marginBottom: ".25rem",
              }}
            >
              Signed in as
              <br />
              <span style={{ color: "var(--text)", fontWeight: 500 }}>
                {user.name}
              </span>
            </div>
            <button
              onClick={onLogout}
              style={{
                width: "100%",
                padding: ".6rem .85rem",
                background: "transparent",
                border: "none",
                color: "var(--red)",
                fontSize: ".88rem",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: "6px",
                fontFamily: "DM Sans, sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(239,68,68,.08)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
