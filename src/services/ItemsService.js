import axios from "axios";
import { canteenHeaders } from "./canteen";

const API = "http://localhost:8080/api/v1";

class ItemsService {
    getItems() {
        return axios.get(`${API}/items`, { headers: canteenHeaders() });
    }

    getItemsByCategory(category) {
        return axios.get(`${API}/category/${encodeURIComponent(category)}`, { headers: canteenHeaders() });
    }

    // Adding items is admin-only; the canteen comes from the admin's token.
    createItem(item) {
        const token = localStorage.getItem('adminToken');
        return axios.post(`${API}/items`, item, { headers: { Authorization: `Bearer ${token}` } });
    }
}

export default ItemsService;
