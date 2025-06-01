import React from 'react';

interface WelcomeTourProps {
  onClose: () => void;
}

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onClose }) => {
  return (
    <div className="welcome-tour">
      <div className="welcome-content">
        <h2>Welcome to Your Sleep Therapy Command Center!</h2>
        <p>This dashboard provides comprehensive insights into your CPAP therapy.</p>
        <ul>
          <li>📊 Track your therapy metrics in real-time</li>
          <li>🎯 Set and monitor personal goals</li>
          <li>📈 Analyze trends and patterns</li>
          <li>🤖 Get AI-powered recommendations</li>
          <li>📱 Customize your dashboard layout</li>
        </ul>
        <button onClick={onClose}>Get Started</button>
      </div>
    </div>
  );
};

export default WelcomeTour;