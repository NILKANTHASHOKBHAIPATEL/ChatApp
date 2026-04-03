import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
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
                                    text: message   
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        maxOutputTokens: 5000
                    }
                })
            }
        );

        const data = await response.json();

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        return reply;    

    } catch (err) {
        console.log(err);
        return "Error generating response";  
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