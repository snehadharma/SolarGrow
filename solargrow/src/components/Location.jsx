import React, { useState } from "react";
import { MapPin } from "lucide-react"; // npm install lucide-react

export default function Location({ onLocationFound }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationLabel, setLocationLabel] = useState(null);

  async function getLocation() {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log("📍 Coordinates:", latitude, longitude);

          // 🌍 Fetch city & ZIP code using OpenWeather Reverse Geocoding API
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );
          const data = await res.json();
          const place = data[0];

          if (!place) {
            throw new Error("Could not fetch city data.");
          }

          const city = place.name;
          const zip = place.zip || "N/A";
          const state = place.state || "";
          const country = place.country;

          const label = `${city}, ${state ? state + ", " : ""}${country}`;
          setLocationLabel(label);
          console.log("📌 Resolved Location:", label);

          if (onLocationFound) {
            onLocationFound({
              latitude,
              longitude,
              city,
              zip,
              state,
              country,
            });
          }
        } catch (err) {
          console.error("❌ Reverse geocoding failed:", err);
          setError("Could not determine your location details.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("❌ Geolocation error:", err);
        setError("Permission denied or location unavailable.");
        setLoading(false);
      }
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={getLocation}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md transition transform hover:scale-105 active:scale-95"
      >
        <MapPin size={20} className="text-white" />
        {loading ? "Locating..." : "Use My Location"}
      </button>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {locationLabel && (
        <p className="text-sm text-green-700 mt-1">📍 {locationLabel}</p>
      )}
    </div>
  );
}
