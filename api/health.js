export default function handler(req, res) {
  const mask = (val = "") =>
    typeof val === "string" && val.length >= 10
      ? `${val.slice(0, 3)}...${val.slice(-4)}`
      : val
      ? "***"
      : "missing";

  res.status(200).json({
    ok: true,
    env: {
      OPENAI_API_KEY_present: !!process.env.OPENAI_API_KEY,
      OPENAI_API_KEY_masked: mask(process.env.OPENAI_API_KEY),
      OPENAI_PROJECT_present: !!process.env.OPENAI_PROJECT,
      OPENAI_PROJECT_value: process.env.OPENAI_PROJECT || "missing",
      MODEL: process.env.MODEL || "missing",
      AUTH_TOKEN_masked: mask(process.env.AUTH_TOKEN)
    }
  });
}
