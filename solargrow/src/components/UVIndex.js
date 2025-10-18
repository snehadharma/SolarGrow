import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { DateTime } from "luxon"; // npm install luxon

const app = express();
app.use(cors());
app.use(express.json());

const CITY = "Austin";
const STATE = "TX";
const OUTPUT_FORMAT = "JSON";

app.get("/api/uv", async (req, res) => {
  try {
    
    const { city, state } = req.query;
    const queryCity = city || CITY;
    const queryState = state || STATE;

    const url = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/CITY/${queryCity}/STATE/${queryState}/${OUTPUT_FORMAT}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch UV data" });
    }

    const data = await response.json();

    // Get Austin's current time in local timezone
    const now = DateTime.now().setZone("America/Chicago"); // Austin is in Central Time
    const formattedNow = now.toFormat("MMM/dd/yyyy hh a"); // matches DATE_TIME format in API

    // Find the UV data that matches current hour
    const currentUV = data.find(item => item.DATE_TIME === formattedNow);

    res.json({ currentUV });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error fetching UV data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));