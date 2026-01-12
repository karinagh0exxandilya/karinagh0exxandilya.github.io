// Создание частиц на фоне
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Загрузка фотографий из папки images
function loadGalleryImages() {
    const gallery = document.getElementById('gallery');
    const placeholder = gallery.querySelector('.gallery-placeholder');
    
    // Список возможных имен файлов для проверки
    // Пользователь может добавить фотографии с любыми именами
    const possibleNames = [
        // Стандартные имена
        'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg',
        'photo7.jpg', 'photo8.jpg', 'photo9.jpg', 'photo10.jpg', 'photo11.jpg', 'photo12.jpg',
        'photo1.png', 'photo2.png', 'photo3.png', 'photo4.png', 'photo5.png', 'photo6.png',
        'photo7.png', 'photo8.png', 'photo9.png', 'photo10.png', 'photo11.png', 'photo12.png',
        // Альтернативные имена
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg',
        '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png',
        'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg',
        'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg',
        // С расширениями
        'photo1.jpeg', 'photo2.jpeg', 'photo3.jpeg',
        'photo1.webp', 'photo2.webp', 'photo3.webp',
        'photo1.gif', 'photo2.gif', 'photo3.gif'
    ];
    
    const foundImages = [];
    let checkedCount = 0;
    const totalToCheck = possibleNames.length;
    
    // Проверяем каждое возможное имя
    possibleNames.forEach((name) => {
        const img = new Image();
        
        img.onload = function() {
            foundImages.push(name);
            checkedCount++;
            checkComplete();
        };
        
        img.onerror = function() {
            checkedCount++;
            checkComplete();
        };
        
        img.src = `images/${name}`;
    });
    
    function checkComplete() {
        if (checkedCount === totalToCheck) {
            if (foundImages.length > 0) {
                displayImages(foundImages);
            } else {
                // Показываем инструкцию, если изображения не найдены
                if (placeholder) {
                    placeholder.style.display = 'block';
                }
            }
        }
    }
}

// Отображение изображений в галерее
function displayImages(imageNames) {
    const gallery = document.getElementById('gallery');
    const placeholder = gallery.querySelector('.gallery-placeholder');
    
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    // Очищаем галерею (кроме placeholder)
    gallery.innerHTML = '';
    
    imageNames.forEach((imgName, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.animationDelay = `${index * 0.1}s`;
        
        const img = document.createElement('img');
        img.src = `images/${imgName}`;
        img.alt = `Фото ${index + 1}`;
        img.loading = 'lazy';
        
        galleryItem.appendChild(img);
        galleryItem.addEventListener('click', () => openLightbox(index, imageNames));
        
        gallery.appendChild(galleryItem);
    });
}

// Lightbox функционал
let currentImageIndex = 0;
let currentImages = [];

function openLightbox(index, images) {
    currentImageIndex = index;
    currentImages = images;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    lightboxImage.src = `images/${images[index]}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextImage() {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    document.getElementById('lightbox-image').src = `images/${currentImages[currentImageIndex]}`;
}

function showPrevImage() {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    document.getElementById('lightbox-image').src = `images/${currentImages[currentImageIndex]}`;
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Добавляем класс для анимации к элементам
    const animatedElements = document.querySelectorAll('.quote-card, .final-message');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-on-scroll');
        observer.observe(el);
    });
}

// Плавная прокрутка для индикатора скролла
function initSmoothScroll() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
}

// Обработка клавиатуры для lightbox
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });
}

// Открытие конверта
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelope-container');
    const letterSection = document.getElementById('letter-section');
    const letterDate = document.getElementById('letter-date');
    
    // Устанавливаем текущую дату
    if (letterDate) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        letterDate.textContent = today.toLocaleDateString('ru-RU', options);
    }
    
    if (envelopeContainer && envelope && letterSection) {
        let isOpened = false;
        
        envelopeContainer.addEventListener('click', () => {
            if (!isOpened) {
                isOpened = true;
                envelope.classList.add('opened');
                
                // Скрываем подсказку
                const hint = envelopeContainer.querySelector('.envelope-hint');
                if (hint) {
                    hint.style.transition = 'opacity 0.3s ease';
                    hint.style.opacity = '0';
                    setTimeout(() => {
                        hint.style.display = 'none';
                    }, 300);
                }
                
                // Добавляем эффект частиц при открытии
                createEnvelopeParticles(envelopeContainer);
                
                // Показываем письмо через небольшую задержку
                setTimeout(() => {
                    letterSection.classList.add('show');
                    
                    // Плавная прокрутка к письму
                    setTimeout(() => {
                        letterSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }, 500);
                }, 600);
            }
        });
        
        // Добавляем эффект при наведении (только для десктопа)
        if (window.innerWidth > 768) {
            envelopeContainer.addEventListener('mouseenter', () => {
                if (!isOpened) {
                    envelope.style.transition = 'transform 0.3s ease';
                    envelope.style.transform = 'scale(1.05)';
                }
            });
            
            envelopeContainer.addEventListener('mouseleave', () => {
                if (!isOpened) {
                    envelope.style.transform = 'scale(1)';
                }
            });
        }
        
        // Добавляем тактильную обратную связь для мобильных
        envelopeContainer.addEventListener('touchstart', () => {
            if (!isOpened) {
                envelope.style.transition = 'transform 0.1s ease';
                envelope.style.transform = 'scale(0.95)';
            }
        });
        
        envelopeContainer.addEventListener('touchend', () => {
            if (!isOpened) {
                envelope.style.transform = 'scale(1)';
            }
        });
    }
}

// Эффект частиц при открытии конверта
function createEnvelopeParticles(container) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = 'rgba(255, 255, 255, 0.9)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.transform = `translate(-50%, -50%)`;
        particle.style.animation = `envelopeParticle 1s ease-out forwards`;
        particle.style.setProperty('--x', x + 'px');
        particle.style.setProperty('--y', y + 'px');
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Добавляем CSS анимацию для частиц
    if (!document.getElementById('envelope-particles-style')) {
        const style = document.createElement('style');
        style.id = 'envelope-particles-style';
        style.textContent = `
            @keyframes envelopeParticle {
                0% {
                    transform: translate(-50%, -50%) translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Комплименты
const compliments = [
    "Твой смех - это самая красивая мелодия, которую я когда-либо слышал ❤️",
    "Когда ты рядом, время останавливается, и весь мир замирает 💕",
    "Твои руки - самое безопасное место, где я хочу быть всегда 💖",
    "Ты умеешь превращать обычные моменты в магию 💗",
    "Твой взгляд на мир заставляет меня видеть красоту в простых вещах 💝",
    "С тобой я понял, что значит по-настоящему жить, а не просто существовать ❤️",
    "Твоя способность находить радость в мелочах - это дар, который я обожаю 💕",
    "Когда ты говоришь, я забываю обо всем на свете - только ты и твой голос 💖",
    "Ты умеешь делать так, что даже пасмурный день становится солнечным 💗",
    "Твоя улыбка - это не просто улыбка, это целая вселенная счастья 💝",
    "С тобой я научился ценить моменты, а не ждать их окончания ❤️",
    "Ты видишь во мне то, чего я сам в себе не замечал 💕",
    "Твоя интуиция и мудрость поражают меня каждый раз 💖",
    "Когда ты рядом, я чувствую, что все возможно, даже невозможное 💗",
    "Твой способ заботиться обо мне делает меня самым счастливым человеком 💝",
    "Ты умеешь читать мои мысли еще до того, как я их выскажу ❤️",
    "Твоя страсть к жизни заразительна - я хочу жить так же ярко, как ты 💕",
    "С тобой я понял, что любовь - это не чувство, а выбор, и я выбираю тебя каждый день 💖",
    "Твоя способность прощать и понимать - это то, что делает тебя особенной 💗",
    "Когда ты смотришь на меня, я чувствую, что я - самый важный человек в мире 💝",
    "Твой способ видеть красоту в несовершенстве учит меня принимать себя ❤️",
    "С тобой я не боюсь быть уязвимым - ты создаешь безопасное пространство 💕",
    "Твоя энергия и жизнерадостность - это то, что заряжает меня каждый день 💖",
    "Ты умеешь превращать мои страхи в смелость просто своим присутствием 💗",
    "Твой способ любить меня показывает, что такое настоящая забота 💝",
    "С тобой я понял, что значит быть по-настоящему счастливым, а не просто довольным ❤️",
    "Твоя способность находить выход из любой ситуации вдохновляет меня 💕",
    "Когда ты рядом, я чувствую, что все мои мечты достижимы 💖",
    "Твой способ видеть хорошее в людях делает мир вокруг тебя лучше 💗",
    "С тобой каждый день - это новый подарок, который я с нетерпением жду 💝",
    "Твоя способность быть собой в любой ситуации - это то, что я обожаю ❤️",
    "Ты умеешь делать так, что даже трудные дни становятся легче 💕",
    "Твой способ любить меня показывает, что такое безусловная любовь 💖",
    "С тобой я понял, что счастье - это не цель, а путь, который мы проходим вместе 💗",
    "Твоя способность видеть красоту в обыденности - это искусство 💝",
    "Когда ты рядом, я чувствую, что могу быть собой без масок ❤️",
    "Твой смех - это лекарство от всех моих грустных мыслей 💕",
    "С тобой я понял, что любовь - это не про идеальность, а про принятие 💖",
    "Твоя способность находить радость в простых вещах напоминает мне, что жизнь прекрасна 💗",
    "Ты умеешь делать так, что даже тишина между нами наполнена смыслом 💝",
    "Твой способ заботиться обо мне показывает, что такое настоящая любовь ❤️",
    "С тобой я понял, что самое важное - это не то, что мы делаем, а то, как мы это делаем вместе 💕",
    "Твоя способность видеть во мне лучшее помогает мне расти каждый день 💖",
    "Когда ты рядом, я чувствую, что все мои тревоги уходят на второй план 💗",
    "Твой способ любить меня учит меня, как нужно любить по-настоящему 💝",
    "С тобой я понял, что счастье - это не про то, что у тебя есть, а про то, с кем ты это делишь ❤️"
];

function initCompliments() {
    const complimentBtn = document.getElementById('compliment-btn');
    const complimentDisplay = document.getElementById('compliment-display');
    const complimentText = complimentDisplay.querySelector('.compliment-text');
    
    if (complimentBtn && complimentText) {
        let lastCompliment = -1;
        
        complimentBtn.addEventListener('click', () => {
            // Убираем предыдущий комплимент
            complimentText.classList.remove('show');
            
            // Выбираем случайный комплимент (не повторяя предыдущий)
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * compliments.length);
            } while (randomIndex === lastCompliment && compliments.length > 1);
            
            lastCompliment = randomIndex;
            
            // Показываем новый комплимент
            setTimeout(() => {
                complimentText.textContent = compliments[randomIndex];
                complimentText.classList.add('show');
            }, 300);
            
            // Анимация кнопки
            complimentBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                complimentBtn.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

// Счетчик времени с 9 ноября
function initDateCounter() {
    const startDate = new Date('2025-11-09T00:00:00'); // Дата начала отношений
    const daysCounter = document.getElementById('days-counter');
    const hoursCounter = document.getElementById('hours-counter');
    const minutesCounter = document.getElementById('minutes-counter');
    
    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (daysCounter) {
            daysCounter.textContent = days;
            daysCounter.style.animation = 'none';
            setTimeout(() => {
                daysCounter.style.animation = 'pulse 0.3s ease';
            }, 10);
        }
        
        if (hoursCounter) {
            hoursCounter.textContent = hours;
            hoursCounter.style.animation = 'none';
            setTimeout(() => {
                hoursCounter.style.animation = 'pulse 0.3s ease';
            }, 10);
        }
        
        if (minutesCounter) {
            minutesCounter.textContent = minutes;
            minutesCounter.style.animation = 'none';
            setTimeout(() => {
                minutesCounter.style.animation = 'pulse 0.3s ease';
            }, 10);
        }
    }
    
    // Обновляем сразу
    updateCounter();
    
    // Обновляем каждую минуту
    setInterval(updateCounter, 60000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initEnvelope();
    loadGalleryImages();
    initScrollAnimations();
    initSmoothScroll();
    initKeyboardNavigation();
    initCompliments();
    initDateCounter();
    initSecretCards();
    initStarsCanvas();
    initChat();
    
    // Обработчики для lightbox
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightbox = document.getElementById('lightbox');
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});

// Параллакс эффект для hero секции (только если конверт не открыт)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const envelope = document.getElementById('envelope');
    
    if (hero && envelope && !envelope.classList.contains('opened')) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = Math.max(0.3, 1 - scrolled / window.innerHeight);
    }
});

// Добавляем эффект "магии" при клике
document.addEventListener('click', (e) => {
    if (e.target.closest('.gallery-item, .quote-card, .message-card')) {
        createClickEffect(e.clientX, e.clientY);
    }
});

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.width = '10px';
    effect.style.height = '10px';
    effect.style.borderRadius = '50%';
    effect.style.background = 'rgba(255, 255, 255, 0.8)';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '9999';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.animation = 'clickRipple 0.6s ease-out';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 600);
}

// Добавляем CSS анимацию для эффекта клика
const style = document.createElement('style');
style.textContent = `
    @keyframes clickRipple {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Секретные карточки
function initSecretCards() {
    const secretCards = document.querySelectorAll('.secret-card');
    
    secretCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

// Интерактивное звездное небо
function initStarsCanvas() {
    const starsCanvas = document.getElementById('stars-canvas');
    if (!starsCanvas) return;
    
    const starCount = 50;
    const starMessages = [
        "Ты делаешь каждый мой день особенным",
        "С тобой я чувствую себя самым счастливым",
        "Твоя улыбка - это мое самое любимое зрелище",
        "Каждый момент с тобой - это подарок",
        "Ты наполняешь мою жизнь смыслом",
        "С тобой я понял, что такое настоящая любовь",
        "Твоя нежность делает меня сильнее",
        "Ты - причина всех моих улыбок",
        "С тобой я не боюсь будущего",
        "Твоя любовь - это мой дом",
        "Каждый день с тобой лучше предыдущего",
        "Ты видишь во мне лучшее",
        "С тобой я чувствую, что могу все",
        "Твоя поддержка значит для меня все",
        "Ты делаешь обычные дни волшебными",
        "С тобой я понял, что такое счастье",
        "Твоя доброта не знает границ",
        "Ты - мое самое большое счастье",
        "С тобой я чувствую себя защищенным",
        "Твоя любовь меняет меня к лучшему",
        "Каждый раз, когда я вижу тебя, мое сердце замирает",
        "Ты делаешь мою жизнь ярче",
        "С тобой я чувствую себя живым",
        "Твоя красота не только внешняя, но и внутренняя",
        "Ты - мой самый лучший друг и любовь",
        "С тобой я не боюсь быть собой",
        "Твоя мудрость вдохновляет меня",
        "Ты заставляешь меня верить в лучшее",
        "С тобой каждый день - это приключение",
        "Твоя любовь - это то, ради чего стоит жить",
        "Ты делаешь меня лучше каждый день",
        "С тобой я чувствую, что нашел свое место",
        "Твоя энергия заряжает меня",
        "Ты - мое самое большое вдохновение",
        "С тобой я понял, что значит быть любимым",
        "Твоя забота обо мне не знает границ",
        "Ты делаешь мои мечты реальностью",
        "С тобой я чувствую себя особенным",
        "Твоя любовь - это мой компас",
        "Ты - мое самое большое сокровище",
        "С тобой я не боюсь ничего",
        "Твоя улыбка лечит все мои раны",
        "Ты делаешь меня смелее",
        "С тобой я чувствую, что все возможно",
        "Твоя любовь - это мой якорь",
        "Ты - мое самое большое достижение",
        "С тобой я понял, что такое настоящая близость",
        "Твоя нежность - это мое убежище",
        "Ты делаешь мою жизнь полной",
        "С тобой я чувствую себя дома"
    ];
    
    // Создаем звезды и закрепляем за каждой свою фразу
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        
        // Закрепляем за звездой свою фразу
        const messageIndex = i % starMessages.length;
        star.dataset.message = starMessages[messageIndex];
        
        starsCanvas.appendChild(star);
        
        star.addEventListener('click', () => {
            star.classList.add('clicked');
            
            // Вычисляем позицию звезды в пикселях один раз
            const starRect = star.getBoundingClientRect();
            const canvasRect = starsCanvas.getBoundingClientRect();
            const starX = starRect.left - canvasRect.left + starRect.width / 2;
            const starY = starRect.top - canvasRect.top + starRect.height / 2;
            
            // Создаем эффект взрыва с частицами
            for (let j = 0; j < 8; j++) {
                const particle = document.createElement('div');
                particle.textContent = ['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)];
                particle.style.position = 'absolute';
                particle.style.left = starX + 'px';
                particle.style.top = starY + 'px';
                particle.style.fontSize = '1.5rem';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1000';
                particle.style.transform = 'translate(-50%, -50%)';
                
                const angle = (Math.PI * 2 * j) / 8;
                const distance = 50 + Math.random() * 30;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                particle.style.setProperty('--x', x + 'px');
                particle.style.setProperty('--y', y + 'px');
                particle.style.animation = 'starParticleExplode 1s ease-out forwards';
                starsCanvas.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }
            
            // Сначала создаем сердечки вокруг звезды
            
            for (let k = 0; k < 5; k++) {
                const heart = document.createElement('div');
                heart.textContent = ['❤️', '💕', '💖', '💗', '💝'][k];
                heart.style.position = 'absolute';
                heart.style.left = starX + 'px';
                heart.style.top = starY + 'px';
                heart.style.fontSize = '1.2rem';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '1000';
                heart.style.animation = `heartFloatUp ${1 + k * 0.2}s ease-out forwards`;
                heart.style.animationDelay = `${k * 0.1}s`;
                heart.style.transform = 'translate(-50%, -50%)';
                starsCanvas.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 2000);
            }
            
            // Показываем сообщение после сердечек (с задержкой)
            setTimeout(() => {
                const message = document.createElement('div');
                message.className = 'star-message';
                message.textContent = star.dataset.message;
                message.style.position = 'absolute';
                message.style.pointerEvents = 'none';
                message.style.zIndex = '1001';
                
                // Используем уже вычисленные координаты звезды
                
                // Временно добавляем сообщение для измерения размеров
                message.style.visibility = 'hidden';
                message.style.left = '0';
                message.style.top = '0';
                starsCanvas.appendChild(message);
                const messageRect = message.getBoundingClientRect();
                const messageWidth = messageRect.width;
                const messageHeight = messageRect.height;
                
                // Вычисляем оптимальную позицию с учетом границ
                let messageX = starX;
                let messageY = starY - 60; // Поднимаем выше звезды
                
                // Проверяем границы по горизонтали
                const padding = 20;
                if (messageX - messageWidth / 2 < padding) {
                    messageX = padding + messageWidth / 2;
                } else if (messageX + messageWidth / 2 > canvasRect.width - padding) {
                    messageX = canvasRect.width - padding - messageWidth / 2;
                }
                
                // Проверяем границы по вертикали
                if (messageY - messageHeight / 2 < padding) {
                    messageY = padding + messageHeight / 2;
                } else if (messageY + messageHeight / 2 > canvasRect.height - padding) {
                    messageY = canvasRect.height - padding - messageHeight / 2;
                }
                
                // Устанавливаем финальную позицию
                message.style.left = messageX + 'px';
                message.style.top = messageY + 'px';
                message.style.transform = 'translate(-50%, -50%)';
                message.style.visibility = 'visible';
                
                setTimeout(() => {
                    message.remove();
                }, 3000);
            }, 800); // Задержка, чтобы сначала появились сердечки
            
            setTimeout(() => {
                star.classList.remove('clicked');
                star.style.animation = 'twinkle 2s ease-in-out infinite';
            }, 600);
        });
    }
    
    // Добавляем CSS анимации для частиц и сообщений
    if (!document.getElementById('stars-animations-style')) {
        const style = document.createElement('style');
        style.id = 'stars-animations-style';
        style.textContent = `
            @keyframes starParticleExplode {
                0% {
                    transform: translate(-50%, -50%) translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(0);
                    opacity: 0;
                }
            }
            
            @keyframes heartFloatUp {
                0% {
                    transform: translate(-50%, -50%) translateY(0) scale(0.8);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) translateY(-80px) scale(1.2);
                    opacity: 0;
                }
            }
            
            .star-message {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                padding: 1rem 1.5rem;
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.2rem;
                color: #fff;
                white-space: nowrap;
                animation: messageAppear 0.5s ease-out, messageFloat 3s ease-out forwards;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            @keyframes messageAppear {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            @keyframes messageFloat {
                0% {
                    transform: translate(-50%, -50%) translateY(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) translateY(-30px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Чат поддержки
function initChat() {
    const chatContainer = document.getElementById('chat-container');
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatContainer || !chatToggle || !chatWindow || !chatInput || !chatSend || !chatMessages) return;
    
    // Открытие/закрытие чата
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.add('active');
        chatInput.focus();
    });
    
    chatClose.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });
    
    // Функция добавления сообщения
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = text;
        
        messageContent.appendChild(messageText);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Прокрутка вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Функция отправки сообщения
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Добавляем сообщение пользователя
        addMessage(message, true);
        
        // Очищаем поле ввода
        chatInput.value = '';
        
        // Мгновенный ответ в формате "Все говорят '[её сообщение]', а я люблю тебя)"
        setTimeout(() => {
            const response = `Все говорят "${message}", а я люблю тебя ❤️`;
            addMessage(response, false);
        }, 300);
    }
    
    // Отправка по кнопке
    chatSend.addEventListener('click', sendMessage);
    
    // Отправка по Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}