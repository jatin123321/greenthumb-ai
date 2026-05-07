'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// SVG Icons
const BotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8"></path>
    <rect x="4" y="8" width="16" height="12" rx="2" ry="2"></rect>
    <path d="M2 14h2"></path>
    <path d="M20 14h2"></path>
    <path d="M15 13v2"></path>
    <path d="M9 13v2"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', color: '#fbbf24' }}>
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

export default function FullScreenChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState({ location: null, spaceType: null, spaceSize: null });
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const searchParams = useSearchParams();
  const initRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    if (!initRef.current) {
      initRef.current = true;
      const savedData = localStorage.getItem('gardeningProfile');
      let introText = "Hi there! I'm your AI Gardening Planner 🌱. Where do you live and what kind of space do you have?";
      
      let parsedData = { location: null, spaceType: null, spaceSize: null };
      if (savedData) {
        parsedData = JSON.parse(savedData);
        setUserData(parsedData);
        if (parsedData.location) {
          introText = `Welcome back! I remember you're gardening in ${parsedData.location}. Are you planting in that same space, or starting a new project? You can also ask me general questions or upload a photo of a sick plant!`;
        }
      }
      
      const plantParam = searchParams.get('plant');
      
      if (plantParam) {
        const initialMsgs = [
          { role: 'model', text: introText },
          { role: 'user', text: `I'm interested in the ${plantParam} plant. Can you explain how to care for it?` }
        ];
        setMessages(initialMsgs);
        
        setIsTyping(true);
        const hiddenContextMsg = `[SYSTEM CONTEXT: The user's saved profile is Location=${parsedData.location || "Unknown"}, SpaceType=${parsedData.spaceType || "Unknown"}, SpaceSize=${parsedData.spaceSize || "Unknown"}. Remember this!] `;
        
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: [{ role: 'model', text: introText }],
            message: hiddenContextMsg + `I'm interested in the ${plantParam} plant. Can you explain how to care for it?`,
            imageBase64: null
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
             setMessages(prev => [...prev, { role: 'model', text: `AI Service Error: ${data.error}` }]);
             return;
          }
          let botMessage = { role: 'model', text: data.reply || "Something went wrong." };
          if (data.isComplete && data.plants) {
            botMessage.plants = data.plants;
            botMessage.weather = data.weather;
          }
          setMessages(prev => [...prev, botMessage]);
        })
        .catch(err => {
          setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI backend." }]);
        })
        .finally(() => setIsTyping(false));

      } else {
        setMessages([{ role: 'model', text: introText }]);
      }
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [searchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, selectedImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeQuickAction = (text) => {
    setInputMessage(text);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !selectedImage) return;

    const userText = inputMessage.trim();
    const sentImage = selectedImage;
    
    setInputMessage('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    const newMessage = { role: 'user', text: userText, imageBase64: sentImage };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const hiddenContextMsg = `[SYSTEM CONTEXT: The user's saved profile is Location=${userData.location || "Unknown"}, SpaceType=${userData.spaceType || "Unknown"}, SpaceSize=${userData.spaceSize || "Unknown"}. Remember this!] `;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newMessages.slice(0, -1),
          message: hiddenContextMsg + userText,
          imageBase64: sentImage
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'model', text: `AI Service Error: ${data.error}` }]);
        setIsTyping(false);
        return;
      }
      
      if (data.extracted) {
        const updatedMemory = {
          location: data.extracted.location || userData.location,
          spaceType: data.extracted.spaceType || userData.spaceType,
          spaceSize: data.extracted.spaceSize || userData.spaceSize
        };
        setUserData(updatedMemory);
        localStorage.setItem('gardeningProfile', JSON.stringify(updatedMemory));
      }

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

  // The chat visualization block includes robust structural layouts
  return (
    <div className="fs-chat-container" ref={containerRef}>
      <div className="interactive-bg">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      <header className="fs-chat-header interactive-hover">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="pulse-dot"></div>
          <h1 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800, letterSpacing: '-0.03em' }} className="text-gradient">
            GreenThumb AI
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {userData.location && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 Saved: <strong style={{color:'var(--text-main)'}}>{userData.location}</strong></span>
          )}
        </div>
      </header>

      <main className="fs-chat-messages">
        <div className="fs-chat-messages-inner">
          
          {/* Quick Action Visual Layout for Empty/Initial states */}
          {messages.length === 1 && (
            <div className="quick-actions-visual animate-in delay-2" style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
              <p className="text-muted" style={{ fontWeight: 500 }}>Try asking these topics:</p>
              <div className="grid grid-cols-3" style={{ width: '100%', gap: '1rem' }}>
                <button className="visual-card hover-lift" onClick={() => executeQuickAction('Recommend plants for a small balcony')}>
                  <div className="visual-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>🪴</div>
                  <h3>Smart Recommendations</h3>
                  <p>Find the perfect plant for your exact coordinates and space limitations.</p>
                </button>
                <button className="visual-card hover-lift" onClick={() => executeQuickAction('I uploaded an image. What disease does my plant have?')}>
                  <div className="visual-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>📸</div>
                  <h3>Disease Diagnosis</h3>
                  <p>Upload a photograph and let Gemini Vision diagnose the ailment.</p>
                </button>
                <button className="visual-card hover-lift" onClick={() => executeQuickAction('How often should I water a Snake plant?')}>
                  <div className="visual-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>💧</div>
                  <h3>General Expertise</h3>
                  <p>Ask freeform questions about soil pH, weather, and watering habits.</p>
                </button>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`chat-row ${msg.role === 'model' ? 'bot-row' : 'user-row'}`}>
              
              {/* Visual Avatar System */}
              <div className="avatar-orb">
                 {msg.role === 'model' ? <BotIcon /> : <UserIcon />}
              </div>

              <div className="chat-content-cluster">
                <div className={`chat-bubble fs-bubble interactive-bubble ${msg.role === 'model' ? 'bot' : 'user'}`}>
                  {msg.text}
                  {msg.imageBase64 && (
                    <div style={{ marginTop: '1rem' }} className="image-pop">
                      <img src={msg.imageBase64} alt="Uploaded" className="interactive-img" />
                    </div>
                  )}
                </div>
                
                {msg.plants && (
                  <div className="plants-visual-container">
                    <div className="weather-chip" style={{ display: 'flex', alignItems: 'center' }}>
                      <SunIcon />
                      <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>Local Climate:</span> {msg.weather.temp}°C, <span style={{ textTransform: 'capitalize', marginLeft: '0.25rem' }}>{msg.weather.description}</span>
                    </div>
                    
                    <div className="grid grid-cols-2" style={{ marginTop: '1.5rem', gap: '2rem' }}>
                      {msg.plants.map((plant, pIndex) => (
                        <div key={plant.id} className="glass-card plant-card visual-plant-card" style={{ animationDelay: `${pIndex * 0.1}s` }}>
                          
                          {/* Rich visually appealing image wrapper */}
                          <div className="rich-img-wrapper">
                            <img src={plant.image} alt={plant.name} />
                            <div className="img-overlay">
                               <span className={`tag ${plant.difficulty.toLowerCase()} solid-tag`}>{plant.difficulty}</span>
                            </div>
                          </div>
                          
                          <div style={{ paddingTop: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{plant.name}</h3>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Type: {plant.type || 'Plant'}</p>
                            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{plant.care}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}

          {isTyping && (
             <div className="chat-row bot-row">
               <div className="avatar-orb"><BotIcon /></div>
               <div className="chat-bubble fs-bubble bot" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', minHeight: '60px' }}>
                 <div className="typing-dots">
                   <div></div><div></div><div></div>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fs-chat-footer">
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          {selectedImage && (
            <div className="selected-image-preview animate-in">
              <img src={selectedImage} alt="Preview" />
              <button type="button" onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}>
                ✖ Remove
              </button>
            </div>
          )}

          <div className="fs-chat-input-wrapper focus-ring">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flex: 1, gap: '1rem', alignItems: 'center' }}>
              
              <input type="hidden" value={inputMessage || selectedImage ? "Upload" : ""} />
              
              <label className="upload-btn" title="Upload Image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </label>

              <input 
                type="text" 
                className="chat-input"
                placeholder="Message GreenThumb or upload an image..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />

              <button type="submit" className="btn-primary send-btn" disabled={isTyping || (!inputMessage.trim() && !selectedImage)}>
                Send
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
