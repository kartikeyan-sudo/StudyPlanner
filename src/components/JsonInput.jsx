import React, { useState } from 'react';

function JsonInput({ jsonInput, error, onJsonChange, onParseJson, hasData }) {
  const [isExpanded, setIsExpanded] = useState(!hasData);

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
            📝 JSON Input
          </h2>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>

        {hasData && !isExpanded && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            ✓ Syllabus loaded. Click to view or edit.
          </p>
        )}

        {isExpanded && (
          <>
            <div className="mb-3 sm:mb-4 mt-3 sm:mt-4">
              <label htmlFor="json-input" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Paste your study plan JSON here:
              </label>
              <textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => onJsonChange(e.target.value)}
                className="w-full h-64 sm:h-96 px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 resize-none"
                placeholder='{\n  "Chapter 1": ["Topic 1", "Topic 2"],\n  "Chapter 2": ["Topic A", "Topic B"]\n}'
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  ⚠️ {error}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onParseJson();
                if (!error) {
                  setTimeout(() => setIsExpanded(false), 500);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              🔄 Generate Study Planner
            </button>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                💡 Supported Formats:
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-400 mb-1">Format 1 (Simple):</p>
                  <pre className="text-xs text-blue-800 dark:text-blue-400 overflow-x-auto">
{`{
  "Unit 1": ["Topic 1", "Topic 2"],
  "Unit 2": ["Topic A", "Topic B"]
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-400 mb-1">Format 2 (Nested):</p>
                  <pre className="text-xs text-blue-800 dark:text-blue-400 overflow-x-auto">
{`{
  "syllabus": {
    "Unit 1": "Title",
    "topics_unit1": ["Topic 1", "Topic 2"]
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JsonInput;
