
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handler to help catch initialization issues
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error Caught: ", message, error);
  const root = document.getElementById('root');
  if (root && root.innerHTML === "") {
    root.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444; font-family: sans-serif;">
      <h2 style="font-weight: bold;">Failed to Load App</h2>
      <p style="font-size: 14px; margin-top: 8px;">${message}</p>
      <button onclick="window.location.reload()" style="margin-top: 15px; background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Retry</button>
    </div>`;
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
