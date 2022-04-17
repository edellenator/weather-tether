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
})

var getWeatherData = function(lat, lon) {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + weatherApiKey;
    fetch(weatherApiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(weather){
                console.log(weather)
                var unixTime = weather.current.dt;
                var fullDate = new Date (unixTime*1000);
                var date = fullDate.toLocaleDateString('en-US')
                var temp = weather.current.temp;
                var wind = weather.current.wind_speed;
                var uvi = weather.current.uvi;
                var hum = weather.current.humidity
                var icon = weather.current.weather[0].icon

                console.log(date);
                displayJumbotron(temp, wind, hum, uvi, date, icon)
            })
        }
        else {
            console.log('city name is invalid')
        }
        });
}

var displayJumbotron = function(temp, wind, hum, uv, date, icon) {
    const tempEl = document.getElementById('temp');
    const windEl = document.getElementById('wind');
    const humEl = document.getElementById('humidity');
    const uvEl = document.getElementById('uv');
    const dateEl = document.getElementById('today');
    const iconEl = document.getElementById('weather-icon');
    iconEl.innerHTML = '<img src="http://openweathermap.org/img/wn/' + icon + '@2x.png">'
    dateEl.textContent = date;
    tempEl.textContent = temp;
    windEl.textContent = wind;
    humEl.textContent = hum;
    uvEl.textContent = uv;
}

// var displayForecast = function (date, temp, wind, hum) {
//     const foreTemp = document.querySelectorAll('.fore-temp');
//     const foreWind = document.querySelectorAll('.fore-wind')
//     const foreDate = document.querySelectorAll('.fore-date')
//     const foreHum = document.querySelectorAll('.fore-humidity')
//     for (var i = 0; i < )

// }