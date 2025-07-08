// Инициализация GSAP плагинов
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
    btn.addEventListener('click', () => {
        const modal = document.getElementById('modal-experimental');
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
})();

// --- Эффект отражения для плит при движении мышки или наклоне (гироскоп) ---
(function setupReflectionEffect() {
    const toggle = document.getElementById('reflection-toggle');
    if (!toggle) return;
    let enabled = false;
    let rafId = null;
    let gyroscope = null;
    let gyroX = 0, gyroY = 0;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const cards = () => Array.from(document.querySelectorAll('.service__card, .stat'));

    // Возвращает минимальное расстояние от мышки до пересечения с другой плитой (или Infinity)
    function obstructionDistance(card, mouseX, mouseY, allCards) {
        const rectA = card.getBoundingClientRect();
        const cx = rectA.left + rectA.width/2;
        const cy = rectA.top + rectA.height/2;
        let minDist = Infinity;
        for (const other of allCards) {
            if (other === card) continue;
            const rectB = other.getBoundingClientRect();
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
                    if (dist < minDist) minDist = dist;
                }
            }
        }
        return minDist;
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
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;
        // Яркость блика: если нет перекрытия — 1, если есть — плавно убывает с расстоянием
        let brightness = 1;
        const minDist = obstructionDistance(card, mouseX, mouseY, allCards);
        if (minDist !== Infinity) {
            // Чем ближе перекрытие — тем слабее (0.1...0.7)
            brightness = Math.max(0.1, Math.min(0.7, minDist/200));
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
    function onMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const all = cards();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            all.forEach(card => setReflection(card, mouseX, mouseY, all));
        });
    }
    function onGyro() {
        // gyroX, gyroY обновляются в обработчике гироскопа
        // Преобразуем значения в виртуальную точку "света" на экране
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Чем сильнее наклон, тем дальше точка
        const mouseX = w/2 + gyroY * w * 0.7;
        const mouseY = h/2 + gyroX * h * 0.7;
        const all = cards();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            all.forEach(card => setReflection(card, mouseX, mouseY, all));
        });
    }
    function enable() {
        enabled = true;
        if (isMobile && 'Gyroscope' in window) {
            try {
                gyroscope = new Gyroscope({ frequency: 30 });
                gyroscope.addEventListener('reading', () => {
                    gyroX = gyroscope.x;
                    gyroY = gyroscope.y;
                    onGyro();
                });
                gyroscope.start();
            } catch (e) {
                // Гироскоп не поддерживается
                gyroscope = null;
            }
        } else {
            window.addEventListener('mousemove', onMouseMove);
        }
        cards().forEach(card => card.classList.add('with-reflection'));
    }
    function disable() {
        enabled = false;
        if (isMobile && gyroscope) {
            gyroscope.stop();
            gyroscope = null;
        }
        window.removeEventListener('mousemove', onMouseMove);
        cards().forEach(clearReflection);
    }
    toggle.addEventListener('change', () => {
        if (toggle.checked) enable();
        else disable();
    });
    // На мобильных теперь не отключаем, а используем гироскоп
})(); 