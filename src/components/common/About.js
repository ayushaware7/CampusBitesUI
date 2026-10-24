import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Smart Canteen</h1>
          <p className="text-xl max-w-2xl">The intelligent food ordering solution designed to make your campus dining experience seamless and efficient.</p>
        </div>
      </div>

      {/* Our Solution Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="/api/placeholder/600/400" 
              alt="Smart canteen ordering system" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Solution</h2>
            <p className="text-gray-600 mb-4">
              Smart Canteen is a cutting-edge food ordering platform developed specifically for busy educational and corporate campuses. Our system eliminates long queues and waiting times, allowing users to order and pay for meals with just a few taps.
            </p>
            <p className="text-gray-600 mb-4">
              Launched in 2023, Smart Canteen was created to solve the common frustrations experienced in institutional dining settings. Our platform connects diners directly with canteen operations, creating a seamless experience from menu browsing to food pickup.
            </p>
            <p className="text-gray-600">
              Using advanced technologies and intuitive design, we've transformed the traditional canteen experience into a modern, efficient service that saves time and reduces food waste.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="text-orange-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Time-Saving</h3>
              <p className="text-gray-600">
                Pre-order meals for pickup at your convenience, skipping the long queues and making your lunch break truly restful.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="text-orange-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Cashless Payments</h3>
              <p className="text-gray-600">
                Multiple secure payment options including credit cards, mobile wallets, and campus account integration.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="text-orange-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Menu Management</h3>
              <p className="text-gray-600">
                Browse daily menus, see nutritional information, and filter options based on dietary preferences and restrictions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <span className="text-orange-600 font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Browse & Select</h3>
            <p className="text-gray-600">
              Browse today's menu, see what's available, and add items to your cart.
            </p>
          </div>
          
          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          
          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <span className="text-orange-600 font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Order & Pay</h3>
            <p className="text-gray-600">
              Place your order and pay securely through our integrated payment system.
            </p>
          </div>
          
          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          
          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <span className="text-orange-600 font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Pickup Ready Alert</h3>
            <p className="text-gray-600">
              Receive a notification when your order is ready for pickup at your selected location.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Benefits For Everyone</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Students/Staff */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                For Students & Staff
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Minimize wait times during busy lunch hours
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Make informed dietary choices with nutritional information
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Easy tracking of spending and order history
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Receive special promotions and loyalty rewards
                </li>
              </ul>
            </div>
            
            {/* For Canteen Management */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                For Canteen Management
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Improved kitchen workflow and resource allocation
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reduced food waste through better demand forecasting
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valuable analytics on popular items and peak times
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Streamlined digital payment processing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Get In Touch</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Have questions about implementing Smart Canteen in your institution? 
          Want to learn more about our features? Our team is here to help.
        </p>
        
        <div className="flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;