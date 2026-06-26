// loadMap is called by the Bing Maps SDK as a global callback
async function loadMap() {
  const mapEl = document.getElementById('map');

  let locations;
  try {
    const res = await fetch('/api/locations');
    if (!res.ok) throw new Error('Server returned ' + res.status);
    const data = await res.json();
    locations = data.locations || [];
  } catch (err) {
    mapEl.textContent = 'Could not load map locations. Please try again later.';
    return;
  }

  if (!locations.length) {
    mapEl.textContent = 'No locations to display.';
    return;
  }

  const map = new Microsoft.Maps.Map(mapEl, {
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
