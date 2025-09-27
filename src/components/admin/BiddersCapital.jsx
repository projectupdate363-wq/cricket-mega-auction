import React from 'react';

const BiddersCapital = ({ bidders, onBack }) => {
  const bidderEntries = Object.entries(bidders);

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
            <h1 className="text-3xl font-bold text-yellow-400">Bidders Capital</h1>
            <p className="text-gray-400">{bidderEntries.length} active bidders</p>
          </div>
        </div>
      </div>

      {bidderEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bidderEntries.map(([bidderName, bidderInfo]) => (
            <div key={bidderName} className="card border-l-4 border-yellow-500 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{bidderName}</h3>
                    <p className="text-sm text-gray-400">Bidder</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">₹{bidderInfo.capital}L</div>
                    <div className="text-sm text-gray-400">Remaining Capital</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-400">
                      {bidderInfo.purchased_players ? bidderInfo.purchased_players.length : 0}
                    </div>
                    <div className="text-xs text-gray-400">Players Owned</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-400">
                      ₹{1000 - bidderInfo.capital}L
                    </div>
                    <div className="text-xs text-gray-400">Money Spent</div>
                  </div>
                </div>

                {bidderInfo.purchased_players && bidderInfo.purchased_players.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Recent Purchases</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {bidderInfo.purchased_players.slice(-3).map((player, index) => (
                        <div key={index} className="bg-white/5 rounded p-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">{player.name}</span>
                            <span className="text-yellow-400 font-bold">₹{player.sold_price}L</span>
                          </div>
                          <div className="text-xs text-gray-400">{player.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Active Bidders</h3>
          <p className="text-gray-500">Bidders will appear here once they join the auction</p>
        </div>
      )}
    </div>
  );
};

export default BiddersCapital;