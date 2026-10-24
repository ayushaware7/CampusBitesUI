import React from 'react';
import SpecialsGrid from '../menu/SpecialsGrid';

const TodaySpecial = () => (
  <div className="py-12 pt-24 bg-white min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="m-7 text-3xl font-extrabold text-gray-900 sm:text-4xl">Today's Special</h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">Campus favorites you don't want to miss</p>
      </div>
      <div className="mt-10">
        <SpecialsGrid />
      </div>
    </div>
  </div>
);

export default TodaySpecial;
