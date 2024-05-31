// service-worker.js
self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
  });
  
  function connectWebSocket(userId) {
    const socket = new WebSocket('ws://localhost:8080'); // Adjust the URL as needed
  
    socket.addEventListener('open', () => {
      console.log('WebSocket connection opened');
      socket.send(JSON.stringify({ user_id: userId }));
    });
  
    socket.addEventListener('message', event => {
      const data = JSON.parse(event.data);
  
      if (data.type === 'topup_success' && data.user_id === userId) {
        self.registration.showNotification('Top-up Successful', {
          body: `You have topped up ${data.credit} credits`,
        });
      }
  
      if (data.type === 'topup_failed' && data.user_id === userId) {
        self.registration.showNotification('Top-up Failed', {
          body: `Your attempt to top up ${data.credit} credits has failed`,
        });
      }
    });
  
    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });
  
    socket.addEventListener('error', error => {
      console.error('WebSocket error:', error);
    });
  
    return socket;
  }
  
  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'INIT_WEBSOCKET') {
      const userId = event.data.userId;
      connectWebSocket(userId);
    }
  });
  