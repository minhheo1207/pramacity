// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "../layouts/Layout"; // đúng path: src/layouts/Layout.jsx
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Account from "../pages/Account";
import BaiViet from "../pages/BaiViet";
import BanChay from "../pages/BanChay";
import HangMoi from "../pages/HangMoi";
import DichVu from "../pages/DichVu";
import KhuyenMai from "../pages/KhuyenMai";
import ProductDetail from "../pages/ProductDetail";
import BaiVietDetail from "../pages/BaiVietDetail";
import NewProductDetail from "../pages/NewProductDetail";
import DatLich from "../pages/DatLich";
import Booking from "../pages/Booking";
import Thuoc from "../pages/Thuoc";
import GioHang from "../pages/GioHang";
import AdminDashboard from "../pages/AdminDashboard";
import EmployeeChat from "../pages/EmployeeChat";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tất cả route con render bên trong Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* Auth / Account */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          {/* Trang danh mục */}
          <Route path="/bai-viet" element={<BaiViet />} />
          <Route path="/ban-chay" element={<BanChay />} />
          <Route path="/hang-moi" element={<HangMoi />} />
          <Route path="/dich-vu" element={<DichVu />} />
          <Route path="/khuyen-mai" element={<KhuyenMai />} />

          {/* Chi tiết */}
          <Route path="/san-pham/:id" element={<ProductDetail />} />
          <Route path="/bai-viet/:id" element={<BaiVietDetail />} />
          <Route path="/hang-moi/:id" element={<NewProductDetail />} />
          <Route path="/dat-lich" element={<DatLich />} />
          <Route path="/dat-lich" element={<Booking />} />
          <Route path="/thuoc" element={<Thuoc />} />
          <Route path="/gio-hang" element={<GioHang />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Admin & Employee routes - không dùng Layout chung */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee/chat" element={<EmployeeChat />} />
      </Routes>
    </BrowserRouter>
  );
}
