import React, { useState, useEffect } from 'react';
import ChatSection from './components/ChatSection';
import MapSection from './components/MapSection';
import AdminSection from './components/AdminSection';
import { Compass, Sparkles, MapPin, Heart } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [activeMobileTab, setActiveMobileTab] = useState('chat'); // 'chat' or 'map'

  // Handling real URL paths instead of hash for cleaner navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange(); // Run on mount

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (view) => {
    const path = view === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentView(view);
    }
  };

  const handleTriggerMarker = (markerId) => {
    setSelectedPlaceId(markerId);
    setActiveMobileTab('map');
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo-container" onClick={() => navigateTo('home')}>
          <div className="logo-glow">
            <Compass size={22} className="spinner" />
          </div>
          <div className="logo-text">
            <h1>МОСКОВСКИЙ NAVI</h1>
            <p>Гид по городу Московскому</p>
          </div>
        </div>

        <nav className="nav-actions">
          {currentView === 'home' ? (
            <>
              <button 
                className="nav-link-btn"
                onClick={() => {
                  const mapEl = document.getElementById('map-section');
                }}
              >
                <MapPin size={16} />
                <span>Карта мест</span>
              </button>
              <button 
                className="nav-link-btn admin-minimal-btn"
                onClick={() => navigateTo('admin')}
                title="Админка"
              >
                <span>Админ</span>
              </button>
            </>
          ) : (
            <button 
              className="nav-link-btn"
              onClick={() => navigateTo('home')}
            >
              <span>← В чат-гид</span>
            </button>
          )}
        </nav>
      </header>

      <main className="main-content">
        {currentView === 'home' ? (
          <>
            <div className={`hero-landing ${activeMobileTab === 'map' ? 'mobile-hidden' : ''}`}>
              <h2>Добро пожаловать в город Московский! 👋</h2>
              <p>
                Только переехали или хотите узнать район получше? Спросите нашего чат-помощника — он расскажет про лучшие места и покажет их прямо на карте.
              </p>
            </div>

            <div className={`landing-chat-section ${activeMobileTab === 'map' ? 'mobile-hidden' : ''}`}>
              <div className="hero-visuals">
                <div className="visual-content">
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', fontWeight: 700, marginTop: '0.75rem', lineHeight: '1.3' }}>
                    Что тут вообще есть?
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                    Не нужно гуглить и читать группы ВКонтакте. Просто напишите вопрос — и чат покажет место на карте:
                  </p>

                  <div className="features-list">
                    <div className="feature-item">
                      <div className="feature-icon-box" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6' }}>
                        <Heart size={18} />
                      </div>
                      <div>
                        <h4>Где вкусно поесть?</h4>
                        <p>Додо Пицца, фудкорт в ТРЦ и кофейни — всё найдётся.</p>
                      </div>
                    </div>

                    <div className="feature-item">
                      <div className="feature-icon-box">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h4>Парки и прогулки</h4>
                        <p>Ульяновский лесопарк, парк «Град Московский» — куда пойти в выходные.</p>
                      </div>
                    </div>

                    <div className="feature-item">
                      <div className="feature-icon-box" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee' }}>
                        <Compass size={18} />
                      </div>
                      <div>
                        <h4>Транспорт и школы</h4>
                        <p>Как добраться до «Филатова Луга», где записать ребёнка в школу и секции.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ChatSection onTriggerMarker={handleTriggerMarker} />
            </div>

            <div className={`landing-map-container-wrapper ${activeMobileTab === 'chat' ? 'mobile-hidden' : ''}`}>
              <MapSection 
                selectedPlaceId={selectedPlaceId} 
                onSelectPlace={setSelectedPlaceId} 
              />
            </div>
          </>
        ) : (
          <AdminSection onBack={() => navigateTo('home')} />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-logo">
          <Compass size={16} className="accent-color spin-slow" />
          <span>Московский NAVI · 2026</span>
        </div>
        <p>Гид для жителей города Московского 🏡</p>
      </footer>

      {currentView === 'home' && (
        <div className="mobile-bottom-nav">
          <button 
            className={`mobile-nav-item ${activeMobileTab === 'chat' ? 'active' : ''}`}
            onClick={() => {
              setActiveMobileTab('chat');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Compass size={20} />
            <span>ИИ Чат-гид</span>
          </button>
          
          <button 
            className={`mobile-nav-item ${activeMobileTab === 'map' ? 'active' : ''}`}
            onClick={() => {
              setActiveMobileTab('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <MapPin size={20} />
            <span>Карта мест</span>
          </button>
        </div>
      )}
    </div>
  );
}
