import { useState } from 'react'
import { supabase } from '../supabaseClient'
// import useNavigate if you need to redirect after signup
import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  Flex,
  FormLabel,
  Input,
  Button,
  Link as CLink,
  VStack,
  Card,
  CardBody,
} from "@chakra-ui/react"
import Location from "./Location.jsx"
import { Link as RouterLink } from "react-router-dom"

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          city: city,
          state: state,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const user = data?.user;
    if (!user) {
      setError("User signup failed — please try again.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: user.id, // Auth user UUID
        first_name: firstName,
        last_name: lastName,
        city: city,
        state: state,
      },
    ]);

    if (insertError) {
      console.error("Error inserting into profiles:", insertError);
      setError("Failed to save user profile: " + insertError.message);
      setLoading(false);
      return;
    }

    // added authetication and profiles table 
    setMessage("✅ Sign-up successful!");
    setLoading(false);
  }

  const handleLocationUpdate = (location) => {
    setCity(location.city || "");
    setState(location.state || "");
  };

  return (
    <Box position="relative" minH="100vh" display="flex" flexDirection="column" bg="#DDEADD" overflow="hidden">
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

      <Flex as="main" flex="1" align="center" justify="center" px={6} position="relative" zIndex={1}>
        <Card bg="whiteAlpha.900" boxShadow="md" borderRadius="2xl" align="center" w="md" p={6}>
          <CardBody>
            <Text
                as="h2"
                fontSize="24px"
                color="green.800"
                textAlign="center"
                fontFamily="'Fustat', sans-serif"
                fontWeight="700"
                pb="20px"
              >
                Welcome to SolarGrow!🌞
              </Text>
            <VStack spacing={6} align="center">
              <Box
                as="form"
                onSubmit={handleSignUp}
                align="center"
              >
                <VStack spacing={5} px="2px">
                  <FormControl isRequired>
                    <FormLabel
                      color="green.800"
                      fontFamily="'Fustat', sans-serif"
                      fontWeight="bold"
                    >Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      backgroundColor="#DDEADD"
                      borderRadius="20px"
                      px="3"
                      py="1"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel
                      color="green.800"
                      fontFamily="'Fustat', sans-serif"
                      fontWeight="bold"
                    >Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      backgroundColor="#DDEADD"
                      borderRadius="20px"
                      px="3"
                      py="1"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </FormControl>
                </VStack>
                <VStack spacing={5} px="2px" pt="10px">
                  {/* First & Last name fields */}
                    <FormControl isRequired>
                      <FormLabel
                        color="green.800"
                        fontFamily="'Fustat', sans-serif"
                        fontWeight="bold"
                      >First Name</FormLabel>
                      <Input
                        type="text"
                        value={firstName}
                        backgroundColor="#DDEADD"
                        borderRadius="20px"
                        px="3"
                        py="1"
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel
                        color="green.800"
                        fontFamily="'Fustat', sans-serif"
                        fontWeight="bold"
                      >Last Name</FormLabel>
                      <Input
                        type="text"
                        value={lastName}
                        backgroundColor="#DDEADD"
                        borderRadius="20px"
                        px="3"
                        py="1"
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                      />
                    </FormControl>

                  <Location onLocationFound={handleLocationUpdate}/>

                  <Button
                    type="submit"
                    bg="#2F855A"
                    opacity="50%"
                    px="20px"
                    py="3px"
                    borderRadius="20px"
                    color="white"
                    fontFamily="'Fustat', sans-serif"
                    isLoading={loading}
                    colorScheme="green"
                  >
                    Sign Up
                  </Button>

                  {message && (
                    <Text color="green.700" fontSize="sm" textAlign="center">
                      {message}
                    </Text>
                  )}

                  {error && (
                    <Text color="red.600" fontSize="sm" textAlign="center">
                      {error}
                    </Text>
                  )}

                  <Text fontSize="sm"
                    color="green.800"
                    fontFamily="'Fustat', sans-serif" textAlign="center">
                    Already have an account?{" "}
                    <CLink as={RouterLink} to="/login" color="green.700" _hover={{ color: "green.800" }}>
                      Log in
                    </CLink>
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  )
}

export default SignUp
