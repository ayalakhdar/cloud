import { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function NewNeedForm({ onClose }) {
  const { addNeed } = useData();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const need = {
      id: Date.now(),
      title,
      description: desc,
      client: user.username,
      status: "OPEN",
    };

    addNeed(need);
    onClose(); // close modal
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2>Create a New Need</h2>

      <input
        placeholder="Need title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ padding: 8 }}
      />

      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
        style={{ padding: 8, height: 100 }}
      />

      <button type="submit" style={{ padding: 10 }}>
        Create
      </button>

      <button type="button" onClick={onClose} style={{ padding: 10 }}>
        Cancel
      </button>
    </form>
  );
}
