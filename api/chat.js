export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const AUTH_TOKEN = process.env.AUTH_TOKEN || "davi-id123";
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const MODEL = process.env.MODEL || "gpt-4o-mini";
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY não configurada" });
    }

    const token = req.headers["x-auth-token"];
    if (token !== AUTH_TOKEN) {
      return res.status(401).json({ error: "não autorizado" });
    }

    const { message = "Olá" } = req.body || {};

    // Prompt mínimo só para validar fluxo. Depois troque pelo contrato completo (versão B).
    const SYSTEM_PROMPT = "Você é Davi, SDR da Impactar Digital (equipe do Leandro Pretti). Responda curto, natural, humano. Quando alguém disser que tem interesse, cumprimente e pergunte o segmento do negócio. Responda apenas com texto para o usuário.";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message }
    ];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.3 })
    });

    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: "OpenAI error", detail: data });

    const reply = data.choices?.[0]?.message?.content?.trim() || "Desculpe, não consegui entender.";
    return res.status(200).json({ ok: true, reply });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "erro interno" });
  }
}
