import { useState } from "react";
import { useData } from "../../context/DataContext";

export default function AccountantRequests() {
  const { needs, offers, updateOfferStatus } = useData();

  // Filter: ALL or only PENDING
  const [filter, setFilter] = useState("ALL");

  return (
    <div style={{ padding: 40 }}>
      <h1>Client Requests</h1>

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
        <button
          onClick={() => setFilter("ALL")}
          style={{
            padding: "6px 14px",
            background: filter === "ALL" ? "#444" : "#ccc",
            color: filter === "ALL" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Show All
        </button>

        <button
          onClick={() => setFilter("PENDING")}
          style={{
            padding: "6px 14px",
            background: filter === "PENDING" ? "#444" : "#ccc",
            color: filter === "PENDING" ? "white" : "black",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Only Pending
        </button>
      </div>

      {needs.length === 0 && <p>No needs available.</p>}

      {needs.map((need) => {
        // Get all offers for this need
        let needOffers = offers.filter((o) => o.needId === need.id);

        // Apply filter
        if (filter === "PENDING") {
          needOffers = needOffers.filter((o) => o.status === "PENDING");
        }

        return (
          <div
            key={need.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              borderRadius: 6,
              marginBottom: 20,
            }}
          >
            <h2>{need.title}</h2>
            <p>{need.description}</p>
            <p>
              <strong>Client:</strong> {need.client}
            </p>

            <h3 style={{ marginTop: 20 }}>Offers:</h3>

            {needOffers.length === 0 && (
              <p style={{ fontStyle: "italic" }}>No offers found.</p>
            )}

            {needOffers.map((offer) => (
              <div
                key={offer.id}
                style={{
                  padding: 10,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  marginBottom: 10,
                  background:
                    offer.status === "ACCEPTED"
                      ? "#e5ffe5"
                      : offer.status === "REJECTED"
                      ? "#ffe5e5"
                      : "white",
                }}
              >
                <p>
                  <strong>Supplier:</strong> {offer.supplier}
                </p>
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

                {/* Buttons if pending */}
                {offer.status === "PENDING" ? (
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                      onClick={() => updateOfferStatus(offer.id, "ACCEPTED")}
                      style={{
                        padding: "6px 12px",
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateOfferStatus(offer.id, "REJECTED")}
                      style={{
                        padding: "6px 12px",
                        background: "#F44336",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <p style={{ marginTop: 10, fontStyle: "italic" }}>
                    Decision already made.
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
