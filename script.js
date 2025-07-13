// Инициализация GSAP плагинов
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// === Avatar System ===
// Цвета для аватарок
const avatarColors = {
  R: '#ff4444', // Red
  G: '#44ff44', // Green
  B: '#4444ff', // Blue
  Y: '#ffff44', // Yellow
  P: '#ff44ff', // Purple
  C: '#44ffff', // Cyan
  O: '#ff8844', // Orange
  W: '#ffffff', // White
  K: '#000000'  // Black
};

// Фигуры для аватарок
const avatarShapes = {
  S: 'square',    // Square
  C: 'circle',    // Circle
  D: 'diamond'    // Diamond
};

// Генерация случайного кода аватарки
function generateRandomAvatarCode() {
  const colors = Object.keys(avatarColors);
  const shapes = Object.keys(avatarShapes);
  
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color2 = colors[Math.floor(Math.random() * colors.length)];
  
  return `${color1}${shape}${color2}`;
}

// Получение или создание аватарки для пользователя
async function getUserAvatar(userUid) {
  try {
    // Проверяем, есть ли аватарка в базе
    const avatarDoc = await db.collection('avatarka').doc(userUid).get();
    
    if (avatarDoc.exists) {
      return avatarDoc.data().code;
    } else {
      // Создаем новую аватарку
      const newAvatarCode = generateRandomAvatarCode();
      
      await db.collection('avatarka').doc(userUid).set({
        code: newAvatarCode,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return newAvatarCode;
    }
  } catch (error) {
    console.error('Ошибка при получении аватарки:', error);
    return generateRandomAvatarCode(); // Возвращаем случайную аватарку в случае ошибки
  }
}

// Создание HTML элемента аватарки
function createAvatarElement(avatarCode, size = 32) {
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'user-avatar';
  
  // Определяем размеры в зависимости от устройства
  const isMobile = window.innerWidth <= 768;
  const isSmallScreen = window.innerWidth <= 480;
  const isVerySmallScreen = window.innerWidth <= 320;
  
  // Адаптируем размеры для мобильных устройств
  let actualSize = size;
  if (isVerySmallScreen && size > 80) {
    actualSize = 80;
  } else if (isSmallScreen && size > 96) {
    actualSize = 96;
  } else if (isMobile && size > 120) {
    actualSize = 120;
  }
  
  avatarDiv.style.cssText = `
    width: ${actualSize}px;
    height: ${actualSize}px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: ${actualSize * 0.4}px;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    margin-right: 8px;
    position: relative;
    overflow: hidden;
  `;
  
  // Парсим код аватарки (например: RSGB)
  const color1 = avatarCode[0];
  const shape = avatarCode[1];
  const color2 = avatarCode[2];
  
  // Проверяем валидность кода
  if (!avatarColors[color1] || !avatarShapes[shape] || !avatarColors[color2]) {
    console.warn('Неверный код аватарки:', avatarCode);
    // Возвращаем дефолтную аватарку
    return createAvatarElement('RSG', size);
  }
  
  // Устанавливаем фон
  avatarDiv.style.backgroundColor = avatarColors[color2] || '#666666';
  
  // Создаем фигуру
  const shapeElement = document.createElement('div');
  
  // Определяем размер фигуры - оптимальный размер для видимости
  const shapeSize = actualSize * 0.6; // Уменьшаем с 0.7 до 0.6 (60% от размера аватара)
  
  // Применяем форму
  switch (shape) {
    case 'S': // Square
      shapeElement.style.cssText = `
        width: ${shapeSize}px;
        height: ${shapeSize}px;
        background-color: ${avatarColors[color1]};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 0;
      `;
      shapeElement.setAttribute('data-shape', 'square');
      break;
    case 'C': // Circle
      shapeElement.style.cssText = `
        width: ${shapeSize}px;
        height: ${shapeSize}px;
        background-color: ${avatarColors[color1]};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
      `;
      shapeElement.setAttribute('data-shape', 'circle');
      break;

    case 'D': // Diamond
      shapeElement.style.cssText = `
        width: ${shapeSize}px;
        height: ${shapeSize}px;
        background-color: ${avatarColors[color1]};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        border-radius: 0;
      `;
      shapeElement.setAttribute('data-shape', 'diamond');
      break;
    default:
      // Дефолтная фигура - круг
      shapeElement.style.cssText = `
        width: ${shapeSize}px;
        height: ${shapeSize}px;
        background-color: ${avatarColors[color1]};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
      `;
      shapeElement.setAttribute('data-shape', 'circle');
  }
  
  avatarDiv.appendChild(shapeElement);
  return avatarDiv;
}

// Обновление аватарки в UI
async function updateUserAvatarInUI(userUid, container) {
  try {
    const avatarCode = await getUserAvatar(userUid);
    const avatarElement = createAvatarElement(avatarCode, 192); // Увеличиваем размер аватарки в 3 раза
    
    // Очищаем контейнер и добавляем аватарку
    container.innerHTML = '';
    container.appendChild(avatarElement);
    
  } catch (error) {
    console.error('Ошибка при обновлении аватарки в UI:', error);
  }
}

// Форматирование времени для отображения в чате
function formatMessageTime(date) {
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    // Сегодня - показываем только время
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diffInHours < 48) {
    // Вчера
    return 'Вчера';
  } else if (diffInHours < 168) {
    // На этой неделе - показываем день недели
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  } else {
    // Старые сообщения - показываем дату
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }
}

// Оптимизация для очень маленьких экранов
const isSmallScreen = window.innerWidth <= 320;
const isMobile = window.innerWidth <= 768;

// Отключаем некоторые анимации на очень маленьких экранах для производительности
if (isSmallScreen) {
    gsap.set('.hero__shape', { rotation: 0 });
}

// Анимация загрузки страницы
window.addEventListener('load', () => {
    // Анимация header
    gsap.from('.header', {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: 'power3.out'
    });

    // Анимация hero секции
    const heroTl = gsap.timeline();
    heroTl
        .from('.hero__title', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('.hero__subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.hero__btn', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.hero__shape', {
            duration: 1.5,
            scale: 0,
            rotation: 360,
            opacity: 0,
            ease: 'back.out(1.7)'
        }, '-=0.5');

    // Анимация формы hero
    gsap.to('.hero__shape', {
        duration: 3,
        rotation: 360,
        repeat: -1,
        ease: 'none'
    });
});

// Анимации при скролле (однократное проигрывание)
// About section
gsap.from('.about__text', {
    scrollTrigger: {
        trigger: '.about__text',
        start: 'top 80%',
        once: true
    },
    duration: 1,
    x: -100,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.about__stats', {
    scrollTrigger: {
        trigger: '.about__stats',
        start: 'top 80%',
        once: true
    },
    duration: 1,
    x: 100,
    opacity: 0,
    ease: 'power3.out'
});

// Stats animation
gsap.from('.stat', {
    scrollTrigger: {
        trigger: '.about__stats',
        start: 'top 80%',
        once: true
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
});

// Красивые анимации для карточек услуг
const serviceCards = document.querySelectorAll('.service__card');

// Анимация появления карточек с эффектом каскада
gsap.fromTo(serviceCards, 
    {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotationY: 45
    },
    {
        scrollTrigger: {
            trigger: '.services__grid',
            start: 'top 80%',
            once: true
        },
        y: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1.2,
        ease: 'back.out(1.7)',
        stagger: 0.2
    }
);

// Анимация иконок внутри карточек
gsap.fromTo('.service__icon', 
    {
        scale: 0,
        rotation: -180
    },
    {
        scrollTrigger: {
            trigger: '.services__grid',
            start: 'top 80%',
            once: true
        },
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.3,
        delay: 0.4
    }
);

// Анимация текста в карточках
gsap.fromTo('.service__card h3, .service__card p', 
    {
        y: 30,
        opacity: 0
    },
    {
        scrollTrigger: {
            trigger: '.services__grid',
            start: 'top 80%',
            once: true
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.6
    }
);

// Contact section
gsap.from('.contact__form', {
    scrollTrigger: {
        trigger: '.contact__form',
        start: 'top 80%',
        once: true
    },
    duration: 1,
    x: -100,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.contact__info', {
    scrollTrigger: {
        trigger: '.contact__info',
        start: 'top 80%',
        once: true
    },
    duration: 1,
    x: 100,
    opacity: 0,
    ease: 'power3.out'
});

// Section titles animation
gsap.from('.section__title', {
    scrollTrigger: {
        trigger: '.section__title',
        start: 'top 80%',
        once: true
    },
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

// Parallax effect для hero shape (только для больших экранов)
if (!isSmallScreen) {
    gsap.to('.hero__shape', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        rotation: 180,
        ease: 'none'
    });
}

// Анимация header при скролле и активная навигация
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.nav__menu a');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Скрытие/показ header
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скролл вниз
        gsap.to(header, {
            duration: 0.3,
            y: -100,
            ease: 'power3.out'
        });
    } else {
        // Скролл вверх
        gsap.to(header, {
            duration: 0.3,
            y: 0,
            ease: 'power3.out'
        });
    }
    
    // Активная навигация
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    lastScrollY = currentScrollY;
});

// Интерактивные анимации
// Hover эффекты для кнопок
document.querySelectorAll('.hero__btn, .contact__form button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            duration: 0.3,
            scale: 1.05,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// Модальные окна для карточек услуг и статистики
const modalTriggers = document.querySelectorAll('.service__card[data-modal], .stat[data-modal]');
const modals = document.querySelectorAll('.modal');
const modalCloses = document.querySelectorAll('.modal__close');

// Открытие модального окна
modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.getAttribute('data-modal');
        const modal = document.getElementById(`modal-${modalId}`);
        
        if (modal) {
            // Анимация элемента при клике
            gsap.to(trigger, {
                duration: 0.2,
                scale: 0.95,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(trigger, {
                        duration: 0.2,
                        scale: 1,
                        ease: 'power2.out'
                    });
                }
            });
            
            // Показываем модальное окно
            modal.style.display = 'flex';
            
            // Анимация появления в стиле Apple
            gsap.fromTo(modal, 
                { opacity: 0 },
                { 
                    opacity: 1, 
                    duration: 0.4,
                    ease: 'power3.out'
                }
            );
            
            gsap.fromTo(modal.querySelector('.modal__content'),
                { 
                    scale: 0.8, 
                    opacity: 0,
                    y: 30
                },
                { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    duration: 0.5,
                    ease: 'back.out(1.2)',
                    delay: 0.1
                }
            );
            
            // Блокируем скролл
            document.body.style.overflow = 'hidden';
        }
    });
});

// Закрытие модального окна
function closeModal(modal) {
    gsap.to(modal, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    gsap.to(modal.querySelector('.modal__content'), {
        scale: 0.8,
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: 'power2.out'
    });
}

// Обработчики закрытия
modalCloses.forEach(close => {
    close.addEventListener('click', () => {
        const modal = close.closest('.modal');
        closeModal(modal);
    });
});

// Закрытие по клику вне модального окна
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="display: flex"]');
        if (openModal) {
            closeModal(openModal);
        }
    }
});

// Hover эффекты для карточек услуг
document.querySelectorAll('.service__card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            y: -10,
            scale: 1.02,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// Hover эффекты для статистики (только для десктопа)
if (window.innerWidth > 768) {
    document.querySelectorAll('.stat').forEach(stat => {
        stat.addEventListener('mouseenter', () => {
            gsap.to(stat, {
                duration: 0.3,
                y: -5,
                scale: 1.05,
                ease: 'power2.out'
            });
        });
        
        stat.addEventListener('mouseleave', () => {
            gsap.to(stat, {
                duration: 0.3,
                y: 0,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });
}

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Закрываем мобильное меню если оно открыто
            const menu = document.querySelector('.nav__menu');
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                const spans = document.querySelectorAll('.nav__burger span');
                gsap.to(spans[0], { rotation: 0, y: 0 });
                gsap.to(spans[1], { opacity: 1 });
                gsap.to(spans[2], { rotation: 0, y: 0 });
            }
            
            // Плавная прокрутка к секции
            gsap.to(window, {
                duration: 1.2,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: 'power3.out'
            });
        }
    });
});

// Анимация счетчиков в статистике
const animateCounters = () => {
    document.querySelectorAll('.stat h3').forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 2;
        
        gsap.fromTo(counter, 
            { textContent: 0 },
            {
                textContent: target,
                duration: duration,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 80%',
                    once: true
                }
            }
        );
    });
};

// Динамически вычисляем количество дней опыта с 05.07.2025
(function updateExperienceDays() {
    function getDayWord(n) {
        n = Math.abs(n) % 100;
        const n1 = n % 10;
        if (n > 10 && n < 20) return 'дней';
        if (n1 > 1 && n1 < 5) return 'дня';
        if (n1 === 1) return 'день';
        return 'дней';
    }
    const experienceElem = document.getElementById('experience-days');
    const experienceModalElem = document.getElementById('experience-days-modal');
    const experienceWordElem = document.getElementById('experience-days-word');
    const experienceModalWordElem = document.getElementById('experience-days-modal-word');
    if (experienceElem || experienceModalElem) {
        const startDate = new Date(2025, 6, 5); // Месяцы с 0, июль = 6
        const today = new Date();
        startDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diffTime = today - startDate;
        const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
        if (experienceElem) experienceElem.textContent = diffDays;
        if (experienceModalElem) experienceModalElem.textContent = diffDays;
        const word = getDayWord(diffDays);
        if (experienceWordElem) experienceWordElem.textContent = word;
        if (experienceModalWordElem) experienceModalWordElem.textContent = word;
    }
})();

// Запуск анимации счетчиков
animateCounters();

// Мобильное меню (если нужно)
const burger = document.querySelector('.nav__burger');
const menu = document.querySelector('.nav__menu');

if (burger && menu) {
    let menuOpen = false;
    burger.addEventListener('click', () => {
        const spans = burger.querySelectorAll('span');
        if (!menuOpen) {
            menu.classList.add('active');
            gsap.fromTo(menu, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
            gsap.to(spans[0], { rotation: 45, y: 7 });
            gsap.to(spans[1], { opacity: 0 });
            gsap.to(spans[2], { rotation: -45, y: -7 });
        } else {
            gsap.to(menu, { y: -40, opacity: 0, duration: 0.3, ease: 'power3.in', onComplete: () => {
                menu.classList.remove('active');
                gsap.set(menu, { clearProps: 'all' });
            }});
            gsap.to(spans[0], { rotation: 0, y: 0 });
            gsap.to(spans[1], { opacity: 1 });
            gsap.to(spans[2], { rotation: 0, y: 0 });
        }
        menuOpen = !menuOpen;
    });

    // Закрытие меню при клике на пункт
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) {
                gsap.to(menu, { y: -40, opacity: 0, duration: 0.3, ease: 'power3.in', onComplete: () => {
                    menu.classList.remove('active');
                    gsap.set(menu, { clearProps: 'all' });
                    menuOpen = false;
                }});
                gsap.to(spans[0], { rotation: 0, y: 0 });
                gsap.to(spans[1], { opacity: 1 });
                gsap.to(spans[2], { rotation: 0, y: 0 });
            }
        });
    });
}

// Дополнительные эффекты
// Анимация при наведении на навигацию
document.querySelectorAll('.nav__menu a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            duration: 0.3,
            y: -2,
            ease: 'power2.out'
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            duration: 0.3,
            y: 0,
            ease: 'power2.out'
        });
    });
});

// Эффект параллакса для фона
gsap.to('.hero', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    backgroundPosition: '50% 100%',
    ease: 'none'
});

console.log('GSAP анимации загружены! 🎉');

// Динамически подставляем текущий год в футер
(function setCurrentYear() {
    const yearElem = document.getElementById('current-year');
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }
})();

// Открытие больших модальных окон-страниц
const bigModalBtns = document.querySelectorAll('.big-modal-btn');
bigModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        const modal = document.getElementById(`modal-${modalId}`);
        if (modal) {
            modal.style.display = 'flex';
            gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power3.out' });
            gsap.fromTo(modal.querySelector('.modal__content'),
                { scale: 0.95, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
            );
            document.body.style.overflow = 'hidden';
        }
    });
});

// --- Video Scrubbing Demo for modal-page1 ---
function setupVideoScrubbingModal() {
    const modal = document.getElementById('modal-page1');
    if (!modal) return;
    const video = modal.querySelector('#video-1');
    if (!video) return;

    // Скролл-обсервер
    function getScrollPercent() {
        const body = modal.querySelector('.modal__body');
        if (!body) return 0;
        const scrollTop = body.scrollTop;
        const scrollHeight = body.scrollHeight - body.clientHeight;
        return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    }

    let rafId = null;
    function onScroll() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const percent = getScrollPercent();
            if (video.duration) {
                const updateTimeTo = (video.duration / 100) * percent;
                if (Math.abs(video.currentTime - updateTimeTo) > 0.01) {
                    video.currentTime = updateTimeTo;
                }
            }
        });
    }

    // Сброс
    function cleanup() {
        const body = modal.querySelector('.modal__body');
        if (body) body.removeEventListener('scroll', onScroll);
    }

    // Инициализация
    video.currentTime = 0;
    video.pause();
    const body = modal.querySelector('.modal__body');
    if (body) body.addEventListener('scroll', onScroll);
    // Очищаем при закрытии
    const close = modal.querySelector('.modal__close');
    if (close) close.addEventListener('click', cleanup);
    modal.addEventListener('click', e => {
        if (e.target === modal) cleanup();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.style.display === 'flex') cleanup();
    });
}

// Автоинициализация при открытии модалки
const page1Btn = document.querySelector('.big-modal-btn[data-modal="page1"]');
if (page1Btn) {
    page1Btn.addEventListener('click', () => {
        setTimeout(setupVideoScrubbingModal, 300);
    });
}

// Динамическая смена фона секции #home (hero) по времени суток
function setHeroBackgroundByTime() {
    const hero = document.getElementById('home') || document.querySelector('.hero');
    if (!hero) return;
    const now = new Date();
    const hour = now.getHours();
    let bg, color;
    if (hour >= 6 && hour < 11) { // Утро
        bg = 'linear-gradient(135deg, #ffb347 0%, #ffcc80 100%)';
        color = '#fff';
    } else if (hour >= 11 && hour < 16) { // День
        bg = 'linear-gradient(135deg, #667eea 0%, #2563eb 100%)';
        color = '#fff';
    } else if (hour >= 16 && hour < 21) { // Вечер
        bg = 'linear-gradient(135deg, #ff9800 0%, #ffb347 100%)';
        color = '#fff';
    } else { // Ночь
        bg = 'linear-gradient(135deg, #232526 0%, #000000 100%)';
        color = '#fff';
    }
    gsap.to(hero, { background: bg, color: color, duration: 1.5, ease: 'power2.inOut' });
}
setHeroBackgroundByTime();
setInterval(setHeroBackgroundByTime, 60000);

// --- Кот в modal-page2 ---
(function setupCatModalPage2() {
    const page2Btn = document.querySelector('.big-modal-btn[data-modal="page2"]');
    if (!page2Btn) return;
    page2Btn.addEventListener('click', () => {
        setTimeout(() => {
            const btn = document.getElementById('show-cat-btn');
            const container = document.getElementById('cat-photo-container');
            if (!btn || !container) return;
            btn.onclick = async function() {
                btn.disabled = true;
                btn.textContent = 'Мяумяумяумяу';
                container.innerHTML = '';
                try {
                    const resp = await fetch('https://api.thecatapi.com/v1/images/search');
                    const data = await resp.json();
                    if (data && data[0] && data[0].url) {
                        const img = document.createElement('img');
                        img.src = data[0].url;
                        img.alt = 'Котик';
                        img.style.maxWidth = '100%';
                        img.style.borderRadius = '1em';
                        img.style.boxShadow = '0 4px 24px rgba(38,99,235,0.10)';
                        container.appendChild(img);
                    } else {
                        container.textContent = 'Не удалось получить кота :('; 
                    }
                } catch (e) {
                    container.textContent = 'Ошибка загрузки кота :('; 
                }
                btn.disabled = false;
                btn.textContent = 'Показать кота';
            };
        }, 300);
    });
})();

// --- Автоматическая тёмная тема (экспериментальная функция) ---
(function setupAutoThemeToggle() {
    const body = document.body;
    const autoThemeToggle = document.getElementById('auto-theme-toggle');
    
    if (!autoThemeToggle) return;
    
    // Загружаем настройку из localStorage
    const autoThemeEnabled = localStorage.getItem('autoThemeEnabled') === 'true';
    autoThemeToggle.checked = autoThemeEnabled;
    
    function applyThemeByTime() {
        const enabled = localStorage.getItem('autoThemeEnabled') === 'true';
        if (!enabled) {
            body.classList.remove('dark-theme');
            return;
        }
        
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 7) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
    }
    
    // Применяем тему при загрузке
    applyThemeByTime();
    
    // Обработчик переключения
    autoThemeToggle.addEventListener('change', function() {
        const enabled = this.checked;
        localStorage.setItem('autoThemeEnabled', enabled);
        
        if (enabled) {
            applyThemeByTime();
        } else {
            body.classList.remove('dark-theme');
        }
    });
    
    // Автоматически обновлять тему каждый час
    setInterval(applyThemeByTime, 60 * 1000);
})();

// --- Классы времени суток для body ---
(function setTimeOfDayClass() {
    function updateTimeClass() {
        const hour = new Date().getHours();
        const body = document.body;
        body.classList.remove('morning', 'day', 'evening', 'night');
        let reflectionColor = 'white';
        if (hour >= 6 && hour < 11) {
            body.classList.add('morning');
            reflectionColor = 'orange';
        } else if (hour >= 11 && hour < 16) {
            body.classList.add('day');
            reflectionColor = 'blue';
        } else if (hour >= 16 && hour < 21) {
            body.classList.add('evening');
            reflectionColor = 'orange';
        } else {
            body.classList.add('night');
            reflectionColor = 'white';
        }
        // Тёмная тема теперь контролируется только через экспериментальные функции
        if (body.classList.contains('dark-theme')) {
            reflectionColor = 'white';
        }
        body.setAttribute('data-reflection-color', reflectionColor);
    }
    updateTimeClass();
    setInterval(updateTimeClass, 60 * 1000);
})();

// --- Экспериментальные функции: модалка ---
(function setupExperimentalModal() {
    const btn = document.querySelector('.big-modal-btn[data-modal="experimental"]');
    if (!btn) return;
    // --- Добавлено: флаг для временного отключения отражений ---
    let wasReflectionEnabled = false;
    btn.addEventListener('click', () => {
        const modal = document.getElementById('modal-experimental');
        if (modal) {
            // --- Отключаем отражения на мобильных при открытии модалки ---
            const toggle = document.getElementById('reflection-toggle');
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            if (toggle && toggle.checked && isMobile) {
                // Найти функцию disable из setupReflectionEffect
                if (window.__reflectionDisable) window.__reflectionDisable();
                wasReflectionEnabled = true;
            } else {
                wasReflectionEnabled = false;
            }
            modal.style.display = 'flex';
            gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power3.out' });
            gsap.fromTo(modal.querySelector('.modal__content'),
                { scale: 0.95, opacity: 0, y: 40 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
            );
            document.body.style.overflow = 'hidden';
            // --- При закрытии модалки возвращаем отражения, если нужно ---
            const closeBtn = modal.querySelector('.modal__close');
            const restoreReflections = () => {
                if (wasReflectionEnabled && toggle && isMobile) {
                    if (window.__reflectionEnable) window.__reflectionEnable();
                }
            };
            if (closeBtn) {
                closeBtn.addEventListener('click', restoreReflections, { once: true });
            }
            modal.addEventListener('click', (e) => {
                if (e.target === modal) restoreReflections();
            }, { once: true });
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    restoreReflections();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        }
    });
})();

// === Firebase config ===
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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// === Auth UI ===
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentsList = document.getElementById('comments-list');

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};
logoutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
  // Проверяем кастомную сессию
  const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
  
  const authSection = document.getElementById('auth-section');
  const userInfo = document.getElementById('user-info');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const h2 = authSection?.querySelector('h2');
  const privacyNote = document.querySelector('.user-privacy-note');
  const privacyNoteContainer = document.querySelector('.side-menu__privacy-note');
  
  if (user || customSession) {
    // Кто-то вошёл (Google или кастомный пользователь)
    if (userInfo) {
      userInfo.textContent = user ? user.displayName : customSession.username;
      userInfo.style.display = '';
    }
    if (authSection) authSection.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = '';
    if (privacyNote && privacyNoteContainer) {
      privacyNoteContainer.appendChild(privacyNote);
      privacyNote.style.display = '';
    }
    
    // Показываем уведомление о входе
    if (user && !customSession) {
      const userName = user.displayName || user.email || 'Пользователь';
      showNotification(`Добро пожаловать, ${userName}! 👋`, 'success', 3000);
    }
  } else {
    // Никто не вошёл
    if (userInfo) {
      userInfo.textContent = '';
      userInfo.style.display = 'none';
    }
    if (authSection) authSection.style.display = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (privacyNote && authSection) {
      authSection.appendChild(privacyNote);
      privacyNote.style.display = 'none';
    }
  }
});

// === Comments ===
async function renderComment(doc) {
  const data = doc.data();
  const div = document.createElement('div');
  div.className = 'comment-item';
  div.style.cssText = `
    margin-bottom: 1em;
    padding: 1em;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    position: relative;
    padding-left: 3em; /* Место для аватарки */
  `;
  
  // Создаем контейнер для аватарки в левом верхнем углу
  const avatarContainer = document.createElement('div');
  avatarContainer.style.cssText = `
    position: absolute;
    top: 0.5em;
    left: 0.5em;
    z-index: 1;
  `;
  
  // Добавляем аватарку, если есть uid
  if (data.uid) {
    try {
      const avatarCode = await getUserAvatar(data.uid);
      const avatarElement = createAvatarElement(avatarCode, 24);
      avatarContainer.appendChild(avatarElement);
    } catch (error) {
      console.error('Ошибка при создании аватарки для комментария:', error);
    }
  }
  
  // Создаем контейнер для текста комментария
  const textContainer = document.createElement('div');
  
  // Определяем цвет в зависимости от темы
  const isDarkTheme = document.body.classList.contains('dark-theme');
  const userNameColor = isDarkTheme ? '#44ff44' : '#000000';
  
  textContainer.innerHTML = `<b style="color: ${userNameColor};">${data.user}</b> <span>${new Date(data.timestamp?.toDate?.() || Date.now()).toLocaleString()}</span><br>${data.text}`;
  
  div.appendChild(avatarContainer);
  div.appendChild(textContainer);
  
  // Анимация появления
  div.style.opacity = '0';
  div.style.transform = 'translateY(20px)';
  commentsList.appendChild(div);
  setTimeout(() => {
    div.style.transition = 'opacity 0.5s, transform 0.5s';
    div.style.opacity = '1';
    div.style.transform = 'translateY(0)';
  }, 10);
}

async function loadComments() {
  // Анимируем исчезновение старых комментариев
  const oldComments = Array.from(commentsList.children);
  oldComments.forEach(div => {
    div.style.transition = 'opacity 0.4s';
    div.style.opacity = '0';
  });
  setTimeout(async () => {
    commentsList.innerHTML = '';
    const snapshot = await db.collection('comments').orderBy('timestamp', 'desc').limit(5).get();
    
    // Рендерим комментарии последовательно для правильной загрузки аватарок
    for (const doc of snapshot.docs) {
      await renderComment(doc);
    }
    
    // Показываем форму, если пользователь авторизован (Google или кастомный)
    const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
    if (auth.currentUser || customSession) {
      commentForm.style.display = '';
    } else {
      commentForm.style.display = 'none';
    }
  }, 400);
}

commentForm.onsubmit = function(e) {
  e.preventDefault();
  const user = auth.currentUser;
  const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
  
  if (!user && !customSession) return;
  
  const text = commentInput.value.trim();
  if (!text) return;
  
  let userName, userUid;
  
  if (user) {
    // Google пользователь
    userName = user.displayName || user.email || 'Аноним';
    userUid = user.uid;
  } else {
    // Кастомный пользователь
    userName = customSession.username;
    userUid = `custom_${customSession.username}`;
  }
  
  db.collection('comments').add({
    user: userName,
    uid: userUid,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    commentInput.value = '';
    loadComments();
  });
};

auth.onAuthStateChanged(async (user) => {
  await loadComments();
  await updateCustomAuthUI();
});

// === Custom Authentication ===
const customAuthBtn = document.getElementById('custom-auth-btn');
const customAuthModal = document.getElementById('modal-custom-auth');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authMessage = document.getElementById('auth-message');

// Открытие модального окна аутентификации
customAuthBtn.onclick = () => {
  customAuthModal.classList.add('show');
  gsap.fromTo(customAuthModal.querySelector('.modal__content'), 
    { opacity: 0, scale: 0.9 }, 
    { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' }
  );
};

// Закрытие модального окна
customAuthModal.querySelector('.modal__close').onclick = () => {
  customAuthModal.classList.remove('show');
};

// Закрытие модального окна при клике вне его
customAuthModal.addEventListener('click', (e) => {
  if (e.target === customAuthModal) {
    customAuthModal.classList.remove('show');
  }
});

// Переключение между табами
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    // Обновляем активный таб
    authTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Показываем соответствующую форму
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    
    if (targetTab === 'login') {
      loginForm.classList.add('active');
    } else {
      registerForm.classList.add('active');
    }
    
    // Очищаем сообщения
    authMessage.className = 'auth-message';
    authMessage.style.display = 'none';
  });
});

// Функция для показа сообщений
function showAuthMessage(message, type) {
  // Показываем сообщение в форме авторизации
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
  authMessage.style.display = 'block';
  
  // Также показываем уведомление для лучшего UX
  const notificationType = type === 'success' ? 'success' : type === 'error' ? 'error' : 'info';
  showNotification(message, notificationType, 4000);
}

// Функция для хеширования пароля (простая реализация)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

// Обработка регистрации
registerForm.onsubmit = async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;
  const passwordConfirm = document.getElementById('register-password-confirm').value;
  
  // Валидация
  if (username.length < 3) {
    showAuthMessage('Логин должен содержать минимум 3 символа', 'error');
    return;
  }
  
  if (password.length < 6) {
    showAuthMessage('Пароль должен содержать минимум 6 символов', 'error');
    return;
  }
  
  if (password !== passwordConfirm) {
    showAuthMessage('Пароли не совпадают', 'error');
    return;
  }
  
  try {
    // Проверяем, существует ли пользователь
    const userDoc = await db.collection('customUsers').doc(username).get();
    
    if (userDoc.exists) {
      showAuthMessage('Пользователь с таким логином уже существует', 'error');
      return;
    }
    
    // Создаём нового пользователя
    const hashedPassword = hashPassword(password);
    await db.collection('customUsers').doc(username).set({
      username: username,
      password: hashedPassword,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    showAuthMessage('Регистрация успешна! Теперь вы можете войти', 'success');
    
    // Показываем приветственное уведомление для нового пользователя
    setTimeout(() => {
      showNotification(`Аккаунт создан! Добро пожаловать, ${username}! 🎉`, 'success', 4000);
    }, 500);
    
    // Переключаемся на форму входа
    document.querySelector('[data-tab="login"]').click();
    
    // Очищаем форму регистрации
    registerForm.reset();
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    showAuthMessage('Ошибка при регистрации. Попробуйте позже', 'error');
  }
};

// Обработка входа
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  
  if (!username || !password) {
    showAuthMessage('Заполните все поля', 'error');
    return;
  }
  
  try {
    // Ищем пользователя в базе данных
    const userDoc = await db.collection('customUsers').doc(username).get();
    
    if (!userDoc.exists) {
      showAuthMessage('Пользователь не найден', 'error');
      return;
    }
    
    const userData = userDoc.data();
    const hashedPassword = hashPassword(password);
    
    if (userData.password !== hashedPassword) {
      showAuthMessage('Неверный пароль', 'error');
      return;
    }
    
    // Успешный вход - создаём сессию
    const sessionData = {
      username: username,
      loginTime: firebase.firestore.FieldValue.serverTimestamp(),
      isCustomUser: true
    };
    
    // Сохраняем в localStorage для простоты
    localStorage.setItem('customUserSession', JSON.stringify(sessionData));
    
    showAuthMessage('Вход выполнен успешно!', 'success');
    
    // Показываем приветственное уведомление
    setTimeout(() => {
      showNotification(`Добро пожаловать, ${username}! 👋`, 'success', 4000);
    }, 500);
    
    // Закрываем модальное окно
    setTimeout(async () => {
      customAuthModal.classList.remove('show');
      // Обновляем UI
      await updateCustomAuthUI();
      // Показываем форму комментариев
      if (commentForm) {
        commentForm.style.display = '';
        // Плавная анимация появления
        commentForm.style.opacity = '0';
        commentForm.style.transform = 'translateY(20px)';
        setTimeout(() => {
          commentForm.style.transition = 'opacity 0.5s, transform 0.5s';
          commentForm.style.opacity = '1';
          commentForm.style.transform = 'translateY(0)';
        }, 100);
      }
    }, 1500);
    
    // Очищаем форму
    loginForm.reset();
    
  } catch (error) {
    console.error('Ошибка входа:', error);
    showAuthMessage('Ошибка при входе. Попробуйте позже', 'error');
  }
};

// Функция для обновления UI после входа/выхода
async function updateCustomAuthUI() {
  const session = JSON.parse(localStorage.getItem('customUserSession') || 'null');
  const userName = document.getElementById('user-name');
  const userAvatarContainer = document.getElementById('user-avatar-container');
  const avatarEditHint = document.getElementById('avatar-edit-hint');
  const authSection = document.getElementById('auth-section');
  const logoutBtn = document.getElementById('logout-btn');
  const privacyNote = document.querySelector('.user-privacy-note');
  const privacyNoteContainer = document.querySelector('.side-menu__privacy-note');
  
  if (session && session.isCustomUser) {
    // Пользователь вошёл через кастомную систему
    if (userName) {
      userName.textContent = session.username;
      userName.style.display = '';
    }
    if (userAvatarContainer) {
      userAvatarContainer.style.display = '';
      // Обновляем аватарку
      await updateUserAvatarInUI(`custom_${session.username}`, userAvatarContainer);
    }
    if (avatarEditHint) {
      // Проверяем, показывали ли мы уже подсказку
      const hasShownHint = localStorage.getItem('avatarEditHintShown');
      if (!hasShownHint) {
        avatarEditHint.style.display = '';
        avatarEditHint.style.opacity = '0.8';
        // Устанавливаем флаг в localStorage
        localStorage.setItem('avatarEditHintShown', 'true');
        // Обратный отсчёт
        const timerSpan = document.getElementById('avatar-hint-timer');
        let secondsLeft = 5;
        if (timerSpan) timerSpan.textContent = `(${secondsLeft})`;
        const countdown = setInterval(() => {
          secondsLeft--;
          if (timerSpan) timerSpan.textContent = `(${secondsLeft})`;
          if (secondsLeft <= 0) {
            clearInterval(countdown);
            if (avatarEditHint) {
              avatarEditHint.style.opacity = '0';
              setTimeout(() => {
                if (avatarEditHint) {
                  avatarEditHint.style.display = 'none';
                }
              }, 300);
            }
          }
        }, 1000);
      }
    }
    if (authSection) authSection.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = '';
    if (privacyNote && privacyNoteContainer) {
      privacyNoteContainer.appendChild(privacyNote);
      privacyNote.style.display = '';
    }
    // Показываем форму комментариев
    if (commentForm) {
      commentForm.style.display = '';
    }
  } else if (auth.currentUser) {
    // Google пользователь
    if (userName) {
      userName.textContent = auth.currentUser.displayName || auth.currentUser.email || 'Пользователь';
      userName.style.display = '';
    }
    if (userAvatarContainer) {
      userAvatarContainer.style.display = '';
      // Обновляем аватарку
      await updateUserAvatarInUI(auth.currentUser.uid, userAvatarContainer);
    }
    if (avatarEditHint) {
      // Проверяем, показывали ли мы уже подсказку
      const hasShownHint = localStorage.getItem('avatarEditHintShown');
      if (!hasShownHint) {
        avatarEditHint.style.display = '';
        avatarEditHint.style.opacity = '0.8';
        // Устанавливаем флаг в localStorage
        localStorage.setItem('avatarEditHintShown', 'true');
        // Обратный отсчёт
        const timerSpan = document.getElementById('avatar-hint-timer');
        let secondsLeft = 5;
        if (timerSpan) timerSpan.textContent = `(${secondsLeft})`;
        const countdown = setInterval(() => {
          secondsLeft--;
          if (timerSpan) timerSpan.textContent = `(${secondsLeft})`;
          if (secondsLeft <= 0) {
            clearInterval(countdown);
            if (avatarEditHint) {
              avatarEditHint.style.opacity = '0';
              setTimeout(() => {
                if (avatarEditHint) {
                  avatarEditHint.style.display = 'none';
                }
              }, 300);
            }
          }
        }, 1000);
      }
    }
    if (authSection) authSection.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = '';
    if (privacyNote && privacyNoteContainer) {
      privacyNoteContainer.appendChild(privacyNote);
      privacyNote.style.display = '';
    }
    // Показываем форму комментариев
    if (commentForm) {
      commentForm.style.display = '';
    }
  } else {
    // Никто не вошёл
    if (userName) {
      userName.textContent = '';
      userName.style.display = 'none';
    }
    if (userAvatarContainer) {
      userAvatarContainer.innerHTML = '';
      userAvatarContainer.style.display = 'none';
    }
    if (avatarEditHint) {
      avatarEditHint.style.display = 'none';
    }
    if (authSection) authSection.style.display = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (privacyNote && authSection) {
      authSection.appendChild(privacyNote);
      privacyNote.style.display = 'none';
    }
    // Скрываем форму комментариев
    if (commentForm) {
      commentForm.style.display = 'none';
    }
  }
}

// Обновляем обработчик выхода
const originalLogoutBtn = logoutBtn.onclick;
logoutBtn.onclick = async () => {
  // Выходим из Google аккаунта
  if (originalLogoutBtn) {
    originalLogoutBtn();
  }
  // Выходим из кастомной системы
  localStorage.removeItem('customUserSession');
  await updateCustomAuthUI();
  // Скрываем форму комментариев
  if (commentForm) {
    commentForm.style.display = 'none';
  }
};

// Проверяем сессию при загрузке страницы
(async () => {
  await updateCustomAuthUI();
})();

// Обработчик изменения размера окна для пересчета аватарок
window.addEventListener('resize', () => {
  // Пересчитываем аватарки при изменении размера окна
  const userAvatarContainer = document.getElementById('user-avatar-container');
  if (userAvatarContainer && userAvatarContainer.style.display !== 'none') {
    // Если аватарка отображается, обновляем её
    const session = JSON.parse(localStorage.getItem('customUserSession') || 'null');
    if (session && session.isCustomUser) {
      updateUserAvatarInUI(`custom_${session.username}`, userAvatarContainer);
    } else if (auth.currentUser) {
      updateUserAvatarInUI(auth.currentUser.uid, userAvatarContainer);
    }
  }
});

// При загрузке страницы
// Удаляю: loadComments();



// --- Эффект отражения для плит при движении мышки или гироскопа ---
(function setupReflectionEffect() {
    const toggle = document.getElementById('reflection-toggle');
    const gyroBtn = document.getElementById('get-orientation');
    if (!toggle) return;
    let enabled = false;
    let isMobile = /Mobi|Android/i.test(navigator.userAgent);
    let gyroActive = false;
    let lastGyro = {beta: 0, gamma: 0};
    const cards = () => Array.from(document.querySelectorAll('.service__card, .stat'));

    // --- Оптимизация: глобальный цикл для отражений ---
    let reflectionRafId = null;
    let pendingMouse = null;
    let pendingGyro = null;
    // Кэш последних значений для каждой карточки
    const cardCache = new WeakMap();
    function updateReflections() {
        if (!enabled) return;
        const all = cards();
        if (pendingMouse) {
            const {x, y} = pendingMouse;
            all.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width/2;
                const cy = rect.top + rect.height/2;
                const screenCenterX = window.innerWidth / 2;
                const screenCenterY = window.innerHeight / 2;
                const blend = 0.5;
                const targetX = x * (1-blend) + screenCenterX * blend;
                const targetY = y * (1-blend) + screenCenterY * blend;
                const dx = targetX - cx;
                const dy = targetY - cy;
                const jitter = (Math.random()-0.5) * 5;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI + 180 + jitter;
                let brightness = 1;
                const {minDist, minDistText, minDistWood} = obstructionDistance(card, x, y, all);
                if (minDist !== Infinity) {
                    brightness = Math.max(0.1, Math.min(0.7, minDist/200));
                } else if (minDistWood !== Infinity) {
                    brightness = Math.max(0.18, Math.min(0.6, minDistWood/200));
                } else if (minDistText !== Infinity) {
                    brightness = Math.max(0.3, Math.min(0.85, minDistText/200));
                }
                // Кэшируем и обновляем только если изменилось
                let cache = cardCache.get(card) || {};
                if (cache.angle !== angle || cache.brightness !== brightness) {
                    card.style.setProperty('--reflection-angle', `${angle}deg`);
                    card.style.setProperty('--reflection-brightness', brightness.toFixed(2));
                    card.classList.add('with-reflection');
                    cardCache.set(card, {angle, brightness});
                }
            });
            setOverlayGlass(x, y);
            setWoodReflection(x, y);
            pendingMouse = null;
        }
        if (pendingGyro) {
            const {alpha, beta, gamma} = pendingGyro;
            all.forEach(card => {
                let orientation = (Math.abs(beta) > Math.abs(gamma)) ? 'portrait' : 'landscape';
                let angle, brightness;
                if (orientation === 'portrait') {
                    angle = 90 + gamma + alpha + beta/2;
                    brightness = 1 - Math.abs(beta)/120;
                } else {
                    angle = 90 + beta + alpha + gamma/2;
                    brightness = 1 - Math.abs(gamma)/90;
                }
                brightness = Math.max(0.15, Math.min(1, brightness));
                let cache = cardCache.get(card) || {};
                if (cache.angle !== angle || cache.brightness !== brightness) {
                    card.style.setProperty('--reflection-angle', `${angle}deg`);
                    card.style.setProperty('--reflection-brightness', brightness.toFixed(2));
                    card.classList.add('with-reflection');
                    cardCache.set(card, {angle, brightness});
                }
            });
            // overlay и wood-reflection
            const overlay = document.querySelector('.overlay-glass');
            let angle;
            let orientation = (Math.abs(beta) > Math.abs(gamma)) ? 'portrait' : 'landscape';
            if (orientation === 'portrait') {
                angle = 90 + gamma + alpha + beta/2;
            } else {
                angle = 90 + beta + alpha + gamma/2;
            }
            const jitter = (Math.random()-0.5) * 5;
            angle += jitter;
            if (overlay) {
                overlay.style.setProperty('--overlay-reflection-angle', `${angle}deg`);
                overlay.style.setProperty('--overlay-reflection-brightness', 0.45);
            }
            const images = document.querySelectorAll('.wood-reflection');
            images.forEach(img => {
                img.classList.add('with-wood-reflection');
                img.style.setProperty('--wood-reflection-angle', `${angle}deg`);
                img.style.setProperty('--wood-reflection-brightness', 0.22);
            });
            pendingGyro = null;
        }
        reflectionRafId = null;
    }
    function scheduleReflectionUpdate() {
        if (!reflectionRafId) {
            reflectionRafId = requestAnimationFrame(updateReflections);
        }
    }
    function onMouseMove(e) {
        pendingMouse = {x: e.clientX, y: e.clientY};
        scheduleReflectionUpdate();
    }
    function onGyro(e) {
        pendingGyro = {alpha: e.alpha, beta: e.beta, gamma: e.gamma};
        scheduleReflectionUpdate();
        // gyro-info (оставляем как есть)
        lastGyro = {beta: e.beta, gamma: e.gamma, alpha: e.alpha};
        const info = document.getElementById('gyro-info');
        if (info) {
            info.style.display = '';
            document.getElementById('alpha').textContent = e.alpha ? e.alpha.toFixed(1) + '°' : '–';
            document.getElementById('beta').textContent = e.beta ? e.beta.toFixed(1) + '°' : '–';
            document.getElementById('gamma').textContent = e.gamma ? e.gamma.toFixed(1) + '°' : '–';
            document.getElementById('orientation').textContent = (Math.abs(e.beta) > Math.abs(e.gamma)) ? 'portrait' : 'landscape';
        }
    }
    function enableGyro() {
        if (gyroActive) return;
        window.addEventListener('deviceorientation', onGyro);
        gyroActive = true;
        const info = document.getElementById('gyro-info');
        if (info) info.style.display = '';
    }
    function disableGyro() {
        if (!gyroActive) return;
        window.removeEventListener('deviceorientation', onGyro);
        gyroActive = false;
        const info = document.getElementById('gyro-info');
        if (info) info.style.display = 'none';
    }
    // === Кэш препятствий для блика ===
    let obstaclesCache = null;
    function updateObstaclesCache() {
        const allCards = Array.from(document.querySelectorAll('.service__card, .stat'));
        const extraSelectors = [
          '.service__icon', 'h3', 'p', '.stat h3', '.stat p', '.section__title',
          '.image-marker-label', '.image-marker-dot', '.image-marker-desc'
        ];
        const extraObstacles = Array.from(document.querySelectorAll(extraSelectors.join(',')));
        obstaclesCache = {
            cards: allCards.map(el => ({el, rect: el.getBoundingClientRect()})),
            text: extraObstacles.filter(el => !allCards.includes(el)).map(el => ({el, rect: el.getBoundingClientRect()}))
        };
    }
    // Обновлять кэш при resize/scroll (throttle)
    let cacheUpdatePending = false;
    function scheduleObstaclesCacheUpdate() {
        if (cacheUpdatePending) return;
        cacheUpdatePending = true;
        requestAnimationFrame(() => {
            updateObstaclesCache();
            cacheUpdatePending = false;
        });
    }
    window.addEventListener('resize', scheduleObstaclesCacheUpdate);
    window.addEventListener('scroll', scheduleObstaclesCacheUpdate, true);
    // Инициализация кэша при старте
    updateObstaclesCache();
    // === END Кэш ===
    // === Spatial Grid для препятствий ===
    const GRID_SIZE = 8; // 8x8 сетка
    let spatialGrid = null;
    function buildSpatialGrid() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const cellW = width / GRID_SIZE;
        const cellH = height / GRID_SIZE;
        spatialGrid = Array.from({length: GRID_SIZE * GRID_SIZE}, () => []);
        function getCellsForRect(rect) {
            const x1 = Math.floor(rect.left / cellW);
            const y1 = Math.floor(rect.top / cellH);
            const x2 = Math.floor((rect.right-1) / cellW);
            const y2 = Math.floor((rect.bottom-1) / cellH);
            const cells = [];
            for (let x = Math.max(0, x1); x <= Math.min(GRID_SIZE-1, x2); x++) {
                for (let y = Math.max(0, y1); y <= Math.min(GRID_SIZE-1, y2); y++) {
                    cells.push(y * GRID_SIZE + x);
                }
            }
            return cells;
        }
        // Добавляем все препятствия
        if (!obstaclesCache) updateObstaclesCache();
        for (const arr of [obstaclesCache.cards, obstaclesCache.text]) {
            for (const obj of arr) {
                const cells = getCellsForRect(obj.rect);
                for (const idx of cells) {
                    spatialGrid[idx].push(obj);
                }
            }
        }
    }
    // Обновлять spatial grid при resize/scroll и обновлении кэша
    function updateSpatialGrid() {
        buildSpatialGrid();
    }
    window.addEventListener('resize', updateSpatialGrid);
    window.addEventListener('scroll', updateSpatialGrid, true);
    // Инициализация spatial grid при старте
    updateSpatialGrid();
    // === END Spatial Grid ===
    // Получить препятствия на пути луча (bresenham по сетке)
    function getObstaclesOnRay(x0, y0, x1, y1) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const cellW = width / GRID_SIZE;
        const cellH = height / GRID_SIZE;
        let obstacles = new Set();
        // Алгоритм Брезенхэма по сетке
        let cx0 = Math.floor(x0 / cellW), cy0 = Math.floor(y0 / cellH);
        let cx1 = Math.floor(x1 / cellW), cy1 = Math.floor(y1 / cellH);
        let dx = Math.abs(cx1 - cx0), dy = Math.abs(cy1 - cy0);
        let sx = cx0 < cx1 ? 1 : -1, sy = cy0 < cy1 ? 1 : -1;
        let err = dx - dy;
        let cx = cx0, cy = cy0;
        while (true) {
            const idx = cy * GRID_SIZE + cx;
            if (spatialGrid[idx]) for (const obj of spatialGrid[idx]) obstacles.add(obj);
            if (cx === cx1 && cy === cy1) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; cx += sx; }
            if (e2 < dx) { err += dx; cy += sy; }
        }
        return Array.from(obstacles);
    }
    // Возвращает минимальное расстояние от мышки до пересечения с другой плитой (или Infinity)
    function obstructionDistance(card, mouseX, mouseY, allCards) {
        const rectA = card.getBoundingClientRect();
        const cx = rectA.left + rectA.width/2;
        const cy = rectA.top + rectA.height/2;
        let minDist = Infinity;
        let minDistText = Infinity;
        let minDistWood = Infinity;
        if (!obstaclesCache) updateObstaclesCache();
        if (!spatialGrid) updateSpatialGrid();
        // Получаем только препятствия на пути луча
        const obstaclesOnRay = getObstaclesOnRay(mouseX, mouseY, cx, cy);
        // Вектор луча
        const minX = Math.min(mouseX, cx), maxX = Math.max(mouseX, cx);
        const minY = Math.min(mouseY, cy), maxY = Math.max(mouseY, cy);
        for (const obj of obstaclesOnRay) {
            const el = obj.el, rectB = obj.rect;
            if (el === card) continue;
            if (rectB.right < minX || rectB.left > maxX || rectB.bottom < minY || rectB.top > maxY) continue;
            const lines = [
                [rectB.left, rectB.top, rectB.right, rectB.top],
                [rectB.right, rectB.top, rectB.right, rectB.bottom],
                [rectB.right, rectB.bottom, rectB.left, rectB.bottom],
                [rectB.left, rectB.bottom, rectB.left, rectB.top]
            ];
            for (const [x1, y1, x2, y2] of lines) {
                const pt = segmentIntersection(mouseX, mouseY, cx, cy, x1, y1, x2, y2);
                if (pt) {
                    const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
                    if (obstaclesCache.cards.some(o => o.el === el)) {
                        if (dist < minDist) { minDist = dist; if (minDist < 5) break; }
                    } else if (obstaclesCache.wood && obstaclesCache.wood.some(o => o.el === el)) {
                        if (dist < minDistWood) { minDistWood = dist; if (minDistWood < 5) break; }
                    } else {
                        if (dist < minDistText) { minDistText = dist; if (minDistText < 5) break; }
                    }
                }
            }
        }
        return {minDist, minDistText, minDistWood};
    }
    // Возвращает точку пересечения двух отрезков или null
    function segmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denom = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
        if (denom === 0) return null;
        const px = ((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/denom;
        const py = ((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/denom;
        // Проверяем, что точка лежит на обоих отрезках
        function onSegment(xa,ya,xb,yb,xp,yp) {
            return Math.min(xa,xb)-0.5<=xp && xp<=Math.max(xa,xb)+0.5 && Math.min(ya,yb)-0.5<=yp && yp<=Math.max(ya,yb)+0.5;
        }
        if (onSegment(x1,y1,x2,y2,px,py) && onSegment(x3,y3,x4,y4,px,py)) return {x:px,y:py};
        return null;
    }
    function setReflection(card, mouseX, mouseY, allCards) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        // Смещение к центру экрана
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        // Усредняем мышь и центр экрана для более "реального" блика
        const blend = 0.5; // 0 — только мышь, 1 — только центр экрана
        const targetX = mouseX * (1-blend) + screenCenterX * blend;
        const targetY = mouseY * (1-blend) + screenCenterY * blend;
        const dx = targetX - cx;
        const dy = targetY - cy;
        // Добавим небольшое дрожание блика
        const jitter = (Math.random()-0.5) * 5; // +/-2.5 градуса
        const angle = Math.atan2(dy, dx) * 180 / Math.PI + 180 + jitter;
        // Яркость блика: если нет перекрытия — 1, если есть — плавно убывает с расстоянием
        let brightness = 1;
        const {minDist, minDistText, minDistWood} = obstructionDistance(card, mouseX, mouseY, allCards);
        if (minDist !== Infinity) {
            // Чем ближе перекрытие плитой — тем слабее (0.1...0.7)
            brightness = Math.max(0.1, Math.min(0.7, minDist/200));
        } else if (minDistWood !== Infinity) {
            // Если только текст/иконка — ослабление слабее (0.3...0.85)
            brightness = Math.max(0.18, Math.min(0.6, minDistWood/200));
        } else if (minDistText !== Infinity) {
            // Если только текст/иконка — ослабление слабее (0.3...0.85)
            brightness = Math.max(0.3, Math.min(0.85, minDistText/200));
        }
        card.style.setProperty('--reflection-angle', `${angle}deg`);
        card.style.setProperty('--reflection-brightness', brightness.toFixed(2));
        card.classList.add('with-reflection');
    }
    function clearReflection(card) {
        card.classList.remove('with-reflection');
        card.style.removeProperty('--reflection-angle');
        card.style.removeProperty('--reflection-brightness');
    }
    function setReflectionGyro(card, alpha, beta, gamma) {
        // alpha: вращение вокруг Z (0-360), beta: X (-180..180), gamma: Y (-90..90)
        // Ориентация: портрет или ландшафт
        let orientation = (Math.abs(beta) > Math.abs(gamma)) ? 'portrait' : 'landscape';
        let angle, brightness;
        if (orientation === 'portrait') {
            // Блик зависит от всех трёх углов
            angle = 90 + gamma + alpha + beta/2;
            brightness = 1 - Math.abs(beta)/120;
        } else {
            angle = 90 + beta + alpha + gamma/2;
            brightness = 1 - Math.abs(gamma)/90;
        }
        brightness = Math.max(0.15, Math.min(1, brightness));
        card.style.setProperty('--reflection-angle', `${angle}deg`);
        card.style.setProperty('--reflection-brightness', brightness.toFixed(2));
        card.classList.add('with-reflection');
        card.style.removeProperty('--reflection-x');
        card.style.removeProperty('--reflection-y');
    }
    let lastOverlay = {angle: null, brightness: null};
    let overlayRafId = null;
    let overlayPending = false;
    function setOverlayGlass(mouseX, mouseY) {
        if (overlayPending) return;
        overlayPending = true;
        if (overlayRafId) cancelAnimationFrame(overlayRafId);
        overlayRafId = requestAnimationFrame(() => {
            overlayPending = false;
            const overlay = document.querySelector('.overlay-glass');
            if (!overlay) return;
            // Центр экрана
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            // Если нет мыши — блик идёт строго вверх
            let dx = 0, dy = -1;
            if (typeof mouseX === 'number' && typeof mouseY === 'number') {
                dx = mouseX - cx;
                dy = mouseY - cy;
            }
            // Добавим небольшое дрожание
            const jitter = (Math.random()-0.5) * 5;
            const angle = Math.round(Math.atan2(dy, dx) * 180 / Math.PI + 180 + jitter);
            // Яркость блика чуть слабее, чем на карточках
            let brightness = 0.45;
            // Обновлять только если изменилось
            if (lastOverlay.angle === angle && lastOverlay.brightness === brightness) return;
            lastOverlay.angle = angle;
            lastOverlay.brightness = brightness;
            overlay.style.setProperty('--overlay-reflection-angle', `${angle}deg`);
            overlay.style.setProperty('--overlay-reflection-brightness', brightness);
        });
    }
    // === Wood reflection for images ===
    function setWoodReflection(mouseX, mouseY) {
        const images = document.querySelectorAll('.wood-reflection');
        // Центр экрана
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        let dx = 0, dy = -1;
        if (typeof mouseX === 'number' && typeof mouseY === 'number') {
            dx = mouseX - cx;
            dy = mouseY - cy;
        }
        const jitter = (Math.random()-0.5) * 5;
        const angle = Math.round(Math.atan2(dy, dx) * 180 / Math.PI + 180 + jitter);
        let brightness = 0.22;
        images.forEach(img => {
            img.classList.add('with-wood-reflection');
            img.style.setProperty('--wood-reflection-angle', `${angle}deg`);
            img.style.setProperty('--wood-reflection-brightness', brightness);
        });
    }
    function clearWoodReflection() {
        const images = document.querySelectorAll('.wood-reflection');
        images.forEach(img => {
            img.classList.remove('with-wood-reflection');
            img.style.removeProperty('--wood-reflection-angle');
            img.style.removeProperty('--wood-reflection-brightness');
        });
    }
    function enable() {
        enabled = true;
        if (isMobile) {
            if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
                gyroBtn.style.display = '';
            } else {
                // Автоматически, если не требуется разрешение
                enableGyro();
            }
        } else {
            window.addEventListener('mousemove', onMouseMove);
            cards().forEach(card => card.classList.add('with-reflection'));
        }
        document.body.classList.add('with-overlay-glass');
        document.addEventListener('visibilitychange', onVisibilityChange);
        setWoodReflection();
        // Матовый эффект для hero
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('matte-hero');
        // Металлический эффект для about
        const about = document.querySelector('.about');
        if (about) about.classList.add('metallic-about');
        // Водяной эффект для services
        const services = document.querySelector('.services');
        if (services) services.classList.add('water-service');
        // Зональные классы для плит
        setTileZoneClasses();
    }
    function disable() {
        enabled = false;
        if (isMobile) {
            disableGyro();
            gyroBtn.style.display = 'none';
        } else {
            window.removeEventListener('mousemove', onMouseMove);
        }
        cards().forEach(clearReflection);
        document.body.classList.remove('with-overlay-glass');
        document.removeEventListener('visibilitychange', onVisibilityChange);
        clearWoodReflection();
        // Убрать матовый эффект с hero
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.remove('matte-hero');
        // Убрать металлический эффект с about
        const about = document.querySelector('.about');
        if (about) about.classList.remove('metallic-about');
        // Убрать водяной эффект с services
        const services = document.querySelector('.services');
        if (services) services.classList.remove('water-service');
        // Убрать зональные классы с плит
        clearTileZoneClasses();
        // --- Очищаем кэш ---
        cardCache.clear();
    }
    // --- Делаем функции доступными глобально для управления из других частей кода ---
    window.__reflectionEnable = enable;
    window.__reflectionDisable = disable;
    toggle.addEventListener('change', () => {
        if (toggle.checked) enable();
        else disable();
    });
    if (isMobile && gyroBtn) {
        gyroBtn.onclick = async function() {
            if (!window.DeviceOrientationEvent || !DeviceOrientationEvent.requestPermission) {
                alert('Ваше устройство не поддерживает DeviceOrientationEvent');
                return;
            }
            let permission = await DeviceOrientationEvent.requestPermission();
            if (permission !== 'granted') {
                alert('Вы должны разрешить доступ к сенсору устройства');
                return;
            }
            enableGyro();
            gyroBtn.style.display = 'none';
        };
    }
    // Если мобильное — не отключаем переключатель, а показываем кнопку
    if (isMobile && gyroBtn) {
        gyroBtn.style.display = 'none';
    }
})(); 

// === Позиционирование меток по ширине картинки (только для десктопа) ===
function positionImageMarkers() {
  const img = document.querySelector('.img-desktop');
  const container = document.querySelector('.image-marker-container');
  const markerStart = container.querySelector('.image-marker--start');
  const markerEnd = container.querySelector('.image-marker--end');
  if (!img || !markerStart || !markerEnd) return;
  // Только на десктопе
  if (window.innerWidth < 768) {
    markerStart.style.left = '';
    markerEnd.style.left = '';
    markerStart.style.transform = '';
    markerEnd.style.transform = '';
    return;
  }
  // Получаем реальные размеры картинки
  const rect = img.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  // Смещение контейнера относительно окна
  const offsetLeft = rect.left - containerRect.left;
  // 42 равные части
  const part = rect.width / 42;
  // Центр метки на позиции чуть ближе друг к другу
  const startX = offsetLeft + part * 2.9;
  const endX = offsetLeft + part * 39.3;
  // Сдвигаем так, чтобы центр метки совпал с нужной точкой
  const markerWidth = markerStart.offsetWidth;
  markerStart.style.left = `${startX - markerWidth/2}px`;
  markerStart.style.transform = 'none';
  markerEnd.style.left = `${endX - markerWidth/2}px`;
  markerEnd.style.transform = 'none';
  // Вертикальное позиционирование: обе метки на одной высоте (например, 95% высоты картинки)
  const markerHeight = markerStart.offsetHeight;
  const y = rect.top - containerRect.top + rect.height * 0.95 - markerHeight / 2;
  markerStart.style.top = `${y}px`;
  markerStart.style.bottom = '';
  markerEnd.style.top = `${y}px`;
  markerEnd.style.bottom = '';
}
window.addEventListener('DOMContentLoaded', positionImageMarkers);
window.addEventListener('resize', positionImageMarkers);
window.addEventListener('load', positionImageMarkers); 

document.querySelector('.nav-experimental-link')?.addEventListener('click', function() {
  const modal = document.getElementById('modal-experimental');
  if (modal) {
    modal.style.display = 'flex';
    if (window.gsap) {
      gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power3.out' });
      gsap.fromTo(modal.querySelector('.modal__content'),
        { scale: 0.95, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
      );
    }
    document.body.style.overflow = 'hidden';
  }
});

// --- Чат ---
const chatSidebar = document.getElementById('chat-sidebar');
const chatSidebarContent = document.querySelector('.chat-sidebar__content');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// Переменные для управления чатом
let currentChatType = 'general'; // 'general' или 'private'
let selectedUserId = null;
let selectedUserName = null;

// Переменные для непрочитанных сообщений
let unreadGeneralMessages = 0;
let unreadPrivateMessages = new Map(); // userId -> count
let lastReadGeneralTimestamp = null;
let lastReadPrivateTimestamps = new Map(); // userId -> timestamp

const openChatSidebar = () => {
  chatSidebar.classList.add('open');
  gsap.set(chatSidebarContent, { x: '100%' });
  gsap.to(chatSidebar, { duration: 0.3, autoAlpha: 1, ease: 'power2.out' });
  gsap.to(chatSidebarContent, { x: 0, duration: 0.5, ease: 'power3.out' });
  loadChatMessages();
  
  // Отмечаем сообщения как прочитанные
  if (currentChatType === 'general') {
    markGeneralMessagesAsRead();
  } else if (currentChatType === 'private' && selectedUserId) {
    markPrivateMessagesAsRead(selectedUserId);
  }
};

const closeChatSidebar = () => {
  gsap.to(chatSidebarContent, { x: '100%', duration: 0.5, ease: 'power3.in' });
  gsap.to(chatSidebar, { duration: 0.3, autoAlpha: 0, delay: 0.5, onComplete: () => {
    chatSidebar.classList.remove('open');
  }});
};

// Обработчики событий для чата
document.querySelector('.nav-chat-link')?.addEventListener('click', openChatSidebar);
document.querySelector('.chat-sidebar__close')?.addEventListener('click', closeChatSidebar);
chatSidebar?.addEventListener('click', function(e) {
  if (e.target === chatSidebar) closeChatSidebar();
});

// Загрузка сообщений из Firebase
async function loadChatMessages() {
  try {
    const messagesSnapshot = await db.collection('messages')
      .orderBy('timestamp', 'asc')
      .limit(100)
      .get();
    
    chatMessages.innerHTML = '';
    
    // Используем for...of для асинхронной обработки
    for (const doc of messagesSnapshot.docs) {
      const messageData = doc.data();
      // Фильтруем только общие сообщения на клиенте
      if (messageData.type === 'general' || !messageData.type) {
        await renderChatMessage(messageData, doc.id);
      }
    }
    
    // Прокручиваем к последнему сообщению
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
  } catch (error) {
    console.error('Ошибка загрузки сообщений:', error);
    showNotification('Ошибка загрузки сообщений', 'error');
  }
}

// Рендеринг сообщения чата
async function renderChatMessage(messageData, messageId) {
  const messageDiv = document.createElement('div');
  const isCurrentUser = isMessageFromCurrentUser(messageData);
  
  messageDiv.className = `chat-message ${isCurrentUser ? 'sent' : 'received'}`;
  
  const timestamp = messageData.timestamp ? new Date(messageData.timestamp.toDate()) : new Date();
  const timeString = timestamp.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Получаем имя отправителя
  let senderName = 'Неизвестный';
  if (isCurrentUser) {
    senderName = 'Вы';
  } else if (messageData.from) {
    senderName = messageData.from;
  } else if (messageData.senderId) {
    senderName = await getUserNameByUid(messageData.senderId);
  }
  
  messageDiv.innerHTML = `
    <div class="chat-message-header">
      ${senderName}
    </div>
    <div class="chat-message-text">${messageData.text}</div>
    <div class="chat-message-time">${timeString}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
}

// Проверка, принадлежит ли сообщение текущему пользователю
function isMessageFromCurrentUser(messageData) {
  const currentUser = auth.currentUser;
  const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
  
  if (currentUser) {
    return messageData.senderId === currentUser.uid;
  } else if (customSession) {
    return messageData.senderId === `custom_${customSession.username}`;
  }
  
  return false;
}

// Отправка сообщения
if (chatForm) {
  chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const messageText = chatInput.value.trim();
    if (!messageText) return;
    
    // Проверяем авторизацию
    const currentUser = auth.currentUser;
    const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
    
    if (!currentUser && !customSession) {
      showNotification('Войдите в систему для отправки сообщений', 'warning');
      return;
    }
    
    try {
      const currentUserId = currentUser ? currentUser.uid : `custom_${customSession.username}`;
      
      let messageData = {
        text: messageText,
        from: currentUser ? (currentUser.displayName || currentUser.email) : customSession.username,
        senderId: currentUserId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      // Добавляем данные в зависимости от типа чата
      if (currentChatType === 'general') {
        messageData.type = 'general';
        messageData.to = 'all';
      } else if (currentChatType === 'private' && selectedUserId) {
        messageData.type = 'private';
        messageData.to = selectedUserId;
        messageData.toName = selectedUserName;
        messageData.participants = [currentUserId, selectedUserId].sort();
      } else if (currentChatType === 'my') {
        // В разделе "Мои чаты" нужно выбрать конкретный чат
        showNotification('Выберите чат из списка для отправки сообщения', 'warning');
        return;
      } else if (currentChatType === 'private' && !selectedUserId) {
        showNotification('Выберите пользователя для личного сообщения', 'warning');
        return;
      } else {
        showNotification('Неизвестный тип чата', 'error');
        return;
      }
      
      await db.collection('messages').add(messageData);
      
      // Очищаем поле ввода
      chatInput.value = '';
      
      // Прокручиваем к новому сообщению
      setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 100);
      
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      showNotification('Ошибка отправки сообщения', 'error');
    }
  });
}

// Слушатель новых сообщений в реальном времени
function setupChatListener() {
  // Слушатель для всех сообщений
  db.collection('messages')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const messageData = change.doc.data();
          
          // Проверяем непрочитанные сообщения
          checkForUnreadMessages(messageData);
          
          // Обрабатываем общие сообщения
          if ((messageData.type === 'general' || !messageData.type) && (currentChatType === 'general' || currentChatType === 'my')) {
            renderChatMessage(messageData, change.doc.id).then(() => {
              // Прокручиваем к новому сообщению
              setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
              }, 100);
            });
          }
          
          // Обрабатываем личные сообщения
          if (messageData.type === 'private' && (currentChatType === 'private' || currentChatType === 'my') && selectedUserId) {
            const currentUser = auth.currentUser;
            const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
            const currentUserId = currentUser ? currentUser.uid : `custom_${customSession?.username}`;
            
            if (messageData.participants && 
                messageData.participants.includes(currentUserId) && 
                messageData.participants.includes(selectedUserId)) {
              renderChatMessage(messageData, change.doc.id).then(() => {
                // Прокручиваем к новому сообщению
                setTimeout(() => {
                  chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 100);
              });
            }
          }
        }
      });
    });
}

// Инициализация слушателя чата
setupChatListener();

// Инициализация системы непрочитанных сообщений
loadReadTimestamps();
updateUnreadBadge();

// Функции для управления типом чата
function setupChatTypeSwitcher() {
  const generalBtn = document.getElementById('chat-general-btn');
  const privateBtn = document.getElementById('chat-private-btn');
  const myBtn = document.getElementById('chat-my-btn');
  const usersList = document.getElementById('chat-users-list');
  const myChatsList = document.getElementById('chat-my-chats-list');
  const chatInfo = document.getElementById('chat-info');
  
  generalBtn?.addEventListener('click', () => {
    switchChatType('general');
  });
  
  privateBtn?.addEventListener('click', () => {
    switchChatType('private');
  });
  
  myBtn?.addEventListener('click', () => {
    switchChatType('my');
  });
}

function switchChatType(type) {
  currentChatType = type;
  selectedUserId = null;
  selectedUserName = null;
  
  const generalBtn = document.getElementById('chat-general-btn');
  const privateBtn = document.getElementById('chat-private-btn');
  const myBtn = document.getElementById('chat-my-btn');
  const usersList = document.getElementById('chat-users-list');
  const myChatsList = document.getElementById('chat-my-chats-list');
  const chatInfo = document.getElementById('chat-info');
  
  // Обновляем кнопки
  generalBtn.classList.toggle('active', type === 'general');
  privateBtn.classList.toggle('active', type === 'private');
  myBtn.classList.toggle('active', type === 'my');
  
  // Показываем/скрываем списки
  usersList.style.display = type === 'private' ? 'block' : 'none';
  myChatsList.style.display = type === 'my' ? 'block' : 'none';
  
  // Обновляем информацию о чате
  if (type === 'general') {
    chatInfo.textContent = '💬 Общий чат';
    chatInfo.style.color = '#666';
    // Отмечаем общие сообщения как прочитанные
    markGeneralMessagesAsRead();
  } else if (type === 'private') {
    chatInfo.textContent = '👤 Выберите пользователя для личного сообщения';
    chatInfo.style.color = '#ff6b6b';
  } else if (type === 'my') {
    chatInfo.textContent = '💬 Выберите чат из списка';
    chatInfo.style.color = '#666';
  }
  
  // Очищаем сообщения и загружаем новые
  chatMessages.innerHTML = '';
  if (type === 'general') {
    loadChatMessages();
  }
  
  // Загружаем соответствующие списки
  if (type === 'private') {
    loadChatUsers();
  } else if (type === 'my') {
    loadMyChats();
  }
}

// Кэш для имен пользователей
const userNameCache = new Map();

// Функция для получения имени пользователя по UID
async function getUserNameByUid(uid) {
  try {
    // Проверяем кэш
    if (userNameCache.has(uid)) {
      return userNameCache.get(uid);
    }
    
    // Если это кастомный пользователь
    if (uid.startsWith('custom_')) {
      const name = uid.replace('custom_', '');
      userNameCache.set(uid, name);
      return name;
    }
    
    // Если это Google пользователь, получаем из комментариев
    const commentsSnapshot = await db.collection('comments')
      .where('uid', '==', uid)
      .limit(1)
      .get();
    
    if (!commentsSnapshot.empty) {
      const commentData = commentsSnapshot.docs[0].data();
      const name = commentData.user || 'Неизвестный';
      userNameCache.set(uid, name);
      return name;
    }
    
    // Если не найдено в комментариях, проверяем сообщения
    const messagesSnapshot = await db.collection('messages')
      .where('senderId', '==', uid)
      .limit(5)
      .get();
    
    if (!messagesSnapshot.empty) {
      // Ищем сообщение с именем пользователя
      for (const doc of messagesSnapshot.docs) {
        const messageData = doc.data();
        if (messageData.from && messageData.from !== 'Пользователь') {
          userNameCache.set(uid, messageData.from);
          return messageData.from;
        }
      }
      // Если не нашли имя, берем первое сообщение
      const messageData = messagesSnapshot.docs[0].data();
      const name = messageData.from || 'Пользователь';
      userNameCache.set(uid, name);
      return name;
    }
    
    // Если не найдено нигде, возвращаем "Пользователь" + часть UID
    const shortUid = uid.substring(0, 8);
    const name = `Пользователь ${shortUid}`;
    userNameCache.set(uid, name);
    return name;
    
  } catch (error) {
    console.error('Ошибка получения имени пользователя:', error);
    const shortUid = uid.substring(0, 8);
    const name = `Пользователь ${shortUid}`;
    userNameCache.set(uid, name);
    return name;
  }
}

// Загрузка списка пользователей для личных сообщений
async function loadChatUsers() {
  try {
    const usersContainer = document.getElementById('chat-users-container');
    usersContainer.innerHTML = '<div style="text-align:center;color:#666;padding:1rem;">Загрузка пользователей...</div>';
    
    const users = new Map();
    
    // Загружаем данные параллельно для ускорения
    console.log('Загружаем данные параллельно...');
    const [commentsSnapshot, messagesSnapshot, avatarsSnapshot] = await Promise.all([
      db.collection('comments').orderBy('timestamp', 'desc').limit(100).get(),
      db.collection('messages').orderBy('timestamp', 'desc').limit(200).get(),
      db.collection('avatarka').get()
    ]);
    
    console.log(`Найдено: комментариев ${commentsSnapshot.size}, сообщений ${messagesSnapshot.size}, аватарок ${avatarsSnapshot.size}`);
    
    // Обрабатываем комментарии
    commentsSnapshot.forEach(doc => {
      const commentData = doc.data();
      const userId = commentData.uid || `custom_${commentData.user}`;
      const userName = commentData.user || 'Неизвестный';
      
      if (!users.has(userId)) {
        users.set(userId, {
          id: userId,
          name: userName,
          lastActivity: commentData.timestamp,
          source: 'comments'
        });
      } else {
        const existingUser = users.get(userId);
        if (commentData.timestamp && (!existingUser.lastActivity || commentData.timestamp.toDate() > existingUser.lastActivity.toDate())) {
          existingUser.lastActivity = commentData.timestamp;
          existingUser.source = 'comments';
        }
      }
    });
    
    // Обрабатываем сообщения
    messagesSnapshot.forEach(doc => {
      const messageData = doc.data();
      if (messageData.senderId) {
        const userId = messageData.senderId;
        const userName = messageData.from || 'Пользователь';
        
        if (!users.has(userId)) {
          users.set(userId, {
            id: userId,
            name: userName,
            lastActivity: messageData.timestamp,
            source: 'messages'
          });
        } else {
          const existingUser = users.get(userId);
          if (messageData.timestamp && (!existingUser.lastActivity || messageData.timestamp.toDate() > existingUser.lastActivity.toDate())) {
            existingUser.lastActivity = messageData.timestamp;
            existingUser.source = 'messages';
          }
        }
      }
    });
    
    // Обрабатываем аватарки
    avatarsSnapshot.forEach(doc => {
      const userId = doc.id;
      if (!users.has(userId)) {
        users.set(userId, {
          id: userId,
          name: 'Пользователь',
          lastActivity: null,
          source: 'avatars'
        });
      }
    });
    
    console.log(`Всего найдено пользователей: ${users.size}`);
    
    // Сортируем пользователей по последней активности
    const sortedUsers = Array.from(users.values()).sort((a, b) => {
      if (!a.lastActivity && !b.lastActivity) return 0;
      if (!a.lastActivity) return 1;
      if (!b.lastActivity) return -1;
      return b.lastActivity.toDate() - a.lastActivity.toDate();
    });
    
    // Очищаем контейнер
    usersContainer.innerHTML = '';
    
    // Создаем элементы пользователей параллельно
    console.log('Создаем элементы пользователей параллельно...');
    const userElements = await Promise.all(
      sortedUsers.map(async (user) => {
        try {
          return await createChatUserElement(user);
        } catch (error) {
          console.error(`Ошибка создания элемента для ${user.id}:`, error);
          // Возвращаем простой элемент с ошибкой
          const errorDiv = document.createElement('div');
          errorDiv.className = 'chat-user-item';
          errorDiv.style.color = '#ff6b6b';
          errorDiv.innerHTML = `
            <div class="chat-user-avatar-container">
              <div class="chat-user-avatar-fallback">❌</div>
            </div>
            <div class="chat-user-info">
              <div class="chat-user-name">Ошибка загрузки</div>
            </div>
          `;
          return errorDiv;
        }
      })
    );
    
    // Добавляем все элементы сразу
    userElements.forEach(element => {
      usersContainer.appendChild(element);
    });
    
    console.log(`Создано элементов: ${userElements.length}`);
    
    if (sortedUsers.length === 0) {
      usersContainer.innerHTML = '<div style="text-align:center;color:#666;padding:1rem;">Пользователи не найдены</div>';
    } else {
      console.log(`Отображено пользователей: ${sortedUsers.length}`);
    }
    
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    showNotification('Ошибка загрузки списка пользователей', 'error');
    const usersContainer = document.getElementById('chat-users-container');
    usersContainer.innerHTML = '<div style="text-align:center;color:#666;padding:1rem;">Ошибка загрузки пользователей</div>';
  }
}

// Создание элемента пользователя для чата
async function createChatUserElement(user) {
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-user-item';
  userDiv.dataset.userId = user.id;
  
  // Получаем актуальное имя пользователя
  const userName = await getUserNameByUid(user.id);
  userDiv.dataset.userName = userName;
  
  // Создаем контейнер для аватарки
  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'chat-user-avatar-container';
  
  // Добавляем аватарку, если есть uid
  if (user.id) {
    try {
      const avatarCode = await getUserAvatar(user.id);
      const avatarElement = createAvatarElement(avatarCode, 24);
      avatarContainer.appendChild(avatarElement);
    } catch (error) {
      console.error(`Ошибка при создании аватарки для пользователя ${user.id}:`, error);
      // Создаем заглушку
      const fallbackAvatar = document.createElement('div');
      fallbackAvatar.className = 'chat-user-avatar-fallback';
      fallbackAvatar.textContent = userName.charAt(0).toUpperCase();
      avatarContainer.appendChild(fallbackAvatar);
    }
  }
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'chat-user-info';
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'chat-user-name';
  nameDiv.textContent = userName;
  
  infoDiv.appendChild(nameDiv);
  
  userDiv.appendChild(avatarContainer);
  userDiv.appendChild(infoDiv);
  
  // Обработчик клика
  userDiv.addEventListener('click', () => {
    selectChatUser(user.id, userName);
  });
  
  return userDiv;
}

// Выбор пользователя для личного чата
function selectChatUser(userId, userName) {
  selectedUserId = userId;
  selectedUserName = userName;
  
  // Обновляем UI
  document.querySelectorAll('.chat-user-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  const selectedElement = document.querySelector(`[data-user-id="${userId}"]`);
  if (selectedElement) {
    selectedElement.classList.add('selected');
  }
  
  // Обновляем информацию о чате
  const chatInfo = document.getElementById('chat-info');
  chatInfo.textContent = `👤 Личное сообщение: ${userName}`;
  chatInfo.style.color = '#667eea';
  
  // Отмечаем личные сообщения как прочитанные
  markPrivateMessagesAsRead(userId);
  
  // Загружаем личные сообщения
  loadPrivateMessages(userId);
}

// Загрузка личных сообщений
async function loadPrivateMessages(targetUserId) {
  try {
    const currentUser = auth.currentUser;
    const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
    const currentUserId = currentUser ? currentUser.uid : `custom_${customSession?.username}`;
    
    if (!currentUserId) {
      showNotification('Войдите в систему для просмотра личных сообщений', 'warning');
      return;
    }
    
    // Получаем все сообщения и фильтруем на клиенте
    const messagesSnapshot = await db.collection('messages')
      .orderBy('timestamp', 'asc')
      .limit(200)
      .get();
    
    chatMessages.innerHTML = '';
    
    // Используем for...of для асинхронной обработки
    for (const doc of messagesSnapshot.docs) {
      const messageData = doc.data();
      // Проверяем, что это личное сообщение между выбранными пользователями
      if (messageData.type === 'private' && 
          messageData.participants && 
          messageData.participants.includes(currentUserId) && 
          messageData.participants.includes(targetUserId)) {
        await renderChatMessage(messageData, doc.id);
      }
    }
    
    // Прокручиваем к последнему сообщению
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
  } catch (error) {
    console.error('Ошибка загрузки личных сообщений:', error);
    showNotification('Ошибка загрузки личных сообщений', 'error');
  }
}

// Загрузка списка чатов пользователя
async function loadMyChats() {
  try {
    const currentUser = auth.currentUser;
    const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
    const currentUserId = currentUser ? currentUser.uid : `custom_${customSession?.username}`;
    
    if (!currentUserId) {
      showNotification('Войдите в систему для просмотра ваших чатов', 'warning');
      return;
    }
    
    const chatsContainer = document.getElementById('chat-my-chats-container');
    chatsContainer.innerHTML = '';
    
    // Получаем все сообщения и группируем по участникам
    const messagesSnapshot = await db.collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();
    
    const chatMap = new Map(); // Map для хранения информации о чатах
    
    // Обрабатываем сообщения для поиска чатов
    for (const doc of messagesSnapshot.docs) {
      const messageData = doc.data();
      
      // Для личных сообщений
      if (messageData.type === 'private' && messageData.participants) {
        if (messageData.participants.includes(currentUserId)) {
          const otherUserId = messageData.participants.find(id => id !== currentUserId);
          if (otherUserId) {
            if (!chatMap.has(otherUserId)) {
              chatMap.set(otherUserId, {
                type: 'private',
                participantId: otherUserId,
                lastMessage: messageData.text,
                lastTimestamp: messageData.timestamp,
                unreadCount: 0
              });
            }
            // Обновляем последнее сообщение если это более новое
            const chat = chatMap.get(otherUserId);
            if (messageData.timestamp.toDate() > chat.lastTimestamp.toDate()) {
              chat.lastMessage = messageData.text;
              chat.lastTimestamp = messageData.timestamp;
            }
          }
        }
      }
      // Для общих сообщений (если пользователь участвовал)
      else if ((messageData.type === 'general' || !messageData.type) && messageData.senderId === currentUserId) {
        if (!chatMap.has('general')) {
          chatMap.set('general', {
            type: 'general',
            participantId: 'general',
            lastMessage: messageData.text,
            lastTimestamp: messageData.timestamp,
            unreadCount: 0
          });
        }
      }
    }
    
    // Создаем элементы чатов
    const sortedChats = Array.from(chatMap.values()).sort((a, b) => 
      b.lastTimestamp.toDate() - a.lastTimestamp.toDate()
    );
    
    for (const chat of sortedChats) {
      const chatElement = await createMyChatElement(chat);
      chatsContainer.appendChild(chatElement);
    }
    
    if (sortedChats.length === 0) {
      chatsContainer.innerHTML = '<div style="text-align:center;color:#666;padding:1rem;">У вас пока нет чатов</div>';
    }
    
  } catch (error) {
    console.error('Ошибка загрузки чатов:', error);
    showNotification('Ошибка загрузки списка чатов', 'error');
  }
}

// Создание элемента чата для раздела "Мои чаты"
async function createMyChatElement(chat) {
  const chatDiv = document.createElement('div');
  chatDiv.className = 'chat-my-item';
  chatDiv.dataset.chatType = chat.type;
  chatDiv.dataset.participantId = chat.participantId;
  
  // Создаем контейнер для аватарки
  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'chat-my-avatar-container';
  
  if (chat.type === 'general') {
    // Для общего чата
    const generalAvatar = document.createElement('div');
    generalAvatar.className = 'chat-my-avatar-fallback';
    generalAvatar.textContent = '💬';
    avatarContainer.appendChild(generalAvatar);
  } else {
    // Для личного чата
    try {
      const avatarCode = await getUserAvatar(chat.participantId);
      const avatarElement = createAvatarElement(avatarCode, 24);
      avatarContainer.appendChild(avatarElement);
    } catch (error) {
      console.error('Ошибка при создании аватарки для чата:', error);
      const fallbackAvatar = document.createElement('div');
      fallbackAvatar.className = 'chat-my-avatar-fallback';
      fallbackAvatar.textContent = '👤';
      avatarContainer.appendChild(fallbackAvatar);
    }
  }
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'chat-my-info';
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'chat-my-name';
  
  if (chat.type === 'general') {
    nameDiv.textContent = 'Общий чат';
  } else {
    const userName = await getUserNameByUid(chat.participantId);
    nameDiv.textContent = userName;
  }
  
  const lastMessageDiv = document.createElement('div');
  lastMessageDiv.className = 'chat-my-last-message';
  lastMessageDiv.textContent = chat.lastMessage.length > 30 ? 
    chat.lastMessage.substring(0, 30) + '...' : chat.lastMessage;
  
  const timeDiv = document.createElement('div');
  timeDiv.className = 'chat-my-time';
  timeDiv.textContent = formatMessageTime(chat.lastTimestamp.toDate());
  
  infoDiv.appendChild(nameDiv);
  infoDiv.appendChild(lastMessageDiv);
  infoDiv.appendChild(timeDiv);
  
  chatDiv.appendChild(avatarContainer);
  chatDiv.appendChild(infoDiv);
  
  // Обработчик клика
  chatDiv.addEventListener('click', () => {
    selectMyChat(chat);
  });
  
  return chatDiv;
}

// Выбор чата из раздела "Мои чаты"
function selectMyChat(chat) {
  // Убираем выделение со всех чатов
  document.querySelectorAll('.chat-my-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Выделяем выбранный чат
  const selectedElement = document.querySelector(`[data-chat-type="${chat.type}"][data-participant-id="${chat.participantId}"]`);
  if (selectedElement) {
    selectedElement.classList.add('selected');
  }
  
  // Обновляем информацию о чате
  const chatInfo = document.getElementById('chat-info');
  
  if (chat.type === 'general') {
    chatInfo.textContent = '💬 Общий чат';
    chatInfo.style.color = '#666';
    markGeneralMessagesAsRead();
    loadChatMessages();
    // Устанавливаем переменные для отправки сообщений
    currentChatType = 'general';
    selectedUserId = null;
    selectedUserName = null;
  } else {
    getUserNameByUid(chat.participantId).then(userName => {
      chatInfo.textContent = `👤 Личное сообщение: ${userName}`;
      chatInfo.style.color = '#667eea';
      markPrivateMessagesAsRead(chat.participantId);
      loadPrivateMessages(chat.participantId);
      // Устанавливаем переменные для отправки сообщений
      currentChatType = 'private';
      selectedUserId = chat.participantId;
      selectedUserName = userName;
    });
  }
}

// Инициализация переключателя типа чата
setupChatTypeSwitcher();

// Обработчик кнопки обновления списка пользователей
document.getElementById('refresh-users-btn')?.addEventListener('click', () => {
  if (currentChatType === 'private') {
    loadChatUsers();
  }
});

// Функции для управления непрочитанными сообщениями
function updateUnreadBadge() {
  const badge = document.getElementById('chat-notification-badge');
  if (!badge) return;
  
  const totalUnread = unreadGeneralMessages + Array.from(unreadPrivateMessages.values()).reduce((sum, count) => sum + count, 0);
  
  if (totalUnread > 0) {
    badge.textContent = totalUnread > 99 ? '99+' : totalUnread.toString();
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function markGeneralMessagesAsRead() {
  unreadGeneralMessages = 0;
  lastReadGeneralTimestamp = new Date();
  updateUnreadBadge();
  
  // Сохраняем в localStorage
  localStorage.setItem('lastReadGeneralTimestamp', lastReadGeneralTimestamp.toISOString());
}

function markPrivateMessagesAsRead(userId) {
  unreadPrivateMessages.set(userId, 0);
  lastReadPrivateTimestamps.set(userId, new Date());
  updateUnreadBadge();
  
  // Сохраняем в localStorage
  const timestamps = Object.fromEntries(lastReadPrivateTimestamps);
  localStorage.setItem('lastReadPrivateTimestamps', JSON.stringify(timestamps));
}

function loadReadTimestamps() {
  // Загружаем время последнего прочтения общих сообщений
  const generalTimestamp = localStorage.getItem('lastReadGeneralTimestamp');
  if (generalTimestamp) {
    lastReadGeneralTimestamp = new Date(generalTimestamp);
  }
  
  // Загружаем время последнего прочтения личных сообщений
  const privateTimestamps = localStorage.getItem('lastReadPrivateTimestamps');
  if (privateTimestamps) {
    try {
      const timestamps = JSON.parse(privateTimestamps);
      Object.entries(timestamps).forEach(([userId, timestamp]) => {
        lastReadPrivateTimestamps.set(userId, new Date(timestamp));
      });
    } catch (error) {
      console.error('Ошибка загрузки времени прочтения личных сообщений:', error);
    }
  }
}

function checkForUnreadMessages(messageData) {
  const currentUser = auth.currentUser;
  const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
  const currentUserId = currentUser ? currentUser.uid : `custom_${customSession?.username}`;
  
  if (!currentUserId || messageData.senderId === currentUserId) {
    return; // Не считаем свои сообщения как непрочитанные
  }
  
  // Проверяем общие сообщения
  if (messageData.type === 'general' || !messageData.type) {
    if (!lastReadGeneralTimestamp || messageData.timestamp.toDate() > lastReadGeneralTimestamp) {
      unreadGeneralMessages++;
      updateUnreadBadge();
    }
  }
  
  // Проверяем личные сообщения
  if (messageData.type === 'private' && messageData.participants) {
    const otherUserId = messageData.participants.find(id => id !== currentUserId);
    if (otherUserId) {
      const lastRead = lastReadPrivateTimestamps.get(otherUserId);
      if (!lastRead || messageData.timestamp.toDate() > lastRead) {
        const currentCount = unreadPrivateMessages.get(otherUserId) || 0;
        unreadPrivateMessages.set(otherUserId, currentCount + 1);
        updateUnreadBadge();
      }
    }
  }
} 

// --- Боковое меню ---
const sideMenu = document.getElementById('side-menu');
const sideMenuContent = document.querySelector('.side-menu__content');
const openSideMenu = () => {
  sideMenu.classList.add('open');
  gsap.set(sideMenuContent, { x: '-100%' });
  gsap.to(sideMenu, { duration: 0.3, autoAlpha: 1, ease: 'power2.out' });
  gsap.to(sideMenuContent, { x: 0, duration: 0.5, ease: 'power3.out' });
};
const closeSideMenu = () => {
  gsap.to(sideMenuContent, { x: '-100%', duration: 0.5, ease: 'power3.in' });
  gsap.to(sideMenu, { duration: 0.3, autoAlpha: 0, delay: 0.5, onComplete: () => {
    sideMenu.classList.remove('open');
  }});
};
document.querySelector('.nav-menu-link')?.addEventListener('click', openSideMenu);
document.querySelector('.side-menu__close')?.addEventListener('click', closeSideMenu);
sideMenu?.addEventListener('click', function(e) {
  if (e.target === sideMenu) closeSideMenu();
});

// Конструктор аватарки
let currentAvatarCode = 'RSG'; // Дефолтная аватарка
let currentUserUid = null;

// Система уведомлений
function showNotification(message, type = 'info', duration = 4000) {
  const container = document.getElementById('notification-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <span class="notification-icon">${icons[type] || icons.info}</span>
    <span class="notification-text">${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  container.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Автоматическое скрытие
  if (duration > 0) {
    setTimeout(() => {
      hideNotification(notification);
    }, duration);
  }
  
  // Клик для закрытия
  notification.addEventListener('click', (e) => {
    if (e.target !== notification.querySelector('.notification-close')) {
      hideNotification(notification);
    }
  });
}

function hideNotification(notification) {
  notification.classList.remove('show');
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 400);
}

// Функция для обновления аватарок в комментариях
async function updateAvatarsInComments(userUid, newAvatarCode) {
  try {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    // Находим все комментарии текущего пользователя
    const commentItems = Array.from(commentsList.children);
    
    for (const commentItem of commentItems) {
      // Проверяем, принадлежит ли комментарий текущему пользователю
      const userNameElement = commentItem.querySelector('b');
      if (!userNameElement) continue;
      
      const userName = userNameElement.textContent;
      
      // Определяем, принадлежит ли комментарий текущему пользователю
      let isCurrentUserComment = false;
      
      if (userUid.startsWith('custom_')) {
        // Кастомный пользователь
        const customSession = JSON.parse(localStorage.getItem('customUserSession') || 'null');
        if (customSession && customSession.username === userName) {
          isCurrentUserComment = true;
        }
      } else {
        // Google пользователь
        const currentUser = auth.currentUser;
        if (currentUser && (currentUser.displayName === userName || currentUser.email === userName)) {
          isCurrentUserComment = true;
        }
      }
      
      if (isCurrentUserComment) {
        // Обновляем аватарку в комментарии
        const avatarContainer = commentItem.querySelector('div[style*="position: absolute"]');
        if (avatarContainer) {
          // Очищаем старую аватарку
          avatarContainer.innerHTML = '';
          
          // Создаем новую аватарку
          const newAvatarElement = createAvatarElement(newAvatarCode, 24);
          avatarContainer.appendChild(newAvatarElement);
          
          // Добавляем анимацию обновления
          newAvatarElement.style.transform = 'scale(0)';
          newAvatarElement.style.transition = 'transform 0.3s ease';
          setTimeout(() => {
            newAvatarElement.style.transform = 'scale(1)';
          }, 10);
        }
      }
    }
    
    console.log('Аватарки в комментариях обновлены для пользователя:', userUid);
    
  } catch (error) {
    console.error('Ошибка при обновлении аватарок в комментариях:', error);
  }
}

// Функция для обновления предварительного просмотра аватарки
function updateAvatarPreview() {
  const previewContainer = document.getElementById('avatar-preview-container');
  console.log('Обновление предварительного просмотра:', currentAvatarCode);
  if (previewContainer) {
    previewContainer.innerHTML = '';
    
    // Определяем размер аватара в зависимости от размера экрана
    let avatarSize = 120; // базовый размер для десктопа
    if (window.innerWidth <= 480) {
      avatarSize = 200; // большой размер для маленьких экранов
    } else if (window.innerWidth <= 768) {
      avatarSize = 180; // средний размер для планшетов
    }
    
    const avatarElement = createAvatarElement(currentAvatarCode, avatarSize);
    previewContainer.appendChild(avatarElement);
    console.log('Аватарка обновлена в предварительном просмотре, размер:', avatarSize);
  } else {
    console.log('Контейнер предварительного просмотра не найден');
  }
}

// Функция для обновления активных кнопок
function updateActiveButtons() {
  const color1 = currentAvatarCode[0];
  const shape = currentAvatarCode[1];
  const color2 = currentAvatarCode[2];
  
  console.log('Обновление кнопок:', { color1, shape, color2, currentAvatarCode });
  
  // Обновляем активные кнопки цветов фона
  document.querySelectorAll('.background-color-btn').forEach(btn => {
    const isActive = btn.dataset.color === color2;
    btn.classList.toggle('active', isActive);
    console.log('Кнопка фона:', btn.dataset.color, 'активна:', isActive);
  });
  
  // Обновляем активные кнопки форм
  document.querySelectorAll('.shape-btn').forEach(btn => {
    const isActive = btn.dataset.shape === shape;
    btn.classList.toggle('active', isActive);
    console.log('Кнопка формы:', btn.dataset.shape, 'активна:', isActive);
  });
  
  // Обновляем активные кнопки цветов формы
  document.querySelectorAll('.shape-color-btn').forEach(btn => {
    const isActive = btn.dataset.color === color1;
    btn.classList.toggle('active', isActive);
    console.log('Кнопка цвета формы:', btn.dataset.color, 'активна:', isActive);
  });
}

// Функция для инициализации конструктора аватарки
function initAvatarConstructor() {
  const modal = document.getElementById('modal-profile');
  if (!modal) return;
  
  // Получаем текущую аватарку пользователя
  const session = JSON.parse(localStorage.getItem('customUserSession') || 'null');
  if (session && session.isCustomUser) {
    currentUserUid = `custom_${session.username}`;
  } else if (auth.currentUser) {
    currentUserUid = auth.currentUser.uid;
  }
  
  // Загружаем текущую аватарку пользователя
  if (currentUserUid) {
    getUserAvatar(currentUserUid).then(avatarCode => {
      currentAvatarCode = avatarCode;
      updateAvatarPreview();
      updateActiveButtons();
    });
  } else {
    updateAvatarPreview();
    updateActiveButtons();
  }
  
  // Добавляем обработчики событий
  addAvatarConstructorEventListeners();
  
  // Добавляем обработчик изменения размера окна для обновления предпросмотра
  window.addEventListener('resize', () => {
    if (modal.classList.contains('show')) {
      updateAvatarPreview();
    }
  });
}

// Функция для добавления обработчиков событий конструктора
function addAvatarConstructorEventListeners() {
  console.log('Добавление обработчиков событий конструктора');
  
  // Обработчики для кнопок цветов фона
  const backgroundBtns = document.querySelectorAll('.background-color-btn');
  console.log('Найдено кнопок цвета фона:', backgroundBtns.length);
  backgroundBtns.forEach(btn => {
    // Удаляем старые обработчики
    btn.removeEventListener('click', handleBackgroundColorChange);
    // Добавляем новый обработчик
    btn.addEventListener('click', handleBackgroundColorChange);
    console.log('Добавлен обработчик для кнопки цвета фона:', btn.dataset.color);
  });
  
  // Обработчики для кнопок форм
  const shapeBtns = document.querySelectorAll('.shape-btn');
  console.log('Найдено кнопок форм:', shapeBtns.length);
  shapeBtns.forEach(btn => {
    // Удаляем старые обработчики
    btn.removeEventListener('click', handleShapeChange);
    // Добавляем новый обработчик
    btn.addEventListener('click', handleShapeChange);
    console.log('Добавлен обработчик для кнопки формы:', btn.dataset.shape);
  });
  
  // Обработчики для кнопок цветов формы
  const shapeColorBtns = document.querySelectorAll('.shape-color-btn');
  console.log('Найдено кнопок цвета формы:', shapeColorBtns.length);
  shapeColorBtns.forEach(btn => {
    // Удаляем старые обработчики
    btn.removeEventListener('click', handleShapeColorChange);
    // Добавляем новый обработчик
    btn.addEventListener('click', handleShapeColorChange);
    console.log('Добавлен обработчик для кнопки цвета формы:', btn.dataset.color);
  });
  
  // Обработчик для кнопки случайной аватарки
  const randomBtn = document.getElementById('random-avatar-btn');
  if (randomBtn) {
    randomBtn.removeEventListener('click', handleRandomAvatar);
    randomBtn.addEventListener('click', handleRandomAvatar);
    console.log('Добавлен обработчик для кнопки случайной аватарки');
  } else {
    console.log('Кнопка случайной аватарки не найдена');
  }
  
  // Обработчик для кнопки сохранения
  const saveBtn = document.getElementById('save-avatar-btn');
  if (saveBtn) {
    saveBtn.removeEventListener('click', handleSaveAvatar);
    saveBtn.addEventListener('click', handleSaveAvatar);
    console.log('Добавлен обработчик для кнопки сохранения');
  } else {
    console.log('Кнопка сохранения не найдена');
  }
}

// Обработчики событий
function handleBackgroundColorChange(e) {
  const newColor = e.target.dataset.color;
  console.log('Изменение цвета фона:', newColor, 'старый код:', currentAvatarCode);
  currentAvatarCode = currentAvatarCode[0] + currentAvatarCode[1] + newColor;
  console.log('Новый код:', currentAvatarCode);
  updateAvatarPreview();
  updateActiveButtons();
}

function handleShapeChange(e) {
  const newShape = e.target.dataset.shape;
  console.log('Изменение формы:', newShape, 'старый код:', currentAvatarCode);
  currentAvatarCode = currentAvatarCode[0] + newShape + currentAvatarCode[2];
  console.log('Новый код:', currentAvatarCode);
  updateAvatarPreview();
  updateActiveButtons();
}

function handleShapeColorChange(e) {
  const newColor = e.target.dataset.color;
  console.log('Изменение цвета формы:', newColor, 'старый код:', currentAvatarCode);
  currentAvatarCode = newColor + currentAvatarCode[1] + currentAvatarCode[2];
  console.log('Новый код:', currentAvatarCode);
  updateAvatarPreview();
  updateActiveButtons();
}

function handleRandomAvatar() {
  currentAvatarCode = generateRandomAvatarCode();
  updateAvatarPreview();
  updateActiveButtons();
  showNotification('Сгенерирована новая аватарка! 🎲', 'info', 2000);
}

async function handleSaveAvatar() {
  if (!currentUserUid) {
    showNotification('Пожалуйста, войдите в систему для сохранения аватарки', 'warning', 5000);
    return;
  }
  
  try {
    // Показываем уведомление о начале сохранения
    showNotification('Сохранение аватарки...', 'info', 0);
    
    // Сохраняем аватарку в базу данных
    await db.collection('avatarka').doc(currentUserUid).set({
      code: currentAvatarCode,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Обновляем аватарку в UI
    const userAvatarContainer = document.getElementById('user-avatar-container');
    if (userAvatarContainer) {
      await updateUserAvatarInUI(currentUserUid, userAvatarContainer);
    }
    
    // Обновляем аватарки в комментариях
    await updateAvatarsInComments(currentUserUid, currentAvatarCode);
    
    // Удаляем уведомление о сохранении
    const container = document.getElementById('notification-container');
    if (container) {
      const savingNotification = container.querySelector('.notification');
      if (savingNotification) {
        savingNotification.remove();
      }
    }
    
    // Показываем сообщение об успехе
    showNotification('Аватарка сохранена! Изменения применятся позже 🔄', 'success', 4000);
    
    // Показываем дополнительное уведомление об обновлении комментариев
    setTimeout(() => {
      showNotification('Аватарки в комментариях также обновлены! 💬', 'info', 2500);
    }, 1000);
    
    // Закрываем модальное окно
    const modal = document.getElementById('modal-profile');
    if (modal) {
      closeModal(modal);
    }
    
  } catch (error) {
    console.error('Ошибка при сохранении аватарки:', error);
    
    // Удаляем уведомление о сохранении
    const container = document.getElementById('notification-container');
    if (container) {
      const savingNotification = container.querySelector('.notification');
      if (savingNotification) {
        savingNotification.remove();
      }
    }
    
    showNotification('Ошибка при сохранении аватарки. Попробуйте позже.', 'error', 5000);
  }
}

// Обработчик клика по аватарке пользователя
document.getElementById('user-avatar-container')?.addEventListener('click', function() {
  const modal = document.getElementById('modal-profile');
  if (modal) {
    modal.style.display = 'flex';
    if (window.gsap) {
      gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power3.out' });
      gsap.fromTo(modal.querySelector('.modal__content'),
        { scale: 0.95, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
      );
    }
    document.body.style.overflow = 'hidden';
    
    // Инициализируем конструктор аватарки
    setTimeout(initAvatarConstructor, 100);
  }
});

// ===== ЗАГРУЗКА НОВОСТЕЙ ИЗ FIREBASE =====
async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) {
        console.error('Контейнер новостей не найден');
        return;
    }

    console.log('Начинаем загрузку новостей...');

    try {
        // Проверяем, инициализирован ли Firebase
        if (!db) {
            console.error('Firebase не инициализирован');
            throw new Error('Firebase не инициализирован');
        }

        // Показываем индикатор загрузки
        newsContainer.innerHTML = `
            <div class="news-loading">
                <div class="loading-spinner"></div>
                <p>Загрузка новостей...</p>
            </div>
        `;

        console.log('Запрашиваем коллекцию news...');

        // Загружаем новости с сортировкой по полю 'created' в убывающем порядке
        let newsSnapshot;
        try {
            newsSnapshot = await db.collection('news')
                .orderBy('created', 'desc')
                .get();
            console.log('Загружено с сортировкой по created:', newsSnapshot.size, 'документов');
        } catch (sortError) {
            console.log('Ошибка при сортировке по created, пробуем без сортировки:', sortError);
            // Если есть ошибка с сортировкой, загружаем без неё
            newsSnapshot = await db.collection('news').get();
        }

        console.log('Результат запроса:', newsSnapshot);
        console.log('Количество документов:', newsSnapshot.size);
        console.log('Пустая коллекция?', newsSnapshot.empty);

        if (newsSnapshot.empty) {
            console.log('Коллекция пустая, показываем сообщение');
            // Если новостей нет
            newsContainer.innerHTML = `
                <div class="news-empty">
                    <h3>Новостей пока нет</h3>
                    <p>Следите за обновлениями!</p>
                    <button onclick="loadNews()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Обновить
                    </button>
                </div>
            `;
            return;
        }

        // Показываем только первую (самую последнюю) новость
        if (newsSnapshot.size > 0) {
            const firstDoc = newsSnapshot.docs[0]; // Берем первый документ (самый последний по дате создания)
            console.log('Показываем новость:', firstDoc.id);
            const newsData = firstDoc.data();
            console.log('Данные новости:', newsData);
            
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            
            // Проверяем наличие контента
            const content = newsData.content || newsData.html || newsData.text || '';
            console.log('Контент новости:', content);
            
            // Парсим размер из первой строки
            let windowSize = null;
            let cleanContent = content;
            
            if (content) {
                const lines = content.split('\n');
                const firstLine = lines[0].trim();
                
                // Проверяем, является ли первая строка размером (например, "600x600")
                const sizeMatch = firstLine.match(/^(\d+)x(\d+)$/);
                if (sizeMatch) {
                    const width = parseInt(sizeMatch[1]);
                    const height = parseInt(sizeMatch[2]);
                    windowSize = { width, height };
                    
                    // Убираем первую строку из контента
                    cleanContent = lines.slice(1).join('\n');
                    console.log(`Размер окна: ${width}x${height}`);
                }
            }
            
            // Применяем размер к контейнеру новости
            if (windowSize) {
                // Проверяем размер экрана для всех устройств
                const screenWidth = window.innerWidth - 40; // Отступы с каждой стороны
                const screenHeight = window.innerHeight - 200; // Отступ для хедера и других элементов
                
                // Проверяем, помещается ли новость на экран
                if (windowSize.width <= screenWidth && windowSize.height <= screenHeight) {
                    // Если новость помещается на экран, показываем её полностью
                    newsItem.style.width = `${windowSize.width}px`;
                    newsItem.style.height = `${windowSize.height}px`;
                    newsItem.style.overflow = 'hidden';
                    
                    console.log('Новость помещается на экран - показываем полностью:');
                    console.log('Оригинальный размер:', windowSize.width, 'x', windowSize.height);
                    console.log('Доступный экран:', screenWidth, 'x', screenHeight);
                } else {
                    // Если новость не помещается, добавляем прокрутку
                    const maxWidth = Math.min(screenWidth, windowSize.width);
                    const maxHeight = Math.min(screenHeight, windowSize.height);
                    
                    console.log('Новость не помещается на экран - добавляем прокрутку:');
                    console.log('Оригинальный размер:', windowSize.width, 'x', windowSize.height);
                    console.log('Доступный экран:', screenWidth, 'x', screenHeight);
                    console.log('Устанавливаем размер контейнера:', maxWidth, 'x', maxHeight);
                    
                    newsItem.style.width = `${maxWidth}px`;
                    newsItem.style.height = `${maxHeight}px`;
                    newsItem.style.overflow = 'auto';
                    newsItem.style.maxWidth = `${windowSize.width}px`;
                    newsItem.style.maxHeight = `${windowSize.height}px`;
                }
                
                newsItem.style.position = 'relative';
                newsItem.style.margin = '0 auto';
                newsItem.style.borderRadius = '16px';
            }
            
            // Вставляем очищенный HTML контент новости
            const contentDiv = document.createElement('div');
            contentDiv.className = 'news-content';
            if (windowSize) {
                // Устанавливаем размер контента равным оригинальному размеру новости
                contentDiv.style.width = `${windowSize.width}px`;
                contentDiv.style.height = `${windowSize.height}px`;
                contentDiv.style.minWidth = `${windowSize.width}px`;
                contentDiv.style.minHeight = `${windowSize.height}px`;
                // Сохраняем оригинальный размер для обработчика resize
                contentDiv.dataset.originalSize = `${windowSize.width}x${windowSize.height}`;
            }
            contentDiv.innerHTML = cleanContent;
            
            // Добавляем отладочную информацию
            if (windowSize) {
                console.log('Создаем новость с размером:', windowSize.width, 'x', windowSize.height);
                console.log('Размер контента установлен:', contentDiv.style.width, 'x', contentDiv.style.height);
            }
            
            newsItem.appendChild(contentDiv);
            
            // Заменяем индикатор загрузки на одну новость
            newsContainer.innerHTML = '';
            newsContainer.appendChild(newsItem);
        } else {
            // Если новостей нет
            newsContainer.innerHTML = `
                <div class="news-empty">
                    <h3>Новостей пока нет</h3>
                    <p>Следите за обновлениями!</p>
                    <button onclick="loadNews()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Обновить
                    </button>
                </div>
            `;
        }

        console.log(`Успешно загружено ${newsSnapshot.size} новостей`);

    } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        console.error('Детали ошибки:', error.message, error.code);
        
        // Показываем сообщение об ошибке с деталями
        newsContainer.innerHTML = `
            <div class="news-error">
                <h3>Ошибка загрузки</h3>
                <p>Не удалось загрузить новости: ${error.message}</p>
                <p style="font-size: 0.9em; margin-top: 0.5rem;">Код ошибки: ${error.code || 'неизвестно'}</p>
                <button onclick="loadNews()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Попробовать снова
                </button>
            </div>
        `;
    }
}

// Загружаем новости при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, ждем инициализации Firebase...');
    // Загружаем новости после инициализации Firebase
    setTimeout(() => {
        console.log('Проверяем инициализацию Firebase...');
        if (db) {
            console.log('Firebase инициализирован, загружаем новости');
            loadNews();
        } else {
            console.log('Firebase еще не инициализирован, ждем еще...');
            setTimeout(loadNews, 2000);
        }
    }, 2000);
});

// Функция для обновления новостей (можно вызывать вручную)
function refreshNews() {
    loadNews();
}

// Функция для адаптации размера новости при изменении размера окна
function adaptNewsSize() {
    const newsItem = document.querySelector('.news-item');
    if (!newsItem) return;
    
    const contentDiv = newsItem.querySelector('.news-content');
    if (!contentDiv || !contentDiv.dataset.originalSize) return;
    
    const sizeMatch = contentDiv.dataset.originalSize.match(/^(\d+)x(\d+)$/);
    if (!sizeMatch) return;
    
    const windowSize = {
        width: parseInt(sizeMatch[1]),
        height: parseInt(sizeMatch[2])
    };
    
    // Проверяем размер экрана для всех устройств
    const screenWidth = window.innerWidth - 40;
    const screenHeight = window.innerHeight - 200;
    
    // Проверяем, помещается ли новость на экран
    if (windowSize.width <= screenWidth && windowSize.height <= screenHeight) {
        newsItem.style.width = `${windowSize.width}px`;
        newsItem.style.height = `${windowSize.height}px`;
        newsItem.style.overflow = 'hidden';
        
        console.log('Адаптация - новость помещается на экран:');
        console.log('Оригинальный размер:', windowSize.width, 'x', windowSize.height);
        console.log('Доступный экран:', screenWidth, 'x', screenHeight);
    } else {
        const maxWidth = Math.min(screenWidth, windowSize.width);
        const maxHeight = Math.min(screenHeight, windowSize.height);
        
        console.log('Адаптация - новость не помещается на экран:');
        console.log('Оригинальный размер:', windowSize.width, 'x', windowSize.height);
        console.log('Доступный экран:', screenWidth, 'x', screenHeight);
        console.log('Устанавливаем размер контейнера:', maxWidth, 'x', maxHeight);
        
        newsItem.style.width = `${maxWidth}px`;
        newsItem.style.height = `${maxHeight}px`;
        newsItem.style.overflow = 'auto';
        newsItem.style.maxWidth = `${windowSize.width}px`;
        newsItem.style.maxHeight = `${windowSize.height}px`;
    }
    
    // Обновляем размеры контента
    contentDiv.style.width = `${windowSize.width}px`;
    contentDiv.style.height = `${windowSize.height}px`;
    contentDiv.style.minWidth = `${windowSize.width}px`;
    contentDiv.style.minHeight = `${windowSize.height}px`;
}

// Добавляем обработчик изменения размера окна
window.addEventListener('resize', adaptNewsSize);

// Функция для тестирования подключения к Firebase
async function testFirebaseConnection() {
    console.log('=== ТЕСТ ПОДКЛЮЧЕНИЯ К FIREBASE ===');
    
    try {
        if (!db) {
            console.error('❌ Firebase не инициализирован');
            return false;
        }
        
        console.log('✅ Firebase инициализирован');
        
        // Проверяем подключение к коллекции news
        const testSnapshot = await db.collection('news').limit(1).get();
        console.log('✅ Подключение к коллекции news успешно');
        console.log('📊 Количество документов в коллекции:', testSnapshot.size);
        
        if (!testSnapshot.empty) {
            const testDoc = testSnapshot.docs[0];
            const testData = testDoc.data();
            console.log('📄 Пример документа:', testDoc.id);
            console.log('📋 Данные документа:', testData);
            
            // Проверяем наличие поля created
            if (testData.created) {
                console.log('📅 Поле created найдено:', testData.created);
            } else {
                console.log('⚠️ Поле created не найдено в документе');
            }
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Ошибка подключения к Firebase:', error);
        console.error('🔍 Детали ошибки:', error.message, error.code);
        return false;
    }
}

// Запускаем тест подключения через 3 секунды после загрузки страницы
setTimeout(testFirebaseConnection, 3000);



// Обработчик изменения размера окна для адаптации новостей
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Перезагружаем новость для применения новых размеров
        const newsItem = document.querySelector('.news-item[style*="width"]');
        if (newsItem) {
            const content = newsItem.querySelector('.news-content');
            if (content && content.dataset.originalSize) {
                const [width, height] = content.dataset.originalSize.split('x').map(Number);
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    // На мобильных устройствах сохраняем пропорции, но ограничиваем высоту
                    const maxHeight = Math.min(height, 600); // Максимальная высота 600px
                    const aspectRatio = width / height;
                    const calculatedWidth = Math.min(window.innerWidth - 40, width); // Отступы 20px с каждой стороны
                    const calculatedHeight = calculatedWidth / aspectRatio;
                    
                    newsItem.style.width = `${calculatedWidth}px`;
                    newsItem.style.height = `${Math.min(calculatedHeight, maxHeight)}px`;
                    newsItem.style.maxWidth = `${width}px`;
                    newsItem.style.maxHeight = `${maxHeight}px`;
                } else {
                    newsItem.style.width = `${width}px`;
                    newsItem.style.height = `${height}px`;
                }
            }
        }
        

    }, 250);
});

