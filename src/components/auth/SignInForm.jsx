import { useState } from "react";
import { supabase } from "../../lib/supabase";
import bcrypt from "bcryptjs";
import { EyeOpen, EyeOff } from "../EyeIcon";

function SignInForm({ onLogin }) {
  const [index, setIndex]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!index || !password) { setError("Please fill in all fields."); return; }

    setLoading(true);
    try {
      const { data: student, error: fetchError } = await supabase
        .from("students")
        .select("*")
        .eq("index_number", index.toUpperCase().trim())
        .single();

      if (fetchError || !student) { setError("Index number not found."); setLoading(false); return; }

      const match = await bcrypt.compare(password, student.password_hash);
      if (!match) { setError("Incorrect password."); setLoading(false); return; }

      onLogin({
        id: student.id,
        name: student.full_name,
        index: student.index_number,
        programme: student.programme || "",
        phone: student.phone_number,
      });
    } catch (err) {
      setError("Login failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      {error && <div className="error-msg">{error}</div>}

      <div className="form-group">
        <label>Index Number</label>
        <input
          type="text"
          placeholder="e.g. UCC/CS/21/0042"
          value={index}
          onChange={(e) => { setIndex(e.target.value); setError(""); }}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            style={{ paddingRight: "2.8rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            style={{
              position: "absolute", right: "0.75rem", top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none",
              cursor: "pointer", color: "var(--text2)",
              display: "flex", alignItems: "center", padding: 0,
            }}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff /> : <EyeOpen />}
          </button>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
        {loading ? "Signing in..." : "Sign In →"}
      </button>
    </div>
  );
}

export default SignInForm;
