import {
  Box,
  Avatar,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const bg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) console.error("Error fetching user:", error.message);
      setUser(user);
      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="green.800" fontFamily="'Fustat', sans-serif">
          Loading profile...
        </Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="red.600" fontFamily="'Fustat', sans-serif">
          No user found. Please log in.
        </Text>
      </Box>
    );
  }
  return (
    <Box
      position="relative"
      minH="100vh"
      display="flex"
      flexDirection="column"
      align="center"
      alignItems="center"
      justifyContent="center"
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

      <Card
        w={{ base: "full", sm: "md" }}
        bg={bg}
        borderRadius="xl"
        boxShadow="md"
        p={8}
      >
        <CardBody>
          <VStack spacing={6}>
            {/* Avatar */}

            {/* User info */}
            <Box textAlign="center">
              <Heading
                as="h2"
                size="lg"
                color="green.800"
                fontFamily="'Fustat', sans-serif"
              >
                {user.name}
              </Heading>
              <Text color="gray.600">{user.email}</Text>
              <Text color="gray.500" fontSize="sm">
                📍 {user.location}
              </Text>
            </Box>

            <Divider />

            {/* Account details */}
            <VStack align="start" spacing={2} w="full">
              <HStack justify="space-between" w="full">
                <Text color="gray.600" fontWeight="medium">
                  Joined
                </Text>
                <Text color="gray.700">{user.joined}</Text>
              </HStack>

              <HStack justify="space-between" w="full">
                <Text color="gray.600" fontWeight="medium">
                  Account Type
                </Text>
                <Text color="gray.700">Free</Text>
              </HStack>
            </VStack>

            <Divider />

            {/* Actions */}
            <HStack spacing={4} pt={4}>
              <Button colorScheme="green" variant="solid">
                Edit Profile
              </Button>
              <Button variant="outline" colorScheme="red">
                Log Out
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
