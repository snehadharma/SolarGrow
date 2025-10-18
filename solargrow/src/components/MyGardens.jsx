import PlantCard from "./PlantCard";
import { SimpleGrid, Flex, Box, Spinner, Text } from "@chakra-ui/react";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function MyGarden() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlants() {
      setLoading(true);
      setError("");

      // Get logged in user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(sessionError);
        setError("Unable to get session.");
        setLoading(false);
        return;
      }

      const user = session?.user;
      if (!user) {
        setError("No user logged in.");
        setLoading(false);
        return;
      }

      // Fetch all plants for this user
      const { data, error: fetchError } = await supabase
        .from("plants")
        .select(
          `
          id,
          user_id,
          plant_conditions_id,
          nickname,
          soil_type,
          date_planted,
          created_at,
          plant_conditions (
            ideal_uv,
            ideal_humidity,
            ideal_precipitation,
            ideal_sunlight_hours
          ),
          plant_logs (
            log_date,
            water_given_ml
          )
        `
        )
        .eq("user_id", user.id);

      if (fetchError) {
        console.error(fetchError);
        setError("Failed to fetch plants: " + fetchError.message);
      } else {
        setPlants(data || []);
      }

      setLoading(false);
    }

    fetchPlants();
  }, []);

  if (loading)
    return (
      <Flex align="center" justify="center" h="50vh">
        <Spinner size="lg" color="green.700" />
      </Flex>
    );

  if (error)
    return (
      <Flex align="center" justify="center" h="50vh">
        <Text color="red.600">{error}</Text>
      </Flex>
    );

  if (plants.length === 0)
    return (
      <Flex align="center" justify="center" h="50vh">
        <Text color="green.800">No plants yet — add one to get started!</Text>
      </Flex>
    );

  return (
    <Box
      position="relative"
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#DDEADD"
      overflow="hidden"
    >
      <Box
        position="absolute"
        left="-120px"
        bottom="-120px"
        w="520px"
        h="420px"
        transform="rotate(30deg)"
        bg="#2F855A"
        borderRadius="30%"
        opacity={0.3}
      />
      <Box
        position="absolute"
        right="50px"
        top="20px"
        w="320px"
        h="320px"
        bg="#F6B632"
        borderRadius="50%"
        opacity={0.5}
        transform="rotate(15deg)"
      />
    <Flex align="center" justify="center" alignItems="center" py={10}>
      <SimpleGrid columns={[1, 2, 3]} spacing={8} align="center">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            nickname={plant.nickname}
            conditions={{
              uvWindow: `${plant.plant_conditions?.ideal_uv || "—"}`,
              humidity: `${plant.plant_conditions?.ideal_humidity || "—"}%`,
              temperature: "N/A", // you can replace this with live data later
            }}
            soilType={plant.soil_type}
            datePlanted={
                plant.date_planted
                ? new Date(plant.date_planted).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })
                : "—"
            }
            lastWatered={
              plant.plant_logs?.[plant.plant_logs.length - 1]?.log_date || "Never"
            }
            onLog={() => console.log("log water for", plant.nickname)}
            onOpen={() =>
                navigate(`/plant/${plant.id}`, {
                    state: {
                        plantId: plant.id, 
                        userId: plant.user_id,
                        conditionId: plant.plant_conditions_id,
                    },
                })
            }
          />
        ))}
      </SimpleGrid>
    </Flex>
    </Box>
  );
}
