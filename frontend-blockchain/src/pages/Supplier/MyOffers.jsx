import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export default function MyOffers() {
  const { offers, needs } = useData();
  const { user } = useAuth();

  const myOffers = offers.filter((o) => o.supplier === user.username);

  const getNeedTitle = (needId) => {
    const need = needs.find((n) => n.id === needId);
    return need ? need.title : "Unknown Need";
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>My Offers</h1>

      {myOffers.length === 0 && <p>You have not submitted any offers yet.</p>}

      {myOffers.map((offer) => (
        <div
          key={offer.id}
          style={{
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            background:
              offer.status === "ACCEPTED"
                ? "#e7ffe7"
                : offer.status === "REJECTED"
                ? "#ffe7e7"
                : "#f8f8f8",
          }}
        >
          <h3>{getNeedTitle(offer.needId)}</h3>

          <p>
            <strong>Proposal: </strong>
            {offer.proposal}
          </p>

          <p>
            <strong>Price: </strong>
            {offer.price} MAD
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
      ))}
    </div>
  );
}
