// The backend deals in integer paise; rupees exist only for display and form fields.
export const formatPaise = (paise) => `₹${(paise / 100).toFixed(2)}`;

// "49.5" -> 4950. NaN for empty, negative or non-numeric input.
export const toPaise = (rupees) => {
  const n = Number(rupees);
  return String(rupees).trim() === '' || !Number.isFinite(n) || n < 0 ? NaN : Math.round(n * 100);
};

export const toRupees = (paise) => String(paise / 100);
