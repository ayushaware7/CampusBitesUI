import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useBrand } from '../../contexts/BrandContext';
import { Menu, X, ShoppingCart, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const { totalItems } = useCart();
  const brand = useBrand();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [activePage, setActivePage] = useState('/');
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  // Set active page based on current URL path when component mounts or location changes
  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  // Check for active orders
  useEffect(() => {
    const checkActiveOrders = () => {
      try {
        const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
        const active = orders.filter(order => 
          ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
        ).length;
        setActiveOrdersCount(active);
      } catch (error) {
        console.error('Error checking active orders:', error);
      }
    };

    checkActiveOrders();
    
    // Check every 30 seconds for updates
    const interval = setInterval(checkActiveOrders, 30000);
    
    return () => clearInterval(interval);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return activePage === path;
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/menu" className="flex items-center">
                {brand.logoUrl || !brand.loaded ? (
                  <img className="h-40" src={brand.logoUrl || '/images/logo1.jpeg'} alt={brand.name} />
                ) : (
                  <span className="text-xl font-bold text-brand-600">{brand.name}</span>
                )}
                {brand.tagline && <span className="hidden lg:block ml-3 text-sm text-gray-500">{brand.tagline}</span>}
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/menu"
                className={`${isActive('/menu') ? 'text-brand-600 border-brand-500' : 'border-transparent text-gray-600 hover:border-brand-300 hover:text-brand-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Menu
              </Link>
              <Link 
                to="/specials" 
                className={`${isActive('/specials') ? 'text-brand-600 border-brand-500' : 'border-transparent text-gray-600 hover:border-brand-300 hover:text-brand-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Today's Specials
              </Link>
              <Link 
                to="/track-orders" 
                className={`${isActive('/track-orders') ? 'text-brand-600 border-brand-500' : 'border-transparent text-gray-600 hover:border-brand-300 hover:text-brand-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium relative`}
              >
                Track Orders
                {activeOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {activeOrdersCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link to="/cart" className="flex items-center text-gray-600 hover:text-brand-500 relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
                <span className={`${isActive('/specials') ? 'ml-2 text-brand-600 border-brand-500' : 'border-transparent text-gray-600 hover:border-brand-300 hover:text-brand-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>Your Cart</span>
              </Link>
              {/* <Link 
                to="/cart" 
                className={`${isActive('/specials') ? 'text-brand-600 border-brand-500' : 'border-transparent text-gray-600 hover:border-brand-300 hover:text-brand-600'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Your Cart
              </Link> */}
              
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-brand-500 hover:text-brand-600 hover:bg-brand-50"
                aria-expanded={isOpen}
              >
                <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/menu" 
              className={`${isActive('/menu') ? 'bg-brand-50 border-brand-500 text-brand-600' : 'border-transparent text-gray-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link 
              to="/specials" 
              className={`${isActive('/specials') ? 'bg-brand-50 border-brand-500 text-brand-600' : 'border-transparent text-gray-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              Today's Specials
            </Link>
            <Link 
              to="/track-orders" 
              className={`${isActive('/track-orders') ? 'bg-brand-50 border-brand-500 text-brand-600' : 'border-transparent text-gray-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium relative`}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                Track Orders
                {activeOrdersCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {activeOrdersCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <Link to="/cart" className="flex items-center text-gray-600 hover:text-brand-500 relative" onClick={() => setIsOpen(false)}>
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="ml-1 bg-brand-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;