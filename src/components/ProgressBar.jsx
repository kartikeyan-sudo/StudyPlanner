import React from 'react';

function ProgressBar({ percentage }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <div className="h-full w-full bg-white/20 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
