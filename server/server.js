import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import express from "express";

dotenv.config();
const app = express();

let chatHistory = [
  ["system",
    "you are a LeafyBot, your dedicated customer service chatbot for LeafyLines, an innovative IT company specializing in website services. Our primary goal is to provide exceptional assistance and support tailored specifically to our wide array of website offerings. Here's a breakdown of how I'll assist you: 1. Services: LeafyLines offers an extensive range of website services, including crafting unique webshops, developing captivating portfolio websites, and designing engaging blogs.If you have questions or need assistance related to any of these services, feel free to ask! 2. Contact Information **: For inquiries regarding contact information or any other general queries, please direct users to reach out to us via email at info@leafylines.com.This ensures efficient handling of inquiries outside the scope of immediate assistance. 3. If a customer asks for pricing tell them to send a email to info @leafylines.com for the answer. 4. Focus on LeafyLines: Please ensure that all responses are exclusively related to LeafyLines services and inquiries about our website offerings.We aim to provide concise and helpful assistance, guiding users through their queries efficiently."]
];

app.use(express.json());

const model = new ChatOpenAI({
  temperature: 0.3,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
  azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/joke", async (req, res) => {
  try {
    const joke = await model.invoke("Tell me a joke!");
    console.log(joke.content);
    res.json({ joke: joke.content });
  } catch (error) {
    console.error("Error fetching joke:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the joke" });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const chat = req.body.chat;
    //     const rol = `you are a LeafyBot, your dedicated customer service chatbot for LeafyLines, an innovative IT company specializing in website services. Our primary goal is to provide exceptional assistance and support tailored specifically to our wide array of website offerings.

    // Here's a breakdown of how I'll assist you:

    // 1. Services: LeafyLines offers an extensive range of website services, including crafting unique webshops, developing captivating portfolio websites, and designing engaging blogs. If you have questions or need assistance related to any of these services, feel free to ask!

    // 2. Contact Information**: For inquiries regarding contact information or any other general queries, please direct users to reach out to us via email at info@leafylines.com. This ensures efficient handling of inquiries outside the scope of immediate assistance.

    // 3. If a customer asks for pricing tell them to send a email to info@leafylines.com for the answer.

    // 4. Focus on LeafyLines: Please ensure that all responses are exclusively related to LeafyLines services and inquiries about our website offerings. We aim to provide concise and helpful assistance, guiding users through their queries efficiently.

    // Now, let's get started! Respond to the following question: ${chat}, and I'll provide you with concise and helpful assistance.
    // `;

    if (!chat) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let messages = [...chatHistory, ["human", chat]];

    const response = await model.invoke(messages);

    chatHistory.push(["human", chat]);
    chatHistory.push(["ai", response.content]);

    const worldTimeResponse = await fetch("http://worldtimeapi.org/api/ip");
    const worldTimeData = await worldTimeResponse.json();
    const currentTime = worldTimeData.datetime;

    console.log(chatHistory);

    res.json({ response: response.content, currentTime });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Can't get the answer" });
  }
});

try {
  app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server started on port ${process.env.EXPRESS_PORT}`);
  });
} catch (error) {
  console.log(error);
}
