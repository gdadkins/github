import React from 'react';

interface PremiumBannerProps {
  onUpgrade?: () => void;
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({ onUpgrade }) => {
  return (
    <div className="premium-banner">
      <div className="banner-content">
        <div className="banner-text">
          <h3>Unlock Advanced Analytics</h3>
          <p>Get predictive insights, detailed reports, and unlimited data history</p>
        </div>
        <button className="upgrade-button" onClick={onUpgrade}>
          Upgrade to Premium - $9.99/month
        </button>
      </div>
    </div>
  );
};

export default PremiumBanner;