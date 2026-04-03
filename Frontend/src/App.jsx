import AuthScreen from "./AuthScreen.jsx";
import './App.css'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import { MyContext } from './MyContext.jsx'
import { use, useState } from 'react';
import {v1 as uuidv1} from 'uuid';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);//stores all chats of the current thread
  const [newChat,setNewChat]=useState(true);
  const [allThreads,setAllThreads]=useState([]);//stores all threads of the user
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const providerValues={
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads,setAllThreads,
    sidebarOpen,setSidebarOpen
  };//passing values to the provider

  // return (
  //   <div className="app">
  //     <MyContext.Provider value={providerValues}>
  //       <Sidebar></Sidebar>
  //       <ChatWindow></ChatWindow>
  //     </MyContext.Provider>
  //   </div>
  // )
  return (
    <>
      {
        token ? (
          <div className="app">
            <MyContext.Provider value={providerValues}>
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <ChatWindow  />
            </MyContext.Provider>
          </div>
        ) : (
          <AuthScreen />   // 👈 show login/register
        )
      }
  </>  
  )
}

export default App
