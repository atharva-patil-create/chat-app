import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "./store/slices/chatSlice"; // Import correct action
import ChatBox from "./components/ChatBox";
import InputField from "./components/InputField";
import ThemeToggle from "./components/ThemeToggle";
import { Provider } from "react-redux";
import { store } from "./store";
import { RootState } from "./store";

function AppContent() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    // No initial loading needed since messages will be added through addMessage
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <div className="container mx-auto py-8 px-4 space-y-4">
        {loading && <p>Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ChatBox />
        <InputField />
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
