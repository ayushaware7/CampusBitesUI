// The canteen comes from the QR code (/c/:slug) and is remembered in localStorage.
// With no slug stored, the backend falls back to its DEFAULT_CANTEEN.
export const setCanteenSlug = (slug) => localStorage.setItem('canteenSlug', slug);

export const canteenHeaders = () => {
  const slug = localStorage.getItem('canteenSlug');
  return slug ? { 'X-Canteen': slug } : {};
};
