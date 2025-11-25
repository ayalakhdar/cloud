import { useState, useMemo } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import OfferForm from "../../components/OfferForm";

export default function SupplierNeeds() {
  const { needs, offers } = useData();
  const { user } = useAuth();

  const [selectedNeed, setSelectedNeed] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // only OPEN needs for suppliers to apply
  const openNeedsAll = needs.filter((n) => n.status === "OPEN");

  // simple search / filter by title or description
  const openNeeds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return openNeedsAll;
    return openNeedsAll.filter(
      (n) =>
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.description && n.description.toLowerCase().includes(q))
    );
  }, [openNeedsAll, query]);

  const myOffers = offers.filter((o) => o.supplier === user.username);

  const hasAlreadyApplied = (needId) => {
    return myOffers.some((o) => o.needId === needId);
  };

  const handleApply = (need) => {
    setSelectedNeed(need);
    setOpen(true);
  };

  const getNeedTitle = (needId) => {
    const n = needs.find((x) => x.id === needId);
    return n ? n.title : "Unknown Need";
  };

  return (
    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" }}>
      <h1 style={{ marginBottom: 12 }}>Open Needs</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px", // left flexible, right sidebar fixed
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* LEFT: Open needs + search */}
        <div>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search needs by title or description..."
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #444",
                background: "#1b1b1b",
                color: "white",
              }}
            />
            <button
              onClick={() => {
                setQuery("");
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
              }}
            >
              Clear
            </button>
          </div>

          {openNeeds.length === 0 ? (
            <p>No open needs matching your search.</p>
          ) : (
            openNeeds.map((need) => (
              <div
                key={need.id}
                style={{
                  border: "1px solid #333",
                  padding: 14,
                  borderRadius: 8,
                  marginBottom: 12,
                  background: "#121212",
                  color: "white",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>{need.title}</h3>
                    <p style={{ margin: "0 0 8px 0", color: "#cfcfcf" }}>
                      {need.description}
                    </p>
                    <small style={{ color: "#999" }}>Client: {need.client}</small>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 12 }}>
                    {hasAlreadyApplied(need.id) ? (
                      <button
                        disabled
                        style={{
                          padding: "8px 12px",
                          background: "#777",
                          color: "white",
                          borderRadius: 8,
                          cursor: "not-allowed",
                          border: "none",
                        }}
                      >
                        Already Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(need)}
                        style={{
                          padding: "8px 12px",
                          background: "#646cff",
                          color: "white",
                          borderRadius: 8,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Apply
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedNeed(need);
                        // open a detail modal below if desired
                        setOpen(true);
                      }}
                      style={{
                        padding: "6px 10px",
                        background: "transparent",
                        border: "1px solid #333",
                        color: "#ddd",
                        borderRadius: 8,
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Sidebar - My Applications + Selected Need Preview */}
        <aside style={{ position: "relative" }}>
          <div
            style={{
              padding: 12,
              border: "1px solid #333",
              borderRadius: 8,
              background: "#151515",
              color: "white",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: "0 0 8px 0" }}>My Applications</h2>
            {myOffers.length === 0 ? (
              <p style={{ color: "#bbb" }}>You haven't applied to any needs yet.</p>
            ) : (
              myOffers.map((o) => (
                <div
                  key={o.id}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #222",
                    marginBottom: 8,
                    background: "#0f0f0f",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>{getNeedTitle(o.needId)}</div>
                  <div style={{ fontSize: 13, color: "#bdbdbd" }}>{o.proposal}</div>
                  <div style={{ marginTop: 6, fontSize: 13 }}>
                    <strong>Price:</strong> {o.price} MAD
                  </div>
                  <div style={{ fontSize: 12, color: "#9a9a9a" }}>
                    Status: {o.status}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selected need preview */}
          <div
            style={{
              padding: 12,
              border: "1px solid #333",
              borderRadius: 8,
              background: "#141414",
              color: "white",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Selected Need</h3>
            {!selectedNeed ? (
              <p style={{ color: "#6b6161ff" }}>Select a need to see details or apply.</p>
            ) : (
              <>
                <h4 style={{ margin: "6px 0" }}>{selectedNeed.title}</h4>
                <p style={{ margin: "6px 0", color: "#ddd" }}>{selectedNeed.description}</p>
                <p style={{ margin: "6px 0", color: "#ccc" }}>
                  Client: {selectedNeed.client}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {hasAlreadyApplied(selectedNeed.id) ? (
                    <button disabled style={{ padding: 8, borderRadius: 8, background: "#777", color: "#fff", border: "none" }}>
                      Already Applied
                    </button>
                  ) : (
                    <button onClick={() => handleApply(selectedNeed)} style={{ padding: 8, borderRadius: 8, background: "#646cff", color: "#fff", border: "none" }}>
                      Apply Now
                    </button>
                  )}
                  <button onClick={() => { setSelectedNeed(null); setOpen(false); }} style={{ padding: 8, borderRadius: 8, border: "1px solid #333", background: "transparent", color: "#ddd" }}>
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Modal for offer submission */}
      <Modal open={open} onClose={() => setOpen(false)}>
        {selectedNeed && <OfferForm need={selectedNeed} onClose={() => { setOpen(false); setSelectedNeed(null); }} />}
      </Modal>

      {/* responsive small-screen hint: stacks automatically due to CSS grid */}
    </div>
  );
}
