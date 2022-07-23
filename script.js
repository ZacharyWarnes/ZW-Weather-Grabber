var APIkey = "8bdf30542457a49d91637d1b7a6f89e0";

//Submit the form to fetch the weather information 
var userInput = document.getElementById("userInput");
var userInputEl = document.getElementById("cname");

function getCityName(event){
    event.preventDefault();
    var cityName = userInputEl.value;
    console.log(cityName);

    fetchGeoLocation(cityName);

}


    //Fetch the city name from the text <input>
    
    // Call the fetchGeoLocation and pass the city name 

//Handle button clicks to fetch weather information

    //get the city name from the clicked buttoin's data-city attribute (event.target)

//Fetch Geolocation Data (Geocoding API)
function fetchGeoLocation(cityName) {

    var reqeust= `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=8bdf30542457a49d91637d1b7a6f89e0`;

    fetch(reqeust)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        var latitude = data[0].lat; 
        var longitude = data[0].lon; 
fetchOneCallWeather(latitude,longitude);
    })

}

// fetchGeoLocation("Seattle");

//Fetch Weather Data (ONECALL)

function fetchOneCallWeather(latitude,longitude){
console.log(latitude,longitude);
    var request2= `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=8bdf30542457a49d91637d1b7a6f89e0&exclude=minutely`

    // fetch(request2)
    // .then(function(response) {
    //     return response.json();
    // })
    // .then(function(data) {
    //     console.log(data);
    // })
}
//Render Function for returning data to page   

userInput.addEventListener("submit", getCityName);