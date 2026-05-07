'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/'
    });

    if (res?.error) {
      setError('Invalid email or password');
      setIsLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="fs-chat-container" style={{ overflowY: 'auto' }}>
      <div className="interactive-bg">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      <div style={{ padding: '4rem 2rem', maxWidth: '500px', margin: '2rem auto', width: '100%' }}>
        <div className="glass-panel animate-in delay-1" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="pulse-dot" style={{ width: '24px', height: '24px', marginBottom: '1.5rem' }}></div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="text-gradient">Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Sign in to access your plant library and personalized gardening advice.
          </p>

          <form onSubmit={handleCredentialsSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '0.75rem', fontSize: '0.95rem' }}>
                {error}
              </div>
            )}
            
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500 }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="fs-chat-input-wrapper focus-ring"
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', color: 'var(--text-main)', padding: '1rem', border: '1px solid var(--surface-border)', borderRadius: '0.75rem', outline: 'none' }}
              />
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500 }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="fs-chat-input-wrapper focus-ring"
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.5)', color: 'var(--text-main)', padding: '1rem', border: '1px solid var(--surface-border)', borderRadius: '0.75rem', outline: 'none' }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem', marginTop: '0.5rem' }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="typing-dots"><div></div><div></div><div></div></div> Logging in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
          </div>

          <button 
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="hover-lift"
            style={{ width: '100%', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', fontSize: '1.1rem', padding: '1rem', background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-main)', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
