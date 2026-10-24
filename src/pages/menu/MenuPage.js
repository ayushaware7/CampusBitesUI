// components/MenuPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ItemsService from '../../services/ItemsService';
import { useCart } from '../../contexts/CartContext'; // Import useCart hook
import { Menu, X } from 'lucide-react';
import { useMemo } from 'react';

const MenuPage = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the cart context instead of local state
  const { cartItems, addToCart, totalItems, totalPrice, clearCart } = useCart();
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  
  // Define the categories
  const categories = useMemo(() => ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'], []);

 useEffect(() => {
  const itemsService = new ItemsService();
  loadMenuItems(itemsService);

  const params = new URLSearchParams(location.search);
  const categoryParam = params.get('category');

  if (categoryParam && categories.includes(categoryParam)) {
    setSelectedCategory(categoryParam);
  }

  if (location.state?.clearCart) {
    clearCart();
    window.history.replaceState({}, document.title);
  }
}, [location.search, location.state, clearCart, categories]);


  const loadMenuItems = (itemsService) => {
    itemsService.getItems()
      .then(response => {
        console.log('API Response:', response.data);
        setMenuItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu items. Please try again later.');
        setLoading(false);
      });
  };

  const toggleCategoryMenu = () => {
    setCategoryMenuOpen(!categoryMenuOpen);
  };

  const selectCategory = (category) => {
  setSelectedCategory(category);

  // Update the URL with the selected category
  navigate(`?category=${category}`);

  // Close the menu on mobile
  if (window.innerWidth < 768) {
    setCategoryMenuOpen(false);
  }
};

  // Function to filter menu items by category
  const filteredMenuItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
    }
    
    if (halfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }
    
    return stars;
  };

  // Function to handle add to cart, now using addToCart from context
  const handleAddToCart = (item) => {
    addToCart(item);
    // Show a brief notification (optional)
    alert(`${item.name} added to cart!`);
  };
  
  // Function to handle checkout button click
  const handleCheckout = () => {
    // Navigate to checkout page with cart data from context
    navigate('/checkout', {
      state: {
        cartItems: cartItems,
        cartTotal: totalPrice
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-20 left-0 right-0 mx-10 bg-red-50 p-4 rounded-lg shadow-md z-50">
      <div className="text-red-600 mb-3">{error}</div>
      <button 
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => loadMenuItems(new ItemsService())}
      >
        Retry
      </button>
    </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      {/* Mobile Category Toggle Button */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-md z-20 p-2">
        <button 
          onClick={toggleCategoryMenu}
          className="flex items-center justify-between w-full p-2 bg-orange-500 text-white rounded-lg"
        >
          <span className="font-medium">Categories: {selectedCategory}</span>
          {categoryMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex">
        {/* Categories Side Column - Desktop */}
        <div className="hidden md:block w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto z-10">
          <div className="p-4 bg-orange-500 text-white">
            <h2 className="text-xl font-bold">Categories</h2>
          </div>
          <ul className="py-2">
            {categories.map((category, index) => (
              <li key={category}>
                <button
                  onClick={() => selectCategory(category)}
                  className={`w-full text-left py-3 px-6 border-b border-gray-100 transition-colors duration-200 flex items-center ${
                    selectedCategory === category
                      ? 'bg-orange-50 text-orange-600 font-medium border-l-4 border-l-orange-500'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {index > 0 && (
                    <span className="mr-3 w-6 h-6 flex items-center justify-center bg-orange-500 text-white rounded-full text-sm">
                      {index}
                    </span>
                  )}
                  <span className="font-medium">{category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Mobile Categories - Collapsible */}
        {categoryMenuOpen && (
          <div className="md:hidden fixed top-28 left-0 right-0 bg-white shadow-lg z-20 max-h-64 overflow-y-auto">
            <ul>
              {categories.map((category, index) => (
                <li key={category}>
                  <button
                    onClick={() => selectCategory(category)}
                    className={`w-full text-left py-3 px-6 border-b border-gray-100 transition-colors duration-200 flex items-center ${
                      selectedCategory === category
                        ? 'bg-orange-50 text-orange-600 font-medium border-l-4 border-l-orange-500'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {index > 0 && (
                      <span className="mr-3 w-6 h-6 flex items-center justify-center bg-orange-500 text-white rounded-full text-sm">
                        {index}
                      </span>
                    )}
                    <span className="font-medium">{category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Main Content Area - Responsive positioning */}
        <div className="md:ml-64 flex-1 p-6 pt-24 md:pt-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h1>
          
          {/* Menu Items Grid */}
          <div className="max-w-6xl mx-auto">
            {filteredMenuItems.length === 0 ? (
              <div className="text-center text-gray-500 py-16">No menu items available for this category</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map((item, index) => (
                  <div key={item.id || index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48 w-full overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-sm">
                        <span className="text-green-600 font-semibold">₹{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.name}</h3>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex text-lg mr-1">
                          {renderStars(item.rating)}
                        </div>
                        <span className="text-gray-600 text-sm">({item.rating})</span>
                      </div>
                      
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Cart Summary - Only show if cart has items */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 right-0 mb-6 mr-6">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">Cart</span>
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                {totalItems} items
              </span>
            </div>
            <div className="text-gray-800 font-medium">
              Total: ₹{totalPrice.toFixed(2)}
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mt-2 transition-colors duration-200"
            >
              Checkout
            </button>
          </div>
        </div>  
      )}
    </div>
  );
};

export default MenuPage;