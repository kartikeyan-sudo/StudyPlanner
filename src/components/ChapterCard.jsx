import React from 'react';
import TopicItem from './TopicItem';

function ChapterCard({ chapter, topics, completedTopics, onTopicToggle }) {
  const completedInChapter = topics.filter(topic => 
    completedTopics[`${chapter}::${topic}`]
  ).length;

  const chapterPercentage = topics.length > 0 
    ? Math.round((completedInChapter / topics.length) * 100) 
    : 0;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white flex-1 pr-2">
          {chapter}
        </h3>
        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
          {completedInChapter}/{topics.length}
        </span>
      </div>

      {/* Chapter Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${chapterPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <TopicItem
            key={index}
            topic={topic}
            chapter={chapter}
            isCompleted={completedTopics[`${chapter}::${topic}`]}
            onToggle={onTopicToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default ChapterCard;
