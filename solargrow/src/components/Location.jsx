import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Button, HStack, Text, Spinner } from "@chakra-ui/react";

export default function Location({ onLocationFound }) {
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
      return { city, state };
    } catch (e) {
      console.error("Reverse lookup failed:", e);
      return { city: "Unknown", state: "" };
    }
  }

  async function fallbackByIP() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return {
        city: data.city || "Unknown",
        state: data.region || "",
        latitude: data.latitude,
        longitude: data.longitude,
      };
    } catch {
      return { city: "Unknown", state: "", latitude: null, longitude: null };
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
      const { city, state } = await reverseLookup(coords.latitude, coords.longitude);
      const label = `${city}, ${state}`;
      setLocationLabel(label);
      onLocationFound?.({ city, state, latitude: coords.latitude, longitude: coords.longitude });
      setLoading(false);
    };

    const fail = async (err) => {
      console.warn("Geo error:", err);
      if (err.code === 3) {
        const f = await fallbackByIP();
        const label = `${f.city}, ${f.state} (approx)`;
        setLocationLabel(label);
        onLocationFound?.(f);
      } else if (err.code === 1) {
        setError("Permission denied. Enable location access.");
      } else {
        setError("Unable to get location.");
      }
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, fail, {
      enableHighAccuracy: false,
      timeout: 60000,
      maximumAge: 0,
    });

    // fallback if not resolved after 70s
    setTimeout(async () => {
      if (!done) {
        const f = await fallbackByIP();
        const label = `${f.city}, ${f.state} (approx)`;
        setLocationLabel(label);
        onLocationFound?.(f);
        setLoading(false);
      }
    }, 70000);
  }

  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <Button
        colorScheme="green"
        fontFamily="'Fustat', sans-serif"
        onClick={getLocation}
        isDisabled={loading}
        w="fit-content"
      >
        {loading ? (
          <HStack spacing={2}>
            <Spinner size="sm" color="green.800" />
            <Text fontFamily="'Fustat', sans-serif" color="green.800">
              Locating...
            </Text>
          </HStack>
        ) : (
          <HStack spacing={2}>
            <MapPin size={15} />
            <Text fontFamily="'Fustat', sans-serif" color="green.800">
              Use My Location
            </Text>
          </HStack>
        )}
      </Button>

      {error && (
        <Text fontSize="sm" color="red.500" mt={1}>
          {error}
        </Text>
      )}

      {locationLabel && (
        <Text mt={2} fontFamily="'Fustat', sans-serif" color="green.800">
          📍 {locationLabel}
        </Text>
      )}
    </div>
  );
}
