import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());


app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "chatbotDB"
        });
        console.log("Connected with Database!");
    } catch (err) {
        console.log("Failed to connect with Db", err);
    }
};

export default connectDB;

// app.post("/test", async (req, res) => {
//     try {
//         const apiKey = process.env.GEMINI_API_KEY;

//         const response = await fetch(
//             `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     contents: [
//                         {
//                             parts: [
//                                 {
//                                     text: req.body.message
//                                 }
//                             ]
//                         }
//                     ]
//                 })
//             }
//         );

//         const data = await response.json();

//         const reply = data.candidates[0].content.parts[0].text;

//         res.send(reply);

//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Error generating response");
//     }
// });