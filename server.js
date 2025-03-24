import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// More permissive CORS configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ body: "OK" });
    }
    
    next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Chat API Route
app.post("/chat", async (req, res) => {
    console.log("Chat request received");
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Shankar GPT-3 API call
        const apiUrl = `https://shankar-gpt-3-api.vercel.app/api?message=${encodeURIComponent(message)}`;
        const response = await axios.get(apiUrl);

        // API Response
        if (response.data && response.data.status) {
            res.json({ reply: response.data.response });
        } else {
            res.status(500).json({ error: "Invalid API response" });
        }
    } catch (error) {
        console.error("Error fetching API response", error.response ? error.response.data : error.message);
        res.status(500).json({
            error: error.response ? error.response.data : error.message || "Internal Server Error"
        });
    }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
