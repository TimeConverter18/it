import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Key, Shield, Info, ArrowLeft, Check, Compass } from 'lucide-react';

const DEFAULT_SYSTEM_INSTRUCTION = `Ты — дружелюбный и экспертный ИИ-помощник для жителей и новоселов района Град Московский (город Московский) в Новой Москве.
Твоя цель — помогать новоселам быстро освоиться, рассказывать про инфраструктуру, транспорт, интересные места, школы, поликлиники и где можно вкусно поесть.

Сведения о районе город Московский для твоих ответов:
1. Транспорт: Ближайшее метро — «Филатов Луг» (Сокольническая линия). До него ходит автобус 189 по выделенной полосе за 7-10 минут. Также недалеко метро «Саларьево» и «Рассказовка» (Солнцевская линия). Удобный выезд на Киевское шоссе.
2. Микрорайоны: 1-й (исторический центр), 3-й, 4-й, Град Московский (5-й мкрн, самый густонаселенный), Первый Московский Город-Парк.
3. Торговля и досуг: ТРЦ «Новомосковский» (кинотеатр, фудкорт, магазины), множество супермаркетов (Перекресток, ВкусВилл, Пятерочка). ДК «Московский» — культурное сердце района с фонтанами.
4. Спорт: Спортивный комплекс «Московский» с большим стадионом и бассейном.
5. Парки: Район окружен Ульяновским и Валуевским лесопарками. Внутри района есть благоустроенный парк «Град Московский».
6. Образование: Отличные школы, включая флагманскую Школу № 2065 с несколькими корпусами.
7. Религия: Храм святителя Тихона (красивый деревянный храм в 1-м микрорайоне).

КРИТИЧЕСКИ ВАЖНОЕ ПРАВИЛО:
Если пользователь спрашивает про конкретное место из списка ниже, или ты рекомендуешь его, ты ОБЯЗАН в самом конце своего сообщения добавить специальный тег в формате [HIGHLIGHT_MARKER: id_маркера].

Список маркеров и их ID:
- ТРЦ «Новомосковский» -> [HIGHLIGHT_MARKER: novomoskovsky]
- Парк «Град Московский» -> [HIGHLIGHT_MARKER: grad_park]
- Спорткомплекс «Московский» -> [HIGHLIGHT_MARKER: sport_complex]
- Храм святителя Тихона -> [HIGHLIGHT_MARKER: tikhon_church]
- ДК «Московский» / Центральная площадь / Библиотека №259 -> [HIGHLIGHT_MARKER: dk_moskovsky]
- Эко-тропа (Ульяновский лесопарк) -> [HIGHLIGHT_MARKER: ulyanovsky_forest]
- Додо Пицца -> [HIGHLIGHT_MARKER: dodo_pizza]
- Школа №2065 (3-й микрорайон) -> [HIGHLIGHT_MARKER: school_2065_3]
- Метро Филатов Луг -> [HIGHLIGHT_MARKER: metro_filatov_lug]
- Стадион Московский -> [HIGHLIGHT_MARKER: stadium_moskovsky]
- Парк «Филатов луг» -> [HIGHLIGHT_MARKER: park_filatov_lug]
- Храм Георгия Победоносца -> [HIGHLIGHT_MARKER: georg_church]
- ТЦ «Столица» -> [HIGHLIGHT_MARKER: tc_stolica]

ПРИМЕЧАНИЕ ДЛЯ МОДЕЛИ: 
Поскольку ДК «Московский» (dk_moskovsky), Библиотека №259 (biblioteka) и Центральная площадь (central_square) находятся по одному адресу и фактически представляют собой единый культурно-досуговый кластер, при упоминании любого из этих трех объектов используй маркер [HIGHLIGHT_MARKER: dk_moskovsky].

Примеры:
- Если спрашивают: "где тут можно поесть пиццу?", ответь дружелюбно про Додо Пиццу и в самом конце сообщения добавь [HIGHLIGHT_MARKER: dodo_pizza].
- Если спрашивают про спорт: "где тут поплавать?", расскажи про Спортивный комплекс 'Московский' (бассейн) и в конце добавь [HIGHLIGHT_MARKER: sport_complex].
- Если спрашивают "какие парки есть?", расскажи про парк Град Московский и Ульяновский лесопарк, и добавь в конце [HIGHLIGHT_MARKER: grad_park].

Общайся уважительно, тепло, как гостеприимный сосед.`;

export default function AdminSection({ onBack }) {
  const [apiKey, setApiKey] = useState('');
  const [yandexApiKey, setYandexApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    // Load config from localStorage
    const savedKey = localStorage.getItem('proxy_api_key') || '';
    const savedYandexKey = localStorage.getItem('yandex_maps_api_key') || '';
    const savedModel = localStorage.getItem('proxy_model') || 'gpt-4o-mini';
    const savedInstruction = localStorage.getItem('proxy_system_instruction') || DEFAULT_SYSTEM_INSTRUCTION;

    setApiKey(savedKey);
    setYandexApiKey(savedYandexKey);
    setModel(savedModel);
    setSystemInstruction(savedInstruction);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('proxy_api_key', apiKey.trim());
    localStorage.setItem('yandex_maps_api_key', yandexApiKey.trim());
    localStorage.setItem('proxy_model', model);
    localStorage.setItem('proxy_system_instruction', systemInstruction);

    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const handleResetInstruction = () => {
    if (window.confirm('Вы уверены, что хотите сбросить инструкцию к стандартной?')) {
      setSystemInstruction(DEFAULT_SYSTEM_INSTRUCTION);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="back-btn" onClick={onBack} title="Вернуться на главную">
          <ArrowLeft size={20} />
          <span>На главную</span>
        </button>
        <div className="admin-title-group">
          <Shield size={24} className="accent-color" />
          <h2>Панель администратора</h2>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card main-settings">
          <h3>Настройки</h3>
          <p className="card-subtitle">
            Всё хранится локально в вашем браузере — никуда не передаётся.
          </p>

          <form onSubmit={handleSave} className="admin-form">
            <div className="form-group">
              <label htmlFor="apiKey">
                <Key size={16} />
                <span>API Ключ ProxyAPI (OpenAI)</span>
              </label>
              <input
                id="apiKey"
                type="password"
                placeholder="api-key-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="form-input"
              />
              <span className="input-hint">
                Получите на <a href="https://proxyapi.ru" target="_blank" rel="noreferrer" className="link">proxyapi.ru</a>. Без ключа — работает демо-режим.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="yandexApiKey">
                <Compass size={16} />
                <span>API Ключ Яндекс Карт (необязательно)</span>
              </label>
              <input
                id="yandexApiKey"
                type="text"
                placeholder="Ключ JavaScript API..."
                value={yandexApiKey}
                onChange={(e) => setYandexApiKey(e.target.value)}
                className="form-input"
              />
              <span className="input-hint">
                Нужен для полноценной Яндекс Карты. Без него показывается схема района.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="model">Модель нейросети</label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="form-select"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Быстрая и экономичная - Рекомендуется)</option>
                <option value="gpt-4o">gpt-4o (Более умная, детальные ответы)</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              </select>
            </div>

            <div className="form-group">
              <div className="label-with-action">
                <label htmlFor="instruction">Инструкция (System Prompt) для ИИ</label>
                <button
                  type="button"
                  onClick={handleResetInstruction}
                  className="reset-btn-inline"
                  title="Восстановить исходный текст"
                >
                  <RefreshCw size={12} />
                  <span>Сбросить</span>
                </button>
              </div>
              <textarea
                id="instruction"
                rows={14}
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                className="form-textarea"
                placeholder="Введите системный промпт для настройки роли искусственного интеллекта..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <Save size={18} />
                <span>Сохранить настройки</span>
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card info-sidebar">
          <h3>Как это работает</h3>
          <div className="info-step">
            <div className="step-num">1</div>
            <div>
              <h4>Карта + чат</h4>
              <p>
                Когда ИИ упоминает место, чат добавляет тег <code>[HIGHLIGHT_MARKER: id]</code> — карта сразу фокусируется на нём.
              </p>
            </div>
          </div>

          <div className="info-step">
            <div className="step-num">2</div>
            <div>
              <h4>Демо без ключа</h4>
              <p>
                Без API-ключа чат отвечает по ключевым словам — всё равно можно потрогать карту.
              </p>
            </div>
          </div>

          <div className="info-step">
            <div className="step-num">3</div>
            <div>
              <h4>Конфиденциальность</h4>
              <p>
                Ключ никуда не сохраняется, кроме вашего браузера.
              </p>
            </div>
          </div>

          <div className="admin-status-box">
            <div className="status-indicator active"></div>
            <span>Статус приложения: Готово к работе</span>
          </div>
        </div>
      </div>

      {showSavedToast && (
        <div className="toast saved-toast">
          <Check size={18} />
          <span>Настройки успешно сохранены!</span>
        </div>
      )}
    </div>
  );
}
