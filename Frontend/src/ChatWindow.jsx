import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from './MyContext.jsx'
import { useContext,useState,useEffect } from "react";
import {ScaleLoader} from 'react-spinners';

function ChatWindow() {
    const {prompt,setPrompt,reply,setReply,currThreadId,prevChats,setPrevChats,setNewChat,sidebarOpen,setSidebarOpen} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));


    const getReply = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        await new Promise(res => setTimeout(res, 500)); // 🔥 ADD THIS
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")   // 🔥 ADD THIS
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("https://chatapp-biu3.onrender.com/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply || "⚠️ No response from AI");
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);

    // const handleProfileClick = () => {
    //     setIsOpen(!isOpen);
    // }

    const handleProfileClick = (e) => {
        e.stopPropagation();   // 🔥 prevents dropdown from closing immediately
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);

        if (isOpen) {
            window.addEventListener("click", handleClickOutside);
        }

        return () => window.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");   // remove token

        // 🔥 reset app state (IMPORTANT)
        setPrevChats([]);
        setReply(null);
        setPrompt("");

        // 🔥 reload app to go to login screen
        window.location.reload();
    }

    return (
        <div className="chatWindow">
            {/* 🔥 Overlay */}
            {sidebarOpen && (
                <div 
                    className="overlay"
                    onClick={() =>{console.log("OVERLAY CLICKED"); setSidebarOpen(false)}}
                ></div>
            )}

            <div className="navbar">
                {/* 🔥 Hamburger */}
                <span onClick={() => setSidebarOpen(prev => !prev)} className="menuBtn">
                    ☰
                </span>
                <span>ChatApp <i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
            </div>
            {/* {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            } */}

            {
                isOpen && 
                <div className="dropDown">

                    <div className="dropDownItem">
                        👤 {user?.name}
                    </div>

                    <div className="dropDownItem">
                        📧 {user?.email}
                    </div>

                    <hr style={{ borderColor: "#444" }} />

                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i> Settings
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
                    </div>

                    <div 
                        className="dropDownItem"
                        onClick={() => {
                            localStorage.removeItem("token");   // 🔥 logout
                            localStorage.removeItem("user");   // 🔥 ADD THIS
                            window.location.reload();           // 🔥 reset app
                        }}
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>

                </div>
}

            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>

            </ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask Anything"
                        value={prompt}
                        onChange={(e)=>setPrompt(e.target.value)}
                        onKeyDown={(e)=> e.key === "Enter"?getReply():''}
                    > 
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    ChatApp can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;