// The canteen comes from the QR code (/c/:slug) and is remembered in localStorage.
export const DEFAULT_CANTEEN = 'main-canteen';

export const setCanteenSlug = (slug) => localStorage.setItem('canteenSlug', slug);

export const getCanteenSlug = () => localStorage.getItem('canteenSlug') || DEFAULT_CANTEEN;
