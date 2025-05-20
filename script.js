const city = document.getElementById('city').value;
const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&format=json`;

fetch(geocodeUrl)
  .then(response => response.json())
  .then(data => {
    if (data.results && data.results.length > 0) {
      const { latitude, longitude } = data.results[0];
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

      fetch(weatherUrl)
        .then(response => response.json())
        .then(weatherData => {
          const { temperature_2m, wind_speed_10m, weathercode } = weatherData.current_weather;
          const weatherDescription = getWeatherDescription(weathercode);

          document.getElementById('weatherInfo').innerHTML = `
            <h2>${city}</h2>
            <p>${weatherDescription}</p>
            <p>Temperature: ${temperature_2m}°C</p>
            <p>Wind Speed: ${wind_speed_10m} m/s</p>
          `;
        })
        .catch(error => {
          document.getElementById('weatherInfo').innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
        });
    } else {
      document.getElementById('weatherInfo').innerHTML = '<p>City not found. Please try again.</p>';
    }
  })
  .catch(error => {
    document.getElementById('weatherInfo').innerHTML = '<p>Error fetching location data. Please try again later.</p>';
  });
