import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  HStack,
  VStack,
  Button,
  Icon,
  Heading,
  Text,
  SimpleGrid,
  Progress,
  Tag,
  TagLabel,
  Divider,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import Location from "./Location";

function SunIcon(props) {
  return (
    <Icon viewBox="0 0 24 24" boxSize="40px" {...props}>
      <path
        fill="currentColor"
        d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zm10.48 0l1.79-1.79 1.79 1.79-1.79 1.79-1.79-1.79zM12 4V1h0v3zm0 19v-3h0v3zM4 12H1v0h3zm19 0h-3v0h3zM6.76 19.16l-1.8 1.79-1.79-1.79 1.79-1.79 1.8 1.79zm12.48 0l1.79 1.79-1.79 1.79-1.79-1.79 1.79-1.79zM12 7a5 5 0 100 10 5 5 0 000-10z"
      />
    </Icon>
  );
}

export default function Home() {
  const [coords, setCoords] = useState(null);
  const [sunData, setSunData] = useState(null);
  const [loadingSun, setLoadingSun] = useState(false);

  const cardRadius = "20px";

  // 🌅 Fetch sunrise/sunset dynamically when coordinates update
  useEffect(() => {
    if (!coords?.latitude || !coords?.longitude) return;

    async function fetchSunData() {
      setLoadingSun(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=sunrise,sunset,uv_index_max&timezone=auto`
        );
        const data = await res.json();

        const sunrise = new Date(data.daily.sunrise[0]);
        const sunset = new Date(data.daily.sunset[0]);
        const uvMax = data.daily.uv_index_max[0];

        setSunData({ sunrise, sunset, uvMax });
      } catch (err) {
        console.error("☀️ Error fetching sun data:", err);
      } finally {
        setLoadingSun(false);
      }
    }

    fetchSunData();
  }, [coords]);

  // 🧭 Receive location from Location.jsx
  function handleLocation({ latitude, longitude, city, state }) {
    setCoords({ latitude, longitude, city: `${city}, ${state}` });
  }

  // ⏰ Helpers
  const formatTime = (date) =>
    date?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) || "--";

  const currentProgress =
    sunData && sunData.sunrise && sunData.sunset
      ? Math.min(
          100,
          Math.max(
            0,
            ((Date.now() - sunData.sunrise.getTime()) /
              (sunData.sunset.getTime() - sunData.sunrise.getTime())) *
              100
          )
        )
      : 0;

  const peakUV = sunData
    ? (() => {
        const mid =
          (sunData.sunrise.getTime() + sunData.sunset.getTime()) / 2;
        const start = new Date(mid - 1.5 * 3600 * 1000);
        const end = new Date(mid + 1.5 * 3600 * 1000);
        return `${formatTime(start)}–${formatTime(end)}`;
      })()
    : "--";

  return (
    <Box
      position="relative"
      minH="100vh"
      bg="#DDEADD"
      overflow="hidden"
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {/* Decorative background blobs */}
      <Box
        position="absolute"
        left="-120px"
        bottom="-120px"
        w="520px"
        h="420px"
        transform="rotate(30deg)"
        bg="#2F855A"
        borderRadius="30%"
        opacity="30%"
      />
      <Box
        position="absolute"
        right="50px"
        top="20px"
        w="320px"
        h="320px"
        bg="#F6B632"
        borderRadius="50%"
        opacity="50%"
        transform="rotate(15deg)"
      />

      <Container
        maxW="7xl"
        pt={{ base: 8, md: 12 }}
        pb={{ base: 8, md: 12 }}
        position="relative"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "5.5fr .5fr 4.5fr" }}
          w="100%"
        >
          {/* Left hero card */}
          <GridItem colSpan={1}>
            <Box
              bg="white"
              borderRadius={cardRadius}
              p={{ base: 6, md: 8 }}
              boxShadow="md"
              height="40vh"
            >
              <VStack align="start" spacing={4}>
                <Text
                  fontSize="36px"
                  fontFamily="'Fustat', sans-serif"
                  fontWeight="700"
                  color="green.800"
                >
                  Grow smarter with solar data.
                </Text>
                <Text color="gray.600">
                  Personalized care plans from real-time UV, humidity and temperature.
                </Text>

                <HStack spacing={3} pt={2}>
                  <Button colorScheme="green" borderRadius="md">
                    Try the demo
                  </Button>
                  <Button variant="outline" colorScheme="green" borderRadius="md">
                    See features
                  </Button>
                </HStack>

                <HStack spacing={3} pt={2} wrap="wrap">
                  <Tag variant="subtle" colorScheme="green" borderRadius="full">
                    <TagLabel>EPA UV API</TagLabel>
                  </Tag>
                  <Tag variant="subtle" borderRadius="full">
                    <TagLabel>OpenWeather</TagLabel>
                  </Tag>
                  <Tag variant="subtle" borderRadius="full">
                    <TagLabel>Sunrise/Sunset</TagLabel>
                  </Tag>
                </HStack>

                {/* 📍 Location Button */}
                <Location onLocationFound={handleLocation} />
              </VStack>
            </Box>
          </GridItem>

          {/* Spacer */}
          <GridItem display={{ base: "none", md: "block" }} />

          {/* Right Sun Path Card */}
          <GridItem colSpan={1}>
            <Box
              bg="white"
              borderRadius={cardRadius}
              p={{ base: 6, md: 8 }}
              boxShadow="md"
              height="40vh"
            >
              <VStack align="start" spacing={5}>
                <HStack spacing={4}>
                  <SunIcon color="yellow.400" />
                  <Heading size="md" color="gray.800">
                    Sun Path {coords?.city ? `— ${coords.city}` : ""}
                  </Heading>
                </HStack>

                <AnimatePresence mode="wait">
                  {loadingSun ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Text color="gray.600">Loading sun data...</Text>
                    </motion.div>
                  ) : sunData ? (
                    <motion.div
                      key={coords?.city || "data"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Progress
                        value={currentProgress}
                        size="lg"
                        colorScheme="yellow"
                        borderRadius="md"
                        w="100%"
                        transition="all 1s ease"
                      />

                      <SimpleGrid
                        columns={2}
                        spacingY={2}
                        w="100%"
                        color="gray.600"
                        fontSize="sm"
                        mt={4}
                      >
                        <Text>Sunrise: {formatTime(sunData.sunrise)}</Text>
                        <Text textAlign="right">
                          Sunset: {formatTime(sunData.sunset)}
                        </Text>
                        <Text colSpan={2}>Peak UV: {peakUV}</Text>
                        <Text colSpan={2}>UV Index Max: {sunData.uvMax}</Text>
                      </SimpleGrid>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Text color="gray.500" fontStyle="italic">
                        Click "Use My Location" to load data
                      </Text>
                    </motion.div>
                  )}
                </AnimatePresence>
              </VStack>
            </Box>
          </GridItem>

          {/* Bottom section */}
          <GridItem colSpan={{ base: 1, md: 3 }} mt={{ base: 2, md: 6 }}>
            <Text
              fontSize="36px"
              fontFamily="'Fustat', sans-serif"
              fontWeight="700"
              color="green.800"
              mb={4}
            >
              How it works!
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box bg="white" p={6} borderRadius={cardRadius} boxShadow="md">
                <Heading size="sm" mb={2}>
                  1. Input
                </Heading>
                <Divider mb={4} />
                <Text color="gray.600">
                  Location, plant type, indoor/outdoor, stage.
                </Text>
              </Box>

              <Box bg="white" p={6} borderRadius={cardRadius} boxShadow="md">
                <Heading size="sm" mb={2}>
                  2. Live data
                </Heading>
                <Divider mb={4} />
                <Text color="gray.600">
                  UV + weather + sunrise/sunset.
                </Text>
              </Box>

              <Box bg="white" p={6} borderRadius={cardRadius} boxShadow="md">
                <Heading size="sm" mb={2}>
                  3. Care plan
                </Heading>
                <Divider mb={4} />
                <Text color="gray.600">
                  Watering, sunlight tips, fertilizer, weekly summary.
                </Text>
              </Box>
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
