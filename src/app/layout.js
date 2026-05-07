import './globals.css';
import Link from 'next/link';
import AuthProvider from '@/components/AuthProvider';
import LogoutButton from '@/components/LogoutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export const metadata = {
  title: 'GreenThumb AI | Plants & Gardening',
  description: 'Identify plants with your camera, chat with our AI gardening expert, and browse our plant library.',
  keywords: 'gardening, plants, AI recommendations, urban gardening, plant care, plant scanner',
};

const NavBar = async () => {
  const session = await getServerSession(authOptions);
  
  return (
    <nav className="global-nav">
      <div className="nav-brand">
        <div className="pulse-dot"></div>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span className="text-gradient" style={{ fontWeight: 800, fontSize: '1.4rem' }}>GreenThumb AI</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link href="/" className="nav-link">Library</Link>
        <Link href="/chat" className="nav-link">AI Chat</Link>
        <Link href="/scan" className="nav-link btn-scan">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="M2 12h4"></path>
            <path d="M18 12h4"></path>
            <path d="M12 2v4"></path>
            <path d="M12 18v4"></path>
            <path d="M12 8v8"></path>
            <rect x="8" y="8" width="8" height="8" rx="2"></rect>
          </svg>
          Scan Plant
        </Link>
        
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--surface-border)', paddingLeft: '1rem' }}>
            <img src={session.user.image} alt={session.user.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <LogoutButton />
          </div>
        ) : (
          <div style={{ marginLeft: '1rem', borderLeft: '1px solid var(--surface-border)', paddingLeft: '1rem' }}>
            <Link href="/login" className="nav-link" style={{ fontWeight: 600 }}>Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          <main className="main-content">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
