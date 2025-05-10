

const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");

const router = express.Router();

router.use(cors());
router.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/generate-text", async (req, res) => {
  try {
    const { time, type, difficulty } = req.body;

    const prompt = `Generate text with STRICT FORMATTING:
    - 30 lines total
    - 3 sentences per line
    - Sentences separated by periods
    - Lines separated by newlines
    - Content Type: ${type === "quotes" ? "Famous quotes" : 
                     type === "numbers" ? "Numbers/symbols" : 
                     "Common words"}
    - Difficulty: ${difficulty === "hard" ? "Complex words" :
                   difficulty === "normal" ? "Moderate" : 
                   "Simple"}

    Example:
    The quick brown fox. Jumps over. The lazy dog.
    Practice typing daily. Improves your speed. Makes you productive.
    if content type is numbers give sentence with numbers and symbol inbetwee sentences or words
    also include numbers/symbols which can be typed using keyboard not tought symbols`;

    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    
    console.log("Raw Generated Text:", generatedText); // Debug log

    // Format validation
    const formattedText = generatedText
  .split('\n')
  .filter(line => line.trim().length > 0)
    .map(line => {
        const sentences = line.split(/\.+/g)
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .slice(0, 3)
          .map(s => s.endsWith('.') ? s : s + '.');
        return sentences.join(' ').trim();
      })
      .join('\n');

      res.header("Access-Control-Allow-Origin", "http://localhost:5173") // Your frontend URL
      .header("Access-Control-Allow-Credentials", "true")
      .json({
        text: formattedText,
        structure: {
          totalLines: 10,
          sentencesPerLine: 3,
          totalSentences: 30
      }
    });

  } catch (error) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
       .header("Access-Control-Allow-Credentials", "true")
       .status(500)
       .json({
         error: "Generation failed",
         details: error.message,
         prompt: error.prompt
       });
  }
});

module.exports = router;