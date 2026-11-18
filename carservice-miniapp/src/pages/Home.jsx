import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../api';
import CategoryCard from '../components/CategoryCard';
import useTelegram from '../hooks/useTelegram';
import useAppStore from '../store/useAppStore';

const Home = () => {
  const navigate              = useNavigate();
  const { user: tgUser }      = useTelegram();
  const { user: storeUser }   = useAppStore();

  const displayName = tgUser?.first_name || storeUser?.firstName || 'Foydalanuvchi';

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn:  getCategories,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-4xl animate-spin">🚗</div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-400 text-sm">Xush kelibsiz,</p>
        <h1 className="text-2xl font-bold">{displayName} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Toshkentdagi avtomobil xizmatlari</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Xizmat qidirish..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-brand"
        />
      </div>

      {/* Categories */}
      <h2 className="text-lg font-semibold mb-3">Kategoriyalar</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onClick={() => navigate(`/nearby?categoryId=${cat.id}&name=${cat.name}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;