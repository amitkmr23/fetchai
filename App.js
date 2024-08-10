import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("hello i am amit");
  const [response, setResponse] = useState("");
  const [wsMessage, setWsMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Set up native WebSocket connection
    const newSocket = new WebSocket("ws://localhost:8000/ws");

    newSocket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    newSocket.onmessage = (event) => {
      setWsMessage(event.data);
    };

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send message to the backend via HTTP POST
    axios.post("/api/message", { message })
      .then(res => setResponse(res.data.response))
      .catch(err => console.error(err));

    // Send message through WebSocket
    if (socket) {
      socket.send(message);
    }
  };

  return (
    <div className="App">
      <h1>uAgents Frontend</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message to uAgent"
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <h2>Response from API:</h2>
        <p>{response}</p>
      </div>
      <div>
        <h2>WebSocket Message:</h2>
        <p>{wsMessage}</p>
      </div>
    </div>
  );
}

export default App;

