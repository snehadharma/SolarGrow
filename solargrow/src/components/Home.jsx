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

  // 🌦 Fetch weather data
  useEffect(() => {
    if (!coords?.latitude || !coords?.longitude) return;

    const fetchWeatherData = async () => {
      setLoadingData(true);
      setError(null);

      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if (!apiKey) throw new Error("Missing OpenWeather API key.");

        const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${apiKey}`;
        const currentRes = await fetch(currentURL);
        const current = await currentRes.json();
        if (!currentRes.ok) throw new Error(current.message || "Weather request failed");

        const uv = Math.max(0, Math.min(11, Math.round(current.main.humidity / 10 + 3)));
        const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        setUvIndex(uv);
        setSunTimes({ sunrise, sunset });

        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${apiKey}`;
        const forecastRes = await fetch(forecastURL);
        const forecastData = await forecastRes.json();
        if (!forecastRes.ok) throw new Error(forecastData.message || "Forecast request failed");

        const days = {};
        forecastData.list.forEach((entry) => {
          const date = new Date(entry.dt * 1000);
          const day = date.toLocaleDateString("en-US", { weekday: "short" });
          if (!days[day]) days[day] = { temps: [], humidity: [] };
          days[day].temps.push(entry.main.temp);
          days[day].humidity.push(entry.main.humidity);
        });

        const forecast = Object.entries(days)
          .slice(0, 7)
          .map(([day, vals]) => ({
            day,
            max: Math.round(Math.max(...vals.temps)),
            min: Math.round(Math.min(...vals.temps)),
            humidity: Math.round(
              vals.humidity.reduce((a, b) => a + b, 0) / vals.humidity.length
            ),
          }));

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
    <><Box
      position="fixed"
      inset="0" // top:0 right:0 bottom:0 left:0
      bg="#DDEADD"
      zIndex={-1}
    >      {/* Background blobs */}
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
        zIndex={0} />
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
        zIndex={0} />
    </Box><Box
      position="relative"
      zIndex={0}
      display="flex" flexDirection="column" align="center" justify="center" alignItems="center"
      w="100%"
      // let content decide height; remove overflow hidden so it can scroll
      // no minH needed unless you want at least a full viewport:
      minH="100svh"
    >

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
              <Box
                bg="white"
                borderRadius={cardRadius}
                p={{ base: 6, md: 8 }}
                boxShadow="md"
                height="40vh"
              >                <VStack align="start" spacing={4}>
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
              >


                <Location onLocationFound={handleLocation} />
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

        {/* HOW IT WORKS SECTION */}
        <GridItem colSpan={{ base: 1, md: 3 }} mt={{ base: 2, md: 6 }}>
          <Text
            fontSize="36px"
            fontFamily="'Fustat', sans-serif"
            fontWeight="700"
            color="green.800"
            align="left"
            mb={4}
          >
            How it works!
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {[
              ["1. Input", "Location, plant type, indoor/outdoor, stage."],
              ["2. Live data", "UV + weather + sunrise/sunset."],
              ["3. Care plan", "Watering, sunlight tips, daily summary."],
            ].map(([title, desc]) => (
              <motion.div key={title} whileHover={{ y: -6, transition: { duration: 0.2 } }}>
                <Box bg="white" p={6} borderRadius={cardRadius} boxShadow="md">
                  <Heading size="sm" mb={2}>
                    {title}
                  </Heading>
                  <Divider mb={4} />
                  <Text color="gray.600">{desc}</Text>
                </Box>
              </motion.div>
            ))}
          </SimpleGrid>
        </GridItem>

        <Divider py="150"></Divider>
        {/* ☀️ UV INDEX SECTION */}
        {/* ☀️ UV INDEX SECTION */}
        <Box ref={uvRef} w="100%" py={20}>
          <Container maxW="7xl" px={{ base: 8, md: 14 }} mx="auto">
            <Heading size="lg" color="green.700" mb={4} fontFamily="'Fustat', sans-serif">
              ☀️ Current UV Index
            </Heading>

            {loadingData ? (
              <Spinner size="xl" color="green.500" />
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <Box
                bgGradient="linear(180deg, #EAF4EC 0%, #FFFFFF 100%)"
                border="2px solid rgba(47,133,90,0.25)"
                borderRadius="30px"
                boxShadow="md"
                p={{ base: 6, md: 8 }}
              >
                <Flex direction="column" align="center" gap={6}>
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: "inline-block" }}
                  >
                    <Circle size="86px" bg="#F6B632" boxShadow="0 0 40px #F6B632" />
                  </motion.div>

                  <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="800" color="#2F855A" fontFamily="'Fustat', sans-serif">
                    UV {uvIndex ?? "--"}
                  </Text>

                  <Progress
                    w={{ base: "100%", md: "80%" }}
                    value={Math.min(100, ((uvIndex ?? 0) / 11) * 100)}
                    borderRadius="999px"
                    height="12px"
                    sx={{
                      "> div": {
                        background:
                          uvIndex < 3
                            ? "linear-gradient(90deg, #9AE6B4, #48BB78)"
                            : uvIndex < 6
                              ? "linear-gradient(90deg, #FBD38D, #ECC94B)"
                              : uvIndex < 8
                                ? "linear-gradient(90deg, #F6AD55, #DD6B20)"
                                : "linear-gradient(90deg, #FC8181, #E53E3E)",
                      },
                    }}
                  />
                  <Text color="green.700" opacity={0.8} fontFamily="'Fustat', sans-serif">
                    {uvIndex < 3 ? "Low" : uvIndex < 6 ? "Moderate" : uvIndex < 8 ? "High" : "Very High"}
                  </Text>
                </Flex>
              </Box>
            )}
          </Container>
        </Box>


        <Divider py="150"></Divider>


        {/* 🌦 WEEKLY WEATHER SECTION */}
        {/* 🌦 WEEKLY WEATHER SECTION */}
        <Box ref={weatherRef} w="100%" py={10}>
          <Container maxW="7xl" px={{ base: 8, md: 14 }} mx="auto">
            <Heading size="lg" color="green.700" mb={4} fontFamily="'Fustat', sans-serif">
              🌦 Weekly Weather Forecast
            </Heading>

            {loadingData ? (
              <Spinner size="xl" color="green.500" />
            ) : weeklyWeather.length > 0 ? (
              <HStack spacing={4} overflowX="auto" py={2} sx={{ "::-webkit-scrollbar": { height: "6px" } }}>
                {weeklyWeather.map((d) => (
                  <motion.div
                    key={d.day}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{ minWidth: 150 }}
                  >
                    <Box
                      bgGradient="linear(180deg, #FFFFFF 0%, #EAF4EC 100%)"
                      border="2px solid rgba(47,133,90,0.2)"
                      borderRadius="24px"
                      boxShadow="sm"
                      p={5}
                      textAlign="center"
                    >
                      <Text fontWeight="800" color="green.800" fontFamily="'Fustat', sans-serif">
                        {d.day}
                      </Text>
                      <Box my={1} fontSize="34px">
                        {/* swap icon by condition if you have it; using emoji for now */}
                        {d.icon || "☀️"}
                      </Box>
                      <Text fontWeight="700" color="green.900" fontFamily="'Fustat', sans-serif">
                        {d.max}° / {d.min}°
                      </Text>
                      <Text color="green.700" fontSize="sm" mt={1} fontFamily="'Fustat', sans-serif">
                        Humidity {d.humidity}%
                      </Text>
                    </Box>
                  </motion.div>
                ))}
              </HStack>
            ) : (
              <Text color="gray.500" fontStyle="italic">Waiting for location...</Text>
            )}
          </Container>
        </Box>


        <Divider py="150"></Divider>

        {/* 🌅 SUNRISE / SUNSET SECTION */}
        {/* 🌅 SUNRISE / SUNSET SECTION */}
        <Box ref={sunriseRef} w="100%" py={16}>
          <Container maxW="7xl" px={{ base: 8, md: 14 }} mx="auto">
            <Heading size="lg" color="green.700" mb={4} fontFamily="'Fustat', sans-serif">
              🌅 Sunrise & Sunset
            </Heading>

            {loadingData ? (
              <Spinner size="xl" color="orange.400" />
            ) : (
              <Box
                bgGradient="linear(180deg, #FFFFFF 0%, #EAF4EC 100%)"
                border="2px solid rgba(47,133,90,0.2)"
                borderRadius="30px"
                boxShadow="md"
                p={{ base: 6, md: 8 }}
              >
                <Flex direction="column" align="center">
                  <Box position="relative" w="320px" h="160px">
                    <svg width="320" height="160">
                      <path d="M20 140 Q160 30 300 140" stroke="#F6B632" strokeWidth="4" fill="none" />
                    </svg>

                    <motion.div
                      style={{ position: "absolute", top: 0, left: 0 }}
                      animate={{ x: [20, 300], y: [120, 20, 120] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Circle size="42px" bg="#F6B632" boxShadow="0 0 26px #F6B632" />
                    </motion.div>
                  </Box>

                  <HStack justify="space-between" w={{ base: "100%", md: "80%" }} mt={6}>
                    <Text color="green.800" fontWeight="700" fontFamily="'Fustat', sans-serif">
                      🌅 Sunrise {sunTimes.sunrise || "--"}
                    </Text>
                    <Text color="green.800" fontWeight="700" fontFamily="'Fustat', sans-serif">
                      🌇 Sunset {sunTimes.sunset || "--"}
                    </Text>
                  </HStack>
                </Flex>
              </Box>
            )}
          </Container>
        </Box>

      </Box></>
  );
}
