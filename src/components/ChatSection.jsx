import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MessageSquare, AlertCircle, Compass, HelpCircle, Loader2, MapPin } from 'lucide-react';
import { PLACES } from '../data/places';

// Smart local fallback responses for beautiful testing without API key
const getMockResponse = (query) => {
  const q = query.toLowerCase();
  
  if (q.includes('пицц') || q.includes('поесть') || q.includes('еда') || q.includes('кафе') || q.includes('ресторан') || q.includes('голод')) {
    return {
      text: "В Московском есть отличные варианты! Самым популярным местом для отдыха всей семьей является **Додо Пицца** (расположена в районе Хабарова). Там панорамные окна, свежайшая пицца и очень уютно. \n\nТакже большой выбор ресторанчиков и фудкорт расположены в **ТРЦ «Новомосковский»**. \n\nКакое заведение вас интересует подробнее?",
      marker: "dodo_pizza"
    };
  }
  
  if (q.includes('парк') || q.includes('лес') || q.includes('гулять') || q.includes('природ') || q.includes('дерев')) {
    return {
      text: "Город Московский окружен великолепными зелеными зонами! \n\n1. **Парк «Град Московский»** — идеален для прогулок с детьми, катания на велосипедах и отдыха. Он полностью благоустроен, есть шезлонги и воркаут-площадки. \n2. **Ульяновский лесопарк** — огромный лесной массив для любителей дикой природы, пробежек по эко-тропам или зимних лыжных прогулок.\n\nЯ нашел для вас парк «Град Московский», вы можете посмотреть его на карте!",
      marker: "grad_park"
    };
  }
  
  if (q.includes('спорт') || q.includes('бассейн') || q.includes('плава') || q.includes('стадион') || q.includes('зал') || q.includes('фитнес')) {
    return {
      text: "Для занятий спортом в Московском созданы великолепные условия. Главным объектом является **Спортивный комплекс «Московский»**. \n\nВ нем есть бассейн олимпийского стандарта, современный тренажерный зал, легкоатлетический манеж и открытый стадион с искусственным подогреваемым газоном. Здесь тренируются как профессиональные команды, так и работают детские секции.",
      marker: "sport_complex"
    };
  }

  if (q.includes('шопинг') || q.includes('тц') || q.includes('центр') || q.includes('покупк') || q.includes('магазин') || q.includes('кино')) {
    return {
      text: "За покупками и развлечениями отправляйтесь в **ТРЦ «Новомосковский»** на улице Хабарова. Это центральный торгово-развлекательный хаб района. \n\nВнутри вас ждут десятки популярных магазинов одежды, супермаркет «Перекресток», современный кинотеатр, детские развлекательные площадки и большой фудкорт.",
      marker: "novomoskovsky"
    };
  }

  if (q.includes('храм') || q.includes('церков') || q.includes('тихон')) {
    return {
      text: "Главной духовной достопримечательностью является **Храм святителя Тихона** в 1-м микрорайоне. Это невероятной красоты деревянный храм с живописной ухоженной прилегающей территорией. \n\nТам есть декоративный пруд, альпийские горки и множество лавочек для тихого уединенного созерцания.",
      marker: "tikhon_church"
    };
  }

  if (q.includes('школ') || q.includes('учеб') || q.includes('дети') || q.includes('образован') || q.includes('2065')) {
    return {
      text: "В Московском очень сильная образовательная база. Флагманом является **Школа № 2065 (Корпус 1)** в 3-м микрорайоне. \n\nОна оснащена передовыми IT- и инженерными лабораториями, медицинскими классами и имеет сильный педагогический состав. Это отличный выбор для качественного развития ваших детей.",
      marker: "school_2065"
    };
  }

  if (q.includes('дк') || q.includes('площад') || q.includes('культур') || q.includes('праздник') || q.includes('фонтан')) {
    return {
      text: "Главное общественное и культурное пространство района — это **ДК «Московский» и его Центральная площадь** с фонтанами. \n\nВ ДК проходят спектакли, работают творческие кружки, а на площади проводятся все праздничные гуляния, концерты и новогодние ярмарки.",
      marker: "dk_moskovsky"
    };
  }

  if (q.includes('метро') || q.includes('автобус') || q.includes('транспорт') || q.includes('доехать') || q.includes('киевск')) {
    return {
      text: "Транспортная доступность Московского отличная! Ближайшая станция метро — **«Филатов Луг»** (красная линия). \n\nТуда проложена специальная выделенная полоса для автобусов, поэтому экспресс-автобус №189 долетает до метро всего за 7-10 минут! Также можно добраться на самокате или велосипеде по благоустроенной дорожке через лесопарк. Дополнительно рядом есть метро «Саларьево» и «Рассказовка».",
      marker: "ulyanovsky_forest"
    };
  }

  return {
    text: "Привет! Я с радостью подскажу вам всё о городе Московском. Я могу рассказать про парки, школы, транспорт, торговые центры, спортивные комплексы и лучшие места, где можно поесть. \n\nСпросите меня о чем-нибудь конкретном, например: *«Где тут можно погулять?»* или *«Где находится бассейн?»*",
    marker: null
  };
};

const SUGGESTED_QUESTIONS = [
  { text: "🍕 Где вкусно поесть пиццу?", label: "Где поесть" },
  { text: "🏊 Где тут поплавать и заняться спортом?", label: "Бассейн и спорт" },
  { text: "🌳 Расскажи про парки района", label: "Парки и леса" },
  { text: "🚇 Как быстрее доехать до метро?", label: "Транспорт и метро" }
];

export default function ChatSection({ onTriggerMarker }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Привет! 👋 Меня зовут NAVI — я знаю всё о городе Московском.\n\nСпросите про парки, кафе, транспорт, школы или просто «что тут вообще есть?» — и я смогу показать подходящие места на карте 👇"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const messagesEndRef = useRef(null);

  // Check if API key exists to set mode
  useEffect(() => {
    const key = localStorage.getItem('proxy_api_key');
    setIsDemoMode(!key);
  }, []);

  const scrollToBottom = () => {
    // We only scroll within the message area, NOT the whole window
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Main function to parse marker IDs from message text
  const parseMarkers = (text) => {
    // Look for [HIGHLIGHT_MARKER: id] tag
    const regex = /\[HIGHLIGHT_MARKER:\s*([a-zA-Z0-9_-]+)\]/;
    const match = text.match(regex);
    if (match && match[1]) {
      const markerId = match[1];
      // Clean up the text by removing the tag
      return {
        content: text.replace(regex, '').trim(),
        markerId: markerId
      };
    }
    return { content: text, markerId: null };
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const apiKey = localStorage.getItem('proxy_api_key');
    const systemInstruction = localStorage.getItem('proxy_system_instruction') || "Ты — виртуальный ИИ-гид по району город Московский.";
    const model = localStorage.getItem('proxy_model') || 'gpt-4o-mini';

    if (!apiKey) {
      // 1. DEMO MODE: Smart keyword answers
      setTimeout(() => {
        const mockResult = getMockResponse(textToSend);
        let textWithTag = mockResult.text;
        
        // Add the system prompt highlight marker tag if applicable
        if (mockResult.marker) {
          textWithTag += ` \n\n[HIGHLIGHT_MARKER: ${mockResult.marker}]`;
        }

        // Parse
        const { content, markerId } = parseMarkers(textWithTag);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: content,
            markerId: markerId
          }
        ]);
        setIsLoading(false);
      }, 1200);
    } else {
      // 2. PROD MODE: ProxyAPI call
      try {
        // Construct standard message history
        const apiMessages = [
          { role: 'system', content: systemInstruction },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: textToSend }
        ];

        const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: model,
            messages: apiMessages,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        const rawReply = data.choices[0].message.content;
        
        // Parse the raw response
        const { content, markerId } = parseMarkers(rawReply);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: content,
            markerId: markerId
          }
        ]);
      } catch (error) {
        console.error('API Error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `⚠️ **Произошла ошибка при обращении к ИИ:** ${error.message}. \n\nПроверьте ваш API-ключ в настройках админки или переключитесь на демонстрационный режим, стерев ключ.`,
            isError: true
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleShowOnMap = (markerId) => {
    onTriggerMarker(markerId);
    // Explicitly scroll to the map section
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <Sparkles className="sparkles-icon" size={18} />
          </div>
          <div>
            <h3>ИИ-Сосед</h3>
            <div className="chat-status">
              <span className={`status-dot ${isDemoMode ? 'demo' : 'online'}`} />
              <span className="status-text">
                {isDemoMode ? 'Демо' : 'Онлайн'}
              </span>
            </div>
          </div>
        </div>
        
        {isDemoMode && (
          <div className="demo-badge-tooltip" title="Работает локально по ключевым словам. Добавьте API-ключ через #/admin для полноценного ИИ.">
            <AlertCircle size={14} />
            <span>Без API</span>
          </div>
        )}
      </div>

      {/* Message Area */}
      <div className="messages-area">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';
          return (
            <div 
              key={message.id} 
              className={`message-wrapper ${isAssistant ? 'assistant' : 'user'} ${message.isError ? 'error-msg' : ''}`}
            >
              <div className="message-icon-wrapper">
                {isAssistant ? (
                  <Compass size={16} className="ai-icon" />
                ) : (
                  <User size={16} className="user-icon" />
                )}
              </div>
              <div className="message-bubble">
                {/* Parse Markdown-like bold and linebreaks */}
                <div className="message-text">
                  {message.content.split('\n').map((line, i) => {
                    // Simple replacement for bold text (**text**)
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i}>
                        {parts.map((part, index) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
                
                {isAssistant && message.markerId && (
                  <button 
                    className="show-on-map-btn"
                    onClick={() => handleShowOnMap(message.markerId)}
                  >
                    <MapPin size={14} />
                    <span>На карте</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="message-wrapper assistant loading">
            <div className="message-icon-wrapper">
              <Compass size={16} className="ai-icon spin-slow" />
            </div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && !isLoading && (
        <div className="suggested-container">
          <span className="suggested-title">✨ Спросите например:</span>
          <div className="suggested-list">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button 
                key={idx} 
                className="suggested-btn"
                onClick={() => handleSendMessage(q.text)}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="chat-input-form">
        <input
          type="text"
          placeholder="Спросите ИИ о районе (например: «где тут парк?»)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isLoading} 
          className="chat-send-btn"
          title="Отправить сообщение"
        >
          {isLoading ? <Loader2 className="spinner" size={18} /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}
