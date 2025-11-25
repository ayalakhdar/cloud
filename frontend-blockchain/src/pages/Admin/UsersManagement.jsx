import { useState } from "react";
import { useUsers } from "../../context/UserContext";

export default function UsersManagement() {
  const { users, addUser, updateUser, deleteUser } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "CLIENT",
  });

  const openModal = (user = null) => {
    setEditingUser(user);
    setForm(
      user
        ? {
            username: user.username,
            password: user.password,
            role: user.role,
          }
        : {
            username: "",
            password: "",
            role: "CLIENT",
          }
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      updateUser(editingUser.id, form);
    } else {
      addUser(form);
    }

    closeModal();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>User Management</h1>

      <button
        onClick={() => openModal()}
        style={{
          padding: "10px 16px",
          marginBottom: 20,
          background: "#333",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        + Add User
      </button>

      {/* USERS LIST */}
      {users.length === 0 && <p>No users found.</p>}

      {users.map((u) => (
        <div
          key={u.id}
          style={{
            padding: 15,
            border: "1px solid #ddd",
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>{u.username}</h3>
          <p style={{ margin: "4px 0" }}>
            <strong>Role:</strong> {u.role}
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button
              onClick={() => openModal(u)}
              style={{
                padding: "6px 12px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
            >
              Edit
            </button>

            <button
              onClick={() => deleteUser(u.id)}
              style={{
                padding: "6px 12px",
                background: "crimson",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* MODAL */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: 24,
              borderRadius: 8,
              minWidth: 350,
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {editingUser ? "Edit User" : "Add User"}
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <input
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
                style={{ padding: 8 }}
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                style={{ padding: 8 }}
              />

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                style={{ padding: 8 }}
              >
                <option value="CLIENT">Client</option>
                <option value="SUPPLIER">Supplier</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button
                type="submit"
                style={{
                  padding: "10px 0",
                  background: "#333",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                {editingUser ? "Update User" : "Create User"}
              </button>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  padding: "10px 0",
                  background: "#ccc",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
