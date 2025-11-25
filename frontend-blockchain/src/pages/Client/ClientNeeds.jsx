import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import NewNeedForm from "../../components/NewNeedForm";

export default function ClientNeeds() {
  const { needs, offers } = useData();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // all needs created by this user
  const allClientNeeds = needs.filter((n) => n.client === user.username);

  // accepted offers related to this client's needs
  const acceptedOffersForClient = offers.filter(
    (o) =>
      o.status === "ACCEPTED" &&
      allClientNeeds.some((need) => need.id === o.needId)
  );

  // ➤ FILTER OUT accepted needs
  const clientNeeds = allClientNeeds.filter(
    (need) => !acceptedOffersForClient.some((offer) => offer.needId === need.id)
  );

  const getNeedTitle = (needId) => {
    const need = needs.find((n) => n.id === needId);
    return need ? need.title : "Unknown Need";
  };

  return (
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ marginBottom: 16 }}>Your Needs</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN - Needs */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0 }}>Needs</h2>
            <button
              onClick={() => setOpen(true)}
              style={{ padding: "8px 12px", borderRadius: 6 }}
            >
              + Create New Need
            </button>
          </div>

          {clientNeeds.length === 0 && <p>No pending needs.</p>}

          {clientNeeds.map((need) => (
            <div
              key={need.id}
              style={{
                padding: 12,
                border: "1px solid #ccc",
                borderRadius: 6,
                marginBottom: 10,
                background: "#fff",
                color: "#000",
              }}
            >
              <h3 style={{ margin: "0 0 6px 0" }}>{need.title}</h3>
              <p style={{ margin: 0 }}>{need.description}</p>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN - Transaction History */}
        <div>
          <h2 style={{ marginTop: 0 }}>Transaction History</h2>

          {acceptedOffersForClient.length === 0 && <p>No transactions yet.</p>}

          {acceptedOffersForClient.map((offer) => (
            <div
              key={offer.id}
              style={{
                padding: 12,
                border: "1px solid #ccc",
                borderRadius: 6,
                marginBottom: 10,
                background: "#716767ff",
              }}
            >
              <h3 style={{ margin: "0 0 6px 0" }}>
                {getNeedTitle(offer.needId)}
              </h3>

              <p style={{ margin: "6px 0" }}>
                <strong>Supplier:</strong> {offer.supplier}
              </p>

              <p style={{ margin: "6px 0" }}>
                <strong>Offer:</strong> {offer.proposal}
              </p>

              <p style={{ margin: "6px 0" }}>
                <strong>Price:</strong> {offer.price} MAD
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* New Need Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <NewNeedForm onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
