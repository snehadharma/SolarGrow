import {
  Box,
  Container,
  Grid,
  GridItem,
  Card,
  Flex,
  CardBody,
  Heading,
  Text,
  HStack,
  VStack,
  Tag,
  TagLabel,
  Progress,
  Divider,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { Sun, Droplets, CloudRain } from "lucide-react";
import SunPathCard from "./SunPathCard";
import Animation1 from "./Animation1";

export default function Dashboard() {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardRadius = "18px";

  // --- fake data; swap in your API values later ---
  const weather = { tempF: 84, humidity: 28, precip: 10 };
  const sun = { sunrise: "6:58 AM", peak: "11:30–2:10", sunset: "7:43 PM", progress: 62 };
  const uvIndex = 7.8;

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

<Animation1>
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
      <Container
        w="80%"
        pt={{ base: 8, md: 12 }}
        pb={{ base: 8, md: 12 }}
        position="relative"
      >
        <Text
          fontSize="36px"
          color="green.800"
          fontFamily="'Fustat', sans-serif"
          mb={5}
        >
          Dashboard
        </Text>

        {/* 12-column grid → left = 7, right = 5 (roughly 60/40) */}
        <Grid
          templateColumns={{ base: "1fr", md: "3fr 3fr 3fr" }}
          w="100%"
        >
          {/* ===== LEFT COLUMN ===== */}
          <GridItem colSpan={1}>
            {/* Sun Path */}
            <Card bg={cardBg} borderRadius={cardRadius} boxShadow="sm" mb={6} p={6}>
              <CardBody>
                <Box>
                  <SunPathCard />
                </Box>

                <HStack justify="space-between" color="gray.600" fontSize="sm">
                  <Text>Sunrise {sunriseOr(sun.sunrise)}</Text>
                  <Text color="green.700" fontWeight="semibold">Peak UV {sun.peak}</Text>
                  <Text>Sunset {sun.sunset}</Text>
                </HStack>
              </CardBody>
            </Card>

            {/* UV Index (simple meter) */}
            <Card bg={cardBg} borderRadius={cardRadius} boxShadow="sm" mb={6} p={6}>
              <CardBody>
                <Heading size="sm" color="gray.800" mb={4}>
                  UV Index
                </Heading>

                <VStack spacing={3} align="stretch">
                  {/* Fake semi-gauge look: track + value */}
                  <Box bg="gray.100" borderRadius="full" h="14px">
                    <Progress
                      value={(uvIndex / 11) * 100}
                      size="sm"
                      colorScheme={uvIndex >= 8 ? "orange" : uvIndex >= 6 ? "yellow" : "green"}
                      borderRadius="full"
                      h="14px"
                    />
                  </Box>

                  <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="gray.800">
                    {uvIndex.toFixed(1)}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem colSpan={1}>
            <Flex display="flex" justifyContent="center" h="100%">
              <svg width="295" height="345" viewBox="0 0 368 432" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M182.453 187.172C182.453 48.526 182.453 4.41144 182.453 54.8281" stroke="#2F855A" stroke-width="10" stroke-linecap="round" />
                <path d="M184 343.172C184 204.526 184 160.411 184 210.828" stroke="#2F855A" stroke-width="10" stroke-linecap="round" />
                <path d="M143.219 248.547C176.606 233.683 197.129 206.94 189.06 188.816C180.99 170.692 147.384 168.05 113.998 182.915C80.6117 197.779 60.0883 224.521 68.1576 242.645C76.2269 260.769 109.833 263.412 143.219 248.547Z" fill="url(#paint0_linear_98_90)" />
                <path opacity="0.6" d="M128.609 215.731L189.06 188.816" stroke="#1F6F54" stroke-width="3" />
                <path d="M224.599 248.547C257.986 263.412 291.592 260.769 299.661 242.645C307.73 224.522 287.207 197.779 253.821 182.915C220.435 168.05 186.828 170.692 178.759 188.816C170.69 206.94 191.213 233.683 224.599 248.547Z" fill="url(#paint1_linear_98_90)" />
                <path opacity="0.6" d="M182.109 191.922L242.56 218.837" stroke="#1F6F54" stroke-width="3" />
                <path d="M141.672 92.5471C175.059 77.6826 195.582 50.9402 187.513 32.8163C179.443 14.6924 145.837 12.0501 112.451 26.9146C79.0648 41.7791 58.5415 68.5214 66.6107 86.6454C74.68 104.769 108.286 107.412 141.672 92.5471Z" fill="url(#paint2_linear_98_90)" />
                <path opacity="0.6" d="M127.062 59.7308L187.513 32.8163" stroke="#1F6F54" stroke-width="3" />
                <path d="M223.053 92.5471C256.439 107.412 290.045 104.769 298.114 86.6453C306.184 68.5214 285.66 41.779 252.274 26.9145C218.888 12.05 185.282 14.6923 177.212 32.8163C169.143 50.9402 189.666 77.6826 223.053 92.5471Z" fill="url(#paint3_linear_98_90)" />
                <path opacity="0.6" d="M180.562 35.9219L241.013 62.8365" stroke="#1F6F54" stroke-width="3" />
                <path d="M348.286 343.859H19.7143C8.82639 343.859 0 351.739 0 361.459V414.259C0 423.98 8.82639 431.859 19.7143 431.859H348.286C359.174 431.859 368 423.98 368 414.259V361.459C368 351.739 359.174 343.859 348.286 343.859Z" fill="#8B5E3C" />
                <path opacity="0.5" d="M72.2857 392.259C75.0077 392.259 77.2143 390.289 77.2143 387.859C77.2143 385.429 75.0077 383.459 72.2857 383.459C69.5638 383.459 67.3572 385.429 67.3572 387.859C67.3572 390.289 69.5638 392.259 72.2857 392.259Z" fill="#6B4427" />
                <path opacity="0.5" d="M105.143 376.126C108.772 376.126 111.714 373.499 111.714 370.259C111.714 367.019 108.772 364.393 105.143 364.393C101.514 364.393 98.5714 367.019 98.5714 370.259C98.5714 373.499 101.514 376.126 105.143 376.126Z" fill="#6B4427" />
                <path opacity="0.5" d="M138 401.793C140.268 401.793 142.107 400.151 142.107 398.126C142.107 396.101 140.268 394.459 138 394.459C135.732 394.459 133.893 396.101 133.893 398.126C133.893 400.151 135.732 401.793 138 401.793Z" fill="#6B4427" />
                <path opacity="0.4" d="M187.286 378.326C190.461 378.326 193.036 376.028 193.036 373.193C193.036 370.358 190.461 368.059 187.286 368.059C184.11 368.059 181.536 370.358 181.536 373.193C181.536 376.028 184.11 378.326 187.286 378.326Z" fill="#6B4427" />
                <path opacity="0.4" d="M236.571 398.126C239.293 398.126 241.5 396.156 241.5 393.726C241.5 391.296 239.293 389.326 236.571 389.326C233.849 389.326 231.643 391.296 231.643 393.726C231.643 396.156 233.849 398.126 236.571 398.126Z" fill="#6B4427" />
                <defs>
                  <linearGradient id="paint0_linear_98_90" x1="53.5469" y1="209.829" x2="174.449" y2="156" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2F855A" />
                    <stop offset="1" stop-color="#6DBE82" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_98_90" x1="193.37" y1="156" x2="314.272" y2="209.829" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2F855A" />
                    <stop offset="1" stop-color="#6DBE82" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_98_90" x1="52" y1="53.8291" x2="172.902" y2="4.90816e-05" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2F855A" />
                    <stop offset="1" stop-color="#6DBE82" />
                  </linearGradient>
                  <linearGradient id="paint3_linear_98_90" x1="191.823" y1="0" x2="312.725" y2="53.8291" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2F855A" />
                    <stop offset="1" stop-color="#6DBE82" />
                  </linearGradient>
                </defs>
              </svg>
            </Flex>
          </ GridItem>


          {/* ===== RIGHT COLUMN ===== */}
          <GridItem colSpan={1} >              {/* Weather Now */}
            <Card bg={cardBg} borderRadius={cardRadius} boxShadow="sm" mb={6} p={6}>
              <CardBody>
                <HStack align="start" justify="space-between" mb={3}>
                  <HStack spacing={3}>
                    <Sun size={28} color="#D69E2E" />
                    <VStack align="start" spacing={0}>
                      <Badge colorScheme="yellow" borderRadius="md">Now</Badge>
                      <Heading size="lg" color="gray.800">{weather.tempF}°F</Heading>
                    </VStack>
                  </HStack>
                </HStack>

                <HStack spacing={8} color="gray.600">
                  <HStack>
                    <Droplets size={18} />
                    <VStack spacing={0} align="start">
                      <Text fontSize="xs" color="gray.500">Humidity</Text>
                      <Text fontWeight="semibold">{weather.humidity}%</Text>
                    </VStack>
                  </HStack>

                  <HStack>
                    <CloudRain size={18} />
                    <VStack spacing={0} align="start">
                      <Text fontSize="xs" color="gray.500">Precip</Text>
                      <Text fontWeight="semibold">{weather.precip}%</Text>
                    </VStack>
                  </HStack>
                </HStack>
              </CardBody>
            </Card>

            {/* Today's Care */}
            <Card bg={cardBg} borderRadius={cardRadius} boxShadow="sm" mb={6} p={6}>
              <CardBody>
                <Heading size="sm" color="gray.800" mb={3}>Today’s Care</Heading>
                <VStack align="start" spacing={2} color="gray.700">
                  <Text>• Water 200–250 ml (low humidity)</Text>
                  <Text>• Avoid direct sun 11:30–2:10</Text>
                  <Text>• Fertilize in 3 days</Text>
                </VStack>
              </CardBody>
            </Card>

            {/* Weekly Summary */}
            <Card bg={cardBg} borderRadius={cardRadius} boxShadow="sm" p={6}>
              <CardBody>
                <Heading size="sm" color="gray.800" mb={2}>
                  Weekly Summary
                </Heading>
                <Text color="green.700" mb={3}>
                  Ideal for basil — moderate UV and low rain.
                </Text>
                <Divider mb={3} />
                <Progress value={65} colorScheme="green" borderRadius="full" />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>
      </Animation1>
    </Box>
  );
}

function sunriseOr(s) {
  return s || "--:--";
}
