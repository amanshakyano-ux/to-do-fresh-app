require("dotenv").config();

const genai = require("@google/genai");

const ai = new genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const categoryGen = async (req, res) => {
  try {
    const { description } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are a smart expense categorization assistant.

Return only one category name.

Expense:
${description}

Category:
      `,
    });

    res.status(200).json(response.text);
  } catch (err) {
    // Log full error for debugging (includes response/status when available)
    console.error("AI categoryGen error:", err);
    // Try to extract useful fields from the error
    const errInfo = {};
    if (err.response) {
      errInfo.status = err.response.status;
      errInfo.data = err.response.data;
    }
    if (err.code) errInfo.code = err.code;

    res.status(500).json({ error: err.message, details: errInfo });
  }
};

module.exports = { categoryGen };
