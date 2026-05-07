'use client';

import React, { useState, useRef } from 'react';

export default function ScanPage() {
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: image })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to scan image.");
      }

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fs-chat-container" style={{ overflowY: 'auto' }}>
      <div className="interactive-bg">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      <div style={{ padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '2rem' }} className="animate-in delay-1">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="text-gradient">Plant Scanner</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Take a picture of any plant, herb, or tree to instantly identify it and learn how to care for it.
          </p>
        </header>

        <div className="glass-panel animate-in delay-2" style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          
          {!image ? (
            <label 
              style={{
                width: '100%', height: '300px', border: '2px dashed var(--primary)', 
                borderRadius: '1rem', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justify: 'center', cursor: 'pointer',
                background: 'rgba(16, 185, 129, 0.05)', transition: 'all 0.3s ease'
              }}
              className="hover-lift"
            >
              <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--primary)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <h3>Tap to use Camera or Upload</h3>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                style={{ display: 'none' }}
                onChange={handleCapture}
                ref={fileInputRef}
              />
            </label>
          ) : (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '100%', maxWidth: '400px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                <img src={image} alt="To be scanned" style={{ width: '100%', display: 'block' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" onClick={handleScan} disabled={isScanning}>
                  {isScanning ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="typing-dots"><div></div><div></div><div></div></div> Scanning...
                    </span>
                  ) : (
                     "Identify Plant"
                  )}
                </button>
                <button 
                  onClick={resetScanner} 
                  disabled={isScanning}
                  style={{ background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-main)', padding: '1rem 2rem', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {error && (
           <div className="glass-card animate-in" style={{ width: '100%', marginTop: '2rem', borderLeft: '4px solid var(--danger)' }}>
             <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
               Scan Error
             </h3>
             <p style={{ marginTop: '0.5rem' }}>{error}</p>
           </div>
        )}

        {result && !error && (
          <div className="glass-card animate-in delay-1" style={{ width: '100%', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div>
                 <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>{result.name}</h2>
                 <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{result.scientificName}</p>
               </div>
               <span className="tag solid-tag" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{result.type}</span>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#f8fafc' }}>Description</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{result.description}</p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: '#f8fafc' }}>Care Instructions</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{result.care}</p>
            </div>

            {result.funFact && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.25rem', borderRadius: '0.75rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>✨ Fun Fact</h4>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{result.funFact}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
