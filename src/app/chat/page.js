'use client';

import React, { Suspense } from 'react';
import FullScreenChat from '@/components/FullScreenChat';

export default function ChatPage() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading chat...</div>}>
        <FullScreenChat />
      </Suspense>
    </div>
  );
}
