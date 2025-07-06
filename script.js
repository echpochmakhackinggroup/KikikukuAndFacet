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

// Запуск анимации счетчиков
animateCounters();

// Мобильное меню (если нужно)
const burger = document.querySelector('.nav__burger');
const menu = document.querySelector('.nav__menu');

if (burger && menu) {
    burger.addEventListener('click', () => {
        menu.classList.toggle('active');
        
        // Анимация бургер меню
        const spans = burger.querySelectorAll('span');
        if (menu.classList.contains('active')) {
            gsap.to(spans[0], { rotation: 45, y: 7 });
            gsap.to(spans[1], { opacity: 0 });
            gsap.to(spans[2], { rotation: -45, y: -7 });
        } else {
            gsap.to(spans[0], { rotation: 0, y: 0 });
            gsap.to(spans[1], { opacity: 1 });
            gsap.to(spans[2], { rotation: 0, y: 0 });
        }
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