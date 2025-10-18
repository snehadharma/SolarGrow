import React, { useState, useEffect } from "react";
import PlantCard from "./PlantCard";
import {
  SimpleGrid,
  Flex,
  Box,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

export default function MyGarden() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [waterAmount, setWaterAmount] = useState("");
  const [notes, setNotes] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function fetchPlants() {
      setLoading(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
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

      const { data, error: fetchError } = await supabase
        .from("plants")
        .select(`
          id,
          nickname,
          soil_type,
          date_planted,
          created_at,
          plant_conditions (
            id,
            name,
            ideal_uv,
            ideal_humidity,
            ideal_precipitation,
            ideal_sunlight_hours
          ),
          plant_logs (
            log_date,
            water_given_ml,
            notes,
            created_at
          )
        `)
        .eq("user_id", user.id);

      if (fetchError) {
        setError("Failed to fetch plants: " + fetchError.message);
      } else {
        const plantsWithLastWatered = (data || []).map((plant) => {
          const lastLog = plant.plant_logs?.sort(
            (a, b) => new Date(b.log_date) - new Date(a.log_date)
          )[0];
          return { ...plant, lastWatered: lastLog?.log_date || "Never" };
        });
        setPlants(plantsWithLastWatered);
      }

      setLoading(false);
    }

    fetchPlants();
  }, []);

  const handleOpenLog = (plant) => {
    setSelectedPlant({
      ...plant,
      plant_conditions: plant.plant_conditions || { id: null },
    });
    setWaterAmount("");
    setNotes("");
    onOpen();
  };

  const handleLogWater = async (plant, waterAmount, notes) => {
    if (!plant?.id) {
      alert("Plant ID is missing!");
      return;
    }

    const waterVal = parseFloat(waterAmount);
    if (isNaN(waterVal)) {
      alert("Please enter a valid water amount");
      return;
    }

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user) throw new Error("User not logged in");

      const today = new Date().toISOString().split("T")[0];

      const { data: insertData, error: insertError } = await supabase
        .from("plant_logs")
        .insert([
          {
            user_id: session.user.id,
            plant_id: plant.id,
            plant_conditions_id: plant.plant_conditions?.id || null,
            log_date: today,
            water_given_ml: waterVal,
            notes: notes || null,
          },
        ])
        .select();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        alert("Failed to log water: " + insertError.message);
        return;
      }

      setPlants((prev) =>
        prev.map((p) =>
          p.id === plant.id
            ? { ...p, lastWatered: today, plant_logs: [...(p.plant_logs || []), insertData[0]] }
            : p
        )
      );
      onClose();
    } catch (err) {
      console.error("Log water error:", err);
      alert("Failed to log water: " + err.message);
    }
  };

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
    <Box position="relative" minH="100vh" display="flex" flexDirection="column" bg="#DDEADD" overflow="hidden">
      {/* Background decorations */}
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

      <Flex align="center" justify="center" py={10}>
        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              nickname={plant.nickname}
              conditions={{
                uvWindow: `${plant.plant_conditions?.ideal_uv || "—"}`,
                humidity: `${plant.plant_conditions?.ideal_humidity || "—"}%`,
                temperature: "N/A",
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
              lastWatered={plant.lastWatered}
              onLog={() => handleOpenLog(plant)}
            />
          ))}
        </SimpleGrid>
      </Flex>

      {/* Log Water Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="white"
          border="2px solid #2F855A"
          borderRadius="xl"
          boxShadow="xl"
          w="500px"
          maxW="500px"
          h="300px"
          
          p={5}
        >
          <ModalHeader color="#2F855A" fontFamily="'Fustat', sans-serif" textAlign="center" pb={3}>
            Log Water for {selectedPlant?.nickname}
          </ModalHeader>

          <ModalBody display="flex" flexDirection="column" gap={4}>
            <Box>
              <Text fontSize="sm" color="#2F855A" mb={1} fontWeight="600">
                Water Amount (ml)
              </Text>
              <Input
                placeholder="Enter amount"
                type="number"
                value={waterAmount}
                onChange={(e) => setWaterAmount(e.target.value)}
                border="2px solid #2F855A"
                borderRadius="md"
                focusBorderColor="#2F855A"
              />
            </Box>

            <Box>
              <Text fontSize="sm" color="#2F855A" mb={1} fontWeight="600">
                Notes (optional)
              </Text>
              <Textarea
                placeholder="Add notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                border="2px solid #2F855A"
                borderRadius="md"
                focusBorderColor="#2F855A"
              />
            </Box>
          </ModalBody>

          <ModalFooter justifyContent="space-between" pt={4}>
            <Button
              flex={1}
              bg="#2F855A"
              color="white"
              mr={2}
              _hover={{ bg: "#27734F" }}
              onClick={() => handleLogWater(selectedPlant, waterAmount, notes)}
            >
              Log
            </Button>
            <Button
              flex={1}
              bg="white"
              color="#2F855A"
              border="2px solid #2F855A"
              _hover={{ bg: "#E3EFE7" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
