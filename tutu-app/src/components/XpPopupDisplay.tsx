import React from 'react';

interface XpPopup {
  id: string;
  x: number;
  y: number;
  amount: number;
}

interface XpPopupDisplayProps {
  popups: XpPopup[];
}

const XpPopupDisplay: React.FC<XpPopupDisplayProps> = ({ popups }) => {
  return (
    <>
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="xp-popup"
          style={{
            left: popup.x,
            top: popup.y,
          }}
        >
          +{popup.amount} XP!
        </div>
      ))}
    </>
  );
};

export default XpPopupDisplay;