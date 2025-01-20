import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  CloudRain,
  Gauge,
} from 'lucide-react';

function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

export function WeatherCard({ data }) {
  const getAirQualityLabel = (index) => {
    if (index <= 20) return 'Good';
    if (index <= 40) return 'Fair';
    if (index <= 60) return 'Moderate';
    if (index <= 80) return 'Poor';
    return 'Very Poor';
  };

  const getAirQualityColor = (index) => {
    if (index <= 20) return 'text-green-500';
    if (index <= 40) return 'text-yellow-500';
    if (index <= 60) return 'text-orange-500';
    if (index <= 80) return 'text-red-500';
    return 'text-purple-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="text-blue-500" />
          <h3 className="font-semibold">Temperature</h3>
        </div>
        <p className="text-2xl font-bold">
          {data.temperature.toFixed(1)}°C
          <span className="text-lg text-gray-500 ml-2">
            ({celsiusToFahrenheit(data.temperature).toFixed(1)}°F)
          </span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-2">
          <Droplets className="text-blue-500" />
          <h3 className="font-semibold">Humidity</h3>
        </div>
        <p className="text-2xl font-bold">{data.humidity}%</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-2">
          <Wind className="text-blue-500" />
          <h3 className="font-semibold">Wind</h3>
        </div>
        <p className="text-2xl font-bold">
          {data.windSpeed.toFixed(1)} m/s
          <span className="text-lg text-gray-500 ml-2">
            ({(data.windSpeed * 2.237).toFixed(1)} mph)
          </span>
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Compass className="text-gray-400" />
          <span>{data.windDirection}°</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-2">
          <CloudRain className="text-blue-500" />
          <h3 className="font-semibold">Precipitation</h3>
        </div>
        <p className="text-2xl font-bold">
          {data.precipitation.toFixed(1)} mm
          <span className="text-lg text-gray-500 ml-2">
            ({(data.precipitation * 0.0394).toFixed(2)} in)
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {data.precipitationProbability}% chance
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="text-blue-500" />
          <h3 className="font-semibold">Air Quality</h3>
        </div>
        <p className={`text-2xl font-bold ${getAirQualityColor(data.airQuality.index)}`}>
          {getAirQualityLabel(data.airQuality.index)}
          <span className="text-lg ml-2">({data.airQuality.index})</span>
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>NO₂: {data.airQuality.no2.toFixed(1)} µg/m³</div>
          <div>O₃: {data.airQuality.o3.toFixed(1)} µg/m³</div>
          <div>PM10: {data.airQuality.pm10.toFixed(1)} µg/m³</div>
          <div>PM2.5: {data.airQuality.pm2_5.toFixed(1)} µg/m³</div>
        </div>
      </div>
    </div>
  );
}