// src/utils/getDailyWeather.js
export async function getDailyWeather(city = "Austin", state = "TX") {
  try {
    // You can make this dynamic later — hardcoded Austin for now
    const lat = "30.2672";
    const lon = "-97.7431";

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=0433a4d012baf53fbe34647223aa1553&units=metric`;

    const res = await fetch(forecastUrl);
    if (!res.ok) throw new Error("Failed to fetch weather data");

    const data = await res.json();
    if (!data.list || data.list.length === 0) {
      throw new Error("No forecast data available");
    }

    // --- 1️⃣ Compute time window for tomorrow (local time) ---
    const now = new Date();
    const tomorrowStart = new Date(now);
    tomorrowStart.setDate(now.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // --- 2️⃣ Filter entries within tomorrow’s 24h window ---
    const tomorrowEntries = data.list.filter((entry) => {
      const entryTime = new Date(entry.dt * 1000);
      return entryTime >= tomorrowStart && entryTime <= tomorrowEnd;
    });

    if (tomorrowEntries.length === 0) {
      console.warn("⚠️ No forecast entries found for tomorrow — using first few instead.");
      tomorrowEntries.push(...data.list.slice(0, 4)); // fallback: next 12 hours
    }

    // --- 3️⃣ Compute averages ---
    const avgTemp =
      tomorrowEntries.reduce((sum, e) => sum + e.main.temp, 0) /
      tomorrowEntries.length;

    const avgHumidity =
      tomorrowEntries.reduce((sum, e) => sum + e.main.humidity, 0) /
      tomorrowEntries.length;

    const avgPop =
      tomorrowEntries.reduce((sum, e) => sum + (e.pop || 0), 0) /
      tomorrowEntries.length;

    const avgRain =
      tomorrowEntries.reduce((sum, e) => sum + (e.rain?.["3h"] || 0), 0) /
      tomorrowEntries.length;

    // --- 4️⃣ Sunrise / sunset from city ---
    const sunrise = new Date(data.city.sunrise * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const sunset = new Date(data.city.sunset * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // --- 5️⃣ Return summary object ---
    return {
      city: data.city.name,
      state,
      lat,
      lon,
      avg_temp_c: avgTemp.toFixed(1),
      avg_temp_f: ((avgTemp * 9) / 5 + 32).toFixed(1),
      humidity: Math.round(avgHumidity),
      precipitation_percent: Math.round(avgPop * 100),
      avg_rain_mm: avgRain.toFixed(1),
      sunrise,
      sunset,
    };
  } catch (error) {
    console.error("Error fetching daily weather:", error);
    return null;
  }
}
