import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, Button, Form } from "react-bootstrap";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello! I'm your Budget AI Assistant. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // add user message to chat
    const updated = [...messages, { from: "user", text: input }];
    setMessages(updated);

    try {
      const res = await axios.post("http://localhost:8081/api/ai/chat", {
        message: input,
      });

      const aiText = res.data.reply || "No response from AI.";

      // add AI response to chat
      setMessages([...updated, { from: "ai", text: aiText }]);

    } catch (err) {
      console.error(err);
      setMessages([
        ...updated,
        { from: "ai", text: "Sorry, something went wrong with the AI." },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <Card
      className="shadow-sm d-flex flex-column"
      style={{
        height: "100%",
        maxHeight: "600px",
        minWidth: "250px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card.Header className="text-center bg-primary text-white fw-bold">
        AI Assistant
      </Card.Header>

      {/* Chat container */}
      <div
        className="p-2 flex-grow-1"
        style={{
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-3 ${
              msg.from === "user"
                ? "bg-primary text-white align-self-end"
                : "bg-light text-dark align-self-start"
            }`}
            style={{ maxWidth: "80%" }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-2">
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button className="mt-2 w-100" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Card>
  );
}
