const key = 'd53785c1e33da9456359647e94822b7f';

async function search() {
    const phrase = document.querySelector('input[type="text"]').value;
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`)
    const data = await response.json()
    const ul = document.querySelector('form ul');
    ul.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const { name, lat, lon, country } = data[i];
        ul.innerHTML += `<li 
        data-lat="${lat}" 
        data-lon="${lon}" 
        data-name="${name}">
        ${name} <span>${country}</span></li>`;

    }
}

const debouncedSearch = _.debounce(() => {
    search();
}, 600)


async function showWeather(lat, lon, name) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`);
    const data = await response.json();

    const temp = Math.round(data.main.temp).toString().substring(0, 2);
    const feelsLike = Math.round(data.main.feels_like).toString().substring(0, 2);
    const humidity = Math.round(data.main.humidity).toString().substring(0, 2);
    const wind = Math.round(data.wind.speed).toString().substring(0, 2);
    const icon = data.weather[0].icon;
    document.getElementById('city').innerHTML = name;
    document.getElementById('degrees').innerHTML = temp + '&deg;C';
    document.getElementById('windValue').innerHTML = wind + '<span>km/h</span>';
    document.getElementById('feelsLikeValue').innerHTML = feelsLike + '<span>&deg;C</span>';
    document.getElementById('humidityValue').innerHTML = humidity + '<span>%</span>';
    document.getElementById('city').innerHTML = name;
    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.querySelector('form').style.display = 'none';
    document.getElementById('weather').style.display = 'block';

}


document.querySelector('input[type="text"]')
    .addEventListener('keyup', debouncedSearch);

document.body.addEventListener('click', ev => {
    const li = ev.target;
    const { lat, lon, name } = li.dataset;

    // Store data in localStorage when a list item is clicked
    if (lat) {
        localStorage.setItem('lat', lat);
        localStorage.setItem('lon', lon);
        localStorage.setItem('name', name);
        showWeather(lat, lon, name);
    }
});


document.getElementById('change')
    .addEventListener('click', () => {
        document.getElementById('weather').style.display = 'none';
        document.querySelector('form').style.display = 'block';
    })

document.body.onload = () => {
    // Retrieve data from localStorage upon page load
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const name = localStorage.getItem('name');
    if (lat && lon && name) {
        showWeather(lat, lon, name);
    }
}