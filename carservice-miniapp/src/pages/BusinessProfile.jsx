import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getBusinessById } from '../api';

const BusinessProfile = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { data: business, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn:  () => getBusinessById(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-4xl animate-spin">🚗</div>
      </div>
    );
  }

  if (!business) {
    return <div className="p-4 text-center text-gray-400">Topilmadi</div>;
  }

  return (
    <div className="pb-24">
      <div className="bg-brand text-white p-6 pt-10">
        <button onClick={() => navigate(-1)} className="text-white text-xl mb-4 block">←</button>
        <h1 className="text-2xl font-bold">{business.name}</h1>
        <p className="text-blue-100 text-sm mt-1">📍 {business.address}</p>
        <div className="flex gap-3 mt-3 flex-wrap">
          {business.rating > 0 && (
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              ⭐ {business.rating}
            </span>
          )}
          {business.phone && (
            <a href={`tel:${business.phone}`}
              className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              📞 Qo'ng'iroq
            </a>
          )}
        </div>
      </div>

      <div className="p-4">
        {business.description && (
          <div className="mb-5">
            <h2 className="font-semibold mb-2">Haqida</h2>
            <p className="text-gray-500 text-sm">{business.description}</p>
          </div>
        )}

        <div>
          <h2 className="font-semibold mb-3">Xizmatlar va narxlar</h2>
          {business.services?.length === 0 && (
            <p className="text-gray-400 text-sm">Xizmatlar hali qo'shilmagan</p>
          )}
          <div className="flex flex-col gap-2">
            {business.services?.map((s) => (
              <div key={s.id}
                className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  {s.description && <p className="text-gray-400 text-xs">{s.description}</p>}
                  {s.duration && <p className="text-gray-400 text-xs">⏱ {s.duration} daqiqa</p>}
                </div>
                <div className="text-right">
                  <p className="text-brand font-semibold text-sm">
                    {s.price.toLocaleString()} so'm
                  </p>
                  <button
                    onClick={() => navigate(`/booking/${business.id}?serviceId=${s.id}`)}
                    className="text-xs bg-brand text-white px-3 py-1 rounded-full mt-1"
                  >
                    Buyurtma
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;