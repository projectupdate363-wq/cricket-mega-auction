import React, { useState, useEffect } from 'react';

const BidderInterface = ({ user, socket, onLogout }) => {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState(25);
  const [timeLeft, setTimeLeft] = useState(50);
  const [capital, setCapital] = useState(1000);
  const [purchasedPlayers, setPurchasedPlayers] = useState([]);
  const [isAuctionActive, setIsAuctionActive] = useState(false);
  const [auctionResult, setAuctionResult] = useState(null);

  useEffect(() => {
    // Socket event listeners
    socket.on('auction_started', (player) => {
      setCurrentPlayer(player);
      setCurrentBid(25);
      setTimeLeft(50);
      setIsAuctionActive(true);
      setAuctionResult(null);
    });

    socket.on('new_bid', (data) => {
      setCurrentBid(data.amount);
      setTimeLeft(50); // Reset timer
    });

    socket.on('auction_end', (data) => {
      setIsAuctionActive(false);
      
      if (data.status === 'sold') {
        if (data.winner === user.username) {
          setAuctionResult({
            type: 'won',
            message: `Congratulations! You won ${data.player} for ₹${data.amount}L!`
          });
          setPurchasedPlayers(prev => [...prev, {
            name: data.player,
            sold_price: data.amount,
            type: currentPlayer?.type || 'Player',
            image: currentPlayer?.image
          }]);
        } else {
          setAuctionResult({
            type: 'lost',
            message: `${data.player} goes to ${data.winner} for ₹${data.amount}L`
          });
        }
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
  }, [socket, user.username, currentPlayer]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isAuctionActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAuctionActive, timeLeft]);

  const handleBid = async (increment) => {
    const newBid = currentBid + increment;
    
    try {
      const response = await fetch('/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `bid_amount=${newBid}`
      });
      
      if (!response.ok) {
        console.error('Bid failed');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'timer-danger';
    if (timeLeft <= 20) return 'timer-warning';
    return '';
  };

  const bidIncrements = [10, 25, 50, 100];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Welcome, {user.username}!
              </span>
            </h1>
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              Remaining Capital: ₹{capital}L
            </div>
            <div className="live-indicator">
              LIVE AUCTION
            </div>
          </div>
          <button
            onClick={onLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Auction */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-400">Current Player</h2>
                <div className="live-indicator">
                  BIDDING
                </div>
              </div>

              {/* Player Display */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
                {currentPlayer ? (
                  <div className="text-center">
                    {currentPlayer.image ? (
                      <img
                        src={`/uploads/${currentPlayer.image}`}
                        alt={currentPlayer.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-blue-400 shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    )}
                    <h3 className="text-3xl font-bold text-white mb-2">{currentPlayer.name}</h3>
                    <p className="text-yellow-400 font-semibold text-lg mb-4">{currentPlayer.type}</p>
                    
                    {/* Player Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400">Runs</div>
                        <div className="font-bold text-green-400 text-lg">{currentPlayer.runs || 'N/A'}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400">Wickets</div>
                        <div className="font-bold text-red-400 text-lg">{currentPlayer.wickets || 'N/A'}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400">Average</div>
                        <div className="font-bold text-blue-400 text-lg">{currentPlayer.average || 'N/A'}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-gray-400">Strike Rate</div>
                        <div className="font-bold text-purple-400 text-lg">{currentPlayer.strike_rate || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <p className="text-gray-400 text-xl">Waiting for auction to start...</p>
                  </div>
                )}
              </div>

              {/* Current Bid and Timer */}
              <div className="text-center mb-6">
                <div className="bid-display">Current Bid: ₹{currentBid}L</div>
                <div className={`timer-display ${getTimerColor()}`}>{timeLeft}</div>
              </div>

              {/* Bid Buttons */}
              {isAuctionActive && !auctionResult && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {bidIncrements.map((increment) => (
                    <button
                      key={increment}
                      onClick={() => handleBid(increment)}
                      disabled={currentBid + increment > capital}
                      className="btn btn-primary py-4 text-lg font-bold"
                    >
                      +₹{increment}L
                    </button>
                  ))}
                </div>
              )}

              {/* Auction Result */}
              {auctionResult && (
                <div className={`text-center p-6 rounded-xl border-2 ${
                  auctionResult.type === 'won' 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : auctionResult.type === 'lost'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  <div className="text-2xl font-bold mb-2">
                    {auctionResult.type === 'won' && 'Congratulations!'}
                    {auctionResult.type === 'lost' && 'Player Sold'}
                    {auctionResult.type === 'unsold' && 'Unsold'}
                  </div>
                  <div className="text-lg">{auctionResult.message}</div>
                </div>
              )}
            </div>
          </div>

          {/* Your Team */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-400">Your Team</h2>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{purchasedPlayers.length}</span>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {purchasedPlayers.length > 0 ? (
                purchasedPlayers.map((player, index) => (
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
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-2">No players purchased yet</p>
                  <p className="text-sm text-gray-500">Start bidding to build your team!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidderInterface;