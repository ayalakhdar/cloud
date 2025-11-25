import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ flex: 1, padding: 20 }}>
        {children}
      </div>
    </div>
  );
}
