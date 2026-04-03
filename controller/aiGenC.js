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
    res.status(500).json({ error: err.message });
  }
};

module.exports = { categoryGen };