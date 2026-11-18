const CategoryCard = ({ category, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-brand transition-all active:scale-95"
  >
    <span className="text-4xl mb-2">{category.icon}</span>
    <span className="text-xs font-medium text-center text-gray-700 leading-tight">
      {category.nameUz || category.name}
    </span>
  </button>
);

export default CategoryCard;