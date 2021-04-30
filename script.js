var cityArrayWithLonLat = [];
var cityArrayTags = [];
var cityAndState = [];
var submitBtn = document.querySelector('#searchBtn');
var cityEl = document.querySelector('#tags');
var dateEl = document.querySelector('.date');
var weatherJson = [];


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


//jquery autocomplete
$(function () {
  $("#tags").autocomplete({
    source: cityArrayTags
  });
});


$(submitBtn).on('click', function () {
  var citySearched = $('#tags').val(); //extracts the value from search
  cityAndState = citySearched.split(",")
  console.log(cityAndState)
  for (var i = 0; i < cityArrayWithLonLat.length; i++) {
    if (cityAndState[0] === cityArrayWithLonLat[i].name && cityAndState[1].trim() === cityArrayWithLonLat[i].state) {
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
      weatherJson = response;   //might get rid of it later, but this makes the json glabal and accessible
      weatherCurrent(response);
      weatherForecast(response);
    })
    .catch(function (error) { // runs if an error happens
      console.log('error:', error);
    });
})

//building the date text
for (let index = 0; index < 5; index++) {
  $('.forecast').children().children('.date').eq(index).text(moment().add(index + 1, 'days').format('l'));
}


function weatherCurrent(apiJson) {
  console.log('hello')
  for (let index = 0; index < 5; index++) {
    $('.icon').eq(index).attr('src', `https://openweathermap.org/img/wn/${apiJson.daily[index + 1].weather[0].icon}@2x.png`);
    $('.temp').eq(index).text(`${apiJson.daily[index + 1].temp.day}`)

  }
}

function weatherForecast(apiJson) {
  console.log('hello2')
  $('#forecast').attr('hidden', false)
}