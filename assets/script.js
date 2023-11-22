// API key for OpenWeatherMap
var apiKey = '8cec26e69161f7f456b3daae120c0839';

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', function() {
    var city = document.getElementById('city-search').value;
    getWeather(city); // Fetch weather for the entered city
    addToHistory(city); // Add the city to search history
});

// Function to fetch and display weather and forecast data
function getWeather(city) {
    // Construct URL for current weather data
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
    
    // Fetch current weather data
    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        displayWeather(data); // Display current weather
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        // Fetch forecast data using coordinates
        return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial');
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(forecastData) {
        displayForecast(forecastData); // Display weather forecast
    })
    .catch(function(error) {
        console.error('Error fetching data: ', error);
    });
}

// Function to display current weather data
function displayWeather(data) {
    var weatherContainer = document.getElementById('current-weather');
    // Format and display the weather data
    var date = new Date(data.dt * 1000).toLocaleDateString();
    var iconUrl = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
    weatherContainer.innerHTML = '<h3>' + data.name + ' (' + date + ')</h3>' +
                                 '<img src="' + iconUrl + '">' +
                                 '<p>Temperature: ' + data.main.temp + ' °F</p>' +
                                 '<p>Wind Speed: ' + data.wind.speed + ' MPH</p>' +
                                 '<p>Humidity: ' + data.main.humidity + '%</p>';
}

// Function to display weather forecast data
function displayForecast(forecastData) {
    var forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    // Loop through forecast data and display each day
    for (var i = 0; i < forecastData.list.length; i += 8) {
        var dayData = forecastData.list[i];
        var date = new Date(dayData.dt_txt).toLocaleDateString();
        var iconUrl = 'http://openweathermap.org/img/w/' + dayData.weather[0].icon + '.png';
        var dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = '<h4>' + date + '</h4>' +
                               '<img src="' + iconUrl + '">' +
                               '<p>Temp: ' + dayData.main.temp + ' °F</p>' +
                               '<p>Wind: ' + dayData.wind.speed + ' MPH</p>' +
                               '<p>Humidity: ' + dayData.main.humidity + '%</p>';
        forecastContainer.appendChild(dayElement);
    }
}

// Function to add a city to the search history
function addToHistory(city) {
    var historyContainer = document.getElementById('search-history');
    var cityElement = document.createElement('li');
    cityElement.textContent = city;
    cityElement.addEventListener('click', function() {
        getWeather(city); // Fetch weather again when clicked
    });
    historyContainer.appendChild(cityElement);
}

// Function to load search history from local storage on page load
function loadHistory() {
    var cities = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    cities.forEach(addToHistory); // Add each city to the history list
}

// Function to save a city to the search history in local storage
function saveToHistory(city) {
    var cities = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(cities));
    }
}

// Event to load search history when the window is loaded
window.onload = loadHistory;
