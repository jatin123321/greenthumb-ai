'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hi there! I'm your AI Gardening Planner 🌱. To get started, where do you live and what kind of space do you have?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    
    // Add user message immediately
    const newMessages = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages,
          message: userText
        })
      });
      
      const data = await response.json();
      
      let botMessage = { role: 'model', text: data.reply || "Something went wrong." };

      if (data.isComplete && data.plants) {
        botMessage.plants = data.plants;
        botMessage.weather = data.weather;
      }

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI backend." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 10, height: 10, background: 'var(--primary)', borderRadius: '50%' }}></div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>AI Gardening Planner</h3>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>
            ✕
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <div className={`chat-bubble ${msg.role === 'model' ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
              
              {/* Plant Cards inside Chat */}
              {msg.plants && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--primary)', borderRadius: '0.5rem', alignSelf: 'flex-start', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 600 }}>Climate:</span> {msg.weather.temp}°C, {msg.weather.description}
                  </div>
                  {msg.plants.map(plant => (
                     <div key={plant.id} className="glass-card" style={{ padding: '1rem', background: 'var(--surface)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <img src={plant.image} alt={plant.name} style={{ width: 60, height: 60, borderRadius: '0.5rem', objectFit: 'cover' }} />
                         <div>
                           <h4 style={{ margin: '0 0 0.25rem 0' }}>{plant.name}</h4>
                           <span className={`tag ${plant.difficulty.toLowerCase()}`}>{plant.difficulty}</span>
                         </div>
                       </div>
                       <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.75rem' }}>{plant.care}</p>
                     </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
          {isTyping && (
            <div className="chat-bubble bot">
              <div className="typing-dots">
                <div></div><div></div><div></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-input-area">
          <input 
            type="text" 
            className="input-field" 
            style={{ padding: '0.75rem', fontSize: '0.95rem' }}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1rem', borderRadius: '0.75rem' }} disabled={isTyping || !inputMessage.trim()}>
            Send
          </button>
        </form>
      </div>

      {/* Floating Action Button */}
      <button 
        className="chat-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  );
}
