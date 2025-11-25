import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // hide navbar on login page

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Links based on role
  const linksByRole = {
    CLIENT: [{ to: "/client/needs", label: "My Needs" }],
    SUPPLIER: [
    { to: "/supplier/needs", label: "Open Needs" },
    { to: "/supplier/my-offers", label: "My Offers" },
    ],
    ACCOUNTANT: [{ to: "/accountant/requests", label: "Requests" }],
    ADMIN: [{ to: "/admin/users", label: "Users" }],
  };

  const roleLinks = linksByRole[user.role] || [];

  return (
    <div
      style={{
        width: "100%",
        background: "#222",
        color: "white",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left Section */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <strong style={{ fontSize: 18 }}>Blockchain System</strong>

        {roleLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{ color: "white", textDecoration: "none" }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right Section */}
      <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
        <span>
          {user.username} ({user.role})
        </span>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            background: "crimson",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
