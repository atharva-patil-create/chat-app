import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <motion.div
      className="flex space-x-1 mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce delay-100"></span>
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce delay-200"></span>
    </motion.div>
  );
};

export default TypingIndicator;
