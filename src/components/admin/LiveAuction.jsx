import React, { useState, useEffect } from 'react';

const LiveAuction = ({
  currentPlayer,
  currentBid,
  timeLeft,
  isAuctionActive,
  onStartAuction,
  onMarkSold,
  onMarkUnsold
}) => {
  const [biddingLog, setBiddingLog] = useState([]);

  useEffect(() => {
    // Listen for new bids to update the log
    const socket = window.socket;
    if (socket) {
      socket.on('new_bid', (data) => {
        setBiddingLog(prev => [{
          bidder: data.bidder,
          amount: data.amount,
          time: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 9)]); // Keep only last 10 bids
      });

      socket.on('auction_started', () => {
        setBiddingLog([]);
      });
    }
  }, []);

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'timer-danger';
    if (timeLeft <= 20) return 'timer-warning';
    return '';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-400">Live Auction</h2>
        <div className="live-indicator">
          LIVE
        </div>
      </div>

      {/* Current Player Display */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
        {currentPlayer ? (
          <div className="text-center">
            {currentPlayer.image ? (
              <img
                src={`/uploads/${currentPlayer.image}`}
                alt={currentPlayer.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-400 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{currentPlayer.name}</h3>
            <p className="text-yellow-400 font-semibold mb-4">{currentPlayer.type}</p>
            
            {/* Player Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-gray-400">Runs</div>
                <div className="font-bold text-green-400">{currentPlayer.runs || 'N/A'}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-gray-400">Wickets</div>
                <div className="font-bold text-red-400">{currentPlayer.wickets || 'N/A'}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-gray-400">Average</div>
                <div className="font-bold text-blue-400">{currentPlayer.average || 'N/A'}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="text-gray-400">Strike Rate</div>
                <div className="font-bold text-purple-400">{currentPlayer.strike_rate || 'N/A'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No player selected for auction</p>
          </div>
        )}
      </div>

      {/* Current Bid and Timer */}
      <div className="text-center mb-6">
        <div className="bid-display">₹{currentBid}L</div>
        <div className={`timer-display ${getTimerColor()}`}>{timeLeft}</div>
      </div>

      {/* Auction Controls */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={onMarkSold}
          disabled={!isAuctionActive}
          className="btn btn-success"
        >
          Mark Sold
        </button>
        <button
          onClick={onMarkUnsold}
          disabled={!isAuctionActive}
          className="btn btn-danger"
        >
          Mark Unsold
        </button>
        <button
          onClick={onStartAuction}
          disabled={isAuctionActive}
          className="btn btn-warning"
        >
          Next Player
        </button>
      </div>

      {/* Bidding Log */}
      <div className="bg-black/20 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-green-400 mb-3">Bidding Log</h4>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {biddingLog.length > 0 ? (
            biddingLog.map((bid, index) => (
              <div key={index} className="bg-white/5 rounded p-2 text-sm animate-slideIn">
                <span className="font-semibold text-blue-400">{bid.bidder}</span>
                <span className="text-gray-300"> bid </span>
                <span className="font-bold text-yellow-400">₹{bid.amount}L</span>
                <span className="float-right text-gray-500 text-xs">{bid.time}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No bids yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveAuction;