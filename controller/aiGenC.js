require("dotenv").config();
const genai = require("@google/genai");
const ai = new genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const categoryGen = async (req, res) => {

  const { description } = req.body;


 ( async function category() {
    const response = await ai.models.generateContent({
        model:"gemini-3-flash-preview",
        contents:`
        You are a smart expense categorization assistant.

Your task:
Based on the given expense description, return only one most relevant category name.

Rules:
- Return only the category name.
- Do not explain anything.
- Do not add extra words.
- Keep category name short (1–2 words).
- First letter capitalized.
- No punctuation.

Expense Description:
${description}

Category:
        ` 
    })
    console.log(`AI GENERATED CATEGORY -- ${response.text}`)
    res.status(200).json(response.text);
  })();


};
module.exports = { categoryGen };
