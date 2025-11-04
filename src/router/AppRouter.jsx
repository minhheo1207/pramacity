// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Account from "../pages/Account";

// ✅ Import thêm 6 trang mới
import BaiViet from "../pages/BaiViet";
import BanChay from "../pages/BanChay";
import HangMoi from "../pages/HangMoi";
import DichVu from "../pages/DichVu";
import KhuyenMai from "../pages/KhuyenMai";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />

        {/* ✅ Thêm các route mới cho thanh menu */}
        <Route path="/bai-viet" element={<BaiViet />} />
        <Route path="/ban-chay" element={<BanChay />} />
        <Route path="/hang-moi" element={<HangMoi />} />
        <Route path="/dich-vu" element={<DichVu />} />
        <Route path="/khuyen-mai" element={<KhuyenMai />} />
      </Routes>
    </BrowserRouter>
  );
}
