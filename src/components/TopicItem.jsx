import React from 'react';

function TopicItem({ topic, chapter, isCompleted, onToggle }) {
  return (
    <label className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
      <input
        type="checkbox"
        checked={isCompleted || false}
        onChange={() => onToggle(chapter, topic)}
        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
      />
      <span className={`ml-3 text-sm transition-all ${
        isCompleted 
          ? 'text-gray-400 dark:text-gray-500 line-through' 
          : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
      }`}>
        {topic}
      </span>
      {isCompleted && (
        <span className="ml-auto text-green-500">✓</span>
      )}
    </label>
  );
}

export default TopicItem;
