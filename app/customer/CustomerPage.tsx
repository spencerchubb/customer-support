"use client";
import { useState } from "react";

type Message = {
    role: string,
    content: string
};

export default function CustomerPage() {
    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([
        { "role": "system", "content": "You are PulseChat, a customer support chatbot for TechPulse." },
        { "role": "assistant", "content": "Hi, my name is PulseChat! What questions do you have about TechPulse?" },
    ]);
    const [currentStream, setCurrentStream] = useState<string>("");

    function onClickSend() {
        const newMessages = [...messages];
        newMessages.push({ "role": "user", "content": text });
        setMessages(newMessages);
        setText("");

        fetch("/api/chatCompletion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: newMessages }),
        })
            .then(async function(res) {
                if (!res.body) throw new Error('No body');

                // Process the response as it streams in
                const reader = res.body.getReader();
                let tokens = '';

                while (true) {
                    let { done, value } = await reader.read() as any;
                    if (done) break;
                    value = new TextDecoder().decode(value);
                    tokens += value;
                    setCurrentStream(tokens);
                }

                // Once the stream is complete, add the final message to the chat.
                setCurrentStream("");
                newMessages.push({"role": "assistant", "content": tokens});
                setMessages(newMessages);
            });
    }

    return <div className="w-full max-w-2xl mx-auto h-full flex flex-col items-center px-4">
        <h1>Customer POV</h1>
        {messages.map((message: Message, index: number) => {
            if (message.role === "system") return;
            return <p key={index} className={`message message-${message.role}`}>{message.content}</p>
        })}
        {currentStream && <p className="message message-assistant">{currentStream}</p>}
        <div style={{ flexGrow: 1 }}></div>
        <div className="flex w-full mb-4">
            <input
                type="text"
                className="flex-grow border border-gray-400 rounded p-2"
                placeholder="Ask a question to PulseChat"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="button ml-2" onClick={onClickSend}>Send</button>
        </div>
    </div>
}