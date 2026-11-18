import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getBusinessesNearby } from '../api';
import BusinessCard from '../components/BusinessCard';
import useLocation from '../hooks/useLocation';

const Nearby = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const categoryId = params.get('categoryId');
  const name       = params.get('name');

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['businesses', location?.lat, location?.lng, categoryId],
    queryFn:  () => getBusinessesNearby(location.lat, location.lng, categoryId),
    enabled:  !!location,
  });

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <div>
          <h1 className="text-xl font-bold">{name || 'Yaqin xizmatlar'}</h1>
          <p className="text-gray-400 text-xs">{businesses.length} ta topildi</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center mt-20">
          <div className="text-4xl animate-spin">🔍</div>
        </div>
      )}

      {!isLoading && businesses.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          <div className="text-5xl mb-3">😕</div>
          <p>Bu kategoriyada yaqin xizmat topilmadi</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {businesses.map((b) => (
          <BusinessCard
            key={b.id}
            business={b}
            onClick={() => navigate(`/business/${b.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Nearby;