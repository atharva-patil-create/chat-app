import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addMessage,
  setTyping,
  updateMessageStatus,
} from "../store/slices/chatSlice";
import { motion } from "framer-motion";
import ContentEditable from "react-contenteditable";

type FormatTag = "bold" | "italic" | "underline" | "link" | "list";

const InputField = () => {
  const [html, setHtml] = useState("");
  const [activeStyle, setActiveStyle] = useState<{
    [key in FormatTag]: boolean;
  }>({
    bold: false,
    italic: false,
    underline: false,
    link: false,
    list: false,
  });
  const dispatch = useDispatch();
  const contentRef = useRef<HTMLDivElement>(null);

  const updateActiveStyles = () => {
    if (!contentRef.current) return;

    setActiveStyle({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      link: document.queryCommandState("createLink"),
      list: document.queryCommandState("insertUnorderedList"),
    });
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveStyles();
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const applyFormatting = (tag: FormatTag) => {
    const command = tag === "link" ? "createLink" : tag;
    const url = tag === "link" ? prompt("Enter URL:") : undefined;

    if (tag === "link" && !url) return;

    document.execCommand(command, false, url || undefined);
    updateActiveStyles();
  };

  const handleInputChange = (e: { target: { value: string } }) => {
    setHtml(e.target.value);
    dispatch(setTyping(true));

    setTimeout(() => {
      dispatch(setTyping(false));
    }, 2000);
  };

  const sendMessage = () => {
    if (!html.trim()) return;

    const messageId = Date.now().toString();

    // Optimistic UI update
    const userMessage = {
      id: messageId,
      text: html,
      sender: "user" as const,
      status: "sending" as const,
      timestamp: Date.now(),
    };
    dispatch(addMessage(userMessage));
    setHtml("");
    setActiveStyle({
      bold: false,
      italic: false,
      underline: false,
      link: false,
      list: false,
    });

    dispatch(setTyping(true));

    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: "This is an AI response.",
        sender: "ai" as const,
        status: "sent" as const,
      };
      dispatch(addMessage(aiMessage));

      setTimeout(() => {
        dispatch(
          updateMessageStatus({ id: aiMessage.id, status: "delivered" })
        );
      }, 1000);

      setTimeout(() => {
        dispatch(updateMessageStatus({ id: aiMessage.id, status: "read" }));
        dispatch(setTyping(false));
      }, 2000);
    }, 1500);
  };

  // ✅ Fix: Handle "Enter" to send message, "Shift + Enter" for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line
      sendMessage();
    }
  };

  return (
    <motion.div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg">
      <div className="flex space-x-2 mb-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
        {[
          { tag: "bold", label: "B" },
          { tag: "italic", label: "I" },
          { tag: "underline", label: "U" },
          { tag: "link", label: "🔗" },
          { tag: "list", label: "📄" },
        ].map(({ tag, label }) => (
          <button
            key={tag}
            onClick={() => applyFormatting(tag as FormatTag)}
            className={`px-3 py-2 rounded-md text-gray-700 dark:text-white transition-all text-lg ${
              activeStyle[tag as keyof typeof activeStyle]
                ? "bg-blue-500 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
        <ContentEditable
          innerRef={contentRef as React.RefObject<HTMLElement>}
          html={html}
          onChange={(e: { currentTarget: { innerHTML: string } }) => {
            handleInputChange({ target: { value: e.currentTarget.innerHTML } });
            updateActiveStyles();
          }}
          onKeyDown={handleKeyDown} // 🔥 Handles Enter key!
          className="flex-1 p-2 bg-transparent outline-none text-gray-700 dark:text-white min-h-[40px] overflow-auto"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all ml-2"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
};

export default InputField;
