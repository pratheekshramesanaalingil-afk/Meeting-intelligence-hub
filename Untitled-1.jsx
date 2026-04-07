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
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 grid gap-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        RAG Dashboard
      </motion.h1>

      <Card className="rounded-2xl shadow">
        <CardContent className="p-4 grid gap-4">
          <Input
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Button onClick={askQuestion} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </Button>

          {answer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-gray-100 rounded-xl"
            >
              {answer}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}