var APIkey = "8bdf30542457a49d91637d1b7a6f89e0";

//Submit the form to fetch the weather information 
var userInput = document.getElementById("userInput");
var userInputEl = document.getElementById("cname");
var searchHistory = [];
var recentSearchContainerEL= document.getElementById("recentSearches");
var currentWeatherCard = document.getElementById("weatherCard");
var forecastCard = document.getElementById("forecast");

// Timezone plugins for day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function getCityName(event){
    console.log(event);
    event.preventDefault();
    var cityName = userInputEl.value;

    console.log(cityName);

    
    fetchGeoLocation(cityName);
    storeCityName(cityName);
    userInputEl.value = '';
    
    
}

//Fetch Geolocation Data (Geocoding API)
function fetchGeoLocation(cityName) {
console.log(cityName);

    var geoRequest= `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=8bdf30542457a49d91637d1b7a6f89e0`;

    fetch(geoRequest)
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
    var weatherRequest= `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=8bdf30542457a49d91637d1b7a6f89e0&exclude=minutely`

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

    
//Elements that will appear in the Current Weather Card
    var cityNameEl = document.createElement('h3');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
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
tempEl.textContent = `Temp: ${currentTemp} °F`;
humidityEl.textContent = `Humid: ${currentHumid} %`;
uvIndexEl.textContent = `UV Index: `;
uvButton.textContent = currentUv;
uvIndexEl.append(uvButton);

//Append Current Weather Card to page 
currentWeatherCard.innerHTML = "";
currentWeatherCard.append(cityNameEl,weatherIcon,tempEl,humidityEl,uvIndexEl);

}

//Render 5 day forecast and elements for forcast cards
function renderForcast(daily,timezone){
    var forecastStart = dayjs().tz(timezone).add(1,'day').startOf('day').unix();
    var forecastEnd = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

//Heading for forecast card container that only appears when function is run
    var forecastContainerHeader = document.createElement('h3')
    forecastContainerHeader.setAttribute('class', 'col-12');
    forecastCard.innerHTML="";
    forecastContainerHeader.textContent= '5-Day-Forcast';
    forecastCard.append(forecastContainerHeader);

// for loop for iterating through daily forcasts 5 times    
for (let i = 0; i < daily.length; i++) {
    if (daily[i].dt >= forecastStart && daily[i].dt < forecastEnd) {
        
        renderForcastCard(daily[i], timezone);
    } 
  }            
}

function renderForcastCard(daily,timezone) {

    var date = daily.dt;
    var dailyTemp = daily.temp.day;
    var dailyWind = daily.wind_speed;
    var dailyHumid = daily.humidity;
    var dailyIconUrl = `https://openweathermap.org/img/w/${daily.weather[0].icon}.png`;
    var dailyIconDescription = daily.weather[0].description || daily.weather[0].main;
    
    console.log(date, dailyTemp, dailyWind);

// creating elements for the forcast card 
    var column = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardHeader = document.createElement('h4')
    var cardWeatherIcon = document.createElement('img');
    var cardTemp = document.createElement('p');
    var cardWind = document.createElement('p');
    var cardHumid = document.createElement('p');

//Appending elements to create card
    
    card.append(cardBody);
    cardBody.append(cardHeader,cardWeatherIcon,cardTemp,cardWind,cardHumid);

//creating class attributes to style elements

    card.setAttribute('class','col-2 m-1 bg-primary border border-dark text-white');

    cardHeader.textContent = dayjs.unix(date).tz(timezone).format('MM/DD/YYYY');
    cardWeatherIcon.setAttribute('src', dailyIconUrl);
    cardWeatherIcon.setAttribute('alt', dailyIconDescription);
    cardTemp.textContent = `Temp: ${dailyTemp} °F`;
    cardWind.textContent = `Wind: ${dailyWind} MPH`;
    cardHumid.textContent = `Humidity: ${dailyHumid} %`;

    forecastCard.append(card);

}

}
//Store City Name in Local Storage
function storeCityName (cityName) {
// Need to push new city name to empty search history array or if data is already in local storage, we need to push to this data
var savedCityNames=JSON.parse(localStorage.getItem("searchHistory"))||searchHistory;

if (!savedCityNames.includes(cityName)) {
    savedCityNames.push(cityName);
} 
    localStorage.setItem("searchHistory",JSON.stringify(savedCityNames));
    // window.location.reload();
    renderLocalStorage();
    
}
// Render Local Storage as buttons to call weather
function renderLocalStorage(){
    recentSearchContainerEL.innerHTML = '';
    var returnedLocalStorage= JSON.parse(localStorage.getItem("searchHistory"));

if (!returnedLocalStorage) {
    return;
}

    for (let index = 0; index < returnedLocalStorage.length; index++) {
    const buttonText  = returnedLocalStorage[index];
    
     var button= document.createElement('button');
     button.setAttribute('class','button');
     button.setAttribute('class', 'btn-block btn-sm btn-searched');
     button.setAttribute('data-search',returnedLocalStorage[index]),
     button.textContent=buttonText;
     recentSearchContainerEL.appendChild(button);
    
}


}
//Recall current weather and forcast for previously searched city 
function recallPreviousSearch(event) {
    var recallButton = event.target.dataset.search;
    fetchGeoLocation(recallButton);
    console.log(recallButton);
}



userInput.addEventListener("submit", getCityName);
renderLocalStorage();
recentSearchContainerEL.addEventListener("click", recallPreviousSearch);
