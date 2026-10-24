import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../services/api';

const POLL_MS = 5000;

// Live orders, refreshed every few seconds. Owned by the dashboard so the tab badge stays
// current even while another tab is open.
export default function useLiveOrders() {
  const [state, setState] = useState({ orders: [], loading: true, error: '' });

  const reload = useCallback(async () => {
    try {
      const orders = await adminApi.orders('live');
      setState({ orders, loading: false, error: '' });
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    reload();
    const timer = setInterval(reload, POLL_MS);
    return () => clearInterval(timer);
  }, [reload]);

  return { ...state, reload };
}
