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

// === Firebase config и логика аутентификации/комментариев ===
// Конфиг теперь берём из window.FIREBASE_CONFIG, который подключается отдельным файлом (не коммитить в git)
const firebaseConfig = window.FIREBASE_CONFIG;

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const authSection = document.getElementById('auth-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const commentsSection = document.getElementById('comments-section');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentsList = document.getElementById('comments-list');
const privacyNote = document.querySelector('.user-privacy-note');

function showAuthSection(show) {
  if (authSection) authSection.style.display = show ? '' : 'none';
}
function showCommentsSection(show) {
  if (commentsSection) commentsSection.style.display = show ? '' : 'none';
}

// Google Auth
if (loginBtn) {
  loginBtn.onclick = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
}
if (logoutBtn) {
  logoutBtn.onclick = function() {
    auth.signOut();
  };
}

// Auth state
if (auth) {
  auth.onAuthStateChanged(user => {
    if (user) {
      showAuthSection(true);
      showCommentsSection(true);
      loginBtn.style.display = 'none';
      logoutBtn.style.display = '';
      userInfo.innerHTML = `<b>${user.displayName}</b>`;
      if (privacyNote) privacyNote.style.display = '';
      loadComments();
    } else {
      showAuthSection(true);
      showCommentsSection(false);
      loginBtn.style.display = '';
      logoutBtn.style.display = 'none';
      userInfo.innerHTML = '';
      if (privacyNote) privacyNote.style.display = 'none';
    }
  });
}

// Добавление комментария
if (commentForm) {
  commentForm.onsubmit = async function(e) {
    e.preventDefault();
    const user = auth.currentUser;
    const text = commentInput.value.trim();
    if (!user || !text) return;
    await db.collection('comments').add({
      text,
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      created: firebase.firestore.FieldValue.serverTimestamp()
    });
    commentInput.value = '';
    loadComments();
  };
}

// Загрузка комментариев
async function loadComments() {
  if (!commentsList) return;
  commentsList.innerHTML = '<em>Загрузка...</em>';
  const snap = await db.collection('comments').orderBy('created', 'desc').limit(5).get();
  if (snap.empty) {
    commentsList.innerHTML = '<em>Комментариев пока нет.</em>';
    return;
  }
  commentsList.innerHTML = '';
  snap.forEach(doc => {
    const c = doc.data();
    const date = c.created && c.created.toDate ? c.created.toDate().toLocaleString() : '';
    const el = document.createElement('div');
    el.style = 'border-bottom:1px solid #eee;padding:0.5em 0;';
    el.innerHTML = `<b>${c.name || 'Аноним'}</b> <span style="color:#888;font-size:0.9em;">${date}</span><br>${c.text}`;
    commentsList.appendChild(el);
  });
} 