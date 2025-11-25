import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  // Ensemble des besoins (créés par CLIENT)
  const [needs, setNeeds] = useState([]);

  // Ensemble des offres (créées par SUPPLIER)
  const [offers, setOffers] = useState([]);

  // Ajout d'un besoin
  const addNeed = (need) => {
    setNeeds((prev) => [...prev, need]);
  };

  const updateNeedStatus = (needId, status) => {
    setNeeds((prev) =>
        prev.map((n) =>
        n.id === needId ? { ...n, status } : n
        )
    );
    };

  // Ajout d'une offre
  const addOffer = (offer) => {
    setOffers((prev) => [...prev, offer]);
  };

  // Comptable — Accepter ou Rejeter une offre
    const updateOfferStatus = (offerId, status) => {
    setOffers((prevOffers) => {
        const newOffers = prevOffers.map((o) => {
        if (o.id === offerId) {
            return { ...o, status };
        }
        return o;
        });

        // When accepting: reject all other offers for that need
        if (status === "ACCEPTED") {
        const accepted = prevOffers.find((o) => o.id === offerId);

        const updatedOffers = newOffers.map((o) => {
            if (o.needId === accepted.needId && o.id !== accepted.id) {
            return { ...o, status: "REJECTED" };
            }
            return o;
        });

        // Update need status
        updateNeedStatus(accepted.needId, "ACCEPTED");

        return updatedOffers;
        }

        return newOffers;
    });
    };


  return (
    <DataContext.Provider
      value={{
        needs,
        offers,
        addNeed,
        addOffer,
        updateOfferStatus,
        updateNeedStatus
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
