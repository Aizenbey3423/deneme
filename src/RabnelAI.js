import { useState } from "react";

export default function RabnelAI() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Merhaba! Rabnel AI'ye hoş geldin. Sana nasıl yardımcı olabilirim?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are RabnelAI, a helpful assistant." },
            ...messages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            { role: "user", content: input },
          ],
        }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

      const data = await res.json();
      const botReply = data?.choices?.[0]?.message?.content || "Cevap alınamadı.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("API Hatası:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Üzgünüm, bir hata oluştu." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🤖 Rabnel AI</h1>
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-2">
        <div className="overflow-y-auto h-96 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl max-w-xs whitespace-pre-wrap ${
                msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-2 rounded-xl border border-gray-300"
            placeholder="Mesaj yaz..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className={`px-4 py-2 rounded-xl text-white ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "..." : "Gönder"}
          </button>
        </div>
      </div>
    </div>
  );
}
