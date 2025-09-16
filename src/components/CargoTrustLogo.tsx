import React from 'react';

interface CargoTrustLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const CargoTrustLogo: React.FC<CargoTrustLogoProps> = ({ 
  size = 'md', 
  showText = true 
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return { width: 32, height: 32, fontSize: '12px' };
      case 'lg': return { width: 80, height: 80, fontSize: '24px' };
      default: return { width: 48, height: 48, fontSize: '16px' };
    }
  };

  const { width, height, fontSize } = getSize();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Logo SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        style={{ flexShrink: 0 }}
      >
        {/* Caminho da estrada */}
        <path
          d="M10 75 L90 75"
          stroke="#3B82F6"
          strokeWidth="3"
          fill="none"
        />
        
        {/* Caminhão */}
        <g transform="translate(15, 45)">
          {/* Corpo do caminhão */}
          <rect
            x="0"
            y="0"
            width="35"
            height="20"
            fill="#3B82F6"
            rx="2"
          />
          
          {/* Cabine */}
          <rect
            x="35"
            y="5"
            width="15"
            height="15"
            fill="#3B82F6"
            rx="1"
          />
          
          {/* Rodas */}
          <circle
            cx="8"
            cy="25"
            r="6"
            fill="#3B82F6"
          />
          <circle
            cx="28"
            cy="25"
            r="6"
            fill="#3B82F6"
          />
          <circle
            cx="42"
            cy="25"
            r="6"
            fill="#3B82F6"
          />
          
          {/* Detalhes da cabine */}
          <rect
            x="37"
            y="7"
            width="3"
            height="3"
            fill="white"
            rx="0.5"
          />
          <rect
            x="41"
            y="7"
            width="3"
            height="3"
            fill="white"
            rx="0.5"
          />
          
          {/* Grade frontal */}
          <rect
            x="48"
            y="8"
            width="2"
            height="8"
            fill="#3B82F6"
          />
          <rect
            x="50"
            y="9"
            width="2"
            height="6"
            fill="#3B82F6"
          />
        </g>
        
        {/* Montanhas */}
        <g transform="translate(60, 35)">
          <path
            d="M0 25 L8 5 L15 15 L22 8 L30 20 L35 10 L40 25 Z"
            fill="#3B82F6"
            opacity="0.8"
          />
        </g>
      </svg>

      {/* Texto do logo */}
      {showText && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          lineHeight: '1.1'
        }}>
          <div style={{
            fontSize: fontSize,
            fontWeight: 'bold',
            color: '#3B82F6',
            letterSpacing: '0.5px'
          }}>
            CARGO
          </div>
          <div style={{
            fontSize: fontSize,
            fontWeight: 'bold',
            color: '#3B82F6',
            letterSpacing: '0.5px',
            transform: 'skewX(-5deg)'
          }}>
            TRUST
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoTrustLogo;
