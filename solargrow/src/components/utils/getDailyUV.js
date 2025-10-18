// utils/getDailyUV.js
export async function getDailyUV(city = "Austin", state = "TX") {
  try {
    const url = `https://data.epa.gov/efservice/getEnvirofactsUVDAILY/CITY/${encodeURIComponent(
      city
    )}/STATE/${encodeURIComponent(state)}/JSON`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch UV data (${response.status})`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error(`No UV data found for ${city}, ${state}`);
    }

    // Return the most recent forecast (usually for today or tomorrow)
    const forecast = data[0];

    return {
      location: `${city}, ${state}`,
      date: forecast.DATE_FORECAST,
      uv_index: forecast.UV_INDEX,
      uv_alert: forecast.UV_ALERT,
      ozone: forecast.OZONE,
      latitude: forecast.LATITUDE,
      longitude: forecast.LONGITUDE,
    };
  } catch (error) {
    console.error("Error fetching UV data:", error);
    return null;
  }
}
