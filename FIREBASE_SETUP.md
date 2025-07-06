# 🔥 Настройка Firebase Realtime Database для формы обратной связи

**Примечание:** Этот проект использует Firebase Realtime Database вместо Firestore. 
Для актуальных инструкций смотрите `REALTIME_DATABASE_SETUP.md`

## Пошаговая инструкция

### 1. Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите **"Создать проект"**
3. Введите название проекта (например: `responsive-gsap-website`)
4. Отключите Google Analytics (опционально)
5. Нажмите **"Создать проект"**

### 2. Настройка Firestore Database

1. В левом меню выберите **"Firestore Database"**
2. Нажмите **"Создать базу данных"**
3. Выберите **"Начать в тестовом режиме"** (для разработки)
4. Выберите ближайший регион (например: `europe-west3`)
5. Нажмите **"Готово"**

### 3. Получение конфигурации

1. В левом меню выберите **"Настройки проекта"** (шестеренка)
2. Прокрутите вниз до раздела **"Ваши приложения"**
3. Нажмите **"Добавить приложение"** → **"Веб"**
4. Введите название приложения (например: `website`)
5. Нажмите **"Зарегистрировать приложение"**
6. Скопируйте конфигурацию (объект `firebaseConfig`)

### 4. Обновление конфигурации

Замените содержимое файла `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "ваш-api-key",
    authDomain: "ваш-project-id.firebaseapp.com",
    projectId: "ваш-project-id",
    storageBucket: "ваш-project-id.appspot.com",
    messagingSenderId: "ваш-messaging-sender-id",
    appId: "ваш-app-id"
};
```

### 5. Настройка правил безопасности Firestore

В Firebase Console → Firestore Database → Правила:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешаем запись в коллекцию contacts
    match /contacts/{document} {
      allow write: if true;  // Разрешаем всем писать
      allow read: if false;  // Запрещаем читать (только админ)
    }
  }
}
```

### 6. Тестирование

1. Откройте сайт в браузере
2. Заполните форму "Свяжитесь с нами"
3. Отправьте сообщение
4. Проверьте в Firebase Console → Firestore Database, что данные появились

## 📁 Структура данных

Сообщения сохраняются в коллекцию `contacts` со структурой:

```javascript
{
  name: "Имя пользователя",
  email: "email@example.com", 
  message: "Текст сообщения",
  timestamp: "2025-01-XX..." // Автоматически
}
```

## 🔒 Безопасность

### Для продакшена рекомендуется:

1. **Ограничить доступ по домену:**
```javascript
allow write: if request.auth != null || 
  request.origin.matches('https://yourdomain.com');
```

2. **Добавить валидацию:**
```javascript
allow write: if request.resource.data.name.size() > 0 &&
  request.resource.data.email.matches('.*@.*') &&
  request.resource.data.message.size() > 10;
```

3. **Ограничить количество запросов:**
```javascript
allow write: if request.time < timestamp.date(2025, 12, 31);
```

## 🚀 Развертывание

После настройки Firebase:

1. Обновите конфигурацию в `firebase-config.js`
2. Закоммитьте изменения:
```bash
git add .
git commit -m "Add Firebase integration for contact form"
git push origin main
```

3. Сайт автоматически обновится на GitHub Pages

## 📧 Уведомления (опционально)

Для получения уведомлений о новых сообщениях:

1. В Firebase Console → Functions
2. Создайте Cloud Function для отправки email
3. Или используйте Zapier/IFTTT для интеграции

## 🎯 Готово!

Теперь форма "Свяжитесь с нами" будет сохранять сообщения в Firebase Firestore!

---

**Примечание:** Не забудьте обновить конфигурацию Firebase перед использованием! 🔥 