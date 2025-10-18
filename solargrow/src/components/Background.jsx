import { Box } from "@chakra-ui/react";

export default function Background() {
  return (
<Box 
    position="fixed" 
    minH="100vh" 
    display="flex" 
    flexDirection="column" 
    bg="#DDEADD" 
    overflow="hidden"
    background-attachment="fixed"
    zIndex={-1}
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
      </Box>
)}