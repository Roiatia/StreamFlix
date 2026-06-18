const locations = [
  {
    name: 'StreamFlix Tel Aviv Office',
    address: 'Tel Aviv, Israel',
    lat: 32.0853,
    lng: 34.7818
  },
  {
    name: 'StreamFlix Sderot Branch',
    address: 'Sderot, Israel',
    lat: 31.5250,
    lng: 34.5969
  },
  {
    name: 'StreamFlix Jerusalem Studio',
    address: 'Jerusalem, Israel',
    lat: 31.7683,
    lng: 35.2137
  }
];

function loadMap() {
  const map = new Microsoft.Maps.Map(document.getElementById('map'), {
    center: new Microsoft.Maps.Location(31.9, 34.9),
    zoom: 7
  });

  locations.forEach(location => {
    const pin = new Microsoft.Maps.Pushpin(
      new Microsoft.Maps.Location(location.lat, location.lng),
      {
        title: location.name,
        subTitle: location.address
      }
    );

    map.entities.push(pin);
  });
}

async function loadExternalServiceData() {
  const infoEl = document.getElementById('externalInfo');

  try {
    const response = await fetch('https://restcountries.com/v3.1/name/israel');
    const data = await response.json();

    const country = data[0];

    infoEl.innerHTML = `
      <strong>Country:</strong> ${country.name.common}<br>
      <strong>Capital:</strong> ${country.capital[0]}<br>
      <strong>Population:</strong> ${country.population.toLocaleString()}<br>
      <strong>Region:</strong> ${country.region}
    `;
  } catch (error) {
    infoEl.textContent = 'Could not load external service data.';
  }
}

document.addEventListener('DOMContentLoaded', loadExternalServiceData);