import React, { useState, useEffect } from 'react';

const SpectatorInterface = ({ user, socket, onLogout }) => {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(25);
  const [timeLeft, setTimeLeft] = useState(50);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [biddingLog, setBiddingLog] = useState([]);
  const [auctionStats, setAuctionStats] = useState({
    totalSold: 0,
    totalSpent: 0,
    highestSale: 0,
    activeBidders: 0
  });
  const [auctionResult, setAuctionResult] = useState(null);

  useEffect(() => {
    // Socket event listeners
    socket.on('auction_started', (player) => {
      setCurrentPlayer(player);
      setCurrentBid(25);
      setTimeLeft(50);
      setBiddingLog([]);
      setAuctionResult(null);
    });

    socket.on('new_bid', (data) => {
      setCurrentBid(data.amount);
      setTimeLeft(50); // Reset timer
      setBiddingLog(prev => [{
        bidder: data.bidder,
        amount: data.amount,
        time: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]); // Keep only last 10 bids
    });

    socket.on('auction_end', (data) => {
      if (data.status === 'sold') {
        const newPlayer = {
          name: data.player,
          sold_price: data.amount,
          winner: data.winner,
          type: currentPlayer?.type || 'Player',
          image: currentPlayer?.image
        };
        setSoldPlayers(prev => [newPlayer, ...prev.slice(0, 4)]); // Keep only last 5
        
        setAuctionStats(prev => ({
          ...prev,
          totalSold: prev.totalSold + 1,
          totalSpent: prev.totalSpent + data.amount,
          highestSale: Math.max(prev.highestSale, data.amount)
        }));

        setAuctionResult({
          type: 'sold',
          message: `${data.player} goes to ${data.winner} for ₹${data.amount}L`
        });
      } else {
        setAuctionResult({
          type: 'unsold',
          message: `${data.player} remains unsold`
        });
      }
      
      setTimeout(() => {
        setCurrentPlayer(null);
        setCurrentBid(25);
        setTimeLeft(50);
        setAuctionResult(null);
      }, 3000);
    });

    return () => {
      socket.off('auction_started');
      socket.off('new_bid');
      socket.off('auction_end');
    };
  }, [socket, currentPlayer]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (currentPlayer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentPlayer, timeLeft]);

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'timer-danger';
    if (timeLeft <= 20) return 'timer-warning';
    return '';
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                NAMMA CRICKET LIVE
              </span>
            </h1>
            <div className="live-indicator mb-4">
              LIVE BROADCAST
            </div>
            <p className="text-gray-400 text-lg">
              Welcome to the live cricket auction! Watch as teams bid for their favorite players.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>

        {/* Main Auction Display */}
        <div className="card max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-400">Live Auction</h2>
            <div className="live-indicator">
              SPECTATOR MODE
            </div>
          </div>

          {/* Player Display */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 mb-6">
            {currentPlayer ? (
              <div className="text-center">
                {currentPlayer.image ? (
                  <img
                    src={`/uploads/${currentPlayer.image}`}
                    alt={currentPlayer.name}
                    className="w-40 h-40 rounded-full object-cover mx-auto mb-6 border-4 border-blue-400 shadow-xl"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                )}
                <h3 className="text-4xl font-bold text-white mb-3">{currentPlayer.name}</h3>
                <p className="text-yellow-400 font-semibold text-xl mb-6">{currentPlayer.type}</p>
                
                {/* Player Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Runs</div>
                    <div className="font-bold text-green-400 text-2xl">{currentPlayer.runs || 'N/A'}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Wickets</div>
                    <div className="font-bold text-red-400 text-2xl">{currentPlayer.wickets || 'N/A'}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Average</div>
                    <div className="font-bold text-blue-400 text-2xl">{currentPlayer.average || 'N/A'}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Strike Rate</div>
                    <div className="font-bold text-purple-400 text-2xl">{currentPlayer.strike_rate || 'N/A'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-2xl">Waiting for auction to start...</p>
              </div>
            )}
          </div>

          {/* Current Bid and Timer */}
          <div className="text-center mb-6">
            <div className="bid-display">Current Bid: ₹{currentBid}L</div>
            <div className={`timer-display ${getTimerColor()}`}>{timeLeft}</div>
          </div>

          {/* Auction Result */}
          {auctionResult && (
            <div className={`text-center p-6 rounded-xl border-2 mb-6 ${
              auctionResult.type === 'sold' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="text-2xl font-bold mb-2">
                {auctionResult.type === 'sold' ? 'SOLD!' : 'UNSOLD'}
              </div>
              <div className="text-lg">{auctionResult.message}</div>
            </div>
          )}

          {/* Live Bidding Activity */}
          <div className="bg-black/20 rounded-lg p-6">
            <h4 className="text-xl font-semibold text-green-400 mb-4">Live Bidding Activity</h4>
            <div className="max-h-48 overflow-y-auto space-y-3">
              {biddingLog.length > 0 ? (
                biddingLog.map((bid, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 animate-slideIn">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-blue-400">{bid.bidder}</span>
                        <span className="text-gray-300"> bid </span>
                        <span className="font-bold text-yellow-400">₹{bid.amount}L</span>
                      </div>
                      <span className="text-gray-500 text-sm">{bid.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No auction activity yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recently Sold */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-green-400">Recently Sold</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {soldPlayers.length > 0 ? (
                soldPlayers.map((player, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-green-500/20 animate-fadeIn">
                    <div className="flex items-center space-x-3">
                      {player.image ? (
                        <img
                          src={`/uploads/${player.image}`}
                          alt={player.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-green-400"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{player.name}</h4>
                        <p className="text-sm text-yellow-400">{player.type}</p>
                        <p className="text-lg font-bold text-green-400">₹{player.sold_price}L</p>
                        <p className="text-sm text-gray-400">{player.winner}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No players sold yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Auction Stats */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-blue-400">Auction Stats</h3>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Total Players Sold</div>
                <div className="text-3xl font-bold text-green-400">{auctionStats.totalSold}</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Total Money Spent</div>
                <div className="text-3xl font-bold text-yellow-400">₹{auctionStats.totalSpent}L</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Highest Sale</div>
                <div className="text-3xl font-bold text-red-400">₹{auctionStats.highestSale}L</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Active Bidders</div>
                <div className="text-3xl font-bold text-purple-400">{auctionStats.activeBidders}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpectatorInterface;