import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import {
    Box,
    Container,
    Grid,
    GridItem,
    Flex,
    HStack,
    VStack,
    Spacer,
    Button,
    Icon,
    Heading,
    Text,
    Link as CLink,
    SimpleGrid,
    Progress,
    Tag,
    TagLabel,
    Divider,
} from "@chakra-ui/react"

function SunIcon(props) {
    return (
        <Icon viewBox="0 0 24 24" boxSize="40px" {...props}>
            <path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zm10.48 0l1.79-1.79 1.79 1.79-1.79 1.79-1.79-1.79zM12 4V1h0v3zm0 19v-3h0v3zM4 12H1v0h3zm19 0h-3v0h3zM6.76 19.16l-1.8 1.79-1.79-1.79 1.79-1.79 1.8 1.79zm12.48 0l1.79 1.79-1.79 1.79-1.79-1.79 1.79-1.79zM12 7a5 5 0 100 10 5 5 0 000-10z" />
        </Icon>
    )
}

export default function Home() {
    // const heroGap = useBreakpointValue({ base: 6, md: 10 })
    const cardRadius = "20px"


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


            {/* Hero */}
            <Container maxW="7xl" pt={{ base: 8, md: 12 }} pb={{ base: 8, md: 12 }} position="relative">
                {/* Use a 3-track grid: 50% | 10% | 40% */}
                <Grid
                    templateColumns={{ base: "1fr", md: "5.5fr .5fr 4.5fr" }}
                    columnGap={{ base: 0, md: 0 }}      // the middle track itself is the gap
                    rowGap={{ base: 0, md: 0 }}
                    w="100%"
                >
                    {/* Left hero card (50%) */}
                    <GridItem colSpan={1}>
                        <Box bg="white" borderRadius={cardRadius} p={{ base: 6, md: 8 }} boxShadow="md" height='40vh'> 
                            <VStack align="start" spacing={4}>
                                <Text fontSize='36px' fontFamily="'Fustat', sans-serif" fontWeight="700" color="green.800">
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
                            </VStack>
                        </Box>
                    </GridItem>

                    {/* Middle spacer (10%) - empty cell on md+ */}
                    <GridItem display={{ base: "none", md: "block" }} />

                    {/* Right hero card (40%) */}
                    <GridItem colSpan={1}>
                        <Box bg="white" borderRadius={cardRadius} p={{ base: 6, md: 8 }} boxShadow="md" height='40vh'>
                            <VStack align="start" spacing={5}> 
                                <HStack spacing={4}> 
                                    <SunIcon color="yellow.400" /> 
                                    <Heading size="md" color="gray.800">   
                                        Sun Path 
                                    </Heading> 
                                </HStack> 
                                <Progress value={62} size="lg" colorScheme="yellow" borderRadius="md" w="100%" /> 
                                <SimpleGrid columns={2} spacingY={2} w="100%" color="gray.600" fontSize="sm"> 
                                    <Text>Sunrise: 6:55 AM</Text> <Text textAlign="right">Sunset: 7:42 PM</Text> 
                                    <Text colSpan={2}>Peak UV: 11:30–2:30</Text> 
                                </SimpleGrid> 
                            </VStack>
                        </Box>
                    </GridItem>

                    {/* ---- Bottom section spans the SAME three tracks ---- */}
                    <GridItem colSpan={{ base: 1, md: 3 }} mt={{ base: 2, md: 6 }}>
                        <Text fontSize='36px' fontFamily="'Fustat', sans-serif" fontWeight="700" color="green.800" mb={4}>
                            How it works!
                        </Text>

                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                            <Box bg="white" p={6} borderRadius={cardRadius} boxShadow="md">
                                <Heading size="sm" mb={2}>1. Input</Heading>
                                <Divider mb={4} />
                                <Text color="gray.600">Location, plant type, indoor/outdoor, stage.</Text>
                            </Box>

                            <Box bg="white" p={6} borderRadius={cardRadius} boxShadow="md">
                                <Heading size="sm" mb={2}>2. Live data</Heading>
                                <Divider mb={4} />
                                <Text color="gray.600">UV + weather + sunrise/sunset.</Text>
                            </Box>

                            <Box bg="white" p={6} borderRadius={cardRadius} boxShadow="md">
                                <Heading size="sm" mb={2}>3. Care plan</Heading>
                                <Divider mb={4} />
                                <Text color="gray.600">Watering, sunlight tips, fertilizer, weekly summary.</Text>
                            </Box>
                        </SimpleGrid>
                    </GridItem>
                </Grid>
            </Container>

        </Box>
    )
}