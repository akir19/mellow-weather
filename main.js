// API key: a7463f5daad4c31cc6ba64a31b51ca8c

const API_KEY = 'a7463f5daad4c31cc6ba64a31b51ca8c';

const searchInput = document.querySelector('.search__input');
const searchBtn = document.querySelector('.search__btn');
const weatherInfo = document.querySelector('.weather-info');
const weatherError = document.querySelector('.weather-error');

// Элементы для вывода данных
const cityDisplay = document.querySelector('.weather-info__city');
const tempDisplay = document.querySelector('.weather-info__temp');
const descDisplay = document.querySelector('.weather-info__desc');
const iconDisplay = document.querySelector('.weather-info__icon');

async function getWeather(city) {
    // Формируем адрес запроса
    // units=metric делает температуру в Цельсиях, а lang=ru — описание на русском
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;

    try {
        const response = await fetch(url); // Ждем ответа от сервера
        
        if (!response.ok) {
            throw new Error('Город не найден'); // Если сервер ответил ошибкой (например, 404)
        }

        const data = await response.json(); // Превращаем "посылку" в понятный объект JS
        displayWeather(data);

    } catch (error) {
        showError();
    }
}

function displayWeather(data) {
    // Прячем ошибку, если она была
    weatherError.classList.add('weather-error--hidden');
    
    // Заполняем данные
    cityDisplay.innerText = data.name;
    tempDisplay.innerText = `${Math.round(data.main.temp)}°C`;
    descDisplay.innerText = data.weather[0].description;
    
    // Получаем иконку погоды
    const iconCode = data.weather[0].icon;
    iconDisplay.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Показываем блок с информацией
    weatherInfo.classList.remove('weather-info--hidden');
}

function showError() {
    weatherInfo.classList.add('weather-info--hidden');
    weatherError.classList.remove('weather-error--hidden');
}

// Слушатель на кнопку
searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Поиск по нажатию Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) getWeather(city);
    }
});