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
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: 250 }}>

        <input
          style={{ padding: 8, marginBottom: 12 }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          style={{ padding: 8, marginBottom: 12 }}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={{ padding: 10 }}>Login</button>
      </form>
    </div>
  );
}
