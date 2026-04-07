"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.reply);
    } catch (err) {
      setAnswer("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
          <CardContent className="p-6 space-y-6">

            {/* Title */}
            <h1 className="text-3xl font-bold text-white text-center">
              🤖 Smart RAG Assistant
            </h1>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask anything from your document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="bg-white/20 text-white placeholder:text-gray-300"
              />

              <Button
                onClick={askQuestion}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "..." : "Ask"}
              </Button>
            </div>

            {/* Answer */}
            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/20 text-white"
              >
                {answer}
              </motion.div>
            )}

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}