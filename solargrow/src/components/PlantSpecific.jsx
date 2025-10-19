import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Box, Text, Spinner, VStack, Button } from "@chakra-ui/react";
import { getDailyUV } from "./utils/getDailyUV"; // ✅ correct relative path
import { getDailyWeather } from "./utils/getDailyWeather";

function calculateWaterRecommendation(plant, uv, weather) {
  const ideal = plant.plant_conditions;
  let waterMl = ideal.ideal_water_ml_per_day || 300;
  let note = "Maintain usual watering schedule.";

  if (uv?.uv_index > ideal.ideal_uv + 1) {
    waterMl *= 1.2;
    note = "Increase watering slightly due to high sunlight.";
  } else if (uv?.uv_index < ideal.ideal_uv - 1) {
    waterMl *= 0.9;
    note = "Decrease watering slightly; low sunlight expected.";
  }

  if (weather?.humidity < ideal.ideal_humidity - 15) {
    waterMl *= 1.15;
    note = "Increase watering due to low humidity.";
  } else if (weather?.humidity > ideal.ideal_humidity + 15) {
    waterMl *= 0.85;
    note = "Reduce watering; high humidity will slow evaporation.";
  }

  if (weather?.precipitation_percent > ideal.ideal_precipitation + 20) {
    waterMl *= 0.8;
    note = "Reduce watering; rainfall expected.";
  }

  const finalWater = Math.round(waterMl);
  return { finalWater, note };
}


export default function PlantSpecific() {
  const { plant_id } = useParams();
  const location = useLocation();
  const { plantId, userId, conditionId } = location.state || {};

  const [plant, setPlant] = useState(null);
  const [uv, setUv] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentRecs, setRecentRecs] = useState([]); // ✅ new state


  useEffect(() => {
    async function fetchPlantAndUV() {
      setLoading(true);
      setError("");

      try {
        // ✅ 1. Fetch the plant
        const idToUse = plantId || plant_id;
        const { data, error } = await supabase
          .from("plants")
          .select(`
            id,
            user_id,
            nickname,
            soil_type,
            date_planted,
            created_at,
            plant_conditions_id,
            plant_conditions:plant_conditions_id (
              id,
              name,
              ideal_uv,
              ideal_humidity,
              ideal_precipitation,
              ideal_sunlight_hours
            ),
            profiles:user_id (
              city,
              state
            )
          `)
          .eq("id", idToUse)
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        setPlant(data);

        // ✅ Fetch past 3 recommendations
        const { data: recData, error: recFetchError } = await supabase
          .from("recommendations")
          .select("id, recommendation_text, recommended_water_ml, date_generated")
          .eq("plant_id", data.id)
          .eq("user_id", userId)
          .order("date_generated", { ascending: false })
          .limit(3);

        if (recFetchError) console.error("❌ Failed to fetch past recs:", recFetchError);
        else setRecentRecs(recData || []);

        // ✅ 2. Fetch UV data using the user's city and state
        const city = data?.profiles?.city || "Austin";
        const state = "TX";

        const uvData = await getDailyUV(city, state);
        setUv(uvData);

        const weatherData = await getDailyWeather(city, "TX", import.meta.env.OPENWEATHER_API_KEY )
        setWeather(weatherData);
        

        if (uvData && weatherData) {
          const today = new Date();
          const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
          const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

          // ✅ Get the latest recommendation
          const { data: latestRec, error: recError } = await supabase
            .from("recommendations")
            .select("id, date_generated")
            .eq("plant_id", data.id)
            .eq("user_id", userId)
            .order("date_generated", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (recError) console.error("❌ Error checking recommendation:", recError);

          // ✅ Get the latest log
          const { data: latestLog, error: logError } = await supabase
            .from("plant_logs")
            .select("id, log_date")
            .eq("plant_id", data.id)
            .eq("user_id", userId)
            .order("log_date", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (logError) console.error("❌ Error checking plant logs:", logError);

          // ✅ Determine if a new recommendation is needed
          const latestRecTime = latestRec ? new Date(latestRec.date_generated) : null;
          const latestLogTime = latestLog ? new Date(latestLog.log_date) : null;

          const shouldInsert =
            !latestRecTime || // No recommendations yet
            (latestLogTime && latestRecTime && latestLogTime > latestRecTime) || // Watered after last recommendation
            latestRecTime < new Date(startOfDay); // No recommendation today

          if (shouldInsert) {
            const rec = calculateWaterRecommendation(data, uvData, weatherData);

            const { error: insertError } = await supabase.from("recommendations").insert([
              {
                user_id: userId,
                plant_id: data.id,
                recommendation_type: "water",
                recommendation_text: `Water ${rec.finalWater} mL today. ${rec.note}`,
                recommended_water_ml: rec.finalWater,
                date_generated: new Date().toISOString(),
              },
            ]);

            if (insertError) console.error("❌ Failed to insert recommendation:", insertError);
            else console.log("✅ New recommendation added!");
          } else {
            console.log("🪴 Skipped: latest recommendation still valid.");
          }
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load plant or UV data.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlantAndUV();
  }, [plant_id, plantId, userId]);

  // 🌀 Loading State
  if (loading)
    return (
      <Box textAlign="center" py={20}>
        <Spinner />
      </Box>
    );

  // ❌ Error State
  if (error)
    return (
      <Box textAlign="center">
        <Text>{error}</Text>
      </Box>
    );

  // 🌱 No Data State
  if (!plant)
    return (
      <Box textAlign="center">
        <Text>No plant found.</Text>
      </Box>
    );

  const conditions = plant.plant_conditions || {};

  return (
    <VStack spacing={3} py={10}>
      <Text fontSize="2xl" fontWeight="bold" color="green.800">
        {plant.nickname}
      </Text>

      <Text>Plant Type: {conditions.name}</Text>
      <Text>Soil Type: {plant.soil_type}</Text>

      <Text>
        Planted:{" "}
        {new Date(plant.date_planted).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>

      <Box>
        <Text fontWeight="bold">Ideal Conditions:</Text>
        <Text>☀️ UV: {conditions.ideal_uv}</Text>
        <Text>💧 Humidity: {conditions.ideal_humidity}%</Text>
        <Text>🌧️ Precipitation: {conditions.ideal_precipitation}%</Text>
        <Text>🌤️ Sunlight: {conditions.ideal_sunlight_hours} hrs/day</Text>
      </Box>

      {/* ✅ Past 3 Recommendations */}
      {recentRecs.length > 0 && (
        <Box>
          <Text fontWeight="bold" color="green.800" mb={2}>
            🕓 Past 3 Recommendations
          </Text>

          {recentRecs.map((rec) => (
            <Box key={rec.id} mb={3} p={2} borderBottom="1px solid #DDEADD">
              <Text fontSize="sm" color="green.900">
                💧 {rec.recommendation_text}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {new Date(rec.date_generated).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Box>
          ))}
        </Box>
      )}

      <Button colorScheme="green" onClick={() => window.history.back()}>
        Back to My Garden
      </Button>
    </VStack>
  );
}
