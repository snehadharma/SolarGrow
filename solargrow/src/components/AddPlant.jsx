import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Box, Flex, Card, CardBody, Button, VStack, FormControl, Select, FormLabel, Input, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


export default function AddPlant() {
  const [plantTypes, setPlantTypes] = useState([]);
  const [formData, setFormData] = useState({
    plant_type_id: "",
    soil_type: "",
    nickname: "",
    date_planted: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const soilTypes = [
    "Loamy Soil",
    "Sandy Soil",
    "Clay Soil",
    "Silty Soil",
    "Peaty Soil",
    "Chalky Soil",
    "Saline Soil",
    "Laterite Soil",
    "Black Soil",
    "Red Soil",
    "Alluvial Soil",
  ];

  // Fetch available plant types from plant_conditions
  useEffect(() => {
    async function fetchPlantTypes() {
      const { data, error } = await supabase
        .from("plant_conditions")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) {
        console.error("❌ Error fetching plant types:", error);
        setIsError(true);
        setMessage("Error loading plant types.");
      } else {
        setPlantTypes(data || []);
      }
    }
    fetchPlantTypes();
  }, []);

  // Submit new plant
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData?.session?.user;
      if (!user) {
        throw new Error("No active session found. Please log in again.");
      }

      // Optionally coerce plant_type_id to number if your DB column is numeric
      const plantTypeId = formData.plant_type_id
        ? Number(formData.plant_type_id)
        : null;

      const { error: insertError } = await supabase.from("plants").insert([
        {
          user_id: user.id,
          plant_conditions_id: plantTypeId,
          soil_type: formData.soil_type || null,
          nickname: formData.nickname || null,
          date_planted: formData.date_planted || null,
        },
      ]);

      if (insertError) throw insertError;

      setMessage("Plant added successfully!");
      setFormData({
        plant_type_id: "",
        soil_type: "",
        nickname: "",
        date_planted: "",
      });
      navigate("/mygarden")
    } catch (err) {
      console.error("Insert error:", err);
      setIsError(true);
      setMessage(`❌ Failed to add plant: ${err.message ?? err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box position="relative" minH="100vh" display="flex" flexDirection="column" bg="#DDEADD" overflow="hidden">
      {/* Decorative background blobs */}
      <Box position="absolute" left="-120px" bottom="-120px" w="520px" h="420px" transform="rotate(30deg)" bg="#2F855A" borderRadius="30%" opacity={0.3} />
      <Box position="absolute" right="50px" top="20px" w="320px" h="320px" bg="#F6B632" borderRadius="50%" opacity={0.5} transform="rotate(15deg)" />

      <Flex as="main" flex="1" align="center" alignContent="center" justify="center" px={6} position="relative" zIndex={1}>
        <Card bg="whiteAlpha.900" boxShadow="md" borderRadius="2xl" align="center" w="md" p={6}>
          <CardBody>
            <Text as="h2" fontSize="24px" color="green.800" textAlign="center" fontFamily="'Fustat', sans-serif" fontWeight="700" pb="20px">
              Add Plant! 🌿
            </Text>

            {message && (
              <Alert status={isError ? "error" : "success"} mb={4} borderRadius="lg">
                <AlertIcon />
                {message}
              </Alert>
            )}

            <VStack spacing={6} align="stretch">
              <Box as="form" onSubmit={handleSubmit}>
                <VStack spacing={5} align="stretch">
                  <FormControl isRequired>
                    <FormLabel color="green.800" fontFamily="'Fustat', sans-serif" fontWeight="bold">
                      Plant Type
                    </FormLabel>
                    <Select
                      appearance="none" 
                      placeholder="Select a plant..."
                      value={formData.plant_type_id}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, plant_type_id: e.target.value }))
                      }
                      bg="white"
                      borderColor="green.300"
                      _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #38A169" }}
                      _hover={{ borderColor: "green.400" }}
                    >
                      {plantTypes.map((plant) => (
                        <option key={plant.id} value={plant.id}>
                          {plant.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="green.800" fontFamily="'Fustat', sans-serif" fontWeight="bold">
                      Soil Type
                    </FormLabel>
                    <Select
                      appearance="none"
                      placeholder="Select a soil type..."
                      value={formData.soil_type}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, soil_type: e.target.value }))
                      }
                      bg="white"
                      borderColor="green.300"
                      _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #38A169" }}
                      _hover={{ borderColor: "green.400" }}
                    >
                      {soilTypes.map((soil) => (
                        <option key={soil} value={soil}>
                          {soil}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="green.800" fontFamily="'Fustat', sans-serif" fontWeight="bold">
                      Nickname
                    </FormLabel>
                    <Input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, nickname: e.target.value }))
                      }
                      backgroundColor="#DDEADD"
                      borderRadius="20px"
                      px="3"
                      py="1"
                      placeholder="e.g., Sunny, Fern, Basil Buddy"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="green.800" fontFamily="'Fustat', sans-serif" fontWeight="bold">
                      Date Planted
                    </FormLabel>
                    <Input
                      type="date"
                      value={formData.date_planted}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, date_planted: e.target.value }))
                      }
                      backgroundColor="#DDEADD"
                      borderRadius="20px"
                      px="3"
                      py="1"
                    />
                  </FormControl>
                </VStack>

                <VStack spacing={5} mt="10px" pt="10px">
                  <Button
                    type="submit"
                    bg="#2F855A"
                    _hover={{ bg: "#276749" }}
                    px="20px"
                    opacity="60%"
                    py="3px"
                    borderRadius="20px"
                    color="white"
                    fontFamily="'Fustat', sans-serif"
                    isLoading={loading}
                    colorScheme="green"
                  >
                    {loading ? "Adding..." : "Add Plant"}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}
