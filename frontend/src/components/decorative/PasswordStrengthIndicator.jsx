import React from 'react';

const PasswordStrengthIndicator = ({ strength }) => {
  const getColor = () => {
    switch (strength) {
        case 1:
            return '#ff0000'; // Weak (red)
        case 2:
            return '#ff0000'; // Weak (red)
        case 3:
            return '#ffef00'; // Medium (yellow)
        case 4:
            return '#00a613'; // Strong (green)
        default:
            return '#dededf';
    }
  };

  return (
    <div
      style={{
        height: '8px', // Increase height for better visibility
        width: '100%',
        backgroundColor: getColor(),
        marginTop: '5px',
        borderRadius: '5px', // Round the edges
      }}
    ></div>
  );
};

export default PasswordStrengthIndicator;
