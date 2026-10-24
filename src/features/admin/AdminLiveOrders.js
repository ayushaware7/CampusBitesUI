import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router for navigation

const LIVE_ORDERS_URL = "http://localhost:8080/api/admin/live-orders";
const COMPLETE_ORDER_URL = "http://localhost:8080/api/admin/complete";
const REJECT_ORDER_URL = "http://localhost:8080/api/admin/reject";

// A helper component for displaying a single order
const LiveOrderCard = ({ order, onComplete, onReject }) => {
    
    // Parse the items JSON string
    const items = JSON.parse(order.itemsJson || "[]");

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">Time: {formatDate(order.orderDate)}</p>
                    </div>
                    <span className="text-2xl font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</span>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
                    <p className="text-sm text-gray-600"><strong>Name:</strong> {order.customerName}</p>
                    <p className="text-sm text-gray-600"><strong>Phone:</strong> {order.customerPhone}</p>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {order.customerEmail}</p>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Items ({items.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                <div>
                                    <p className="font-medium text-sm text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-500">Price: ₹{item.price.toFixed(2)}</p>
                                </div>
                                <span className="text-sm font-bold text-gray-800">Qty: {item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={() => onReject(order.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                    >
                        ❌ Reject
                    </button>
                    <button
                        onClick={() => onComplete(order.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-md"
                    >
                        ✅ Complete
                    </button>
                </div>
            </div>
        </div>
    );
};


const AdminLiveOrders = () => {
    const [liveOrders, setLiveOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use useCallback to memoize the fetch function
    const fetchLiveOrders = useCallback(async () => {
        try {
            const token = localStorage.getItem('adminToken'); // <-- GET TOKEN
            const response = await fetch(LIVE_ORDERS_URL, {
            headers: {
                'Authorization': `Bearer ${token}` // <-- ADD TOKEN
            }});
            
            if (!response.ok) {
                throw new Error('Failed to fetch live orders.');
            }
            const data = await response.json();
            setLiveOrders(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array means this function is created once

    // UseEffect for initial load and polling
    useEffect(() => {
        // Fetch immediately on component mount
        fetchLiveOrders();

        // Set up the polling interval (every 3 seconds)
        const pollInterval = setInterval(() => {
            console.log("Polling for new orders...");
            fetchLiveOrders();
        }, 3000);

        // Cleanup function: clear the interval when the component unmounts
        return () => {
            clearInterval(pollInterval);
        };
    }, [fetchLiveOrders]); // Depend on the memoized fetchLiveOrders function

const handleAction = async (id, actionType) => {
    const token = localStorage.getItem('adminToken'); // <-- GET TOKEN
    const url = actionType === 'complete' ? `${COMPLETE_ORDER_URL}/${id}` : `${REJECT_ORDER_URL}/${id}`;
 
        try {
            const response = await fetch(url, { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` // <-- ADD TOKEN
            }
        });

            if (!response.ok) {
                throw new Error(`Failed to ${actionType} order.`);
            }
            console.log(`Order ${id} marked as ${actionType}`);
            // Immediately remove the order from the UI for a snappy feel
            setLiveOrders(prevOrders => prevOrders.filter(order => order.id !== id));
            // The polling will confirm the state soon anyway
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    const handleComplete = (id) => handleAction(id, 'complete');
    const handleReject = (id) => handleAction(id, 'reject');

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
            

                {/* Loading / Error / No Orders States */}
                {isLoading && <p className="text-center text-gray-600">Loading orders...</p>}
                {error && <p className="text-center text-red-600">Error: {error}</p>}
                {!isLoading && !error && liveOrders.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-2xl font-semibold text-gray-500">No live orders right now! 🎉</p>
                    </div>
                )}

                {/* Orders Grid */}
                {!isLoading && liveOrders.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveOrders.map(order => (
                            <LiveOrderCard 
                                key={order.id} 
                                order={order}
                                onComplete={handleComplete}
                                onReject={handleReject}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLiveOrders;