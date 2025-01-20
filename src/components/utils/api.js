const OPENWEATHER_API_KEY = '59693debd52a95d7a3d29d1a8626c923';
const OPENCAGE_API_KEY = 'c5152e89ea52447f81075f8a52175b85';

export async function searchLocation(query) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      query
    )}&limit=5&appid=${OPENWEATHER_API_KEY}`
  );
  const data = await response.json();
  return data.map(item => ({
    name: item.name,
    lat: item.lat,
    lon: item.lon,
    country: item.country,
  }));
}

export async function getLocationDetails(lat, lon) {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`
  );
  const data = await response.json();
  const result = data.results[0];
  
  // Calculate area size based on the bounding box from OpenCage
  const bbox = result.bounds;
  const areaSize = calculateAreaSize(bbox.northeast.lat, bbox.northeast.lng, bbox.southwest.lat, bbox.southwest.lng);
  
  return {
    lat,
    lon,
    name: result.components.city || result.components.town || result.components.village || '',
    country: result.components.country,
    formatted: result.formatted,
    areaSize,
  };
}

function calculateAreaSize(north, east, south, west) {
  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert degrees to radians
  const lat1 = south * Math.PI / 180;
  const lat2 = north * Math.PI / 180;
  const lon1 = west * Math.PI / 180;
  const lon2 = east * Math.PI / 180;
  
  // Haversine formula to calculate area
  const width = Math.abs(R * Math.cos((lat1 + lat2) / 2) * (lon2 - lon1));
  const height = R * Math.abs(lat2 - lat1);
  
  // Convert square kilometers to hectares (1 km² = 100 hectares)
  return width * height * 100;
}

export async function getWeatherData(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability&daily=precipitation_probability_max&timezone=auto`
  );
  
  const airQualityResponse = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,nitrogen_dioxide,pm10,pm2_5,ozone`
  );

  const data = await response.json();
  const airData = await airQualityResponse.json();

  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    precipitation: data.current.precipitation,
    precipitationProbability: data.daily.precipitation_probability_max[0],
    airQuality: {
      index: airData.current.european_aqi,
      no2: airData.current.nitrogen_dioxide,
      pm10: airData.current.pm10,
      pm2_5: airData.current.pm2_5,
      o3: airData.current.ozone,
    },
  };
}