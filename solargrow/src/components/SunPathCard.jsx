import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SunPathCard({ location }) {
  const [sunData, setSunData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

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
      } catch (err) {
        console.error("☀️ Sun data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSunData();
  }, [location]);

  const formatTime = (date) =>
    date?.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) || "--";

  const isNight =
    sunData && (now < sunData.sunrise || now > sunData.sunset);
  const IconComponent = isNight ? Moon : Sun;

  const uv = sunData?.uvMax || 0;
  let uvColor = "#F6B632";
  if (uv >= 3 && uv < 6) uvColor = "#F6AD55";
  else if (uv >= 6 && uv < 8) uvColor = "#ED8936";
  else if (uv >= 8) uvColor = "#E53E3E";

  // Peak UV window: mid-day ±1.5 h
  const peakStart = sunData
    ? new Date(
        (sunData.sunrise.getTime() + sunData.sunset.getTime()) / 2 -
          1.5 * 3600 * 1000
      )
    : null;
  const peakEnd = sunData
    ? new Date(
        (sunData.sunrise.getTime() + sunData.sunset.getTime()) / 2 +
          1.5 * 3600 * 1000
      )
    : null;

  // compute overall day progress and peak window placement (% positions)
  const dayStart = sunData?.sunrise?.getTime() || 0;
  const dayEnd = sunData?.sunset?.getTime() || 1;
  const peakStartPct =
    peakStart && dayEnd
      ? ((peakStart.getTime() - dayStart) / (dayEnd - dayStart)) * 100
      : 40;
  const peakEndPct =
    peakEnd && dayEnd
      ? ((peakEnd.getTime() - dayStart) / (dayEnd - dayStart)) * 100
      : 60;

  const barColor = useMemo(() => {
    if (isNight) return "#CBD5E0";
    if (uv < 3) return "#FFF3B0";
    if (uv < 6) return "#F6B632";
    if (uv < 8) return "#F6AD55";
    return "#E53E3E";
  }, [isNight, uv]);

  const peakUVLabel =
    peakStart && peakEnd
      ? `${formatTime(peakStart)}–${formatTime(peakEnd)}`
      : "--";

  return (
    <Box>
      <VStack align="start" spacing={5}>
        <HStack>
          <Sun size={40} color="#F6B632" />
          <Heading size="md" color="gray.800">
            Sun Path {location?.city ? `— ${location.city}` : ""}
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
              {/* 🌞 Sun or Moon with breathing animation */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="120px"
                mb={2}
              >
                <motion.div
                  animate={{
                    scale: isNight ? [1, 1.05, 1] : [1, 1.25, 1],
                    opacity: isNight ? 0.6 : 1,
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <IconComponent
                    size={65}
                    color={barColor}
                    style={{
                      filter: isNight
                        ? "drop-shadow(0 0 6px #A0AEC0)"
                        : `drop-shadow(0 0 12px ${barColor})`,
                    }}
                  />
                </motion.div>
              </Box>

              {/* 🟡 Fixed bar with highlighted UV window */}
              <Box
                width="100%"
                height="10px"
                borderRadius="6px"
                bg="#E2E8F0"
                position="relative"
                mt={2}
                overflow="hidden"
              >
                {/* Highlighted UV range */}
                <Box
                  position="absolute"
                  left={`${peakStartPct}%`}
                  width={`${peakEndPct - peakStartPct}%`}
                  height="100%"
                  bg={barColor}
                  borderRadius="6px"
                  opacity={0.85}
                  boxShadow={`0 0 10px ${barColor}`}
                  transition="all 0.5s ease"
                />
              </Box>

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
                <Text colSpan={2}>Peak UV: {peakUVLabel}</Text>
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
