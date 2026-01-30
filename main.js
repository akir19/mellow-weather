const API_KEY = 'a7463f5daad4c31cc6ba64a31b51ca8c';
const bell = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');

// Элементы
const searchInput = document.querySelector('.search__input');
const searchBtn = document.querySelector('.search__btn');
const weatherInfo = document.querySelector('.weather-info');
const weatherError = document.querySelector('.weather-error');

// Главная функция
async function getWeather(city) {
    if (!city) return;
    
    console.log("🚀 Запрос для города:", city);
    const encodedCity = encodeURIComponent(city);
    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}&units=metric&lang=ru`;
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${API_KEY}&units=metric&lang=ru`;

    try {
        const [resCurrent, resForecast] = await Promise.all([
            fetch(urlCurrent),
            fetch(urlForecast)
        ]);

        if (!resCurrent.ok) throw new Error('City not found');

        const data = await resCurrent.json();
        const dataForecast = await resForecast.json();

        updateUI(data, dataForecast);
        playNotify();

    } catch (err) {
        console.error("❌ Ошибка:", err);
        weatherError.classList.remove('weather-error--hidden');
        weatherInfo.classList.add('weather-info--hidden');
    }
}

function updateUI(now, future) {
    // Показываем блок инфо
    weatherError.classList.add('weather-error--hidden');
    weatherInfo.classList.remove('weather-info--hidden');

    // Находим элементы внутри функции, чтобы гарантировать их наличие
    document.querySelector('.weather-info__city').innerText = `${now.name}, ${now.sys.country}`;
    document.querySelector('.weather-info__temp').innerText = `${Math.round(now.main.temp)}°C`;
    document.querySelector('.weather-info__desc').innerText = now.weather[0].description;
    document.querySelector('#wind-speed').innerText = now.wind.speed;

    // Прогноз на завтра
    if (future.list && future.list[8]) {
        document.querySelector('#next-day-temp').innerText = Math.round(future.list[8].main.temp);
    }

    // Иконка
    const iconCode = now.weather[0].icon;
    document.querySelector('.weather-info__icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    updateTheme(now.weather[0].main);
    console.log("✅ Интерфейс обновлен для города:", now.name);
}

function updateTheme(state) {
    const themes = {
        Clear: 'linear-gradient(135deg, #fceeb5 0%, #f3ad4b 100%)',
        Clouds: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
        Rain: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
        Drizzle: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
        Thunderstorm: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
        Snow: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
        Default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    document.body.style.background = themes[state] || themes.Default;
}

function playNotify() {
    bell.currentTime = 0; 
    bell.volume = 0.2;
    bell.play().catch(() => {}); 
}

// СОБЫТИЯ (используем именованную функцию для удобства)
const handleSearch = () => {
    const value = searchInput.value.trim();
    getWeather(value);
};

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Стартовый запуск
getWeather('Москва');