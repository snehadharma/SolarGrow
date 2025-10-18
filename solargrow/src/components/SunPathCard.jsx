import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Progress,
} from "@chakra-ui/react";
import { Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SunPath({ location }) {
  const [sunData, setSunData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;
    async function fetchSunData() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=sunrise,sunset,uv_index_max&timezone=auto`
        );
        const data = await res.json();
        const sunrise = new Date(data.daily.sunrise[0]);
        const sunset = new Date(data.daily.sunset[0]);
        const uvMax = data.daily.uv_index_max[0];
        setSunData({ sunrise, sunset, uvMax });
      } catch (e) {
        console.error("Sun data fetch failed:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSunData();
  }, [location]);

  const formatTime = (date) =>
    date?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) || "--";

  // calculate current progress through the day
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
      bg="white"
      borderRadius="20px"
      p={8}
      boxShadow="md"
      height="40vh"
      width="100%"
    >
      <VStack align="start" spacing={5}>
        <HStack spacing={4}>
          <Sun size={40} color="#F6B632" />
          <Heading size="md" color="gray.800">
            Sun Path{" "}
            {location?.city ? `— ${location.city}` : ""}
          </Heading>
        </HStack>

        <AnimatePresence mode="wait">
          {loading ? (
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
              key={location?.city || "data"}
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

              <SimpleGrid columns={2} spacingY={2} w="100%" color="gray.600" fontSize="sm" mt={4}>
                <Text>Sunrise: {formatTime(sunData.sunrise)}</Text>
                <Text textAlign="right">Sunset: {formatTime(sunData.sunset)}</Text>
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
  );
}
