import React, { useState, useEffect } from 'react';
import PlayerForm from './admin/PlayerForm';
import LiveAuction from './admin/LiveAuction';
import NavigationButtons from './admin/NavigationButtons';
import AvailablePlayers from './admin/AvailablePlayers';
import SoldPlayers from './admin/SoldPlayers';
import UnsoldPlayers from './admin/UnsoldPlayers';
import BiddersCapital from './admin/BiddersCapital';

const AdminDashboard = ({ user, socket, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [players, setPlayers] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);
  const [bidders, setBidders] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(25);
  const [timeLeft, setTimeLeft] = useState(50);
  const [isAuctionActive, setIsAuctionActive] = useState(false);

  useEffect(() => {
    // Socket event listeners
    socket.on('auction_started', (player) => {
      setCurrentPlayer(player);
      setCurrentBid(25);
      setTimeLeft(50);
      setIsAuctionActive(true);
    });

    socket.on('new_bid', (data) => {
      setCurrentBid(data.amount);
      setTimeLeft(50); // Reset timer
    });

    socket.on('auction_end', (data) => {
      setIsAuctionActive(false);
      if (data.status === 'sold') {
        setSoldPlayers(prev => [...prev, {
          ...currentPlayer,
          sold_price: data.amount,
          winner: data.winner,
          status: 'sold'
        }]);
      } else {
        setUnsoldPlayers(prev => [...prev, {
          ...currentPlayer,
          status: 'unsold'
        }]);
      }
      
      setTimeout(() => {
        setCurrentPlayer(null);
        setCurrentBid(25);
        setTimeLeft(50);
      }, 3000);
    });

    socket.on('admin_update', (data) => {
      if (data.players) setPlayers(data.players);
      if (data.sold_players) setSoldPlayers(data.sold_players);
      if (data.unsold_players) setUnsoldPlayers(data.unsold_players);
      if (data.bidders) setBidders(data.bidders);
    });

    socket.on('player_added', (player) => {
      setPlayers(prev => [...prev, player]);
    });

    return () => {
      socket.off('auction_started');
      socket.off('new_bid');
      socket.off('auction_end');
      socket.off('admin_update');
      socket.off('player_added');
    };
  }, [socket, currentPlayer]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isAuctionActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            socket.emit('check_timer');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAuctionActive, timeLeft, socket]);

  const handleStartAuction = async () => {
    try {
      await fetch('/start_auction', { method: 'POST' });
    } catch (error) {
      console.error('Error starting auction:', error);
    }
  };

  const handleMarkSold = () => {
    socket.emit('mark_sold');
  };

  const handleMarkUnsold = () => {
    socket.emit('mark_unsold');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'available':
        return <AvailablePlayers players={players} onBack={() => setCurrentView('dashboard')} />;
      case 'sold':
        return <SoldPlayers players={soldPlayers} onBack={() => setCurrentView('dashboard')} />;
      case 'unsold':
        return <UnsoldPlayers players={unsoldPlayers} onBack={() => setCurrentView('dashboard')} />;
      case 'bidders':
        return <BiddersCapital bidders={bidders} onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">Welcome back, {user.username}</p>
              </div>
              <button
                onClick={onLogout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <PlayerForm socket={socket} />
              <LiveAuction
                currentPlayer={currentPlayer}
                currentBid={currentBid}
                timeLeft={timeLeft}
                isAuctionActive={isAuctionActive}
                onStartAuction={handleStartAuction}
                onMarkSold={handleMarkSold}
                onMarkUnsold={handleMarkUnsold}
              />
            </div>

            <NavigationButtons
              onNavigate={setCurrentView}
              counts={{
                available: players.length,
                sold: soldPlayers.length,
                unsold: unsoldPlayers.length,
                bidders: Object.keys(bidders).length
              }}
            />
          </div>
        );
    }
  };

  return <div className="min-h-screen">{renderCurrentView()}</div>;
};

export default AdminDashboard;