# 🔒 Безопасность Firebase

## ⚠️ Важно: API ключи Firebase

**НИКОГДА не публикуйте API ключи Firebase в публичных репозиториях!**

## 🚨 Проблема

API ключи Firebase в публичном коде могут быть использованы злоумышленниками для:
- Превышения лимитов использования
- Несанкционированного доступа к данным
- Дополнительных расходов на ваш аккаунт

## 🔧 Решение

### 1. Для локальной разработки

Создайте файл `.env` в корне проекта:

```bash
# Скопируйте .env.example в .env
cp .env.example .env
```

Заполните `.env` вашими реальными данными:

```env
FIREBASE_API_KEY=ваш-api-key
FIREBASE_AUTH_DOMAIN=ваш-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://ваш-project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=ваш-project-id
FIREBASE_STORAGE_BUCKET=ваш-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=ваш-sender-id
FIREBASE_APP_ID=ваш-app-id
FIREBASE_MEASUREMENT_ID=ваш-measurement-id
```

### 2. Для GitHub Pages

Поскольку GitHub Pages не поддерживает переменные окружения, используйте:

#### Вариант A: Ограничение доступа по домену

В Firebase Console → Realtime Database → Правила:

```json
{
  "rules": {
    "contacts": {
      ".read": false,
      ".write": "auth != null || request.origin.matches('https://echpochmakhackinggroup.github.io')"
    }
  }
}
```

#### Вариант B: Создание отдельного проекта для продакшена

1. Создайте новый проект Firebase для продакшена
2. Используйте разные конфигурации для разработки и продакшена

### 3. Для продакшена

#### Ограничение по домену:
```json
{
  "rules": {
    "contacts": {
      ".read": false,
      ".write": "request.origin.matches('https://yourdomain.com')"
    }
  }
}
```

#### Ограничение по количеству запросов:
```json
{
  "rules": {
    "contacts": {
      ".read": false,
      ".write": "newData.hasChildren(['name', 'email', 'message']) && 
                 newData.child('name').val().size() > 0 &&
                 newData.child('email').val().matches(/.*@.*/) &&
                 newData.child('message').val().size() > 10"
    }
  }
}
```

## 🛡️ Дополнительные меры безопасности

### 1. Мониторинг использования

- Регулярно проверяйте использование в Firebase Console
- Настройте уведомления о превышении лимитов
- Мониторьте подозрительную активность

### 2. Ротация ключей

- Периодически обновляйте API ключи
- Используйте разные ключи для разных сред

### 3. Ограничение функциональности

- Отключите неиспользуемые сервисы Firebase
- Используйте минимальные права доступа

## 📋 Чек-лист безопасности

- [ ] API ключи не в публичном коде
- [ ] Правила безопасности настроены
- [ ] Ограничения по домену установлены
- [ ] Мониторинг использования включен
- [ ] Резервные копии настроены

## 🆘 Если ключ скомпрометирован

1. **Немедленно** отключите ключ в Firebase Console
2. Создайте новый ключ
3. Обновите все приложения
4. Проверьте логи на подозрительную активность

---

**Помните: Безопасность прежде всего! 🔒** 