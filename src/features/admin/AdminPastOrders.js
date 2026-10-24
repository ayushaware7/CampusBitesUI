import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PAST_ORDERS_URL = "http://localhost:8080/api/admin/past-orders";

// A helper component for displaying a single past order
const PastOrderCard = ({ order }) => {
    
    const items = JSON.parse(order.itemsJson || "[]");
    const isCompleted = order.status === 'COMPLETED';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`bg-white shadow-md rounded-lg overflow-hidden border-l-4 ${isCompleted ? 'border-green-500' : 'border-red-500'}`}>
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Order #{order.originalOrderId}</h3>
                        <p className="text-sm text-gray-500">Ordered: {formatDate(order.orderDate)}</p>
                        <p className="text-sm text-gray-500">Handled: {formatDate(order.completedDate)}</p>
                    </div>
                    <span className={`text-lg font-bold ${isCompleted ? 'text-green-600' : 'text-red-600'}`}>
                        {order.status}
                    </span>
                </div>

                <div className="mb-3">
                    <p className="text-sm text-gray-600"><strong>Customer:</strong> {order.customerName}</p>
                    <p className="text-sm text-gray-600"><strong>Phone:</strong> {order.customerPhone}</p>
                </div>
                
                <details className="text-sm">
                    <summary className="font-medium text-gray-700 cursor-pointer">View Items ({items.length})</summary>
                    <div className="space-y-1 mt-2 p-2 bg-gray-50 rounded">
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                                <span className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold pt-1 border-t">
                            <span className="text-gray-800">Total</span>
                            <span className="text-gray-800">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
};


const AdminPastOrders = () => {
    const [pastOrders, setPastOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch only once on component mount
        const fetchPastOrders = async () => {
            const token = localStorage.getItem('adminToken'); // <-- GET TOKEN
            try {
                const response = await fetch(PAST_ORDERS_URL, {
                headers: {
                    'Authorization': `Bearer ${token}` // <-- ADD TOKEN
                }
            });
                if (!response.ok) {
                    throw new Error('Failed to fetch past orders.');
                }
                const data = await response.json();
                setPastOrders(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPastOrders();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                
                {/* Loading / Error / No Orders States */}
                {isLoading && <p className="text-center text-gray-600">Loading orders...</p>}
                {error && <p className="text-center text-red-600">Error: {error}</p>}
                {!isLoading && !error && pastOrders.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-2xl font-semibold text-gray-500">No past orders found.</p>
                    </div>
                )}

                {/* Orders List */}
                {!isLoading && pastOrders.length > 0 && (
                    <div className="space-y-4">
                        {pastOrders.map(order => (
                            <PastOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPastOrders;