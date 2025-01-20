import React, { useEffect, useState } from 'react';
import { MapPin, RefreshCw, Move } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { WeatherCard } from './WeatherCard';
import { Map } from './Map';
import { getLocationDetails, getWeatherData } from './utils/api';

/**
 * @typedef {Object} WeatherData
 * @property {number} temperature
 * @property {number} humidity
 * @property {number} windSpeed
 * @property {number} windDirection
 * @property {number} precipitation
 * @property {number} precipitationProbability
 * @property {Object} airQuality
 * @property {number} airQuality.index
 * @property {number} airQuality.no2
 * @property {number} airQuality.pm10
 * @property {number} airQuality.pm2_5
 * @property {number} airQuality.o3
 */

/**
 * @typedef {Object} LocationData
 * @property {number} lat
 * @property {number} lon
 * @property {string} name
 * @property {string} country
 * @property {string} formatted
 * @property {number} areaSize - Area size in hectares
 */

/**
 * @typedef {Object} SearchResult
 * @property {number} lat
 * @property {number} lon
 */

const Weather = ({onWeatherUpdate,changeArea}) => {
  /** @type {[LocationData | null, React.Dispatch<React.SetStateAction<LocationData | null>>]} */
  const [location, setLocation] = useState(null);

  /** @type {[WeatherData | null, React.Dispatch<React.SetStateAction<WeatherData | null>>]} */
  const [weather, setWeather] = useState(null);
  useEffect(()=>{
    onWeatherUpdate(weather);
  },[weather]);
  useEffect(()=>{
    changeArea((location==null)?(0):(location.areaSize))
  },[location]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationSelect = async (searchResult) => {
    setLoading(true);
    setError(null);
    try {
      const [locationData, weatherData] = await Promise.all([
        getLocationDetails(searchResult.lat, searchResult.lon),
        getWeatherData(searchResult.lat, searchResult.lon),
      ]);
      setLocation(locationData);
      setWeather(weatherData);
      if (onWeatherUpdate) {
        onWeatherUpdate(weatherData);
      }
    } catch (err) {
      setError('Failed to fetch location data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const [locationData, weatherData] = await Promise.all([
            getLocationDetails(position.coords.latitude, position.coords.longitude),
            getWeatherData(position.coords.latitude, position.coords.longitude),
          ]);
          setLocation(locationData);
          setWeather(weatherData);
        } catch (err) {
          setError('Failed to fetch location data. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Failed to get your location. Please enable location services.');
        setLoading(false);
        console.error(err);
      }
    );
  };

  const handleRefresh = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const weatherData = await getWeatherData(location.lat, location.lon);
      setWeather(weatherData);
    } catch (err) {
      setError('Failed to refresh weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Weather & Location Analysis
          </h1>
          <p className="text-gray-600">
            Enter a location or use your current position to get detailed weather information
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <SearchBar onLocationSelect={handleLocationSelect} />
          <button
            onClick={handleGetCurrentLocation}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            <MapPin size={20} />
            Get Current Location
          </button>
          {location && (
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              Refresh Data
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {location && weather && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">
                {location.name}, {location.country}
              </h2>
              <p className="text-gray-600">{location.formatted}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <p>
                  {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
                </p>
                <div className="flex items-center gap-2">
                  <Move size={16} />
                  <span>
                    Area: {location.areaSize.toFixed(2)} ha
                    <span className="text-gray-400 ml-2">
                      ({(location.areaSize / 100).toFixed(2)} km²)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <WeatherCard data={weather} />

            <Map
              lat={location.lat}
              lon={location.lon}
              onMarkerClick={() => {
                // Handle marker click if needed
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
