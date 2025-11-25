import React, { useMemo } from "react";
import { useData } from "../../context/DataContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AccountantDashboard() {
  const { needs = [], offers = [] } = useData();

  // Total counts
  const totals = useMemo(() => {
    const totalNeeds = needs.length;
    const totalOffers = offers.length;

    const statusCounts = { ACCEPTED: 0, REJECTED: 0, PENDING: 0 };
    offers.forEach((o) => {
      const s = o.status || "PENDING";
      if (!statusCounts[s]) statusCounts[s] = 0;
      statusCounts[s]++;
    });

    return { totalNeeds, totalOffers, statusCounts };
  }, [needs, offers]);

  // Needs by client (bar chart)
  const needsByClient = useMemo(() => {
    const map = {};
    needs.forEach((n) => {
      const client = n.client || "Unknown";
      map[client] = (map[client] || 0) + 1;
    });
    return Object.entries(map).map(([client, count]) => ({ client, count }));
  }, [needs]);

  // Offers by supplier (bar chart)
  const offersBySupplier = useMemo(() => {
    const map = {};
    offers.forEach((o) => {
      const sup = o.supplier || "Unknown";
      map[sup] = (map[sup] || 0) + 1;
    });
    return Object.entries(map).map(([supplier, count]) => ({ supplier, count }));
  }, [offers]);

  // Offer status distribution (pie chart)
  const offersStatusData = useMemo(() => {
    const map = {};
    offers.forEach((o) => {
      const s = o.status || "PENDING";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [offers]);

  // Stacked data: statuses per supplier
  const stackedBySupplier = useMemo(() => {
    const map = {};
    offers.forEach((o) => {
      const sup = o.supplier || "Unknown";
      if (!map[sup]) map[sup] = { supplier: sup, ACCEPTED: 0, REJECTED: 0, PENDING: 0 };
      const s = o.status || "PENDING";
      map[sup][s] = (map[sup][s] || 0) + 1;
    });
    return Object.values(map);
  }, [offers]);

  const COLORS = ["#4CAF50", "#F44336", "#FFC107", "#8884d8", "#82ca9d"];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Accountant — Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl shadow bg-white">
          <div className="text-sm text-gray-500">Total Needs</div>
          <div className="text-3xl font-semibold">{totals.totalNeeds}</div>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <div className="text-sm text-gray-500">Total Offers</div>
          <div className="text-3xl font-semibold">{totals.totalOffers}</div>
        </div>
        <div className="p-4 rounded-xl shadow bg-white">
          <div className="text-sm text-gray-500">Offers by Status</div>
          <div className="text-2xl font-semibold">
            Accepted: {totals.statusCounts.ACCEPTED || 0} — Rejected: {totals.statusCounts.REJECTED || 0} — Pending: {totals.statusCounts.PENDING || 0}
          </div>
        </div>
      </div>

      {/* Row: needs by client + offer status pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-4 rounded-xl shadow bg-white">
          <h3 className="font-semibold mb-2">Needs by Client</h3>
          {needsByClient.length === 0 ? (
            <p className="italic">No needs to display.</p>
          ) : (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={needsByClient} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="client" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Needs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl shadow bg-white">
          <h3 className="font-semibold mb-2">Offers — Status Distribution</h3>
          {offers.length === 0 ? (
            <p className="italic">No offers to display.</p>
          ) : (
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={offersStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {offersStatusData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Offers by supplier (bar) + stacked statuses per supplier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl shadow bg-white">
          <h3 className="font-semibold mb-2">Offers by Supplier</h3>
          {offersBySupplier.length === 0 ? (
            <p className="italic">No offers to display.</p>
          ) : (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={offersBySupplier} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="supplier" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Offers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl shadow bg-white">
          <h3 className="font-semibold mb-2">Statuses per Supplier (stacked)</h3>
          {stackedBySupplier.length === 0 ? (
            <p className="italic">No offers to display.</p>
          ) : (
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedBySupplier} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="supplier" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ACCEPTED" stackId="a" name="Accepted" />
                  <Bar dataKey="REJECTED" stackId="a" name="Rejected" />
                  <Bar dataKey="PENDING" stackId="a" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        Tip: click legend entries to toggle series visibility. Charts are responsive.
      </div>
    </div>
  );
}
