// import { useState } from "react";
// import "./AuthScreen.css";

// function AuthScreen() {
//   const [isLogin, setIsLogin] = useState(true);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async () => {
//     const url = isLogin
//       ? "http://localhost:8080/api/auth/login"
//       : "http://localhost:8080/api/auth/register";

//     const body = isLogin
//       ? { email, password }
//       : { name, email, password };

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(body)
//     });

//     const data = await res.json();
//     console.log("LOGIN RESPONSE:", data);   // 🔥 DEBUG

//     if (data.token) {
//       localStorage.setItem("token", data.token);
//       window.location.reload();   // 🔥 go to app
//     } else {
//       alert("Registered! Now login.");
//       setIsLogin(true);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h2>{isLogin ? "Login" : "Register"}</h2>

//       {!isLogin && (
//         <input placeholder="Name" onChange={(e)=>setName(e.target.value)} />
//       )}

//       <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
//       <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

//       <button onClick={handleSubmit}>
//         {isLogin ? "Login" : "Register"}
//       </button>

//       <p onClick={()=>setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
//         {isLogin ? "Create account" : "Already have account?"}
//       </p>
//     </div>
//   );
// }

// export default AuthScreen;


import { useState } from "react";
import "./AuthScreen.css";

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const url = isLogin
      ? "https://chatapp-biu3.onrender.com/api/auth/login"
      : "https://chatapp-biu3.onrender.com/api/auth/register";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.reload();
    } else {
      alert(data.message || "Something went wrong");
    }
  };

  return (
    <div className="authContainer">
      <div className="authBox">

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {!isLogin && (
          <input
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)} className="toggleText">
          {isLogin ? "Create account" : "Already have an account?"}
        </p>

      </div>
    </div>
  );
}

export default AuthScreen;