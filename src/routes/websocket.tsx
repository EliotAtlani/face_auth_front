import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Websocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    socket.current = new WebSocket("ws://localhost:8000/ws");

    // Connection opened
    socket.current.addEventListener("open", () => {
      console.log("Connected to WebSocket");
    });

    // Listen for messages
    socket.current.addEventListener("message", (event: MessageEvent) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Connection closed
    socket.current.addEventListener("close", () => {
      console.log("Disconnected from WebSocket");
    });

    // Clean up the effect
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(inputMessage);
      setInputMessage("");
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WebSocket Test</h1>
      <div className="mb-4">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Type a message"
        />
        <Button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </Button>
      </div>
      <div className="border p-4 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Websocket;
