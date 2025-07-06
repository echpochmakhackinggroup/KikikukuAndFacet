// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyA0SHaJ4MoO50Vx1u59gPpmXer5bNjBdZk",
    authDomain: "sait-s-vitoi.firebaseapp.com",
    databaseURL: "https://sait-s-vitoi-default-rtdb.firebaseio.com",
    projectId: "sait-s-vitoi",
    storageBucket: "sait-s-vitoi.firebasestorage.app",
    messagingSenderId: "182870319147",
    appId: "1:182870319147:web:2b4301d6c2232c8bed4a6e",
    measurementId: "G-3T12739LZB"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Получение ссылки на Realtime Database
const db = firebase.database();

console.log('Firebase Realtime Database инициализирован! 🔥'); 