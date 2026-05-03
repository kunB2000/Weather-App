import './style.css';
import './styleTwo.css';

const button = document.getElementById('searchIcon');

const iconMap = {
  clear: "https://openweathermap.org/img/wn/01d@2x.png",
  cloudy: "https://openweathermap.org/img/wn/03d@2x.png",
  "clear-day": "☀️",
  'clear-night': '🌙',
  rain: '🌧️',
  snow: '❄️',
  cloudy: '☁️',
  'partly-cloudy-day': '🌤️',
  'partly-cloudy-night': '🌙☁️'
};

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
city = ["New York", "London", "Paris", "Tokyo", "Bangkok", "Hong Kong", "Macao", "Istanbul", "Dubai", "Singapore"]

const updateUI = (data) => {
  
  let day = days[new Date(data.days[0].datetime).getDay()];
  let time12hr = new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  // Main Section
  document.getElementById('temp').innerHTML = `${Math.round(data.days[0].temp)}°C`;
  document.getElementById('description').innerHTML = data.days[0].conditions;
  document.getElementById('date').innerHTML = data.days[0].datetime;
  document.getElementById('dayNtime').innerHTML = `${day}, ${time12hr}`;
  getCityName(data.latitude, data.longitude).then(city => {
    document.getElementById('city').innerHTML = city;
  });;
  
  document.getElementById('tempImg').innerHTML = iconMap[data.days[0].icon] || '🌡️';

  // Details Section
  document.getElementById('feelsLike').innerHTML = `${Math.round(data.days[0].feelslike)}°`;
  document.getElementById('windSpeed').innerHTML = data.days[0].windspeed;
  document.getElementById('windDirection').innerHTML = data.days[0].winddir;
  document.getElementById('humidity').innerHTML = data.days[0].humidity;
  document.getElementById('precipitation').innerHTML = Math.round((data.days[0].precip * 10) / 10 );
  document.getElementById('pressure').innerHTML = data.days[0].pressure;
  document.getElementById('skyConditions').innerHTML = data.days[0].conditions;
  document.getElementById('sunrise').innerHTML = data.days[0].sunrise;
  document.getElementById('sunset').innerHTML = data.days[0].sunset;
};


const getWeather = async (e) =>  {
  e.preventDefault();
  const location = document.getElementById('searchBarInput').value;
  const key = process.env.API_KEY;
  // Added unitGroup=metric to get Celsius automatically
  const baseUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${key}`;
  try {
    // const data = await response.json();

    const response = await fetch(baseUrl);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    updateUI(data);

  }
  catch(error) {
    console.log(error.message)
  }

}

button.addEventListener("click", getWeather);


// fetch the geolocations

// 1. Reusable Fetch Function
const fetchWeatherData = async (query) => {
  const key = process.env.API_KEY;
  // We use &unitGroup=metric to get Celsius automatically
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=metric&key=${key}`;

  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Location not found');
      const data = await response.json();
      updateUI(data); // Calls your function to paint the screen
  } catch (error) {
      console.error("Fetch Error:", error);
  }
};

// 2. Geolocation Logic
const initApp = () => {
  if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              // SUCCESS: User allowed location
              const { latitude, longitude } = position.coords;
              fetchWeatherData(`${latitude},${longitude}`);
          },
          (error) => {
              // ERROR: User denied or error occurred
              console.warn("Location denied, loading default city.");
              fetchWeatherData(city[Math.floor(Math.random() * 10)]);
          }
      );
  } else {
      // Browser doesn't support Geolocation
      fetchWeatherData(city[Math.floor(Math.random() * 10)]);
  }
};

// 3. Run on Page Load
window.addEventListener('load', initApp);

// 4. Keep your manual search listener
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('searchBarInput').value;
  fetchWeatherData(city);
});

async function getCityName(lat, lng) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.city
  } catch (error) {
    console.error("Error", error);
  }
}