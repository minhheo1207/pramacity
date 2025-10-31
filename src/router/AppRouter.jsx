// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* các trang khác sẽ thêm ở đây */}
      </Routes>
    </BrowserRouter>
  );
}
