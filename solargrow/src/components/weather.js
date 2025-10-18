import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { DateTime } from "luxon";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const app = express();
app.use(cors());
app.use(express.json());

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const CITY = "Austin";
const STATE = "TX";
const COUNTRY = "US";

app.get("/api/weather", async (req, res) => {
  try {
    const { city, state } = req.query;

    const queryCity = city || CITY;   // fallback to default if no query param
    const queryState = state || STATE;
    console.log("Fetching weather for:", queryCity, queryState);

    if (!queryCity || !queryState) {
      return res.status(400).json({ error: "Please provide city and state in query parameters" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity},${queryState},${COUNTRY}&appid=${OPENWEATHER_API_KEY}&units=imperial`;
    
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch weather data" });
    }

    const data = await response.json();

    const weather = {
      temperatureF: data.main.temp,
      humidity: data.main.humidity,
      precipitation: data.rain?.["1h"] || data.snow?.["1h"] || 0,
      sunrise: DateTime.fromSeconds(data.sys.sunrise + data.timezone).toUTC().toFormat("hh:mm a"),
      sunset: DateTime.fromSeconds(data.sys.sunset + data.timezone).toUTC().toFormat("hh:mm a")
    };

    res.json(weather);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching weather data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Weather server running on port ${PORT}`));
