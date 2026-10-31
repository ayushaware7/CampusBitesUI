import React from 'react';
import useMenu from '../../hooks/useMenu';
import ItemGrid from './ItemGrid';

// Items the canteen flagged as today's special, taken from the live menu.
const SpecialsGrid = ({ limit }) => {
  const { categories, loading, error } = useMenu();
  const specials = categories.flatMap((c) => c.items).filter((i) => i.isSpecial).slice(0, limit);

  if (loading) return <p className="text-center text-gray-500 py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-8">{error}</p>;
  if (specials.length === 0) return <p className="text-center text-gray-500 py-8">No specials today. Check the full menu!</p>;
  return <ItemGrid items={specials} />;
};

export default SpecialsGrid;
