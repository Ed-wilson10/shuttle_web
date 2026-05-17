import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import OTPPage from "../../pages/OTPPage";

function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("signin");
  const [verifyPhone, setVerifyPhone] = useState(null);

  if (verifyPhone) {
    return (
      <OTPPage
        phoneNumber={verifyPhone}
        onSuccess={() => {
          // Complete registration after OTP verified
          const pending = JSON.parse(sessionStorage.getItem("pending_reg") || "{}");
          if (pending.index) {
            import("../../lib/supabase").then(({ supabase }) => {
              supabase.from("students").insert({
                index_number: pending.index,
                full_name: pending.name,
                phone_number: pending.phone,
                programme: pending.programme,
                password_hash: pending.passwordHash,
                is_verified: true,
              }).select().single().then(({ data }) => {
                sessionStorage.removeItem("pending_reg");
                if (data) onLogin({ id: data.id, name: data.full_name, index: data.index_number, programme: data.programme, phone: data.phone_number });
              });
            });
          }
        }}
      />
    );
  }

  return (
    <div id="page-auth">
      <div className="auth-box">
        <div className="auth-brand">
          <div className="logo">Shuttle<span>Pass</span></div>
          <p>UCC Internal Campus Shuttle</p>
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "signin" ? "active" : ""}`} onClick={() => setTab("signin")}>Sign In</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Create Account</button>
        </div>
        {tab === "signin" ? <SignInForm onLogin={onLogin} /> : <SignUpForm onLogin={onLogin} onVerify={setVerifyPhone} />}
      </div>
    </div>
  );
}

export default AuthPage;