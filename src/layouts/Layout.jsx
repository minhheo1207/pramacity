// src/layouts/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
// Nếu bạn chưa có Footer, có thể comment dòng dưới
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
