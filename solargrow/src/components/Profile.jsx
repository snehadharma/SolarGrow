import {
  Box,
  Avatar,
  AvatarGroup,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  Link,
  Card,
  CardBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'

export default function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const bg = useColorModeValue("white", "gray.800");  
  const [session, setSession] = useState(null);
  const navigate = useNavigate()


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

  const name =
    user.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata?.last_name ?? ""}`.trim()
      : user.email;
  const metadata = user.user_metadata ?? {};

  // Normalize possible shapes for location:
  // - metadata.location may be an object: { city, state }
  // - metadata.location may be a string: "City, State"
  // - metadata may have top-level city/state fields
  let city = "";
  let state = "";

  if (metadata.location) {
    if (typeof metadata.location === "string") {
      const parts = metadata.location
        .split(/,| - |\/|;|\|/)
        .map((p) => p.trim())
        .filter(Boolean);
      city = parts[0] ?? "";
      state = parts[1] ?? "";
    } else if (typeof metadata.location === "object") {
      city = metadata.location.city ?? "";
      state = metadata.location.state ?? "";
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate('/home')
  }


  // Fallback to top-level metadata fields if available
  city = city || metadata.city || "";
  state = state || metadata.state || "";

  const locationDisplay = [city, state].filter(Boolean).join(", ") || "Location not set";

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
        borderRadius="50px"
        boxShadow="md"
        p={8}
      >
        <CardBody>
          <VStack spacing={6}>
            {/* Avatar */}
            <Avatar
              size="7xl"
              name={name || "User"}
              bg="green.200"
              p="10px"
              color="green.800"
            />

            {/* User info */}
            <Box textAlign="center">
              <Text
                fontSize="2xl"
                color="green.800"
                fontWeight="bold"
                fontFamily="'Fustat', sans-serif"
              >
                {name}
              </Text>
              <Text fontSize="xs"
                color="green.800"
                fontFamily="'Fustat', sans-serif">{user.email}</Text>
              <Text
                color="green.800"
                fontFamily="'Fustat', sans-serif" fontSize="xs">
                {locationDisplay}
              </Text>
            </Box>

            <Divider />

            {/* Actions */}
            <HStack spacing={4} pt={4}>
              <Button
                colorScheme="green"
                bgColor="green.200"
                opacity="80%"
                borderRadius="20px"
                px="10px"
                py="3px"
                variant="solid"
                color="green.800"
                fontFamily="'Fustat', sans-serif"
              >
                Edit Profile
              </Button>
              <Link
                as="button"
                bgColor="green.200"
                opacity="80%"
                borderRadius="20px"
                px="10px"
                py="3px"
                variant="solid"
                color="green.800"
                fontFamily="'Fustat', sans-serif"
                onClick={handleLogout}
                _hover={{ textDecoration: "none", color: "green.600" }}
              >
                Log Out
              </Link>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
