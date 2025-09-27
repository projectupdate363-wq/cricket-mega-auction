import React from 'react';

const NavigationButtons = ({ onNavigate, counts }) => {
  const buttons = [
    {
      key: 'available',
      title: 'Available Players',
      count: counts.available,
      color: 'from-blue-500 to-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      key: 'sold',
      title: 'Sold Players',
      count: counts.sold,
      color: 'from-green-500 to-green-600',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    {
      key: 'unsold',
      title: 'Unsold Players',
      count: counts.unsold,
      color: 'from-red-500 to-red-600',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    {
      key: 'bidders',
      title: 'Bidders Capital',
      count: counts.bidders,
      color: 'from-yellow-500 to-yellow-600',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {buttons.map((button) => (
        <button
          key={button.key}
          onClick={() => onNavigate(button.key)}
          className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${button.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          <div className="relative z-10">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${button.color} rounded-lg mb-4 text-white`}>
              {button.icon}
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
              {button.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-300 group-hover:text-white transition-colors">
                {button.count}
              </span>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default NavigationButtons;