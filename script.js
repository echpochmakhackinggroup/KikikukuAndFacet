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

// --- Тёмная тема ---
(function setupDarkThemeToggle() {
    const btn = document.getElementById('toggle-dark-theme');
    if (!btn) return;
    const body = document.body;
    function setBtnText(isDark) {
        btn.textContent = isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема';
    }
    function applyThemeByTime() {
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 7) {
            body.classList.add('dark-theme');
            setBtnText(true);
        } else {
            body.classList.remove('dark-theme');
            setBtnText(false);
        }
    }
    applyThemeByTime();
    btn.onclick = function() {
        body.classList.add('theme-anim');
        setTimeout(() => body.classList.remove('theme-anim'), 350);
        const isDark = body.classList.toggle('dark-theme');
        setBtnText(isDark);
    };
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

 