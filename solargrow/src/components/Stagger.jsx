// components/anim/Stagger.jsx
import { motion } from "framer-motion";
const container = { animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const item = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32 } },
};
export default function Stagger({ children }) {
  return (
    <motion.div variants={container} initial="initial" animate="animate" style={{ display:"contents" }}>
      {Array.isArray(children)
        ? children.map((c, i) => <motion.div key={i} variants={item}>{c}</motion.div>)
        : <motion.div variants={item}>{children}</motion.div>}
    </motion.div>
  );
}
