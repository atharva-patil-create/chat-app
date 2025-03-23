import { motion } from "framer-motion";

const Message = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-2 bg-gray-300 rounded-lg"
  >
    {text}
  </motion.div>
);

export default Message;
