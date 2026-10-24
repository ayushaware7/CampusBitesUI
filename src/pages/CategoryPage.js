// src/pages/CategoryPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemsService from "../services/ItemsService";

const CategoryPage = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const service = new ItemsService();
    service
      .getItemsByCategory(category)
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, [category]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center capitalize">
        {category}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-2xl p-4 transition-transform hover:scale-105"
            >
              <img
                src={`/${item.image}`}
                alt={item.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">₹{item.price}</p>
              <p className="text-yellow-500">⭐ {item.rating}</p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600">No items found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
