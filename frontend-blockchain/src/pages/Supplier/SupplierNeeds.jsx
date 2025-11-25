import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import OfferForm from "../../components/OfferForm";

export default function SupplierNeeds() {
  const { needs,offers} = useData();
  const { user } = useAuth();

  const [selectedNeed, setSelectedNeed] = useState(null);
  const [open, setOpen] = useState(false);

  const openNeeds = needs.filter((n) => n.status === "OPEN");
  const hasAlreadyApplied = (needId) => {
    return offers.some(
      (o) => o.needId === needId && o.supplier === user.username
    );
  };

  const handleApply = (need) => {
    setSelectedNeed(need);
    setOpen(true);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Open Needs</h1>

      {openNeeds.length === 0 && <p>No open needs yet.</p>}

      {openNeeds.map((need) => (
        <div
          key={need.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <h3>{need.title}</h3>
          <p>{need.description}</p>
          <small>Client: {need.client}</small>
          <br />

          {hasAlreadyApplied(need.id) ? (
            <button
              disabled
              style={{
                marginTop: 10,
                padding: "6px 12px",
                background: "#aaa",
                color: "white",
                cursor: "not-allowed",
              }}
            >
              Already Applied
            </button>
          ) : (
            <button
              onClick={() => handleApply(need)}
              style={{ marginTop: 10, padding: "6px 12px" }}
            >
              Apply
            </button>
          )}

        </div>
      ))}

      {/* Modal for offer submission */}
      <Modal open={open} onClose={() => setOpen(false)}>
        {selectedNeed && (
          <OfferForm
            need={selectedNeed}
            onClose={() => setOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
