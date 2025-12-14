import React from 'react';

interface BackArrowProps {
  size?: 'small' | 'medium' | 'large';
}

const BackArrow: React.FC<BackArrowProps> = ({ size = 'large' }) => {
  const fontSize = {
    small: '1.5rem',
    medium: '2rem',
    large: '2.5rem'
  }[size];

  return (
    <span style={{
      fontSize,
      fontWeight: 'bold',
      display: 'inline-block',
      lineHeight: 1
    }}>
      ←
    </span>
  );
};

export default BackArrow;
