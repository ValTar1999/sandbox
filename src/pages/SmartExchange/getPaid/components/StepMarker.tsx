const StepMarker = ({ value }: { value: number }) => (
  <span className="flex h-5 w-5 min-w-5 min-h-5 max-w-5 max-h-5 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs leading-4 font-medium text-gray-800">
    {value}
  </span>
);

export default StepMarker;
