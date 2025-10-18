import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Circle,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

const PlantAvatar = ({ size = 96 }) => {
  const ring = useColorModeValue("#E3EFE7", "rgba(227,239,231,0.3)");
  return (
    <Circle size={`${size}px`} border="2px solid" borderColor={ring}>
      <Icon viewBox="0 0 120 120" boxSize={`${Math.round(size * 0.7)}px`}>
        <defs>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2F855A" />
            <stop offset="100%" stopColor="#6DBE82" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="60" rx="40" ry="24" fill="url(#leafGrad)" />
        <rect x="57" y="48" width="6" height="28" rx="3" fill="#2F855A" />
      </Icon>
    </Circle>
  );
};

export default function PlantCard({
  nickname,
  conditions = {},
  soilType,
  datePlanted,
  createdAt,
  lastWatered,
  onOpen,
  onLog,
  size = 400,
}) {
  const cardBg = useColorModeValue("white", "gray.800");
  const ink = useColorModeValue("#1E2B1E", "green.100");
  const muted = useColorModeValue("#5B6C5B", "green.200");
  const leaf = "#2F855A";
  const border = useColorModeValue("#E3EFE7", "rgba(227,239,231,0.18)");

  return (
    <Box p={2} rounded="xl" w={size} h={size}>
      <VStack
        align="stretch"
        spacing={0}
        rounded="2xl"
        w="100%"
        h="100%"
        bg={cardBg}
        boxShadow="md"
        border="1px solid"
        borderColor={border}
        overflow="hidden"
        position="relative"
      >
        <VStack pt={6} spacing={3}>
          <PlantAvatar size={Math.round(size * 0.24)} />
          <Text
            fontWeight="bold"
            fontSize="xl"
            fontFamily="'Fustat', sans-serif"
            color={leaf}
            lineHeight="1.1"
            textAlign="center"
          >
            {nickname}
          </Text>
        </VStack>

        <HStack justify="center" spacing={3} mt={4} px={5}>
          <Text fontSize="sm" fontWeight={700} fontFamily="'Fustat', sans-serif" color={muted} textAlign="center">
            {[
              conditions.uvWindow ? `High UV ${conditions.uvWindow}` : null,
              conditions.humidity ? `Humidity ${conditions.humidity}` : null,
              conditions.temperature ?? null,
            ]
              .filter(Boolean)
              .join(" • ")}
          </Text>
        </HStack>

        <VStack spacing={1} mt={3} px={6}>
          <Text fontSize="sm" fontFamily="'Fustat', sans-serif" fontWeight={700} color={muted}>
            {soilType ? `${soilType} soil` : ""}
          </Text>
          <Text fontSize="xs" fontFamily="'Fustat', sans-serif" fontWeight={600} color={muted}>
            {datePlanted ? `Planted: ${datePlanted}` : ""}
          </Text>
          <Text fontSize="xs" fontFamily="'Fustat', sans-serif" fontWeight={600} color={muted}>
            {createdAt ? `Created: ${createdAt}` : ""}
          </Text>
          {lastWatered && (
            <Text fontSize="xs" fontFamily="'Fustat', sans-serif" fontWeight={600} color={muted}>
              Last watered: {lastWatered}
            </Text>
          )}
        </VStack>

        <HStack spacing={3} justify="center" mt="auto" pb={5} pt={4}>
          <Button
            bgColor="gray.100"
            fontFamily="'Fustat', sans-serif"
            py="2px"
            px="5px"
            borderColor={leaf}
            borderRadius="20px"
            color={leaf}
            _hover={{ bg: "green.800", opacity: "30%", color: "white" }}
            onClick={onLog}
            size="sm"
            w="36"
          >
            Log
          </Button>
          <Button
            bg={leaf}
            color="white"
            py="2px"
            px="5px"
            fontFamily="'Fustat', sans-serif"
            borderRadius="20px"
            _hover={{ bg: "#27734F" }}
            onClick={onOpen}
            size="sm"
            w="36"
          >
            Open
          </Button>
        </HStack>

        <span
          position="absolute"
          top="4"
          right="4"
          w="20"
          h="20"
          rounded="full"
          bgGradient="linear(to-br, #FFD85B, #F6B632)"
          opacity={0.18}
        />
        <span
          position="absolute"
          bottom="8"
          left="6"
          w="40"
          h="20"
          rounded="full"
          bgGradient="linear(to-r, #2F855A, #6DBE82)"
          opacity={0.1}
          filter="blur(8px)"
        />
      </VStack>
    </Box>
  );
}