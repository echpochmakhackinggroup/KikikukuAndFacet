# 🚀 Размещение сайта на GitHub Pages

## Пошаговая инструкция

### 1. Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите кнопку **"New"** или **"+"** → **"New repository"**
3. Заполните форму:
   - **Repository name**: `responsive-gsap-website` (или любое другое название)
   - **Description**: `Адаптивный сайт с GSAP анимациями`
   - Выберите **Public** (для бесплатного GitHub Pages)
   - **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
4. Нажмите **"Create repository"**

### 2. Подключение локального репозитория к GitHub

После создания репозитория, GitHub покажет команды. Выполните их в терминале:

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваше имя пользователя)
git remote add origin https://github.com/YOUR_USERNAME/responsive-gsap-website.git

# Переименуйте основную ветку в main (если нужно)
git branch -M main

# Отправьте код на GitHub
git push -u origin main
```

### 3. Настройка GitHub Pages

1. Перейдите в ваш репозиторий на GitHub
2. Нажмите на вкладку **"Settings"**
3. Прокрутите вниз до раздела **"Pages"** (в левом меню)
4. В разделе **"Source"** выберите:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Нажмите **"Save"**

### 4. Проверка работы

Через несколько минут ваш сайт будет доступен по адресу:
```
https://YOUR_USERNAME.github.io/responsive-gsap-website/
```

## 🔧 Дополнительные настройки

### Настройка доменного имени (опционально)

Если у вас есть собственный домен:

1. В настройках Pages добавьте ваш домен в поле **"Custom domain"**
2. Создайте файл `CNAME` в корне репозитория с вашим доменом
3. Добавьте и закоммитьте файл:

```bash
echo "your-domain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

### Настройка HTTPS (автоматически)

GitHub Pages автоматически предоставляет SSL сертификат для вашего сайта.

## 📝 Обновление сайта

Для обновления сайта после изменений:

```bash
# Добавьте изменения
git add .

# Создайте коммит
git commit -m "Update website content"

# Отправьте на GitHub
git push origin main
```

GitHub Pages автоматически обновит сайт через несколько минут.

## 🎯 Полезные ссылки

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Troubleshooting](https://docs.github.com/en/pages/troubleshooting)

## 🚨 Важные моменты

1. **Публичный репозиторий** - для бесплатного GitHub Pages
2. **Имя пользователя** - замените `YOUR_USERNAME` на ваше реальное имя пользователя GitHub
3. **Время развертывания** - обычно 1-5 минут после push
4. **Кэширование** - может потребоваться очистка кэша браузера

---

**Готово! Ваш адаптивный сайт с GSAP анимациями теперь доступен в интернете! 🌐** 