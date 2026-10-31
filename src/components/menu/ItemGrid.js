import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { buildLine } from '../../utils/cart';
import ItemCard from './ItemCard';
import ItemOptionsModal from './ItemOptionsModal';

// Cards for a list of menu items. Plain items go straight to the cart; items with
// variants or add-ons open the picker first.
const ItemGrid = ({ items }) => {
  const { addToCart } = useCart();
  const [picking, setPicking] = useState(null);

  const handleAdd = (item) => {
    if (item.variants.length > 0 || item.addonGroups.length > 0) setPicking(item);
    else addToCart(buildLine(item, null, []));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onAdd={handleAdd} />
        ))}
      </div>
      {picking && (
        <ItemOptionsModal
          item={picking}
          onClose={() => setPicking(null)}
          onConfirm={(variant, addons) => {
            addToCart(buildLine(picking, variant, addons));
            setPicking(null);
          }}
        />
      )}
    </>
  );
};

export default ItemGrid;
