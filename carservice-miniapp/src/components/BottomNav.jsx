import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/',         icon: '🏠', label: 'Bosh' },
  { path: '/nearby',   icon: '📍', label: 'Yaqin' },
  { path: '/bookings', icon: '📋', label: 'Buyurtmalar' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center py-3 transition-all ${
              active ? 'text-brand' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs mt-1 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;