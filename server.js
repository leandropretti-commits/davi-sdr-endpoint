import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÕES BÁSICAS
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.MODEL || "gpt-4o-mini";
const AUTH_TOKEN = process.env.AUTH_TOKEN || "davi-123";

// CONTRATO DO AGENTE (COLE AQUI DEPOIS O TEXTO COMPLETO DO DAVI V3)
const SYSTEM_PROMPT = `
[COLE AQUI O CONTRATO DO AGENTE — DAVI (V3) COMPLETO]
`;

// TESTE RÁPIDO
app.get("/", (req, res) => res.send("✅ Davi SDR rodando perfeitamente!"));

// ROTA PRINCIPAL QUE O MANYCHAT VAI USAR
app.post("/chat", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (token !== AUTH_TOKEN) {
      return res.status(401).json({ error: "não autorizado" });
    }

    const userMessage = req.body.message || "Olá";
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.3
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui entender.";

    res.json({ ok: true, reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "erro interno" });
  }
});

app.listen(3000, () => console.log("🚀 Davi SDR rodando localmente na porta 3000"));
