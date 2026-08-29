import React, { useState, useEffect } from 'react';

export default function MockGamemode({ config, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete({ score: 88, status: 'WIN' });
    }
  }, [timeLeft, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'white' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-lime)' }}>
        IN PROGRESS: {config?.mode?.name}
      </h1>
      <div style={{ fontSize: '4rem', color: 'var(--accent-lime)', marginTop: '2rem' }}>
        {timeLeft}
      </div>
    </div>
  );
}
