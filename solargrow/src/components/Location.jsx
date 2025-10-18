import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Button, HStack, Text, Spinner } from "@chakra-ui/react";

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
      <Button
        type="submit"
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
          📍{locationLabel}
        </Text>
      )}
    </div>
  );
}