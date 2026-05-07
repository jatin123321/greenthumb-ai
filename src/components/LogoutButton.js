'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })} 
      className="nav-link" 
      style={{ 
        fontSize: '0.9rem', 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        padding: 0,
        fontFamily: 'inherit',
        color: 'var(--text-main)'
      }}
    >
      Logout
    </button>
  );
}
