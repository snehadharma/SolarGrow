import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Box, Text, Spinner, VStack, Button } from "@chakra-ui/react";
// import weather from "./weather";
// import { ClipboardType } from "lucide-react";
import { getDailyUV } from "./utils/getDailyUV"

export default function PlantSpecific() {
  const { plant_id } = useParams(); 
  const location = useLocation();
  const { plantId, userId, conditionId } = location.state || {};
  const [uv, setUv] = useState(null);
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlant() {
      setLoading(true);
      setError("");

      const idToUse = plantId || plant_id; // ✅ fallback for both
      const { data, error } = await supabase
        .from("plants")
        .select(
          `
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
          )
        `
        )
        .eq("id", idToUse)
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error(error);
        setError("Failed to load plant details.");
      } else {
        setPlant(data);
      }

      setLoading(false);
    }

    fetchPlant();
  }, [plant_id, plantId, userId]);

  if (loading)
    return (
      <Box textAlign="center" py={20}>
        <Spinner  />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center">
        <Text >{error}</Text>
      </Box>
    );

  if (!plant)
    return (
      <Box textAlign="center">
        <Text>No plant found.</Text>
      </Box>
    );

  const conditions = plant.plant_conditions || {};
  
  // plant.plantId
  // const sunrise  = weather.sunrise;
  // console.log(sunrise);


  console.log(plant.plant_conditions_id)

  return (
    <VStack>
      <Text >
        {plant.nickname}
      </Text>
      <Text> 
        Plant Type: {conditions.name}
      </Text>

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
        <Text>
          Ideal Conditions:
        </Text>
        <Text>☀️ UV: {conditions.ideal_uv}</Text>
        <Text>💧 Humidity: {conditions.ideal_humidity}%</Text>
        <Text>🌧️ Precipitation: {conditions.ideal_precipitation}%</Text>
        <Text>🌤️ Sunlight: {conditions.ideal_sunlight_hours} hrs/day</Text>
      </Box>

      <Button onClick={() => window.history.back()}>
        Back to My Garden
      </Button>
    </VStack>
  );
}
