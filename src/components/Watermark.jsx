import React, { useState } from 'react';

const Watermark = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg cursor-pointer hover:from-purple-500/90 hover:to-pink-500/90 transition-all duration-300">
          <p className="text-white text-xs font-semibold tracking-wide">
            Developed by Mr. Zero
          </p>
        </div>
        
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-black/90 backdrop-blur-sm text-white text-xs p-3 rounded-lg shadow-xl border border-purple-500/50">
            <p className="font-semibold mb-1">To contact Mr. Zero please email here:</p>
            <a 
              href="mailto:kartikeyandubey61@gmail.com" 
              className="text-pink-400 hover:text-pink-300 underline break-all"
            >
              kartikeyandubey61@gmail.com
            </a>
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-black/90 border-r border-b border-purple-500/50"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watermark;
