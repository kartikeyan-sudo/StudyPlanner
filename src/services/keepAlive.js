// Keep-Alive Service - Pings backend every 2 minutes to prevent Render from sleeping

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
const PING_INTERVAL = 2 * 60 * 1000; // 2 minutes in milliseconds

let intervalId = null;

const pingBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('[Keep-Alive] Backend pinged successfully at', new Date().toLocaleTimeString());
    } else {
      console.warn('[Keep-Alive] Backend ping failed with status:', response.status);
    }
  } catch (error) {
    console.error('[Keep-Alive] Error pinging backend:', error.message);
  }
};

// Start the keep-alive service
export const startKeepAlive = () => {
  // Ping immediately on start
  pingBackend();
  
  // Set up interval to ping every 2 minutes
  if (!intervalId) {
    intervalId = setInterval(pingBackend, PING_INTERVAL);
    console.log('[Keep-Alive] Service started - pinging backend every 2 minutes');
  }
};

// Stop the keep-alive service (optional, for cleanup)
export const stopKeepAlive = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[Keep-Alive] Service stopped');
  }
};

// Auto-start the service when this module is imported
startKeepAlive();
