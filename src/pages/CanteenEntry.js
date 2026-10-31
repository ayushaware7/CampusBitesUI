import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setCanteenSlug } from '../services/canteen';

// Landing route for a restaurant's QR code (/r/:slug, or the older /c/:slug): remember the canteen, then open its menu.
const CanteenEntry = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setCanteenSlug(slug);
    navigate('/menu', { replace: true });
  }, [slug, navigate]);

  return null;
};

export default CanteenEntry;
