import { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function OfferForm({ need, onClose }) {
  const { addOffer } = useData();
  const { user } = useAuth();

  const [proposal, setProposal] = useState("");
  const [price, setPrice] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    const offer = {
      id: Date.now(),
      needId: need.id,
      supplier: user.username,
      proposal,
      price,
      status: "PENDING",
    };

    addOffer(offer);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <h2>Submit Offer</h2>

      <p>
        <strong>Need:</strong> {need.title}
      </p>

      <textarea
        placeholder="Your proposal"
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        required
        style={{ padding: 8, height: 100 }}
      />

      <input placeholder="price (MAD)" value={price} onChange={(e)=>setPrice(e.target.value)} type="number"></input>

      <button type="submit" style={{ padding: 10 }}>
        Submit
      </button>

      <button type="button" onClick={onClose} style={{ padding: 10 }}>
        Cancel
      </button>
    </form>
  );
}
