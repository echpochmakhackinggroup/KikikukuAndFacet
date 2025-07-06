// Firebase конфигурация
// Используем переменные окружения для безопасности
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "sait-s-vitoi.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sait-s-vitoi-default-rtdb.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "sait-s-vitoi",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "sait-s-vitoi.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "182870319147",
    appId: process.env.FIREBASE_APP_ID || "1:182870319147:web:2b4301d6c2232c8bed4a6e",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-3T12739LZB"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Получение ссылки на Realtime Database
const db = firebase.database();

console.log('Firebase Realtime Database инициализирован! 🔥'); 