
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
    
    // Handle OPTIONS method
    if (req.method === 'OPTIONS') {
        return res.status(200).json({
            body: "OK"
        });
    }
    
    next();
});

//add middleware 
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase URL-encoded form size

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});





app.post("/chat", async (req, res) => {
    console.log("Here");
    try {
        const { message, file} = req.body;
        const api_key = process.env.API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}`;
        
        const chatHistory = [
            {
                role: "user",
                parts: [{ text: message }, ...(file ? [{ inline_data: file}]: [] )],
            }
        ];

        const response = await axios.post(
            url,
            { contents: chatHistory },
            { headers: { "Content-Type": "application/json" }}
        );


        res.json(response.data);
    } catch (error) {
        console.error("Error fetching API response", error.response ? error.response.data: error.message);
        res.status(500).json({
            error: error.response ? error.response.data: error.message || "Internal Server Error"
        });
    }


});



// Set the server to listen on a port

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



