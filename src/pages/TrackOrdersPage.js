import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { canteenHeaders } from '../services/canteen';

const MY_ORDERS_URL = "http://localhost:8080/api/admin/my-orders"; // Using the new endpoint

const TrackOrdersPage = () => { // 
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // [cite: 157]
  const [selectedOrder, setSelectedOrder] = useState(null); // [cite: 157]
  
  // Get the customer's phone number from local storage
  const customerPhone = useMemo(() => localStorage.getItem('customerPhone'), []);

  // [Order statuses map remains the same: 158]
  const orderStatuses = {
    // New status for live orders
    LIVE: { label: 'Order Placed', color: 'bg-yellow-500', icon: '📝' },
    // Past order statuses
    COMPLETED: { label: 'Completed', color: 'bg-green-500', icon: '✔️' },
    REJECTED: { label: 'Cancelled', color: 'bg-red-500', icon: '❌' }
  };
  
  // [useEffect remains: 159]
  useEffect(() => {
    loadOrders();
  }, [customerPhone]); // Re-run if customerPhone changes (though it shouldn't)

  const loadOrders = async () => {
    if (!customerPhone) {
        console.warn("No customer phone found in local storage.");
        setLoading(false);
        return;
    }
    
    setLoading(true); // 
    try {
        const response = await fetch(`${MY_ORDERS_URL}?phone=${encodeURIComponent(customerPhone)}`, { headers: canteenHeaders() });
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const data = await response.json(); // This will be { liveOrders: [], pastOrders: [] }

        // --- NEW: Process and combine orders ---
        
        // Process live orders
        const liveOrders = data.liveOrders.map(order => ({
            ...order,
            id: `L-${order.id}`, // Add prefix to avoid ID conflicts
            status: 'LIVE',
            items: JSON.parse(order.itemsJson || "[]"),
            totalAmount: order.totalAmount
        }));
        
        // Process past orders
        const pastOrders = data.pastOrders.map(order => ({
            ...order,
            id: `P-${order.id}`, // Add prefix
            status: order.status, // "COMPLETED" or "REJECTED"
            items: JSON.parse(order.itemsJson || "[]"),
            totalAmount: order.totalAmount
        }));

        // Combine and sort by date (newest first)
        const allOrders = [...liveOrders, ...pastOrders].sort((a, b) => 
            new Date(b.orderDate) - new Date(a.orderDate)
        );
        
        setOrders(allOrders);
        // --- END NEW ---

    } catch (error) {
        console.error("Error loading orders:", error);
    } finally {
        setLoading(false);
    }
  }; // [End of loadOrders: 168]

  // [getStatusProgress, formatDate, handleViewDetails, 
  //  handleCloseModal, handleBackToMenu remain the same: 169-175]

  const getStatusProgress = (status) => {
    if (status === 'LIVE') return 33;
    if (status === 'COMPLETED') return 100;
    if (status === 'REJECTED') return 0;
    return 0; // Default
  };

  const formatDate = (dateString) => { // [cite: 171]
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { // [cite: 172]
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (order) => { // [cite: 173]
    setSelectedOrder(order);
  };
  
  const handleCloseModal = () => { // [cite: 174]
    setSelectedOrder(null);
  };
  
  const handleBackToMenu = () => { // [cite: 175]
    navigate('/menu');
  };

  // [Filter functions are simplified as we only have 3 statuses]
  const filterOrders = (filterStatus) => {
    // We reload from scratch as filtering logic is simple
    loadOrders().then(() => {
        if (filterStatus === 'all') {
            return; // loadOrders already set all
        }
        setOrders(prevOrders => prevOrders.filter(order => {
            if (filterStatus === 'active') {
                return order.status === 'LIVE';
            }
            return order.status === filterStatus;
        }));
    });
  }; // [End of filterOrders: 179]

  // --- JSX (HTML) Section ---
  // Most of this is the same, just updated to use the new data structure
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header [cite: 180] */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Track Your Orders</h1>
          <button
            onClick={handleBackToMenu}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Back to Menu
          </button>
        </div>

        {/* Filter Buttons [cite: 181-183] */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => filterOrders('all')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
          >
            All Orders
          </button>
          <button
            onClick={() => filterOrders('active')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Active Orders
          </button>
          <button
             onClick={() => filterOrders('COMPLETED')}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Completed
          </button>
        </div>

        {/* Loading State [cite: 184] */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? ( // [cite: 185]
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">{customerPhone ? "No orders found for this account." : "No customer phone found. Please place an order first."}</p>
            <button
              onClick={handleBackToMenu}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg"
            >
             Start Ordering
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              
                {/* Order Header [cite: 187] */}
                <div className={`text-white p-4 ${orderStatuses[order.status].color}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Order #{order.id}</span>
                    <span className={`bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium`}>
                       {orderStatuses[order.status].icon} {orderStatuses[order.status].label}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">{formatDate(order.orderDate)}</p>
                </div>

                {/* Order Body [cite: 189] */}
                <div className="p-4">
                  {/* Items Summary [cite: 190] */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Items ({order.items.length})</h3>
                     <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-gray-600">
                          <span>{item.quantity}x {item.name}</span>
                           <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                         <p className="text-sm text-orange-500">+{order.items.length - 2} more items</p>
                      )}
                    </div>
                  </div>

                  {/* Total Amount [cite: 193] */}
                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Total</span>
                      <span className="font-bold text-lg text-green-600">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Progress Bar [cite: 195] */}
                  {order.status !== 'REJECTED' && (
                   <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${order.status === 'LIVE' ? 'bg-yellow-500' : 'bg-green-500'}`}
                           style={{ width: `${getStatusProgress(order.status)}%` }}
                        ></div>
                      </div>
                    </div>
                   )}

                  {/* View Details Button [cite: 197] */}
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition-colors"
                   >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal [cite: 199] */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header [cite: 200] */}
              <div className={`p-6 text-white ${orderStatuses[selectedOrder.status].color}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
                    <p className="text-sm opacity-90">{formatDate(selectedOrder.orderDate)}</p>
                   </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                   ×
                  </button>
                </div>
              </div>

              {/* Modal Body [cite: 203-212] */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Order Status</h3>
                  <div className={`${orderStatuses[selectedOrder.status].color} text-white px-4 py-2 rounded-lg inline-block`}>
                    {orderStatuses[selectedOrder.status].icon} {orderStatuses[selectedOrder.status].label}
                   </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                     <p className="text-gray-600"><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p className="text-gray-600"><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                  </div>
                </div>

                 <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                         </div>
                        <p className="font-semibold text-green-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                 </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="text-sm text-gray-500">{selectedOrder.razorpayPaymentId}</span>
                   </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-bold text-lg text-gray-800">Total</span>
                    <span className="font-bold text-xl text-green-600">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                   </div>
                </div>
              </div>

              {/* Modal Footer [cite: 213] */}
              <div className="bg-gray-50 p-4 flex justify-end">
                <button
                   onClick={handleCloseModal}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg"
                >
                  Close
                </button>
              </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrdersPage;