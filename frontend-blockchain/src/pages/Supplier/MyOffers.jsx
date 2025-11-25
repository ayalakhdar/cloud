import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export default function MyOffers() {
  const { offers, needs } = useData();
  const { user } = useAuth();

  const myOffers = offers.filter((o) => o.supplier === user.username);

  const pending = myOffers.filter((o) => o.status === "PENDING");
  const accepted = myOffers.filter((o) => o.status === "ACCEPTED");
  const rejected = myOffers.filter((o) => o.status === "REJECTED");

  const getNeedTitle = (needId) => {
    const need = needs.find((n) => n.id === needId);
    return need ? need.title : "Unknown Need";
  };

  const renderOfferCard = (offer) => (
    <div
      key={offer.id}
      style={{
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        border: "1px solid #ccc",
        background:
          offer.status === "ACCEPTED"
            ? "#83eb98ff"
            : offer.status === "REJECTED"
            ? "#ef1e1eff"
            : "#65a3bdff",
      }}
    >
      <h3>{getNeedTitle(offer.needId)}</h3>

      <p>
        <strong>Proposal:</strong> {offer.proposal}
      </p>

      <p>
        <strong>Price:</strong> {offer.price} MAD
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            color:
              offer.status === "ACCEPTED"
                ? "green"
                : offer.status === "REJECTED"
                ? "red"
                : "black",
            fontWeight: "bold",
          }}
        >
          {offer.status}
        </span>
      </p>
    </div>
  );

  return (
    <div style={{ padding: 40 }}>
      <h1>My Offers</h1>

      {myOffers.length === 0 && <p>You have not submitted any offers yet.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginTop: 10,
        }}
      >
        {/* Pending Column */}
        <div>
          <h2>Pending Offers</h2>
          {pending.length === 0 && <p>No pending offers.</p>}
          {pending.map(renderOfferCard)}
        </div>

        {/* Accepted Column */}
        <div>
          <h2>Transactions</h2>
          {accepted.length === 0 && <p>No accepted offers.</p>}
          {accepted.map(renderOfferCard)}
        </div>

        {/* Rejected Column */}
        <div>
          <h2>Rejected</h2>
          {rejected.length === 0 && <p>No rejected offers.</p>}
          {rejected.map(renderOfferCard)}
        </div>
      </div>
    </div>
  );
}
