import { SimpleGrid, Flex, Box } from "@chakra-ui/react";
import PlantCard from "./PlantCard";

export default function MyGarden() {
  return (
    <Box
      position="relative"
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#DDEADD"
      overflow="hidden"
    >
      {/* Decorative background blobs (absolutely positioned to this Box) */}
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
      <Flex align="center" justify="center" alignItems="center">
        <SimpleGrid columns={[1, 2, 3]} spacing={8} align="center">
          <PlantCard
            nickname="Sunny Basil"
            conditions={{ uvWindow: "11:30–2:10", humidity: "28%", temperature: "84°F" }}
            soilType="Loamy"
            datePlanted="2025-04-22"
            createdAt="2025-10-03 14:22"
            lastWatered="2025-10-16 09:10"
            onLog={() => console.log("log water")}
            onOpen={() => console.log("open plant")}
          />
          <PlantCard
            nickname="Sunny Basil"
            conditions={{ uvWindow: "11:30–2:10", humidity: "28%", temperature: "84°F" }}
            soilType="Loamy"
            datePlanted="2025-04-22"
            createdAt="2025-10-03 14:22"
            lastWatered="2025-10-16 09:10"
            onLog={() => console.log("log water")}
            onOpen={() => console.log("open plant")}
          />
          <PlantCard
            nickname="Sunny Basil"
            conditions={{ uvWindow: "11:30–2:10", humidity: "28%", temperature: "84°F" }}
            soilType="Loamy"
            datePlanted="2025-04-22"
            createdAt="2025-10-03 14:22"
            lastWatered="2025-10-16 09:10"
            onLog={() => console.log("log water")}
            onOpen={() => console.log("open plant")}
          />
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
