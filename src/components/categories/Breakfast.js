import React, { useEffect, useState } from "react";
import ItemsService from "../../services/ItemsService";

function Breakfast() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    ItemsService.getItemsByCategory("breakfast").then((res) => {
      setItems(res.data);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Breakfast</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow">
            <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
            <p>₹{item.price}</p>
            <p className="text-yellow-500">⭐ {item.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Breakfast;
