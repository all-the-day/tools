import React, { useEffect } from 'react';
import { Card } from 'animal-island-ui';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const toastStyle = {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    zIndex: 1000,
    minWidth: '300px',
    maxWidth: '400px',
    animation: 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 24px rgba(62, 39, 35, 0.2)'
  };

  const typeColors = {
    success: 'app-green',
    error: 'app-red',
    info: 'app-blue'
  };

  const typeIcons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div style={toastStyle}>
      <Card color={typeColors[type] || 'app-blue'}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '500', 
          color: '#fff',
          fontSize: '1rem'
        }}>
          <span style={{ fontSize: '1.3rem' }}>
            {typeIcons[type] || 'ℹ️'}
          </span>
          <span>{message}</span>
        </div>
      </Card>
    </div>
  );
}