document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('city');

    document.querySelector('.city-container h2').textContent = cityName;

    try {
        const response = await fetch('js/data.json');
        const cities = await response.json();
        const cityData = cities.find(city => city.name === cityName);
        
        if (cityData) {
            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?` +
                `latitude=${cityData.latitude}&longitude=${cityData.longitude}` +
                `&current_weather=true` +
                `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
                `&timezone=auto`
            );
            const weatherData = await weatherResponse.json();

            document.querySelector('.temperature h2').textContent = 
                `${Math.round(weatherData.current_weather.temperature)}°C`;
            
            const maxTemp = document.querySelector('.maxmin h3:first-child');
            const minTemp = document.querySelector('.maxmin h3:last-child');
            maxTemp.textContent = `Max: ${Math.round(weatherData.daily.temperature_2m_max[0])}°C`;
            minTemp.textContent = `Min: ${Math.round(weatherData.daily.temperature_2m_min[0])}°C`;

            const weatherCode = weatherData.current_weather.weathercode;
            updateWeatherIcon(weatherCode);

            createCurrentConditionsChart(
                weatherData.current_weather.windspeed,
                weatherData.daily.precipitation_probability_max[0]
            );

            createForecastChart(weatherData.daily);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function updateWeatherIcon(code) {
    //All from Bootstrap icon
    const weatherIcons = {
        0: { icon: 'bi-sun-fill', text: 'Clear sky' },
        1: { icon: 'bi-cloud-sun-fill', text: 'Mainly clear' },
        2: { icon: 'bi-cloud-sun-fill', text: 'Partly cloudy' },
        3: { icon: 'bi-clouds-fill', text: 'Overcast' },
        45: { icon: 'bi-cloud-fog-fill', text: 'Foggy' },
        48: { icon: 'bi-cloud-fog-fill', text: 'Foggy' },
        51: { icon: 'bi-cloud-drizzle-fill', text: 'Light drizzle' },
        53: { icon: 'bi-cloud-drizzle-fill', text: 'Drizzle' },
        55: { icon: 'bi-cloud-drizzle-fill', text: 'Dense drizzle' },
        61: { icon: 'bi-cloud-rain-fill', text: 'Light rain' },
        63: { icon: 'bi-cloud-rain-fill', text: 'Rain' },
        65: { icon: 'bi-cloud-rain-heavy-fill', text: 'Heavy rain' },
        71: { icon: 'bi-cloud-snow-fill', text: 'Light snow' },
        73: { icon: 'bi-cloud-snow-fill', text: 'Snow' },
        75: { icon: 'bi-cloud-snow-fill', text: 'Heavy snow' },
        95: { icon: 'bi-cloud-lightning-rain-fill', text: 'Thunderstorm' }
    };

    const weather = weatherIcons[code] || { 
        icon: 'bi-question-circle-fill', 
        text: `Unknown Weather (Code: ${code})` 
    };

    const iconElement = document.querySelector('.weather-icon');
    const textElement = document.querySelector('.weathercode h2');
    
    iconElement.className = `bi ${weather.icon} weather-icon`;
    textElement.textContent = weather.text;

    setWeatherBackground(code);
}

function setWeatherBackground(weatherCode) {
    const body = document.body;
    //imported from Giphy
    const backgrounds = {
        0: 'assets/img/Sticker Sky GIF by Josh Rigling.gif',
        1: 'assets/img/Sticker Sky GIF by Josh Rigling.gif',
        2: 'assets/img/Sticker Sky GIF by Josh Rigling.gif',
        3: 'assets/img/Black And White Rain GIF by Nora Simon.gif',
        45: 'assets/img/Fog GIF.gif',
        48: 'assets/img/Fog GIF.gif',
        51: 'assets/img/rain.gif',
        53: 'assets/img/rain.gif',
        55: 'assets/img/rain.gif',
        61: 'assets/img/rain.gif',
        63: 'assets/img/rain.gif',
        65: 'assets/img/rain.gif',
        71: 'assets/img/snow.gif',
        73: 'assets/img/snow.gif',
        75: 'assets/img/snow.gif',
        95: 'assets/img/giphy.gif',
        default: 'assets/img/Sticker Sky GIF by Josh Rigling.gif'
    };

    const backgroundImage = backgrounds[weatherCode] || backgrounds.default;
    document.body.style.backgroundImage = `url('${backgroundImage}')`;
    document.body.style.setProperty('--background-image', `url('${backgroundImage}')`);

    const styleTag = document.createElement('style');
    styleTag.textContent = `
        body::before {
            background-image: url('${backgroundImage}');
        }
    `;
    document.head.appendChild(styleTag);
}

function createCurrentConditionsChart(windspeed, precipitation) {
    const ctx = document.getElementById('windPrecipChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Wind Speed (km/h)', 'Precipitation (%)'],
            datasets: [{
                data: [windspeed, precipitation],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(45, 45, 122, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(45, 45, 122, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

function createForecastChart(dailyData) {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyData.time.map(date => 
                new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
            ),
            datasets: [
                {
                    label: 'Max Temperature (°C)',
                    data: dailyData.temperature_2m_max,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Min Temperature (°C)',
                    data: dailyData.temperature_2m_min,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Precipitation (%)',
                    data: dailyData.precipitation_probability_max,
                    type: 'bar',
                    backgroundColor: 'rgba(45, 45, 122, 0.5)',
                    borderColor: 'rgba(45, 45, 122, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                y1: {
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Precipitation (%)',
                        color: 'white'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        padding: 10
                    }
                }
            }
        }
    });
}