import React from 'react';

const AvailablePlayers = ({ players, onBack }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-blue-400">Available Players</h1>
            <p className="text-gray-400">{players.length} players ready for auction</p>
          </div>
        </div>
      </div>

      {players.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map((player, index) => (
            <div key={index} className="player-card animate-fadeIn">
              {player.image ? (
                <img
                  src={`/uploads/${player.image}`}
                  alt={player.name}
                  className="player-image"
                />
              ) : (
                <div className="player-image-placeholder">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              )}
              
              <h3 className="text-lg font-bold text-white mb-2">{player.name}</h3>
              <p className="text-yellow-400 font-semibold mb-3">{player.type}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Runs:</span>
                  <span className="text-green-400 font-semibold">{player.runs || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wickets:</span>
                  <span className="text-red-400 font-semibold">{player.wickets || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Average:</span>
                  <span className="text-blue-400 font-semibold">{player.average || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Strike Rate:</span>
                  <span className="text-purple-400 font-semibold">{player.strike_rate || 'N/A'}</span>
                </div>
              </div>
              
              {(player.batting_type || player.bowling_type) && (
                <div className="mt-3 pt-3 border-t border-gray-700 space-y-1 text-xs">
                  {player.batting_type && (
                    <div className="text-gray-400">Batting: {player.batting_type}</div>
                  )}
                  {player.bowling_type && (
                    <div className="text-gray-400">Bowling: {player.bowling_type}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Available Players</h3>
          <p className="text-gray-500">Add some players to start the auction</p>
        </div>
      )}
    </div>
  );
};

export default AvailablePlayers;