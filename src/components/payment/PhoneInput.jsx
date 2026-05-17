function PhoneInput({ value, onChange }) {
  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    onChange(cleaned);
  };

  return (
    <div className="pay-num-input">
      <span>+233</span>
      <input
        type="tel"
        placeholder="24 000 0000"
        maxLength={10}
        value={value}
        onChange={handleChange}
        inputMode="numeric"
      />
    </div>
  );
}

export default PhoneInput;
