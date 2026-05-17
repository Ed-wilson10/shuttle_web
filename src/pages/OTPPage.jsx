import { useState, useEffect, useRef } from 'react';
import '../index.css';

export default function OTPPage({ phoneNumber, onSuccess }) {
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs                 = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const maskedPhone = phoneNumber
    ? phoneNumber.slice(0, 3) + '*****' + phoneNumber.slice(-3)
    : '***';

  function handleOtpChange(index, value) {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join('');
    if (code.length < 6) return setError('Enter all 6 digits.');
    setLoading(true);
    setError('');

    const { supabase } = await import('../lib/supabase');
    const { data: otpRecord } = await supabase
      .from('otps')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    setLoading(false);

    if (!otpRecord) return setError('No active OTP found.');
    if (new Date() > new Date(otpRecord.expires_at)) return setError('OTP expired. Resend it.');
    if (otpRecord.otp_code !== code.trim()) return setError('Incorrect code.');

    await supabase.from('otps').update({ used: true }).eq('id', otpRecord.id);
    onSuccess();
  }

  async function handleResend() {
    if (countdown > 0) return;
    setResending(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { supabase } = await import('../lib/supabase');
    await supabase.from('otps').insert({ phone_number: phoneNumber, otp_code: newOtp, expires_at: expiresAt, used: false });
    window.alert(`New code: ${newOtp}`);
    setResending(false);
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  }

  return (
    <div className="auth-screen">
      <div className="auth-card otp-card">
        <div className="auth-logo">📱</div>
        <h1 className="auth-title">Verify Your Phone</h1>
        <p className="auth-subtitle">
          We sent a 6-digit code to <strong>{maskedPhone}</strong>
        </p>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`otp-box ${digit ? 'filled' : ''}`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button
          className="auth-btn"
          onClick={handleVerify}
          disabled={loading || otp.join('').length < 6}
        >
          {loading ? 'Verifying...' : 'Confirm Code →'}
        </button>

        <div className="resend-row">
          {countdown > 0 ? (
            <span className="resend-timer">Resend in {countdown}s</span>
          ) : (
            <button
              className="resend-btn"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? 'Sending...' : "Didn't receive it? Resend"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}