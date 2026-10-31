import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { publicApi } from '../services/api';
import { getCanteenSlug } from '../services/canteen';

// Defaults shown until a restaurant's own branding loads (or when it has none).
const DEFAULT_BRAND = { name: 'Campus Bites', tagline: '', logoUrl: '', primaryColor: '', loaded: false };

const BrandContext = createContext(DEFAULT_BRAND);
export const useBrand = () => useContext(BrandContext);

const HEX = /^#[0-9a-fA-F]{6}$/;
const WEIGHTS = { 50: 0.92, 100: 0.84, 200: 0.66, 300: 0.4 }; // share of white mixed in
const DARKEN = { 600: 0.14, 700: 0.3 }; // share of black mixed in

// Builds the brand shades from one colour: lighter tints for backgrounds, darker for hover/active.
const shades = (hex) => {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const mix = (target, w) => rgb.map((v) => Math.round(v + (target - v) * w)).join(' ');
  const out = { 500: rgb.join(' ') };
  Object.entries(WEIGHTS).forEach(([n, w]) => { out[n] = mix(255, w); });
  Object.entries(DARKEN).forEach(([n, w]) => { out[n] = mix(0, w); });
  return out;
};

const applyColor = (hex) => {
  const style = document.documentElement.style;
  [50, 100, 200, 300, 500, 600, 700].forEach((n) => style.removeProperty(`--brand-${n}`));
  if (!HEX.test(hex)) return;
  Object.entries(shades(hex)).forEach(([n, v]) => style.setProperty(`--brand-${n}`, v));
};

// Loads the restaurant behind the current QR slug and applies its name, logo and colour.
// Used only around the customer app, so admin screens keep the default look.
export const BrandProvider = ({ children }) => {
  const { pathname } = useLocation();
  const [brand, setBrand] = useState(DEFAULT_BRAND);

  useEffect(() => {
    const slug = getCanteenSlug();
    if (brand.slug === slug) return undefined;
    let stale = false;
    publicApi.canteen().then((c) => {
      if (!stale) setBrand({ ...c, loaded: true });
    }).catch(() => {}); // branding is cosmetic: keep the defaults if it cannot load
    return () => { stale = true; };
  }, [pathname, brand.slug]);

  useEffect(() => {
    applyColor(brand.primaryColor);
    document.title = brand.loaded ? brand.name : DEFAULT_BRAND.name;
  }, [brand]);

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
};
