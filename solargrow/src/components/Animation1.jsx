// components/anim/PageTransition.jsx
import { motion } from "framer-motion";
export default function Animation1({ children }) {
  return (
    <motion.div
      style={{ display: "contents" }}              // no layout shift
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.25,0.1,0.25,1] }}
    >
      {children}
    </motion.div>
  );
}
