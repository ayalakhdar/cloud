import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      let user = login(username, password);

      // Redirect automatically based on role
      if (user.role === "CLIENT") navigate("/client/needs");
      if (user.role === "SUPPLIER") navigate("/supplier/needs");
      if (user.role === "ACCOUNTANT") navigate("/accountant/requests");
      if (user.role === "ADMIN") navigate("/admin/users");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100%",
    }}
  >
    <div
      style={{
        background: "#1e1e1e",
        padding: "40px 50px",
        borderRadius: 12,
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Login</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <input
          style={{
            padding: 12,
            borderRadius: 6,
            border: "1px solid #555",
            background: "#2b2b2b",
            color: "white",
          }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          style={{
            padding: 12,
            borderRadius: 6,
            border: "1px solid #555",
            background: "#2b2b2b",
            color: "white",
          }}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          style={{
            padding: 12,
            borderRadius: 6,
            background: "#646cff",
            color: "white",
            fontSize: "1.1em",
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          Login
        </button>
      </form>
    </div>
  </div>
);

}
