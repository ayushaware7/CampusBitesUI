import React from 'react';
import { formatPaise } from '../../utils/money';

const ItemCard = ({ item, onAdd }) => {
  const prices = item.variants.length > 0 ? item.variants.map((v) => v.pricePaise) : [item.pricePaise];
  const customisable = item.variants.length > 0 || item.addonGroups.length > 0;

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg ${item.isAvailable ? '' : 'opacity-60'}`}>
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
        {item.isSpecial && (
          <span className="absolute top-2 left-2 bg-brand-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Today's special
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            title={item.isVeg ? 'Veg' : 'Non-veg'}
            className={`flex-shrink-0 h-4 w-4 border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}
          >
            <span className={`h-2 w-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </span>
          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
        </div>
        {item.description && <p className="text-sm text-gray-500 mb-2">{item.description}</p>}
        <p className="text-green-600 font-semibold mb-3">
          {prices.length > 1 ? 'From ' : ''}
          {formatPaise(Math.min(...prices))}
        </p>
        <button
          disabled={!item.isAvailable}
          onClick={() => onAdd(item)}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {!item.isAvailable ? 'Sold out' : customisable ? 'Customise' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
