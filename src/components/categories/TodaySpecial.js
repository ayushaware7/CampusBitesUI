import React from 'react';
import { useCart } from '../../contexts/CartContext'; // Import useCart hook

const TodaySpecial = () => {
  const popularItems = [
    { id: 'special-1', name: 'Pav Bhaji', price: 120.00, rating: 4.8, image: 'images/PavBhaji.jpeg', category: 'Lunch' },
    { id: 'special-2', name: 'Chole Bhature', price: 100.99, rating: 4.5, image: 'images/chole-Bhature.jpg', category: 'Lunch' },
    { id: 'special-3', name: 'Rajma Rice', price: 120.49, rating: 4.7, image: 'images/rajma-chawal.jpg', category: 'Lunch' },
    { id: 'special-4', name: 'Fruit Smoothie', price: 200.99, rating: 4.6, image: 'images/fruitsmoothie.jpg', category: 'Beverages' },
  ];

  // Use the cart context instead of local state
  const { addToCart } = useCart();

  // Function to handle add to cart, now using addToCart from context
  const handleAddToCart = (item) => {
    addToCart(item);
    // Show a brief notification (optional)
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="m-7 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Today's Special
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Campus favorites you don't want to miss
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularItems.map((item, index) => (
            <div key={item.id || index} className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                <p className="mt-1 text-sm font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaySpecial;