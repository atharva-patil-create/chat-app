import { useSelector } from "react-redux";
import { RootState } from "../store";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";

const ChatBox = () => {
  // ✅ Safe state selection to prevent undefined errors
  const messages = useSelector((state: RootState) => state.chat.messages) || [];
  const userStatus =
    useSelector((state: RootState) => state.chat.userStatus) || "offline";
  const isTyping = useSelector((state: RootState) => state.chat.isTyping);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg">
      {/* ✅ Display User Status */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-gray-700 dark:text-white">Status:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm text-white ${
            userStatus === "active" ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          {userStatus}
        </span>
      </div>

      {/* ✅ Chat Messages */}
      <div
        ref={chatContainerRef}
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl h-[400px] overflow-y-auto shadow-lg scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm"
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              {/* ✅ Message Read Receipts */}
              {msg.sender === "user" && (
                <span className="ml-2 text-white/80">
                  {msg.status === "read" ? (
                    <CheckCheck size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ✅ Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 dark:text-gray-400 italic"
          >
            Typing...
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
