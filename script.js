var APIkey = "8bdf30542457a49d91637d1b7a6f89e0";

//Submit the form to fetch the weather information 
var userInput = document.getElementById("userInput");
var userInputEl = document.getElementById("cname");
var searchHistory = [];
var recentSearchContainerEL= document.getElementById("recentSearches");
var currentWeatherCard = document.getElementById("weatherCard");
var forcastCard = document.getElementById("forecast");

// Timezone plugins for day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function getCityName(event){
    event.preventDefault();
    var cityName = userInputEl.value;
    console.log(cityName);

    fetchGeoLocation(cityName);
    storeCityName(cityName);

}

//Fetch Geolocation Data (Geocoding API)
function fetchGeoLocation(cityName) {

    var geoReqeust= `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=8bdf30542457a49d91637d1b7a6f89e0`;

    fetch(geoReqeust)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        var latitude = data[0].lat; 
        var longitude = data[0].lon; 
        var locationName = data[0].name
fetchOneCallWeather(latitude,longitude,locationName);
    })

}

//Fetch Weather Data (ONECALL)

function fetchOneCallWeather(latitude,longitude,locationName){
console.log(latitude,longitude);
    var weatherRequest= `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=8bdf30542457a49d91637d1b7a6f89e0&exclude=minutely`

    fetch(weatherRequest)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    
renderItems(locationName, data);
    })
}
//Render Function for returning data to page 
function renderItems(locationName, data) {
    renderCurrentWeather(locationName, data.current, data.timezone);
    renderForcast(data.daily, data.timezone);

// Render function for current weather and variables for creating current weather card
function renderCurrentWeather (locationName,current,timezone) {
    var currentDate = dayjs().tz(timezone).format('MM/DD/YYYY');
    var currentTemp = data.current.temp;
    var currentWind = data.current.wind_speed;
    var currentHumid = data.current.humidity;
    var currentUv = data.current.uvi;
    var iconUrl = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
    var iconDescription = data.current.weather[0].description || data.current.weather[0].main;

     console.log(currentDate,currentTemp,currentWind,currentHumid,currentUv);
//Elements that will appear in the Current Weather Card
    var cityNameEl = document.createElement('h3');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvIndexEl = document.createElement('p');
    var uvButton = document.createElement('button');

//Code for setting up weather icon and creating button for UV indicator
    weatherIcon.setAttribute('src',iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    uvButton.classList.add('btn','btn-sm');

//Code for dynamic UV indicator 
if (currentUv < 3) {
   uvButton.classList.add('btn-success');
} else if (currentUv < 7) {
    uvButton.classList.add('btn-warning');
} else {
    uvButton.classList.add('btn-danger');
}

//Content of the Current Weather card 
cityNameEl.textContent = `${locationName} (${currentDate})`;
tempEl.textContent = `Temp: ${currentTemp}`;
humidityEl.textContent = `Humid: ${currentHumid}`;
uvIndexEl.textContent = `UV Index: `;
uvButton.textContent = currentUv;
uvIndexEl.append(uvButton);

//Append Current Weather Card to page 
currentWeatherCard.innerHTML = "";
currentWeatherCard.append(cityNameEl,weatherIcon,tempEl,humidityEl,uvIndexEl);


}

function renderForcast(){
    
}

}
//Store City Name in Local Storage
function storeCityName (cityName) {
// Need to push new city name to empty search history array or if data is already in local storage, we need to push to this data
var savedCityNames=JSON.parse(localStorage.getItem("searchHistory"))||searchHistory;
    savedCityNames.push(cityName);
    localStorage.setItem("searchHistory",JSON.stringify(savedCityNames));
}
// Render Local Storage as buttons to call weather


function renderLocalStorage(){
    var returnedLocalStorage= JSON.parse(localStorage.getItem("searchHistory"));

if (!returnedLocalStorage) {
    return;
}

    for (let index = 0; index < returnedLocalStorage.length; index++) {
    const buttonText  = returnedLocalStorage[index];
    
    var button= document.createElement('button');
    button.textContent=buttonText;
    recentSearchContainerEL.appendChild(button);

    
}
}

renderLocalStorage();
userInput.addEventListener("submit", getCityName);