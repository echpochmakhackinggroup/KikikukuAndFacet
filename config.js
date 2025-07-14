// Конфигурация Firebase
// Измените эти настройки для подключения к другой базе данных

// Функция для получения конфигурации Firebase из localStorage или возврата пустой конфигурации
function getFirebaseConfig() {
  const savedConfig = localStorage.getItem('firebaseConfig');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (error) {
      console.error('Ошибка парсинга сохраненной конфигурации:', error);
    }
  }
  
  // Возвращаем пустую конфигурацию по умолчанию
  return {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };
}

// Функция для сохранения конфигурации в localStorage
function saveFirebaseConfig(config) {
  localStorage.setItem('firebaseConfig', JSON.stringify(config));
}

// Функция для проверки, настроена ли база данных
function isDatabaseConfigured() {
  const config = getFirebaseConfig();
  return config.apiKey && config.projectId && config.authDomain;
}

// Получаем текущую конфигурацию
const FIREBASE_CONFIG = getFirebaseConfig();

// Настройки приложения
const APP_CONFIG = {
  // Названия коллекций в Firestore
  collections: {
    comments: 'comments',
    messages: 'messages',
    avatars: 'avatarka',
    users: 'customUsers',
    news: 'news'
  },
  
  // Настройки чата
  chat: {
    maxMessages: 200,
    maxComments: 100,
    refreshInterval: 3000 // миллисекунды
  },
  
  // Настройки аватарок
  avatar: {
    defaultSize: 32,
    previewSize: 192,
    colors: {
      R: '#ff4444', // Red
      G: '#44ff44', // Green
      B: '#4444ff', // Blue
      Y: '#ffff44', // Yellow
      P: '#ff44ff', // Purple
      C: '#44ffff', // Cyan
      O: '#ff8844', // Orange
      W: '#ffffff', // White
      K: '#000000'  // Black
    },
    shapes: {
      S: 'square',    // Square
      C: 'circle',    // Circle
      D: 'diamond'    // Diamond
    }
  },
  
  // Настройки уведомлений
  notifications: {
    defaultDuration: 4000,
    successDuration: 3000,
    errorDuration: 5000
  }
};

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FIREBASE_CONFIG, APP_CONFIG, getFirebaseConfig, saveFirebaseConfig, isDatabaseConfigured };
} 