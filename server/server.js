import dotenv from 'dotenv';
import { ChatOpenAI } from "@langchain/openai";
import express from "express";

dotenv.config();
const app = express();

app.use(express.json());

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/joke', async (req, res) => {
    try {
        const joke = await model.invoke("Tell me a Javascript joke!");
        console.log(joke.content);
        res.json({ joke: joke.content });
    } catch (error) {
        console.error("Error fetching joke:", error.message);
        res.status(500).json({ error: "An error occurred while fetching the joke" });
    }
});

app.post('/chat', async (req, res) => {
    try {
        const chat = req.body.chat;
        console.log(chat);

        if (!chat) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await model.invoke(chat);

        res.status(200).json({ response: response.content });
    } catch (error) {
        console.error("Error processing chat:", error.message);
        res.status(500).json({ error: "An error occurred while processing the chat" });
    }
});

const PORT = process.env.EXPRESS_PORT

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
