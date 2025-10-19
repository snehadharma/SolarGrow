import PlantCard from "./PlantCard";
import {
  SimpleGrid,
  Flex,
  Button,
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
  useDisclosure,
  ModalCloseButton,
  Divider
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";
import Stagger from "./Stagger"
import { useState, useEffect } from "react";
import AddPlant from './AddPlant'
import { useNavigate } from "react-router-dom";


export default function MyGarden() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [waterAmount, setWaterAmount] = useState("");
  const [notes, setNotes] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        `
        )
        .eq("user_id", user.id);

      if (fetchError) {
        console.error(fetchError);
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
      <Box
        position="relative"
        minH="100vh"
        display="flex"
        flexDirection="column"
        align="center"
        justify="center"
        alignItems="center"
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
        <Button
          onClick={() => navigate("/addplant")}
          bg="green.600"
          color="white"
          _hover={{ bg: "green.700", transform: "scale(1.03)" }}
          transition="all 0.2s"
          borderRadius="full"
          w="200px"
          m="30px"
          py="6px"
          boxShadow="md"
        >
          + Add Plant
        </Button>
        <Text color="green.800">No plants yet — add one to get started!</Text>
      </Box>
    );

  return (
    <>
      <Box
      position="fixed"
      inset="0"            // top:0 right:0 bottom:0 left:0
      bg="#DDEADD"
      zIndex={-1}
    >
      {/* Decorative shapes */}
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
        pointerEvents="none"
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
        pointerEvents="none"
      />
    </Box>

    <Box
      position="relative"
      zIndex={0}
      display="flex" flexDirection="column" align="center" justify="center" alignItems="center"
      w="100%"
      // let content decide height; remove overflow hidden so it can scroll
      // no minH needed unless you want at least a full viewport:
      minH="100svh"
    >
        <Button
          onClick={() => navigate("/addplant")}
          bg="green.600"
          color="white"
          _hover={{ bg: "green.700", transform: "scale(1.03)" }}
          transition="all 0.2s"
          borderRadius="full"
          w="200px"
          m="30px"
          py="6px"
          boxShadow="md"
        >
          + Add Plant
        </Button>
        <Stagger>
        <Flex align="center" justify="center" alignItems="center" >
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
                lastWatered={plant.lastWatered}
                onLog={() => handleOpenLog(plant)}
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
        </Stagger>
      </Box>
      
      <Modal
  isOpen={isOpen}
  onClose={onClose}
  isCentered
  // keep portal clean to avoid odd centering
  portalProps={{ appendToParentPortal: false }}
>
  {/* Soft dim + slight blur so your background blobs still peek through */}
  <ModalOverlay bg="rgba(0,0,0,0.2)" backdropFilter="blur(2px)" />

  <ModalContent
    position="fixed"
    top="25%"
    left="25%"
    transform="translate(-50%, -50%)"
    m={0}
    // gentle green-to-cream blend, similar to your page
    bgGradient="linear(180deg, #EAF4EC 0%, #FFFFFF 100%)"
    // border="2px solid #2F855A"
    borderRadius="30px"
    boxShadow="xl"
    maxW="90vw"
    w="520px"
    maxH="90vh"
    p={0}
    overflow="hidden"
  >
    {/* Decorative corner blobs inside modal (very subtle) */}
    <Box
      position="absolute"
      top="-60px"
      right="-60px"
      w="180px"
      h="180px"
      bg="#F6B632"
      opacity={0.15}
      borderRadius="50%"
      transform="rotate(15deg)"
      pointerEvents="none"
    />
    <Box
      position="absolute"
      bottom="-80px"
      left="-80px"
      w="240px"
      h="200px"
      bg="#2F855A"
      opacity={0.10}
      borderRadius="30%"
      transform="rotate(25deg)"
      pointerEvents="none"
    />

    <Flex
      align="center"
      justify="space-between"
      px={6}
      py={5}
      borderBottom="1px solid rgba(47,133,90,0.25)"
    >
      <Text
        color="#2F855A"
        fontFamily="'Fustat', sans-serif"
        fontWeight="800"
        fontSize="22px"
      >
        🌿 Log Water for {selectedPlant?.nickname}
      </Text>

      <ModalCloseButton
        position="static"
        borderRadius="full"
        _hover={{ bg: "rgba(47,133,90,0.08)" }}
      />
    </Flex>

    <Divider borderColor="rgba(47,133,90,0.25)" />

    <ModalBody
      display="flex"
      flexDirection="column"
      align="center"
      justify="center"
      gap={5}
      p={8}
    >
      <Box w="100%">
        <Text
          fontSize="sm"
          color="#2F855A"
          mb={2}
          fontWeight="700"
          fontFamily="'Fustat', sans-serif"
        >
          Water Amount (ml)
        </Text>
        <Input
          placeholder="e.g., 250"
          type="number"
          min={0}
          value={waterAmount}
          onChange={(e) => setWaterAmount(e.target.value)}
          bg="#E9F3EA"
          border="1.5px solid transparent"
          borderRadius="16px"
          px={4}
          py={3}
          w="100%" // full width inside modal
          _focus={{ borderColor: "#2F855A", boxShadow: "0 0 0 2px rgba(47,133,90,0.25)" }}
          _hover={{ borderColor: "rgba(47,133,90,0.45)" }}
          fontFamily="'Fustat', sans-serif"
        />
      </Box>

      <Box w="100%">
        <Text
          fontSize="sm"
          color="#2F855A"
          mb={2}
          fontWeight="700"
          fontFamily="'Fustat', sans-serif"
        >
          Notes (optional)
        </Text>
        <Textarea
          placeholder="Any observations... 🌱"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          bg="#E9F3EA"
          border="1.5px solid transparent"
          borderRadius="16px"
          px={4}
          py={3}
          resize="vertical"
          w="100%"
          _focus={{ borderColor: "#2F855A", boxShadow: "0 0 0 2px rgba(47,133,90,0.25)" }}
          _hover={{ borderColor: "rgba(47,133,90,0.45)" }}
          fontFamily="'Fustat', sans-serif"
        />
      </Box>
    </ModalBody>

    <Divider borderColor="rgba(47,133,90,0.25)" />

    <ModalFooter gap={3} p={5}>
      <Button
        flex={1}
        bg="#2F855A"
        color="white"
        borderRadius="999px"
        py={3}
        fontWeight="800"
        fontFamily="'Fustat', sans-serif"
        _hover={{ bg: "#27734F", transform: "translateY(-1px)" }}
        _active={{ transform: "translateY(0)" }}
        transition="all 0.15s ease"
        onClick={() => handleLogWater(selectedPlant, waterAmount, notes)}
      >
        Log
      </Button>
      <Button
        flex={1}
        bg="white"
        color="#2F855A"
        border="2px solid #2F855A"
        borderRadius="999px"
        py={3}
        fontWeight="800"
        fontFamily="'Fustat', sans-serif"
        _hover={{ bg: "#E3EFE7", transform: "translateY(-1px)" }}
        _active={{ transform: "translateY(0)" }}
        onClick={onClose}
      >
        Cancel
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </>
  );
}
