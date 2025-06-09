
const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-3 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-3 border-t-blue-600 border-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
