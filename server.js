require('dotenv').config();
const express = require('express');
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;



//add middleware 
app.use(cors());
app.use(express.json());
const api_key = process.env.API_KEY;
console.log(api_key);
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api_key}`;
console.log(url);
//return;



app.post("/chat", async (req, res) => {
    console.log("Here");
    try {
        const { message, file} = req.body;

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



