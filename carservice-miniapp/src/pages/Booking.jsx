import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBusinessById, createBooking } from '../api';
import useAppStore from '../store/useAppStore';

const Booking = () => {
  const { id }    = useParams();
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const { token } = useAppStore();

  const serviceId          = params.get('serviceId');
  const [date, setDate]    = useState('');
  const [time, setTime]    = useState('');
  const [notes, setNotes]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]  = useState('');

  const { data: business } = useQuery({
    queryKey: ['business', id],
    queryFn:  () => getBusinessById(id),
  });

  const service = business?.services?.find((s) => s.id === parseInt(serviceId));

  const handleBooking = async () => {
    if (!token) { navigate('/login'); return; }
    if (!date || !time) { setError('Sana va vaqtni tanlang'); return; }

    setLoading(true);
    setError('');
    try {
      await createBooking({
        businessId:  parseInt(id),
        serviceId:   parseInt(serviceId),
        scheduledAt: `${date}T${time}:00`,
        notes,
      });
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <h1 className="text-xl font-bold">Buyurtma berish</h1>
      </div>

      {service && (
        <div className="bg-blue-50 border border-brand rounded-xl p-4 mb-5">
          <p className="font-semibold text-brand">{service.name}</p>
          <p className="text-gray-500 text-sm">{business?.name}</p>
          <p className="text-brand font-bold mt-1">{service.price.toLocaleString()} so'm</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Sana</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand bg-white" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Vaqt</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand bg-white" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Izoh (ixtiyoriy)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Qo'shimcha ma'lumot..." rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand resize-none text-sm bg-white" />
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button onClick={handleBooking} disabled={loading}
        className="w-full bg-brand text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50">
        {loading ? 'Yuklanmoqda...' : 'Buyurtma berish ✅'}
      </button>
    </div>
  );
};

export default Booking;