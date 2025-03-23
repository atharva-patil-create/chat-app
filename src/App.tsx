import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "./components/ChatBox";
import InputField from "./components/InputField";
import ThemeToggle from "./components/ThemeToggle";
import { Provider } from "react-redux";
import { store } from "./store";
import useWebSocket from "./hooks/useWebSocket";
import { RootState } from "./store";
import { toggleTheme } from "./store/slices/themeSlice";
import { loadChatHistory } from "./store/slices/chatSlice";

function WebSocketHandler() {
  useWebSocket("ws://localhost:8080"); // WebSocket now runs inside Provider
  return null; // This component does not render anything
}

function AppContent() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Load chat history on startup
  useEffect(() => {
    dispatch(loadChatHistory());
  }, [dispatch]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (!savedTheme) {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(toggleTheme());
    } else {
      dispatch(toggleTheme());
    }
  }, [dispatch]);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <div className="container mx-auto py-8 px-4 space-y-4">
        <ChatBox />
        <InputField />
        <WebSocketHandler /> {/* WebSocket runs after Provider is available */}
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
