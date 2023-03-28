function formatDate(date) {
  let currentHours = date.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];
  return `${currentDay},   ${currentHours}:${currentMinutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let days = ["Thu", "Fri", "Sat", "Sun", "Mon"];
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` 
              <div class="col-2">
                <div class="weather-forecast-day">${formatDay(
                  forecastDay.dt
                )}</div>
                <img
                  src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt=""
                  width="42"
                />
                <div class="weather-forecast-temperature">
                  <span class="weather-forecast-temperature-max">${Math.round(
                    forecastDay.temp.max
                  )}°F </span>
                  <span class="weather-forecast-temperature-min">
                    ${Math.round(forecastDay.temp.min)}°F </span>
                </div>
              </div>
            `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
let quotesForDay = [
  "The best preparation for tomorrow is doing your best today",
  "Nothing is more expensive than a missed opportunity",
  "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart",
  "Never give up on what you really want to do",
  "The person with big dreams is more powerful than the one with all the facts",
  "The future belongs to those who believe in the beauty of their dreams",
  "Find a job you like and you add five days to every week",
  "Nothing will work unless you do",
];

let quoteElement = document.querySelector("#quote");
let storedQuote = localStorage.getItem("quoteForDay");
let today = new Date().toLocaleDateString();

if (storedQuote && localStorage.getItem("date") === today) {
  quoteElement.textContent = storedQuote;
} else {
  let randomIndex = Math.floor(Math.random() * quotesForDay.length);
  let quote = quotesForDay[randomIndex];
  localStorage.setItem("quoteForDay", quote);
  localStorage.setItem("date", today);
  quoteElement;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "f09d3949047ab6c9e3bcaf79cf61f619";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${apiKey}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}
function displayTemperature(response) {
  let temperature = document.querySelector("#temperature");
  let location = document.querySelector("#city");
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let windSpeed = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperature.innerHTML = Math.round(celsiusTemperature);
  location.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = response.data.main.humidity;

  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", `${response.data.weather[0].description}`);

  backGroundChanger(response);
  getForecast(response.data.coord);
}

function backGroundChanger(response) {
  let weather = response.data.weather[0].main;
  let body = document.querySelector("#image");
  if (weather === "Clouds") {
    body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/073/910/original/pexels-miguel-%C3%A1-padri%C3%B1%C3%A1n-19670_%281%29.jpg?1679968822')";
  } else if (weather === "Rain") {
    body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/073/913/original/pexels-lumn-311039.jpg?1679969440')";
  } else if (weather === "Snow") {
    body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/073/911/original/pexels-jill-wellington-327131.jpg?1679969055')";
  } else if (weather === "Clear") {
    body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/073/915/original/pexels-amy-chandra-789152.jpg?1679970606')";
  } else {
    body.style.backgroundImage =
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/073/916/original/pexels-min-an-1369280.jpg?1679970914')";
  }
}

function search(city) {
  let apiKey = "f09d3949047ab6c9e3bcaf79cf61f619";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#input-city-search");
  search(cityInputElement.value);
}

let form = document.querySelector("#city-search");
form.addEventListener("submit", handleSubmit);

search("Philadelphia");
