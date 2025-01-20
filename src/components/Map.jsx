import React, { useEffect, useRef } from 'react';

export function Map({ lat, lon, onMarkerClick }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      if (!mapRef.current) {
        mapRef.current = window.L.map('map').setView([lat, lon], 13);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
      } else {
        mapRef.current.setView([lat, lon], 13);
      }

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = window.L.marker([lat, lon])
        .addTo(mapRef.current)
        .on('click', onMarkerClick);
    };

    loadMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon, onMarkerClick]);

  return (
    <div id="map" className="w-full h-[400px] rounded-lg shadow-md" />
  );
}