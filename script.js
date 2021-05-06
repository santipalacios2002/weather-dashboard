var cityArrayWithLonLat = [];
var cityArrayTags = [];
var cityAndState = [];
var submitBtn = document.querySelector('#searchBtn');
var cityEl = document.querySelector('#tags');
var dateEl = document.querySelector('.date');
var cityStorage = [];
searchBlock();
//gets city json file of American cities
$.getJSON('./city.list.json', function (data) {
  for (var i = 0; i < data.length; i++) {
    cityArrayWithLonLat.push({
      'name': data[i].name,
      'state': data[i].state,
      'lon': data[i].coord.lon,
      'lat': data[i].coord.lat
    })
    cityArrayTags.push(`${data[i].name}, ${data[i].state}`)
  }
});

//building the date text for forecast
for (let index = 0; index < 5; index++) {
  $('.date').eq(index).text(moment().add(index + 1, 'days').format('ddd, L'));
}

$('#submitBtn').on('click', function () {
  var citySearched = $('#tags').val(); //extracts the value from search
  apiCityCall(citySearched);
  saveSearch($('#tags').val());
  $('.search-block').prepend(`<button class="btn btn-secondary col mb-2 searchBtn">${citySearched}</button>`)

  $('.searchBtn').on('click', function (event) {
    var citySearched = event.target.innerText
    apiCityCall(citySearched);
  })
})

//jquery autocomplete widget
$(function () {
  $("#tags").autocomplete({
    source: cityArrayTags
  });
});

function weatherForecast(apiJson) {
  for (let index = 0; index < 6; index++) {
    $('.icon').eq(index).attr('src', `https://openweathermap.org/img/wn/${apiJson.daily[index].weather[0].icon}@2x.png`);
    $('.icon').eq(index).attr('alt', `weather icon`);
    $('.temp').eq(index).text(`${Math.round(apiJson.daily[index + 1].temp.max)}/${Math.round(apiJson.daily[index + 1].temp.min)} ℉`)
    $('.wind').eq(index).text(`${apiJson.daily[index + 1].wind_speed} MPH`)
    $('.humidity').eq(index).text(`${apiJson.daily[index + 1].humidity} %`)
  }
  $('#forecast').attr('hidden', false)
}

function weatherCurrent(apiJson) {
  $('.dateAndCityCurrent').text(`${cityAndState} (${moment().format('dddd, L')})`)
  $('.dateAndCityCurrent').append(`<img class="iconCurrent" src="https://openweathermap.org/img/wn/${apiJson.current.weather[0].icon}@2x.png" alt="current weather icon">`)
  $('.tempCurrent').text(`${Math.round(apiJson.current.temp)} ℉`)
  $('.windCurrent').text(`${Math.round(apiJson.current.wind_speed)} MPH`)
  $('.humidityCurrent').text(`${Math.round(apiJson.current.humidity)} %`)
  $('.uvIndexCurrent').text(`${apiJson.current.uvi}`)
  if (apiJson.current.uvi < 3) {
    $('.uvIndexCurrent').removeClass('bg-danger')
    $('.uvIndexCurrent').removeClass('bg-warning')
    $('.uvIndexCurrent').addClass('bg-success text-white rounded px-2 py-1 fw-bold')
  } else if (apiJson.current.uvi < 6) {
    $('.uvIndexCurrent').removeClass('bg-success')
    $('.uvIndexCurrent').removeClass('bg-danger')
    $('.uvIndexCurrent').addClass('bg-warning text-white rounded px-2 py-1 fw-bold')
  } else {
    $('.uvIndexCurrent').removeClass('bg-success')
    $('.uvIndexCurrent').removeClass('bg-warning')
    $('.uvIndexCurrent').addClass('bg-danger text-white rounded px-2 py-1 fw-bold')
  }
}

$('.searchBtn').on('click', function (event) {
  console.log(event.target.innerText)
  var citySearched = event.target.innerText
  apiCityCall(citySearched);
})

//use unshift to add new element at the beggining of the array
//use pop to remove last element of the array

function saveSearch(city) {                                         //saves searches to local storage when invoked
  var citySearch = JSON.parse(localStorage.getItem('search'));
  if (citySearch === null) {
    cityStorage.unshift(city)
    localStorage.setItem('search', JSON.stringify(cityStorage)) //save it to local storage
  } else {
    cityStorage = citySearch;
    cityStorage.unshift(city)
    localStorage.setItem('search', JSON.stringify(cityStorage)) //save it to local storage
  }
}

function searchBlock() {
  var citySearch = JSON.parse(localStorage.getItem('search'));
  if (citySearch === null) {
    return
  }
  for (let index = 0; index < citySearch.length; index++) {
    $('.search-block').append(`<button class="btn btn-secondary col mb-2 searchBtn">${citySearch[index]}</button>`)
  }
}

function apiCityCall(citySearched) {
  cityAndState = citySearched.split(", ")
  console.log(cityAndState)
  for (var i = 0; i < cityArrayWithLonLat.length; i++) {
    if (cityAndState[0] === cityArrayWithLonLat[i].name && cityAndState[1] === cityArrayWithLonLat[i].state) {
      var cityLonLat = [cityArrayWithLonLat[i].lat, cityArrayWithLonLat[i].lon]
      console.log(cityLonLat)
    }
  }
  var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLonLat[0]}&lon=${cityLonLat[1]}&appid=0f6d8bac92fd58296cc45805a6e84234&units=imperial&exclude=minutely,hourly`;
  $.ajax({
    url: weatherUrl,
    method: 'GET',
  })
    .then(function (response) { // runs if no error happens
      console.log('Ajax Reponse \n-------------');
      console.log(response);
      weatherCurrent(response);
      weatherForecast(response);
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
    });
}
