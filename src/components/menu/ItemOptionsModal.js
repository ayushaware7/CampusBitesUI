import React, { useState } from 'react';
import { X } from 'lucide-react';
import { formatPaise } from '../../utils/money';

const rule = (g) =>
  g.minSelect === g.maxSelect
    ? `Choose ${g.maxSelect}`
    : g.minSelect === 0
    ? `Choose up to ${g.maxSelect}`
    : `Choose ${g.minSelect} to ${g.maxSelect}`;

// Picks a variant and add-ons. Mirrors the server's rules for instant feedback; the server re-checks everything.
const ItemOptionsModal = ({ item, onClose, onConfirm }) => {
  const firstFree = item.variants.find((v) => v.isAvailable);
  const [variantId, setVariantId] = useState(firstFree ? firstFree.id : 0);
  const [picked, setPicked] = useState({}); // groupId -> [addonId]

  const variant = item.variants.find((v) => v.id === variantId) || null;
  const chosen = item.addonGroups.flatMap((g) => g.addons.filter((a) => (picked[g.id] || []).includes(a.id)));

  const toggle = (group, addonId) =>
    setPicked((prev) => {
      const cur = prev[group.id] || [];
      if (group.maxSelect === 1) {
        // single choice: radio, but allow un-picking when the group is optional
        const next = cur.includes(addonId) ? (group.minSelect === 0 ? [] : cur) : [addonId];
        return { ...prev, [group.id]: next };
      }
      if (cur.includes(addonId)) return { ...prev, [group.id]: cur.filter((id) => id !== addonId) };
      if (cur.length >= group.maxSelect) return prev;
      return { ...prev, [group.id]: [...cur, addonId] };
    });

  const groupOk = (g) => {
    const n = (picked[g.id] || []).length;
    return n >= g.minSelect && n <= g.maxSelect;
  };
  const valid = (item.variants.length === 0 || variant) && item.addonGroups.every(groupOk);
  const total = (variant ? variant.pricePaise : item.pricePaise) + chosen.reduce((s, a) => s + a.pricePaise, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {item.variants.length > 0 && (
            <fieldset>
              <legend className="font-medium text-gray-800 mb-2">Choose a size <span className="text-sm text-gray-500">(required)</span></legend>
              {item.variants.map((v) => (
                <label key={v.id} className={`flex items-center justify-between py-2 ${v.isAvailable ? '' : 'opacity-50'}`}>
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="variant"
                      disabled={!v.isAvailable}
                      checked={variantId === v.id}
                      onChange={() => setVariantId(v.id)}
                    />
                    {v.name}
                    {!v.isAvailable && <span className="text-xs text-red-500">Sold out</span>}
                  </span>
                  <span className="text-gray-700">{formatPaise(v.pricePaise)}</span>
                </label>
              ))}
            </fieldset>
          )}

          {item.addonGroups.map((g) => (
            <fieldset key={g.id}>
              <legend className="font-medium text-gray-800 mb-2">
                {g.name} <span className="text-sm text-gray-500">({rule(g)})</span>
              </legend>
              {g.addons.map((a) => (
                <label key={a.id} className={`flex items-center justify-between py-2 ${a.isAvailable ? '' : 'opacity-50'}`}>
                  <span className="flex items-center gap-2">
                    <input
                      type={g.maxSelect === 1 ? 'radio' : 'checkbox'}
                      name={`group-${g.id}`}
                      disabled={!a.isAvailable}
                      checked={(picked[g.id] || []).includes(a.id)}
                      // radios use onClick so an optional single choice can be un-picked; checkboxes use onChange
                      onChange={() => g.maxSelect !== 1 && toggle(g, a.id)}
                      onClick={() => g.maxSelect === 1 && toggle(g, a.id)}
                    />
                    {a.name}
                    {!a.isAvailable && <span className="text-xs text-red-500">Sold out</span>}
                  </span>
                  <span className="text-gray-700">{a.pricePaise > 0 ? `+${formatPaise(a.pricePaise)}` : 'Free'}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>

        <div className="p-4 border-t sticky bottom-0 bg-white">
          <button
            disabled={!valid}
            onClick={() => onConfirm(variant, chosen)}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg"
          >
            Add to cart · {formatPaise(total)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemOptionsModal;
