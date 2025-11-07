import React from 'react';

const LicitacionSkeleton = () => {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-700 rounded px-3 py-1 w-24"></div>
          <div className="h-6 bg-gray-700 rounded px-3 py-1 w-16"></div>
          <div className="h-6 bg-gray-700 rounded px-3 py-1 w-20"></div>
        </div>
      </div>
      
      {/* Description skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-700 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
      
      {/* Info grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#2a2a2a] p-3 rounded-xl">
            <div className="h-4 bg-gray-700 rounded mb-2 w-16"></div>
            <div className="h-5 bg-gray-600 rounded w-full"></div>
          </div>
        ))}
      </div>
      
      {/* Button skeleton */}
      <div className="pt-4 border-t border-gray-700 flex justify-center">
        <div className="h-10 bg-gray-700 rounded-xl w-48"></div>
      </div>
    </div>
  );
};

export default LicitacionSkeleton;