'use client';
import React from 'react';

export default function RecommendationDashboard({ weather, plants, onReset }) {
  return (
    <div className="container animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="title text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Planting Guide</h2>
          <p className="text-muted">Personalized for {weather.location}</p>
        </div>
        <button onClick={onReset} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--surface-border)' }}>
          Start Over
        </button>
      </div>

      {/* Weather Summary Card */}
      <div className="glass-card mb-8 animate-in delay-1" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Climate Overview</h3>
        <div className="grid grid-cols-3">
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Temperature</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{Math.round(weather.temp)}°C</p>
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Humidity</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Conditions</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 500, textTransform: 'capitalize' }}>{weather.description}</p>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }} className="animate-in delay-2">Recommended Plants</h3>
      
      <div className="grid grid-cols-2 animate-in delay-3">
        {plants && plants.length > 0 ? (
          plants.map((plant) => (
            <div key={plant.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                {/* Fallback pattern to beautiful image */}
                <img 
                  src={plant.image} 
                  alt={plant.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{plant.name}</h4>
                  <span className={`tag ${plant.difficulty.toLowerCase()}`}>{plant.difficulty}</span>
                </div>
                
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem', fontStyle: 'italic' }}>Type: {plant.type}</p>
                
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Care Guide:</p>
                  <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {plant.care}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem' }}>
            <p>No perfect matches found for and these specific constraints, try adjusting your space settings!</p>
          </div>
        )}
      </div>
    </div>
  );
}
