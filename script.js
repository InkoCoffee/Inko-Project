// ==========================================
// 1. MOBILE MENU TOGGLE HANDLER
// ==========================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ==========================================
// 2. INTRO VIDEO OVERLAY HANDLER
// ==========================================
const introOverlay = document.getElementById('introOverlay');
const introVideo = document.getElementById('introVideo');
const skipIntroBtn = document.getElementById('skipIntroBtn');

if (introVideo && introOverlay) {
    // Гарантируем видимость оверлея на старте скрипта
    introOverlay.classList.remove('hidden');
    introVideo.muted = true;

    // Функция полного и плавного закрытия интро
    const fadeOutIntro = () => {
        introOverlay.classList.add('hidden');
        introVideo.pause();
    };

    // Запуск воспроизведения видео
    introVideo.play()
        .then(() => {
            // Если видео успешно запустилось, отсчитываем 2.5 секунды и показываем кнопку
            setTimeout(() => {
                if (skipIntroBtn) {
                    skipIntroBtn.classList.add('visible');
                }
            }, 2500); // 2500 миллисекунд = 2.5 секунды
        })
        .catch(err => {
            console.log("Автовоспроизведение заблокировано политикой браузера:", err);
            
            /* 
               РЕШЕНИЕ ЗАВИСАНИЯ: Если браузер заблокировал видео на 1-м кадре,
               мы разрешаем пользователю просто кликнуть в любую точку экрана интро, 
               чтобы пройти дальше.
            */
            if (skipIntroBtn) {
                skipIntroBtn.innerText = "Пропустить";
                skipIntroBtn.classList.add('visible');
            }
            
            // Клик по всему темному экрану тоже сработает как пропуск, если автоплей сломался
            introOverlay.style.cursor = 'pointer';
            introOverlay.addEventListener('click', fadeOutIntro, { once: true });
        });

    // Плавный фейд-аут при штатном окончании видеофайла
    introVideo.addEventListener('ended', fadeOutIntro);

    // Обработчик для кнопки пропуска
    if (skipIntroBtn) {
        skipIntroBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращает двойной вызов, если сработал клик по оверлею
            fadeOutIntro();
        });
    }
}

// ==========================================
// 3. MENU FILTER & SEARCH HANDLER
// ==========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const menuCards = document.querySelectorAll('.menu-card');

if (filterBtns.length && searchInput && menuCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        menuCards.forEach(card => {
            const title = card.querySelector('.card-body h3').textContent.toLowerCase();
            const desc = card.querySelector('.card-body p').textContent.toLowerCase();
            if (title.includes(query) || desc.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
