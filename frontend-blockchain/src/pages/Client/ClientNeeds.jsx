import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import NewNeedForm from "../../components/NewNeedForm";

export default function ClientNeeds() {
  const { needs } = useData();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const clientNeeds = needs.filter((n) => n.client === user.username);

  return (
    <div style={{ padding: 40 }}>
      <h1>Your Needs</h1>

      <button
        onClick={() => setOpen(true)}
        style={{ padding: 10, marginBottom: 20 }}
      >
        + Create New Need
      </button>

      {clientNeeds.length === 0 && <p>No needs yet.</p>}

      {clientNeeds.map((need) => (
        <div
          key={need.id}
          style={{
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <h3>{need.title}</h3>
          <p>{need.description}</p>
        </div>
      ))}

      {/* Popup Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <NewNeedForm onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
