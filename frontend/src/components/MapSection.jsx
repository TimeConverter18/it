import React, { useState, useEffect } from 'react';
import { PLACES } from '../data/places';
import { Star, Sparkles, Eye, AlertCircle } from 'lucide-react';

const getCategoryRu = (category) => {
  switch (category) {
    case 'shopping': return 'Покупки / ТРЦ';
    case 'park': return 'Парк / Природа';
    case 'sport': return 'Спорт / Бассейн';
    case 'culture': return 'Культура / Школы';
    case 'food': return 'Кафе / Пицца';
    default: return 'Место';
  }
};

const getMarkerColor = (category) => {
  switch (category) {
    case 'shopping': return '#ec4899';
    case 'park': return '#10b981';
    case 'sport': return '#06b6d4';
    case 'culture': return '#a855f7';
    case 'food': return '#f59e0b';
    default: return '#6b7280';
  }
};

const FILTERS = [
  { key: 'all',      label: 'Все места' },
  { key: 'food',     label: '🍕 Кафе' },
  { key: 'park',     label: '🌳 Парки' },
  { key: 'sport',    label: '🏊 Спорт' },
  { key: 'shopping', label: '🛍 Шопинг' },
  { key: 'culture',  label: '🎭 Культура' },
];

export default function MapSection({ selectedPlaceId, onSelectPlace }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [yandexApiKey, setYandexApiKey] = useState('');
  
  useEffect(() => {
    const savedYandexKey = localStorage.getItem('yandex_maps_api_key') || '';
    setYandexApiKey(savedYandexKey);
  }, []);

  const selectedPlace = PLACES.find(p => p.id === selectedPlaceId) || null;
  const filteredPlaces = activeCategory === 'all'
    ? PLACES
    : PLACES.filter(p => p.category === activeCategory);

  // Build URL with real API key if available
  const buildMapUrl = (place) => {
    const baseUrl = 'https://yandex.ru/map-widget/v1/';
    const params = new URLSearchParams();
    
    if (yandexApiKey) {
      params.append('apikey', yandexApiKey);
    }
    
    if (!place) {
      params.append('ll', '37.352,55.594');
      params.append('z', '14');
    } else {
      const [lat, lon] = place.coords;
      params.append('ll', `${lon},${lat}`);
      params.append('z', '16');
      params.append('pt', `${lon},${lat},pm2rdm`);
    }
    
    params.append('l', 'map');
    params.append('lang', 'ru_RU');
    
    return `${baseUrl}?${params.toString()}`;
  };

  const mapSrc = buildMapUrl(selectedPlace);

  return (
    <div className="map-section-wrapper" id="map-section" style={{ scrollMarginTop: '100px' }}>
      <div className="map-header">
        <div className="map-header-title">
          <Sparkles className="map-title-icon" size={20} />
          <h2>Интерактивная карта района</h2>
        </div>
        {!yandexApiKey && (
          <div className="map-alert-hint">
            <AlertCircle size={14} />
            <span>Карта работает в режиме схемы. Добавьте API-ключ в админке для полной функциональности.</span>
          </div>
        )}
        <p className="map-subtitle">
          Нажмите на место в списке или спросите чат — карта сразу покажет нужную точку.
        </p>
      </div>

      <div className="map-filters">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-tab ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key)}
            style={key !== 'all' ? { '--category-color': getMarkerColor(key) } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="map-layout">
        <div className="map-container-outer">
          <iframe
            key={mapSrc}
            src={mapSrc}
            className="yandex-map-container"
            allowFullScreen
            title="Карта города Московского"
            style={{ border: 'none', width: '100%', height: '100%', borderRadius: '12px', display: 'block' }}
          />
          {selectedPlace && (
            <div className="map-place-overlay">
              <img src={selectedPlace.photo} alt={selectedPlace.title} className="overlay-img" />
              <div className="overlay-info">
                <strong>{selectedPlace.title}</strong>
                <span>📍 {selectedPlace.address}</span>
                <span style={{ color: getMarkerColor(selectedPlace.category), fontSize: '0.75rem' }}>
                  {getCategoryRu(selectedPlace.category)}
                </span>
              </div>
              <button className="overlay-close" onClick={() => onSelectPlace(null)}>×</button>
            </div>
          )}
        </div>

        <div className="map-sidebar">
          <div className="sidebar-header">
            <h3>Каталог мест ({filteredPlaces.length})</h3>
          </div>
          <div className="places-list">
            {filteredPlaces.map((place) => {
              const isActive = selectedPlaceId === place.id;
              const color = getMarkerColor(place.category);
              return (
                <div
                  key={place.id}
                  className={`place-card ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectPlace(place.id)}
                  style={{ borderLeftColor: color }}
                >
                  <div className="place-card-img-container">
                    <img src={place.photo} alt={place.title} className="place-card-img" />
                    <span className="place-card-tag" style={{ backgroundColor: color }}>
                      {getCategoryRu(place.category)}
                    </span>
                  </div>
                  <div className="place-card-content">
                    <h4 className="place-card-title">{place.title}</h4>
                    <div className="place-card-meta">
                      <span className="place-rating">
                        <Star size={12} className="star-icon" />
                        {place.rating}
                      </span>
                      <span className="place-address">{place.address}</span>
                    </div>
                    <p className="place-desc-trim">
                      {place.description.substring(0, 90)}...
                    </p>
                    <div className="place-card-actions">
                      <span className="view-link">
                        <Eye size={12} />
                        Показать на карте
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
