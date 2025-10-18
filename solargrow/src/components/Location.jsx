import React, { useState } from "react";
import { MapPin } from "lucide-react";

export default function Location() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationLabel, setLocationLabel] = useState(null);

  async function reverseLookup(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`,
        {
          headers: {
            "User-Agent": "SolarBloomHackathonApp/1.0 (ali.hssn015@gmail.com)",
            "Accept-Language": "en",
          },
        }
      );
      const data = await res.json();
      const a = data.address || {};
      const city = a.city || a.town || a.village || "";
      const state = a.state || "";
      return city && state ? `${city}, ${state}` : state || city || "Unknown";
    } catch (e) {
      console.error("Reverse lookup failed:", e);
      return "Unknown";
    }
  }

  async function fallbackByIP() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return `${data.city}, ${data.region}`;
    } catch {
      return "Unknown";
    }
  }

  async function getLocation() {
    setLoading(true);
    setError(null);
    setLocationLabel(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    let done = false;

    const success = async ({ coords }) => {
      done = true;
      const label = await reverseLookup(coords.latitude, coords.longitude);
      setLocationLabel(label);
      setLoading(false);
    };

    const fail = async (err) => {
      console.warn("Geo error:", err);
      if (err.code === 3) {
        // timeout → fallback
        const label = await fallbackByIP();
        setLocationLabel(label + " (approx)");
      } else if (err.code === 1) {
        setError("Permission denied. Enable location access.");
      } else {
        setError("Unable to get location.");
      }
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, fail, {
      enableHighAccuracy: false, // allow coarse network location
      timeout: 60000,            // 60 seconds
      maximumAge: 0,
    });

    // Safety fallback: if still not resolved after 70s, use IP
    setTimeout(async () => {
      if (!done) {
        const label = await fallbackByIP();
        setLocationLabel(label + " (approx)");
        setLoading(false);
      }
    }, 70000);
  }

  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <button
        onClick={getLocation}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition text-white ${
          loading
            ? "bg-green-400 cursor-wait"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Locating...</span>
          </div>
        ) : (
          <>
            <MapPin size={20} className="text-white animate-pulse" />
            <span>Use My Location</span>
          </>
        )}
      </button>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {locationLabel && (
        <p className="text-sm text-green-700 mt-1 font-medium">
          📍 {locationLabel}
        </p>
      )}
    </div>
  );
}
