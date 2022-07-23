var APIkey = "8bdf30542457a49d91637d1b7a6f89e0";

//Submit the form to fetch the weather information 

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
    })

}

fetchGeoLocation("Seattle");

//Fetch Weather Data (ONECALL)

function fetchOneCallWeather()

//Render Function for returning data to page