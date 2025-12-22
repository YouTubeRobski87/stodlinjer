/**
 * Weather Widget för Stödlinjer
 * Visar väder med poetiska, omtänksamma fraser
 */

(function () {
  'use strict';

  const BASE_URL = window.BASE_URL || '';
  const renderIcon = (name) => {
    const cleaned = (name || '').replace(/^fa-/, '');
    const map = { 'calendar-days': 'calendar-month' };
    const symbol = map[cleaned] || cleaned;
    // Dual-icon structure for hover swap effect
    return `<span class="icon-duo"><svg class="stl icon-line" aria-hidden="true" focusable="false"><use href="${BASE_URL}/assets/symbols/st-line.svg#symbol-${symbol}"></use></svg><svg class="sts icon-solid" aria-hidden="true" focusable="false"><use href="${BASE_URL}/assets/symbols/st-solid.svg#symbol-${symbol}"></use></svg></span>`;
  };

  // Konfiguration
  const CONFIG = {
    // Fallback-koordinater (Göteborg) om geolokalisering misslyckas
    fallback: {
      lat: 57.71,
      lon: 11.97,
      city: 'Göteborg'
    },
    // Timeout för geolokalisering (ms)
    geoTimeout: 5000,
    // SMHI API-bas
    smhiBase:
      'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point',
    // Nominatim API-bas (för reverse geocoding)
    nominatimBase: 'https://nominatim.openstreetmap.org/reverse'
  };

  /**
   * Hämta användarens position via Geolocation API
   * Returnerar Promise med {lat, lon} eller fallback
   */
  function getUserPosition() {
    return new Promise((resolve) => {
      // Kolla om geolokalisering finns
      if (!navigator.geolocation) {
        console.log('Geolocation stöds ej, använder fallback');
        resolve(CONFIG.fallback);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        // Lyckades
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            city: null // Vi vet inte stadsnamnet från coords
          });
        },
        // Misslyckades (nekad, timeout, etc.)
        (error) => {
          console.log('Geolocation misslyckades:', error.message);
          resolve(CONFIG.fallback);
        },
        // Alternativ
        {
          timeout: CONFIG.geoTimeout,
          enableHighAccuracy: false
        }
      );
    });
  }

  /**
   * Hämta stadsnamn från koordinater via Nominatim (OpenStreetMap)
   */
  async function getCityName(lat, lon) {
    try {
      const url = `${CONFIG.nominatimBase}?lat=${lat}&lon=${lon}&format=json&accept-language=sv`;

      const response = await fetch(url, {
        headers: {
          // Nominatim kräver en User-Agent
          'User-Agent': 'Stodlinjer-WeatherWidget/1.0'
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      // Nominatim returnerar address-objekt med olika nivåer
      // Vi plockar första bästa: city > town > municipality > county
      const address = data.address || {};
      const city = address.city || address.town || address.municipality || address.county || null;

      return city;
    } catch (error) {
      console.log('Kunde inte hämta stadsnamn:', error.message);
      return null;
    }
  }

  /**
   * Hämta väderdata från SMHI
   */
  async function fetchWeather(lat, lon) {
    // SMHI vill ha max 6 decimaler
    const latRound = lat.toFixed(6);
    const lonRound = lon.toFixed(6);

    const url = `${CONFIG.smhiBase}/lon/${lonRound}/lat/${latRound}/data.json`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`SMHI svarade med ${response.status}`);
    }

    return response.json();
  }

  /**
   * Plocka ut relevant data från SMHI-svaret
   */
  function parseWeatherData(data) {
    // Första timeSeries är "nu"
    const now = data.timeSeries[0];

    // Hjälpfunktion för att hitta parameter
    const getParam = (name) => {
      const param = now.parameters.find((p) => p.name === name);
      return param ? param.values[0] : null;
    };

    return {
      temperature: Math.round(getParam('t')), // Temperatur
      weatherCode: getParam('Wsymb2'), // Vädersymbol
      windSpeed: Math.round(getParam('ws')), // Vind m/s
      time: new Date(now.validTime)
    };
  }

  /**
   * Hitta rätt stämning baserat på Wsymb2-kod
   */
  function getMood(weatherCode, weatherMoods) {
    // Loopa genom alla stämningar och hitta matchande kod
    for (const [key, mood] of Object.entries(weatherMoods.moods)) {
      if (mood.codes.includes(weatherCode)) {
        return mood;
      }
    }
    // Ingen match – använd fallback
    return weatherMoods.fallback;
  }

  /**
   * Beräkna om det är dag eller natt baserat på solens position
   * Använder en förenklad beräkning baserad på latitud och tid på året
   */
  function isDaytime(lat) {
    const now = new Date();
    const hour = now.getHours();
    const dayOfYear = getDayOfYear(now);

    // Beräkna ungefärlig soluppgång/solnedgång för Sveriges latituder
    // Detta är en förenklad modell som fungerar bra för skandinaviska breddgrader
    const declination = 23.45 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
    const latRad = lat * (Math.PI / 180);
    const decRad = declination * (Math.PI / 180);

    // Timvinkel vid soluppgång/-nedgång
    const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad);

    // Hantera midnattssol och polarnatt
    if (cosHourAngle < -1) {
      // Midnattssol - alltid dag
      return true;
    } else if (cosHourAngle > 1) {
      // Polarnatt - alltid natt
      return false;
    }

    const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);
    const sunrise = 12 - hourAngle / 15;
    const sunset = 12 + hourAngle / 15;

    return hour >= sunrise && hour < sunset;
  }

  /**
   * Hämta dag på året (1-365)
   */
  function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * Välj rätt ikon baserat på dag/natt
   */
  function getIcon(mood, isDay) {
    return isDay ? mood.iconDay : mood.iconNight;
  }

  /**
   * Formatera datum och tid på svenska
   */
  function formatDateTime() {
    const now = new Date();

    const weekdays = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    const months = [
      'januari',
      'februari',
      'mars',
      'april',
      'maj',
      'juni',
      'juli',
      'augusti',
      'september',
      'oktober',
      'november',
      'december'
    ];

    const weekday = weekdays[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return {
      date: `${weekday} ${day} ${month}`,
      time: `kl. ${hours}:${minutes}`
    };
  }

  /**
   * Slumpa en fras från en array
   */
  function randomPhrase(phrases) {
    const index = Math.floor(Math.random() * phrases.length);
    return phrases[index];
  }

  /**
   * Rendera widgeten till DOM
   */
  function renderWidget(container, { temp, label, phrase, iconFile, city, dateTime }) {
    const iconUrl = `${window.weatherMoods.iconBasePath}${iconFile}`;

    container.innerHTML = `
      <div class="weather-widget__inner">
        <span class="weather-widget__datetime stat-chip">${renderIcon('fa-calendar-days')} ${dateTime.date} ${dateTime.time}</span>
        <img
          src="${iconUrl}"
          alt="${label}"
          class="weather-widget__icon"
          width="88"
          height="88"
        >
        <div class="weather-widget__content">
          <p class="weather-widget__summary">${Math.round(
            temp
          )}°C och ${label.toLowerCase()} i ${city}</p>
          <p class="weather-widget__phrase">”${phrase}”</p>
        </div>
      </div>
    `;
    container.classList.add('weather-widget--loaded');
  }

  /**
   * Visa felmeddelande
   */
  function renderError(container) {
    container.innerHTML = `
      <div class="weather-widget__inner weather-widget__inner--error">
        <p class="weather-widget__phrase">Kunde inte hämta vädret just nu. Det gör inget – du klarar dagen ändå.</p>
      </div>
    `;
    container.classList.add('weather-widget--loaded');
  }

  /**
   * Huvudfunktion – initiera widgeten
   */
  async function initWeatherWidget() {
    // Hitta widget-containern
    const container = document.querySelector('[data-weather-widget]');
    if (!container) return; // Ingen widget på sidan

    // Hämta stämningsdata (från Eleventy global data)
    const weatherMoods = window.weatherMoods;
    if (!weatherMoods) {
      console.error('weatherMoods saknas');
      renderError(container);
      return;
    }

    try {
      // Steg 1: Hämta position
      const position = await getUserPosition();

      // Steg 2: Hämta stadsnamn (om vi inte redan har ett)
      let city = position.city;
      if (!city) {
        city = await getCityName(position.lat, position.lon);
      }
      // Fallback om vi fortfarande inte har något stadsnamn
      if (!city) {
        city = 'din plats';
      }

      // Steg 3: Hämta väder
      const smhiData = await fetchWeather(position.lat, position.lon);

      // Steg 4: Tolka data
      const weather = parseWeatherData(smhiData);

      // Steg 5: Hitta stämning
      const mood = getMood(weather.weatherCode, weatherMoods);

      // Steg 6: Avgör dag eller natt
      const isDay = isDaytime(position.lat);

      // Steg 7: Välj rätt ikon
      const iconFile = getIcon(mood, isDay);

      // Steg 8: Slumpa en fras
      const phrase = randomPhrase(mood.phrases);

      // Steg 9: Hämta datum och tid
      const dateTime = formatDateTime();

      // Steg 10: Rendera
      renderWidget(container, {
        temp: weather.temperature,
        label: mood.label,
        phrase: phrase,
        iconFile: iconFile,
        city: city,
        dateTime: dateTime
      });
    } catch (error) {
      console.error('Weather widget fel:', error);
      renderError(container);
    }
  }

  // Kör när DOM är redo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWeatherWidget);
  } else {
    initWeatherWidget();
  }
})();
