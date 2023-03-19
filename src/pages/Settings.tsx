import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [fullPositionSize, setFullPositionSize] = useState<number>(0);

  useEffect(() => {
    // Fetch the latest full position size from the backend
    fetch('http://localhost:3001/api/full-position-size')
      .then((response) => response.json())
      .then((data) => setFullPositionSize(data.current_full_position_size));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullPositionSize(Number(e.target.value));
  };

  const saveSettings = () => {
    // Send the updated value to the backend
    fetch('http://localhost:3001/api/full-position-size', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changed_to: fullPositionSize, user_id: 'your_user_id' }),
    });
  };

  return (
    <div>
      <h1>Settings</h1>
      <div className="form-group">
        <label htmlFor="fullPositionSize">Full Position Size</label>
        <input
          type="number"
          className="form-control"
          id="fullPositionSize"
          name="fullPositionSize"
          value={fullPositionSize}
          onChange={handleChange}
          required
        />
      </div>
      <button className="btn btn-primary" onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
};

export default Settings;
