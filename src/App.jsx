import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import BidderInterface from './components/BidderInterface';
import SpectatorInterface from './components/SpectatorInterface';
import SpectatorCounter from './components/SpectatorCounter';

const socket = io();

function App() {
  const [user, setUser] = useState(null);
  const [spectatorCount, setSpectatorCount] = useState(0);

  useEffect(() => {
    // Listen for spectator count updates
    socket.on('spectator_count', (count) => {
      setSpectatorCount(count);
    });

    return () => {
      socket.off('spectator_count');
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    socket.disconnect();
    socket.connect();
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <SpectatorCounter count={spectatorCount} />
      
      {user.user_type === 'admin' && (
        <AdminDashboard user={user} socket={socket} onLogout={handleLogout} />
      )}
      
      {user.user_type === 'bidder' && (
        <BidderInterface user={user} socket={socket} onLogout={handleLogout} />
      )}
      
      {user.user_type === 'spectator' && (
        <SpectatorInterface user={user} socket={socket} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;