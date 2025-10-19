import { useState, useRef, useEffect } from "react";
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
  Divider,
  Progress,
  Flex,
  Circle,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Location from "./Location";
import SunPathCard from "./SunPathCard";

const MotionButton = motion(Button);

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

// 🌤 Determine UV safety category
function getUvLabel(value) {
  if (value == null) return "Unknown";
  if (value < 3) return "Low";
  if (value < 6) return "Moderate";
  if (value < 8) return "High";
  if (value < 11) return "Very High";
  return "Extreme";
}

// 🌦 Map weather condition → emoji
function getWeatherEmoji(main) {
  const condition = main?.toLowerCase() || "";
  if (condition.includes("rain")) return "🌧";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("clear")) return "☀️";
  if (condition.includes("thunder")) return "⛈";
  if (condition.includes("snow")) return "🌨";
  if (condition.includes("mist") || condition.includes("fog")) return "🌫";
  return "🌤";
}

export default function Home() {
  const [coords, setCoords] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [weeklyWeather, setWeeklyWeather] = useState([]);
  const [sunTimes, setSunTimes] = useState({ sunrise: "", sunset: "" });
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const cardRadius = "20px";

  const uvRef = useRef(null);
  const weatherRef = useRef(null);
  const sunriseRef = useRef(null);

  const scrollTo = (ref) => {
    if (ref.current) {
      const y = ref.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  function handleLocation({ latitude, longitude, city, state }) {
    setCoords({ latitude, longitude, city: `${city}, ${state}` });
  }

  // 🌦 Fetch weather + real UV data
  useEffect(() => {
    if (!coords?.latitude || !coords?.longitude) return;

    const fetchWeatherData = async () => {
      setLoadingData(true);
      setError(null);

      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if (!apiKey) throw new Error("Missing OpenWeather API key.");
        const { latitude, longitude } = coords;

        // ✅ Real UV index from Open-Meteo (no key required)
        const uvRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index&timezone=auto`
        );
        const uvData = await uvRes.json();
        const uv = uvData?.current?.uv_index ?? null;
        setUvIndex(uv);

        // 🌅 Sunrise/sunset from OpenWeather
        const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
        const currentRes = await fetch(currentURL);
        const current = await currentRes.json();
        if (!currentRes.ok) throw new Error(current.message || "Weather request failed");

        const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        setSunTimes({ sunrise, sunset });

        // 🌤 Forecast (Fahrenheit)
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
        const forecastRes = await fetch(forecastURL);
        const forecastData = await forecastRes.json();
        if (!forecastRes.ok) throw new Error(forecastData.message || "Forecast request failed");

        const days = {};
        forecastData.list.forEach((entry) => {
          const date = new Date(entry.dt * 1000);
          const day = date.toLocaleDateString("en-US", { weekday: "short" });
          if (!days[day])
            days[day] = { temps: [], humidity: [], conditions: [] };
          days[day].temps.push(entry.main.temp);
          days[day].humidity.push(entry.main.humidity);
          days[day].conditions.push(entry.weather[0].main);
        });

        const forecast = Object.entries(days)
          .slice(0, 7)
          .map(([day, vals]) => {
            const commonCondition =
              vals.conditions.sort(
                (a, b) =>
                  vals.conditions.filter((v) => v === a).length -
                  vals.conditions.filter((v) => v === b).length
              ).pop() || "Clear";

            return {
              day,
              max: Math.round(Math.max(...vals.temps)),
              min: Math.round(Math.min(...vals.temps)),
              humidity: Math.round(
                vals.humidity.reduce((a, b) => a + b, 0) / vals.humidity.length
              ),
              emoji: getWeatherEmoji(commonCondition),
            };
          });

        setWeeklyWeather(forecast);
      } catch (err) {
        console.error("Weather fetch failed:", err);
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchWeatherData();
  }, [coords]);

  return (
    <Box position="relative" bg="#DDEADD" minH="100vh" overflow="hidden">
      {/* Background blobs */}
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
        zIndex={0}
      />
      <Box
        position="absolute"
        right="50px"
        top="20px"
        w="320px"
        h="320px"
        bg="#F6B632"
        borderRadius="50%"
        opacity="40%"
        transform="rotate(15deg)"
        zIndex={0}
      />

      {/* HERO SECTION */}
      <Container
        maxW="7xl"
        centerContent={false}
        px={{ base: 8, md: 14 }}
        mx="auto"
        pt={{ base: 8, md: 12 }}
        pb={{ base: 8, md: 12 }}
        position="relative"
        zIndex={1}
      >
        <Grid templateColumns={{ base: "1fr", md: "5.5fr .5fr 4.5fr" }} w="100%">
          {/* Left Card */}
          <GridItem colSpan={1}>
            <Box bg="white" borderRadius={cardRadius} p={{ base: 6, md: 8 }} boxShadow="md">
              <VStack align="start" spacing={4}>
                <Text fontSize="36px" fontWeight="700" color="green.800">
                  Grow smarter with solar data.
                </Text>
                <Text color="gray.600">
                  Personalized care plans from real-time UV, humidity and temperature.
                </Text>

                {/* Animated Buttons */}
                <HStack spacing={3} pt={2}>
                  <MotionButton
                    colorScheme="green"
                    borderRadius="full"
                    px={6}
                    fontWeight="600"
                    whileHover={{
                      scale: 1.08,
                      boxShadow: "0px 0px 12px rgba(56,161,105,0.6)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try the Demo
                  </MotionButton>

                  <MotionButton
                    variant="outline"
                    colorScheme="green"
                    borderRadius="full"
                    px={6}
                    fontWeight="600"
                    whileHover={{
                      scale: 1.08,
                      boxShadow: "0px 0px 12px rgba(72,187,120,0.5)",
                      backgroundColor: "rgba(72,187,120,0.05)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    See Features
                  </MotionButton>
                </HStack>

                {/* Scroll Buttons */}
                <HStack spacing={3} pt={3} wrap="wrap">
                  {[
                    ["☀️ Current UV", "yellow", uvRef],
                    ["🌦 Weekly Weather", "green", weatherRef],
                    ["🌅 Sunrise & Sunset", "orange", sunriseRef],
                  ].map(([label, color, ref]) => (
                    <MotionButton
                      key={label}
                      colorScheme={color}
                      size="sm"
                      borderRadius="full"
                      onClick={() => scrollTo(ref)}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: `0px 0px 10px rgba(0,0,0,0.2)`,
                        backgroundColor: `var(--chakra-colors-${color}-300)`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {label}
                    </MotionButton>
                  ))}
                </HStack>

                {/* Location Button */}
                <Location onLocationFound={handleLocation} />
              </VStack>
            </Box>
          </GridItem>

          {/* Spacer */}
          <GridItem display={{ base: "none", md: "block" }} />

          {/* Right Card */}
          <GridItem colSpan={1}>
            <Box
              bg="white"
              borderRadius={cardRadius}
              p={{ base: 6, md: 8 }}
              boxShadow="md"
              height="40vh"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {coords ? (
                <SunPathCard location={coords} />
              ) : (
                <Text color="gray.500" fontStyle="italic">
                  Click "Use My Location" to load your Sun Path
                </Text>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Container>

      {/* ---------- INSERTED: How it works! bottom section ---------- */}
      <Container maxW="7xl" px={{ base: 8, md: 14 }} mx="auto" pt={{ base: 2, md: 6 }}>
        <Grid templateColumns={{ base: "1fr", md: "1fr" }} w="100%">
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
      {/* ---------- end inserted section ---------- */}

      {/* ☀️ UV INDEX SECTION */}
      <Box ref={uvRef} w="100%" bg="white" py={20}>
        <Container maxW="7xl" px={{ base: 8, md: 14 }} mx="auto">
          <Heading size="lg" color="green.700" mb={4}>
            ☀️ Current UV Index
          </Heading>
          {loadingData ? (
            <Spinner size="xl" color="green.500" />
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            <Flex
              align="center"
              justify="center"
              direction="column"
              gap={6}
              bg="#F9F9F9"
              p={6}
              borderRadius={cardRadius}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Circle size="80px" bg="#F6B632" boxShadow="0 0 30px #F6B632" />
              </motion.div>

              <Text fontSize="5xl" fontWeight="bold" color="#2F855A">
                UV {uvIndex?.toFixed(1) ?? "--"}
              </Text>
              <Text fontSize="xl" color="gray.600" fontWeight="600">
                {getUvLabel(uvIndex)}
              </Text>

              <Progress
                w="80%"
                value={(uvIndex / 11) * 100}
                colorScheme={
                  uvIndex < 3 ? "green" : uvIndex < 6 ? "yellow" : uvIndex < 8 ? "orange" : "red"
                }
                borderRadius="full"
                height="10px"
              />
            </Flex>
          )}
        </Container>
      </Box>

      {/* 🌦 WEEKLY WEATHER SECTION */}
      <Box ref={weatherRef} w="100%" bg="#EDF9F1" py={20}>
        <Container maxW="7xl" px={{ base: 8, md: 14 }} mx="auto">
          <Heading size="lg" color="green.700" mb={4}>
            🌦 Weekly Weather Forecast
          </Heading>
          {loadingData ? (
            <Spinner size="xl" color="green.500" />
          ) : weeklyWeather.length > 0 ? (
            <HStack spacing={4} overflowX="auto">
              {weeklyWeather.map((d) => (
                <Box
                  key={d.day}
                  bg="white"
                  p={6}
                  borderRadius="16px"
                  boxShadow="md"
                  minW="140px"
                  textAlign="center"
                >
                  <Text fontWeight="bold">{d.day}</Text>
                  <Text fontSize="3xl">{d.emoji}</Text>
                  <Text>
                    {d.max}° / {d.min}°
                  </Text>
                  <Text color="green.600" fontSize="sm">
                    Humidity {d.humidity}%
                  </Text>
                </Box>
              ))}
            </HStack>
          ) : (
            <Text color="gray.500" fontStyle="italic">
              Waiting for location...
            </Text>
          )}
        </Container>
      </Box>

      {/* 🌅 SUNRISE / SUNSET SECTION */}
      <Box ref={sunriseRef} w="100%" bg="white" py={20}>
        <Container maxW="7xl" px={{ base: 8, md: 14 }} mx="auto">
          <Heading size="lg" color="green.700" mb={4}>
            🌅 Sunrise & Sunset
          </Heading>
          {loadingData ? (
            <Spinner size="xl" color="orange.400" />
          ) : (
            <Flex align="center" justify="center" direction="column">
              <Box position="relative" w="300px" h="150px">
                <svg width="300" height="150">
                  <path d="M20 130 Q150 20 280 130" stroke="#F6B632" strokeWidth="4" fill="none" />
                </svg>
                <motion.div
                  style={{ position: "absolute", top: "0", left: "0" }}
                  animate={{ x: [20, 280], y: [110, 10, 110] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Circle size="40px" bg="#F6B632" boxShadow="0 0 20px #F6B632" />
                </motion.div>
              </Box>
              <HStack justify="space-between" w="80%" mt={6}>
                <Text>🌅 Sunrise {sunTimes.sunrise || "--"}</Text>
                <Text>🌇 Sunset {sunTimes.sunset || "--"}</Text>
              </HStack>
            </Flex>
          )}
        </Container>
      </Box>
    </Box>
  );
}
