import React, { useState } from 'react';

const PlayerForm = ({ socket }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    runs: '',
    wickets: '',
    strike_rate: '',
    average: '',
    batting_type: '',
    bowling_type: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/add_player', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setFormData({
          name: '',
          type: '',
          runs: '',
          wickets: '',
          strike_rate: '',
          average: '',
          batting_type: '',
          bowling_type: '',
          image: null
        });
        // Reset file input
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error adding player:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-green-400">Add New Player</h2>
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Player Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Enter player name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="">Select Role</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicket-Keeper">Wicket-Keeper</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Runs
            </label>
            <input
              type="number"
              name="runs"
              value={formData.runs}
              onChange={handleChange}
              className="input"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Wickets
            </label>
            <input
              type="number"
              name="wickets"
              value={formData.wickets}
              onChange={handleChange}
              className="input"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Strike Rate
            </label>
            <input
              type="number"
              name="strike_rate"
              value={formData.strike_rate}
              onChange={handleChange}
              className="input"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Batting Average
            </label>
            <input
              type="number"
              name="average"
              value={formData.average}
              onChange={handleChange}
              className="input"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Batting Type
            </label>
            <input
              type="text"
              name="batting_type"
              value={formData.batting_type}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Right-handed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bowling Type
            </label>
            <input
              type="text"
              name="bowling_type"
              value={formData.bowling_type}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Fast, Spin"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Player Image
          </label>
          <div className="relative">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="input"
              accept="image/*"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full py-3"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="loading-spinner mr-2"></div>
              Adding Player...
            </div>
          ) : (
            'Add Player to Auction'
          )}
        </button>
      </form>
    </div>
  );
};

export default PlayerForm;