import { useState } from "react";
import PaymentMethod from "./PaymentMethod";
import PhoneInput from "./PhoneInput";
import ProcessingOverlay from "./ProcessingOverlay";

const METHODS = [
  { id: "momo", icon: "📱", name: "MoMo", sub: "MTN Mobile Money" },
  { id: "ecash", icon: "💳", name: "eCash", sub: "Vodafone eCash" },
];

function PaymentPage({ bookingData, onProceed, onBack }) {
  const [payMethod, setPayMethod] = useState("momo");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    if (phone.trim().length < 9) {
      setError(true);
      return;
    }
    setError(false);
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onProceed({ payMethod, phone });
    }, 2200);
  };

  return (
    <div id="page-payment">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Complete Payment</h2>
      </div>

      <div className="payment-wrap">
        <div className="payment-card">
          <div className="pay-steps">
            <div className="pay-step done"></div>
            <div className="pay-step active"></div>
            <div className="pay-step"></div>
          </div>

          <div
            style={{
              fontSize: ".82rem",
              color: "var(--text2)",
              textAlign: "center",
              marginBottom: "1.25rem",
            }}
          >
            Step 2 of 3 — Payment
          </div>

          <div className="amount-display">
            <div className="amt-label">Amount Due</div>
            <div className="amt">{bookingData.price}</div>
            <div
              style={{
                fontSize: ".75rem",
                color: "var(--text2)",
                marginTop: ".25rem",
              }}
            >
              {bookingData.from} → {bookingData.to}
            </div>
          </div>

          <div
            style={{
              fontSize: ".82rem",
              color: "var(--text2)",
              marginBottom: ".5rem",
            }}
          >
            Select payment method
          </div>

          <div className="pay-methods">
            {METHODS.map((m) => (
              <PaymentMethod
                key={m.id}
                {...m}
                isActive={payMethod === m.id}
                onSelect={setPayMethod}
              />
            ))}
          </div>

          {error && (
            <div className="error-msg" style={{ display: "block" }}>
              Please enter a valid phone number.
            </div>
          )}

          <div className="form-label" style={{ marginBottom: ".4rem" }}>
            {payMethod === "momo" ? "MTN MoMo Number" : "Vodafone eCash Number"}
          </div>

          <PhoneInput value={phone} onChange={setPhone} />

          {processing ? (
            <ProcessingOverlay />
          ) : (
            <>
              <div
                style={{
                  background: "var(--bg3)",
                  borderRadius: "var(--radius-sm)",
                  padding: ".75rem",
                  fontSize: ".78rem",
                  color: "var(--text3)",
                  marginBottom: "1.25rem",
                  lineHeight: 1.6,
                }}
              >
                ⚡ You will receive a{" "}
                <strong style={{ color: "var(--text2)" }}>
                  mobile money prompt
                </strong>{" "}
                on your phone. Approve it to confirm your booking.
              </div>
              <button className="btn btn-primary" onClick={handlePay}>
                Pay Now — {bookingData.price}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
