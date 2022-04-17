const btnEl = document.getElementById('city-submit');
const cityEl = document.getElementById('city-name')
const weatherApiKey = "04ee506db424c97fa7821658500050f4";


btnEl.addEventListener('click', function(event){
    event.preventDefault();
    var cityInput = document.getElementById('city-input').value;
    cityEl.textContent = cityInput
    var cityArray = cityInput.split(' ');
    var cityString = cityArray.join('+');
    var geoApiUrl = "https://nominatim.openstreetmap.org/search.php?=&city=" + cityString + "&format=jsonv2&limit=1"
    fetch(geoApiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(city){
            getWeatherData(city[0].lat, city[0].lon)
            })
        }
        else {
            console.log('city name is invalid')
        }
        });

    // 
    // console.log(weatherApiUrl);
})

var getWeatherData = function(lat, lon) {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + weatherApiKey;
    fetch(weatherApiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(weather){
                console.log(weather.daily)
            })
        }
        else {
            console.log('city name is invalid')
        }
        });
}

// var displayJumbotron = function()