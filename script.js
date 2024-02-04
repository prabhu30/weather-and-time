// Weather API (Api Key is needed)
// https://weatherApi.openweathermap.org/data/2.5/weather?q=guntur&appid=1f9e8de8db310362153662662d90c102

// Time API (Api Key is needed)
// https://timezone.abstractapi.com/v1/current_time/?api_key=2bd31493a8a24421a6ff5d5ff917b024&location=newyork

const weatherEle = document.querySelector('.weather');
const errorEle = document.querySelector('.error-message');

const userInput = document.querySelector('.userInput');
const searchButton = document.querySelector('.user-search-btn');
const temperatureEle = document.querySelector('.temperature');
const cityEle = document.querySelector('.city');
const humidityEle = document.querySelector('.humidity');
const windSpeedEle = document.querySelector('.wind');
const weatherStatusImgEle = document.querySelector('.weather-status-img');

const timeEle = document.querySelector('.time');
const timezoneEle = document.querySelector('.timezone');

const weatherApiKey = "1f9e8de8db310362153662662d90c102";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";

const timeApiKey = "2bd31493a8a24421a6ff5d5ff917b024";
const timeApiUrl = "https://timezone.abstractapi.com/v1/current_time/";

async function getWeatherAndTimeData(city) {
    const weatherResponse = await fetch(weatherApiUrl + `&appid=${weatherApiKey}&q=${city}`);
    const timeResponse = await fetch(timeApiUrl + `?api_key=${timeApiKey}&location=${city}`);

    if (weatherResponse.status == 404 || timeResponse.status == 404) {
        weatherEle.style.display = 'none';
        errorEle.style.display = 'block';
    } else {
        /**
         * Weather Response Data
         */
        const weatherData = await weatherResponse.json();
        
        const cityName = weatherData.name;
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;

        const weatherStatusImg = `${weatherData.weather[0].main}`.toLowerCase();

        cityEle.textContent = cityName;
        temperatureEle.textContent = Math.round(temperature) + `°C`;
        humidityEle.textContent = Math.round(humidity) + `%`;
        windSpeedEle.textContent = Math.round(windSpeed) + ` kmph`;
        weatherStatusImgEle.src = `images/${weatherStatusImg}.png`;

        /**
         * Time Response Data
         */
        const timeData = await timeResponse.json();

        const time = new Date(timeData.datetime);
        const timezone = timeData.timezone_abbreviation;
        
        const hoursInitial = time.getHours();
        const timeOfDay = hoursInitial >= 1 && hoursInitial <= 12 ? "AM" : "PM";
        
        const hours = `${hoursInitial > 12 && hoursInitial <= 24 ? hoursInitial - 12 : hoursInitial}`.padStart(2, 0);

        const minutesInitial = time.getMinutes();
        const minutes = `${minutesInitial}`.padStart(2, 0);
        
        timeEle.textContent = `${hours} : ${minutes}`;
        timezoneEle.textContent = `${timeOfDay} (${timezone})`

        weatherEle.style.display = 'block';   
        errorEle.style.display = 'none';
    }
}

searchButton.addEventListener('click', (event) => {
    const cityName = userInput.value;
    userInput.value = '';
    userInput.blur();

    getWeatherAndTimeData(cityName);
})

userInput.addEventListener('keydown', (event) => {
    const cityName = userInput.value;

    if (event.key === 'Enter') {
        getWeatherAndTimeData(cityName);

        userInput.value = '';
        userInput.blur();
    }
})
