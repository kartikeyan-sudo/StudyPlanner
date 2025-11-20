import React, { useEffect, useState } from 'react';

function WelcomeScreen({ user }) {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    setTimeout(() => setShow(true), 50);
    
    // Trigger fade-out animation before disappearing
    setTimeout(() => setFadeOut(true), 1500);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Black background with neon accents */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10 animate-gradient-shift bg-200"></div>
      </div>
      
      {/* Neon grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Animated neon particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              background: i % 2 === 0 ? '#3b82f6' : '#a855f7',
              boxShadow: i % 2 === 0 ? '0 0 10px #3b82f6, 0 0 20px #3b82f6' : '0 0 10px #a855f7, 0 0 20px #a855f7'
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className={`relative z-10 text-center transition-all duration-1000 transform ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Neon glow circles */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Greeting text with neon effect */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in-up" style={{
            color: '#fff',
            textShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6, 0 0 30px #3b82f6'
          }}>
            <span className="inline-block">Hello,</span>
          </h1>
          <h2 className="text-6xl md:text-9xl font-black animate-fade-in-up" style={{ 
            animationDelay: '0.2s',
            background: 'linear-gradient(90deg, #3b82f6, #a855f7, #3b82f6)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
            filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))'
          }}>
            {user?.name || 'User'}
          </h2>
        </div>

        {/* Neon line separator */}
        <div className="flex justify-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="h-0.5 w-64 bg-gradient-to-r from-transparent via-blue-500 to-transparent" style={{
            boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f6'
          }}></div>
        </div>

        {/* Welcome message */}
        <p className="text-xl md:text-2xl font-light mb-8 animate-fade-in-up" style={{ 
          animationDelay: '0.4s',
          color: '#93c5fd',
          textShadow: '0 0 10px rgba(147, 197, 253, 0.5)'
        }}>
          Welcome to your Study Planner ✨
        </p>

        {/* Neon loading dots */}
        <div className="flex justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ 
            animationDelay: '0s',
            boxShadow: '0 0 15px #3b82f6, 0 0 30px #3b82f6'
          }}></div>
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ 
            animationDelay: '0.15s',
            boxShadow: '0 0 15px #a855f7, 0 0 30px #a855f7'
          }}></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ 
            animationDelay: '0.3s',
            boxShadow: '0 0 15px #3b82f6, 0 0 30px #3b82f6'
          }}></div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
