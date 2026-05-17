import { useState } from "react";
import { supabase } from "../../lib/supabase";
import bcrypt from "bcryptjs";
import { EyeOpen, EyeOff } from "../EyeIcon";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function EyeButton({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "absolute", right: "0.75rem", top: "50%",
        transform: "translateY(-50%)",
        background: "none", border: "none",
        cursor: "pointer", color: "var(--text2)",
        display: "flex", alignItems: "center", padding: 0,
      }}
      tabIndex={-1}
    >
      {show ? <EyeOff /> : <EyeOpen />}
    </button>
  );
}

function SignUpForm({ onLogin, onVerify}) {
  const [form, setForm] = useState({ name: "", index: "", programme: "", phone: "", password: "", confirmPassword: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => { setForm((p) => ({ ...p, [field]: e.target.value })); setError(""); };
  const toggleShow = (field) => () => setShow((p) => ({ ...p, [field]: !p[field] }));

  const handleSubmit = async () => {
    setError("");
    const { name, index, programme, phone, password, confirmPassword } = form;

    if (!name || !index || !programme || !phone || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (!/^0[2-9]\d{8}$/.test(phone)) return setError("Enter a valid Ghana phone number (e.g. 0241234567).");

    setLoading(true);
    try {
      // Check duplicate
      const { data: existing } = await supabase
        .from("students").select("id").eq("index_number", index.toUpperCase().trim()).single();
      if (existing) { setError("This index number is already registered."); setLoading(false); return; }

      // Generate OTP and show in browser prompt
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await supabase.from("otps").insert({ phone_number: phone, otp_code: otp, expires_at: expiresAt, used: false });

     // Show alert with OTP, then redirect to verify page
window.alert(`Your ShuttlePass verification code is: ${otp}\n\nYou will now be taken to the verification page.`);

// Store pending registration in sessionStorage
sessionStorage.setItem("pending_reg", JSON.stringify({
  name: name.trim(),
  index: index.toUpperCase().trim(),
  programme,
  phone: phone.trim(),
  passwordHash: await bcrypt.hash(password, 10),
  otp,
  expiresAt: expiresAt,
}));

// Signal parent to show OTP page
onVerify(phone.trim());
return; // stop here — rest of logic moves to OTPPage
      // Hash and insert
      const passwordHash = await bcrypt.hash(password, 10);
      const { data: student, error: insertError } = await supabase
        .from("students")
        .insert({
          index_number: index.toUpperCase().trim(),
          full_name: name.trim(),
          phone_number: phone.trim(),
          programme,
          password_hash: passwordHash,
          is_verified: true,
        })
        .select().single();

      if (insertError) { setError("Registration failed. Try again."); setLoading(false); return; }

      await supabase.from("otps").update({ used: true }).eq("phone_number", phone).eq("otp_code", otp);

      onLogin({ id: student.id, name: student.full_name, index: student.index_number, programme: student.programme, phone: student.phone_number });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      {error && <div className="error-msg">{error}</div>}

      <div className="form-group">
        <label>Full Name</label>
        <input type="text" placeholder="e.g. Kwame Asante" value={form.name} onChange={set("name")} />
      </div>

      <div className="form-group">
        <label>Index Number</label>
        <input type="text" placeholder="e.g. UCC/CS/22/0101" value={form.index} onChange={set("index")} />
      </div>    

      <div className="form-group">
        <label>Programme</label>
        <select value={form.programme} onChange={set("programme")}>
          <option value="">Select programme</option>
          <option>BSc Computer Science</option>
          <option>BSc Information Technology</option>
          <option>BA Economics</option>
          <option>BSc Mathematics</option>
          <option>BSc Physics</option>
          <option>BSc Actuarial Science</option>
          <option>BA English</option>
          <option>BSc Statistics</option>
        </select>
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input type="tel" placeholder="0241234567" value={form.phone} onChange={set("phone")} inputMode="numeric" />
      </div>

      <div className="form-group">
        <label>Password</label>
        <div style={{ position: "relative" }}>
          <input type={show.password ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={set("password")} style={{ paddingRight: "2.8rem" }} />
          <EyeButton show={show.password} onToggle={toggleShow("password")} />
        </div>
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <div style={{ position: "relative" }}>
          <input type={show.confirm ? "text" : "password"} placeholder="Repeat your password" value={form.confirmPassword} onChange={set("confirmPassword")} style={{ paddingRight: "2.8rem" }} />
          <EyeButton show={show.confirm} onToggle={toggleShow("confirm")} />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
        {loading ? "Creating account..." : "Create Account →"}
      </button>
    </div>
  );
}

export default SignUpForm;
