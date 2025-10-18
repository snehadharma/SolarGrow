import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Box } from "@chakra-ui/react"

export default function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/login')
    })
  }, [])

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
    </Box>
  )
}