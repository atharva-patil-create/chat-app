// src/api/mockApi.ts
export const fetchMessages = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          text: "Hello!",
          sender: "ai",
          status: "read",
          timestamp: Date.now(),
        },
        {
          id: "2",
          text: "How can I assist you?",
          sender: "ai",
          status: "read",
          timestamp: Date.now(),
        },
      ]);
    }, 1000); // Simulates network delay
  });
};

export const sendMessageToApi = async (message: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve({
          id: Date.now().toString(),
          text: message,
          sender: "user",
          status: "sent",
          timestamp: Date.now(),
        });
      } else {
        reject(new Error("Network error, try again!"));
      }
    }, 500);
  });
};
