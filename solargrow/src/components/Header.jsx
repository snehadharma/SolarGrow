import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Link as RouterLink } from "react-router-dom";
import { Link, Flex, HStack } from "@chakra-ui/react";

function Header() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate('/home')
  }

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      py={4}
      px={6}
      bg="white"
      w="100%"
    >
      <HStack spacing={8}>
        <Link
          as={RouterLink}
          to="/home"
          fontSize="24px"
          fontFamily="'Fustat', sans-serif"
          fontWeight="700"
          color="green.800"
          _hover={{ textDecoration: "none", color: "green.600" }}
        >
          SolarGrow
        </Link>

        {session && (
          <Link
            as={RouterLink}
            to="/dashboard"
            fontSize="18px"
            fontFamily="'Fustat', sans-serif"
            color="green.800"
            _hover={{ textDecoration: "none", color: "green.600" }}
          >
            Dashboard
          </Link>
        )}
      </HStack>

      {session && (
        <HStack spacing={6}>
          <Link
            as={RouterLink}
            to="/profile"
            fontSize="18px"
            fontFamily="'Fustat', sans-serif"
            color="green.800"
            _hover={{ textDecoration: "none", color: "green.600" }}
          >
            Profile
          </Link>

          <Link
            as="button"
            onClick={handleLogout}
            fontSize="18px"
            fontFamily="'Fustat', sans-serif"
            color="green.800"
            _hover={{ textDecoration: "none", color: "green.600" }}
          >
            Log Out
          </Link>
        </HStack>
      )}

      {!session && (
        <HStack spacing={6}>
          <Link
            as={RouterLink}
            to="/login"
            fontSize="18px"
            fontFamily="'Fustat', sans-serif"
            color="green.800"
            _hover={{ textDecoration: "none", color: "green.600" }}
          >
            Log In
          </Link>

          <Link
            as={RouterLink}
            to="/signup"
            fontSize="18px"
            fontFamily="'Fustat', sans-serif"
            color="green.800"
            _hover={{ textDecoration: "none", color: "green.600" }}
          >
            Sign Up
          </Link>
        </HStack>
      )}
    </Flex>
  )
}

export default Header
