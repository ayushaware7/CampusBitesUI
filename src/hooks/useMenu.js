import { useCallback, useEffect, useState } from 'react';
import { publicApi } from '../services/api';

// Loads the current canteen's menu: { categories, loading, error, reload }.
export default function useMenu() {
  const [state, setState] = useState({ categories: [], loading: true, error: null });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    publicApi
      .menu()
      .then((data) => setState({ categories: data.categories, loading: false, error: null }))
      .catch((err) => setState({ categories: [], loading: false, error: err.message }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
