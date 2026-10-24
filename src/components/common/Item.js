import React from 'react'

export const Item = ({item}) => {


    return (
    <><div key={item.id} className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div>
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover"
      />
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">★ {item.rating}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-gray-900">${item.price.toFixed(2)}</p>
      <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300">
        Add to Cart
      </button>
    </div>
  </div></>
  )
}

export default Item