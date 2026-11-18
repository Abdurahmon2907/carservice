const BusinessCard = ({ business, onClick }) => {
  const minPrice = business.services?.length
    ? Math.min(...business.services.map((s) => s.price))
    : null;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all active:scale-95"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{business.name}</h3>
          <p className="text-gray-400 text-xs mt-1">📍 {business.address}</p>
          <p className="text-gray-400 text-xs">{business.distanceKm} km uzoqlikda</p>
          {minPrice && (
            <p className="text-brand text-sm font-medium mt-2">
              dan {minPrice.toLocaleString()} so'm
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 ml-3">
          {business.rating > 0 && (
            <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">
              ⭐ {business.rating}
            </span>
          )}
          <span className="text-gray-300 text-lg">→</span>
        </div>
      </div>
    </button>
  );
};

export default BusinessCard;