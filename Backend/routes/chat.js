import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/openai.js";
import { authMiddleware } from "../middleware/auth.js";
import { generateTitle } from "../utils/openai.js";


const router = express.Router();

//test
router.post("/test",authMiddleware, async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz2",
            title: "Testing New Thread3"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all threads
router.get("/thread",authMiddleware, async(req, res) => {
    try {
        const threads = await Thread.find({userId: req.user.id}).sort({updatedAt: -1});
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId",authMiddleware, async(req, res) => {
    const {threadId} = req.params;

    try {
        // const thread = await Thread.findOne({threadId});
        const thread = await Thread.findOne({
            threadId,
            userId: req.user.id
        });

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId",authMiddleware, async (req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({
            threadId,
            userId: req.user.id
        });

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat",authMiddleware, async(req, res) => {
    const {threadId, message} = req.body;
    let title=await generateTitle(message);

    if(!threadId || !message) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        let thread = await Thread.findOne({
            threadId,
            userId: req.user.id
        });

        if(!thread) {
            //create a new thread in Db
            thread = new Thread({
                threadId,
                userId: req.user.id,   // 🔥 THIS LINE FIXES ERROR
                title: title,
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getGeminiAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;