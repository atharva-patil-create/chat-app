// Updated useWebSocket.ts with reconnection logic and mock API integration
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "../store/slices/chatSlice";

const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const connect = () => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      socketRef.current = new WebSocket(url);

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        // Ensure the message isn't already in Redux state
        const isDuplicate = state.messages.some((msg) => msg.id === message.id);
        if (!isDuplicate) {
          dispatch(addMessage(message));
        }
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket closed. Reconnecting...");
        setTimeout(connect, 3000); // Auto-reconnect after 3 seconds
      };
    };

    connect();
    return () => socketRef.current?.close();
  }, [url, dispatch]);

  return socketRef;
};

export default useWebSocket;
