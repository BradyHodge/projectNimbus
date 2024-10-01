document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=Rexburg,US&units=imperial&appid=')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const weatherData = `
          <p><b>Temperature:</b> ${data.list[0].main.temp}°F</p>
          <p><b>Conditions:</b> ${data.list[0].weather[0].description}</p>
        `;
        document.getElementById('weatherData').innerHTML = weatherData;
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  });
   