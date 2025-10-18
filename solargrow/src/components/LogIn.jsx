import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
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
import { Link as RouterLink } from "react-router-dom"

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <Box position="relative" minH="100vh" display="flex" flexDirection="column" bg="#DDEADD" overflow="hidden">
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
              Welcome Back! 🌿
            </Text>
            <VStack spacing={6} align="stretch">


              <Box
                as="form"
                onSubmit={handleLogIn}
                align="center"
              >
                <VStack spacing={5} align="stretch">
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

                  <Button
                    type="submit"
                    color="green.800"
                    fontFamily="'Fustat', sans-serif"
                    isLoading={loading}
                    colorScheme="green"
                  >
                    Log In
                  </Button>

                  {error && (
                    <Text color="red.600" fontSize="sm" textAlign="center">
                      {error}
                    </Text>
                  )}

                  <Text fontSize="sm"
                    color="green.800"
                    fontFamily="'Fustat', sans-serif" textAlign="center">
                    Don’t have an account?{" "}
                    <CLink as={RouterLink} to="/signup" color="green.700" _hover={{ color: "green.800" }}>
                      Sign up
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

export default LogIn
