const btnEl = document.getElementById('city-submit');
const cityEl = document.getElementById('city-name')
const weatherApiKey = "04ee506db424c97fa7821658500050f4";
var cityArr = []



btnEl.addEventListener('click', function(event){
    event.preventDefault();
    var cityInput = document.getElementById('city-input').value;
    cityEl.textContent = cityInput
    var cityArray = cityInput.split(' ');
    var cityString = cityArray.join('+');
    var geoApiUrl = "https://nominatim.openstreetmap.org/search.php?=&city=" + cityString + "&format=jsonv2&limit=1"
    fetch(geoApiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(city) {
                getWeatherData(city[0].lat, city[0].lon);
            })
        }
        else {
            alert('city name is invalid')
        }
    })
    .catch(function(error){
        alert('It appears that all of the satellites have crashed from the sky and we can no longer retrieve any weather data')
    });
    
    cityArr.push(cityInput);
    console.log(cityArr);
    saveCities();
    sideBarStorage(cityInput);
    cityInput.value = "";
        
});

var sideBarStorage = function(city) {
    const cityContainer = document.getElementById('city-container');
    const cityEl = document.createElement('div');
    cityEl.setAttribute('class', "p-3 card bg-secondary text-white text-center mb-3 stored-city");
    cityEl.textContent=city;
    cityContainer.appendChild(cityEl);
    const cityBtn = cityContainer.querySelectorAll('.stored-city')
    for (var i = 0; i < cityBtn.length; i++) {
        cityBtn[i].setAttribute('onclick', 'storedCitySelect(this)')
    }
}

var storedCitySelect = function(select) {
    var citySelect = select.textContent;
    cityEl.textContent = citySelect
    var cityArray = citySelect.split(' ');
    var cityString = cityArray.join('+');
    var geoApiUrl = "https://nominatim.openstreetmap.org/search.php?=&city=" + cityString + "&format=jsonv2&limit=1"
    fetch(geoApiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(city) {
                getWeatherData(city[0].lat, city[0].lon);
            })
        }
        else {
            alert('city name is invalid')
        }
    })
    .catch(function(error){
        alert('It appears that all of the satellites have crashed from the sky and we can no longer retrieve any weather data')
    });

}

var getWeatherData = function(lat, lon) {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + weatherApiKey;
    fetch(weatherApiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(weather){
                console.log(weather)
                // store all data from weather api as variables
                var unixTime = weather.current.dt;
                var fullDate = new Date (unixTime*1000);
                var date = fullDate.toLocaleDateString('en-US')
                var temp = weather.current.temp;
                var wind = weather.current.wind_speed;
                var uvi = weather.current.uvi;
                var hum = weather.current.humidity
                var icon = weather.current.weather[0].icon
                // apply weather data to jumbotron
                displayJumbotron(temp, wind, hum, uvi, date, icon)
                var foreTempArr = []
                for (var i = 0; i < weather.daily.length; i++){
                    foreTempArr.push(weather.daily[i].temp.max)
                }

                var foreDateArr = [];
                for (var i = 0; i < weather.daily.length; i++){
                    var unixForeTime = weather.daily[i].dt;
                    var fullForeDate = new Date (unixForeTime*1000);
                    var hrDate = fullForeDate.toLocaleDateString('en-US'); 
                    foreDateArr.push(hrDate)
                }

                var foreWindArr = [];
                for (var i = 0; i < weather.daily.length; i++){
                    foreWindArr.push(weather.daily[i].wind_speed)
                }
               
                var foreHumArr = [];
                for (var i = 0; i < weather.daily.length; i++){
                    foreHumArr.push(weather.daily[i].humidity)
                }

                var foreIconArr = [];
                for (var i = 0; i < weather.daily.length; i++){
                    foreIconArr.push(weather.daily[i].weather[0].icon)
                }
                displayForecast(foreDateArr, foreTempArr, foreWindArr, foreHumArr, foreIconArr)
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
    if (uv < 3) {
        uvEl.setAttribute('class', 'btn btn-success ml-2');
    }
    else if (uv >= 3 && uv < 6) {
        uvEl.setAttribute('class', 'btn btn-warning ml-2');
    }
    else if (uv >= 6 && uv < 8) {
        uvEl.setAttribute('class', 'btn btn-orange ml-2');
    }
    else {
        uvEl.setAttribute('class', 'btn btn-danger ml-2');
    }
}

var displayForecast = function (date, temp, wind, hum, icon) {
    const foreIcon = document.querySelectorAll('.fore-icon')
    const foreTemp = document.querySelectorAll('.fore-temp');
    const foreWind = document.querySelectorAll('.fore-wind')
    const foreDate = document.querySelectorAll('.fore-date')
    const foreHum = document.querySelectorAll('.fore-humidity')
    for (var i = 0; i < foreTemp.length; i++) {
        foreTemp[i].textContent = temp[i];
    }
    for (var i = 0; i < foreDate.length; i++) {
        foreDate[i].textContent = date[i];
    }
    for (var i = 0; i < foreWind.length; i++) {
        foreWind[i].textContent = wind[i];
    }
    for (var i = 0; i < foreHum.length; i++) {
        foreHum[i].textContent = hum[i];
    }
    for (var i = 0; i < foreIcon.length; i++) {
        foreIcon[i].innerHTML = '<img src="http://openweathermap.org/img/wn/' + icon[i] + '@2x.png" width="50px">';
    }
    

}

var saveCities = function () {
    localStorage.setItem('cities', JSON.stringify(cityArr))
}

var loadCities = function () {
    var retrievedCities = localStorage.getItem("cities");

    if (!retrievedCities) {
        return false;
    };

    console.log('saved tasks found!');
    console.log(retrievedCities);

    retrievedCities = JSON.parse(retrievedCities);
    console.log(retrievedCities);
    cityArr.push(retrievedCities);
    console.log(cityArr);
    for (var i = 0; i < retrievedCities.length; i++) {
        sideBarStorage(retrievedCities[i])
    }
}

loadCities();