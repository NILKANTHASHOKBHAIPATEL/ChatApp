import "dotenv/config";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const getGeminiAPIResponse = async (message, retries = 2) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        { parts: [{ text: message }] }
                    ],
                    generationConfig: {
                        maxOutputTokens: 1000   // 🔥 IMPORTANT
                    }
                })
            }
        );

        const data = await response.json();

        console.log("🔥 FULL GEMINI RESPONSE:");
        console.log(JSON.stringify(data, null, 2));

        console.log("GEMINI RESPONSE:", data);

        // 🔥 HANDLE API ERROR
        if (data.error) {
            console.log("❌ Gemini error:", data.error);
            return "⚠️ AI service error. Try again later.";
        }

        // 🔥 RETRY IF NO RESPONSE
        if (!data.candidates || !data.candidates.length) {
            if (retries > 0) {
                console.log("🔁 Retrying...");
                await delay(1000);  // wait 1 sec
                return getGeminiAPIResponse(message, retries - 1);
            }
            return "⚠️ AI is busy. Try again.";
        }

        return data.candidates[0]?.content?.parts?.[0]?.text;

    } catch (err) {
        console.log("🔥 ERROR:", err);
        return "⚠️ Error generating response";
    }
};

export default getGeminiAPIResponse;

export const generateTitle = async (message) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Generate a very short chat title (max 5 words) for this message: "${message}". Only return the title.`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "New Chat";

    } catch (err) {
        console.log("TITLE ERROR:", err);
        return "New Chat";
    }
};