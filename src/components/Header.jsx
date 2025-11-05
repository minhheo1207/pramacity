// src/components/Header.jsx
import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

import { useAuth } from "../utils/AuthContext";
import AuthModal from "./AuthModal";

const CART_KEY = "demo_cart";

export default function Header() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [openUser, setOpenUser] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);

  // ========== CART BADGE ==========
  const [cartQty, setCartQty] = useState(0);
  useEffect(() => {
    // đọc lần đầu
    syncCartQty();
    // lắng nghe sự kiện cập nhật từ các trang (BanChay, v.v.)
    const onUpdate = (e) => setCartQty(e.detail?.qty ?? 0);
    document.addEventListener("CART_UPDATED", onUpdate);
    // nếu mở nhiều tab, đồng bộ qua storage
    const onStorage = (e) => {
      if (e.key === CART_KEY) syncCartQty();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      document.removeEventListener("CART_UPDATED", onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }
  function syncCartQty() {
    const qty = readCart().reduce((s, it) => s + (it.qty || 0), 0);
    setCartQty(qty);
  }
  // =================================

  // đóng menu user khi click ra ngoài
  const userWrapRef = useRef(null);
  useEffect(() => {
    if (!openUser) return;
    const onDown = (e) => {
      if (userWrapRef.current && !userWrapRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openUser]);

  function onSearch(e) {
    e.preventDefault();
    console.log("SEARCH:", q);
  }

  return (
    <header className="lc-header">
      {/* Topline */}
      <div className="lc-topline">
        <div className="container lc-topline__wrap">
          <div className="tl-left">
            <i className="ri-search-line"></i>
            <a href="#" className="underline">
              Tìm hiểu ngay
            </a>
          </div>
          <div className="tl-right">
            <i className="ri-smartphone-line"></i>
            <span>Tải ứng dụng</span>
            <i className="ri-customer-service-2-line"></i>
            <span>
              Tư vấn ngay: <b>1800 6821</b>
            </span>
          </div>
        </div>
      </div>

      {/* Dải gradient chính */}
      <div className="lc-bar">
        <div className="container lc-bar__wrap">
          {/* Logo */}
          <Link to="/" className="lc-logo">
            <span className="lc-logo__brand">Pharma</span>
            <span className="lc-logo__city">City</span>
          </Link>

          {/* Tìm kiếm */}
          <form className="lc-search" onSubmit={onSearch}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm tên thuốc, bệnh lý, TPCN…"
            />
            <button type="button" className="icon-btn" title="Nói">
              <i className="ri-mic-line"></i>
            </button>
            <button type="button" className="icon-btn" title="Quét">
              <i className="ri-scan-line"></i>
            </button>
            <button className="lc-search__btn" type="submit">
              Tìm
            </button>
          </form>

          {/* Tài khoản + Giỏ hàng */}
          <div className="lc-quick">
            {!user ? (
              <button
                type="button"
                className="lc-account"
                onClick={() => setOpenAuth(true)}
              >
                <i className="ri-user-line"></i> <span>Đăng nhập</span>
              </button>
            ) : (
              <div
                className="lc-account user"
                ref={userWrapRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenUser((v) => !v);
                }}
              >
                <div className="avatar">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="name">{user.name}</span>
                <i className="ri-arrow-down-s-line"></i>

                {openUser && (
                  <div
                    className="lc-user-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link to="/account" onClick={() => setOpenUser(false)}>
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to="/account?tab=orders"
                      onClick={() => setOpenUser(false)}
                    >
                      Đơn hàng
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenUser(false);
                        logout();
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link to="/cart" className="lc-cart" aria-label="Giỏ hàng">
              <i className="ri-shopping-cart-2-line"></i>
              <span className="badge">{cartQty}</span>
              <span className="text">Giỏ hàng</span>
            </Link>
          </div>
        </div>

        {/* Tag danh mục nhanh */}
        <div className="container lc-tags">
          <NavLink
            to="/bai-viet"
            className={({ isActive }) => "tag" + (isActive ? " active" : "")}
          >
            Bài viết
          </NavLink>
          <NavLink
            to="/ban-chay"
            className={({ isActive }) => "tag" + (isActive ? " active" : "")}
          >
            Bán chạy
          </NavLink>
          <NavLink
            to="/hang-moi"
            className={({ isActive }) => "tag" + (isActive ? " active" : "")}
          >
            Hàng mới
          </NavLink>
          <NavLink
            to="/dich-vu"
            className={({ isActive }) => "tag" + (isActive ? " active" : "")}
          >
            Dịch vụ
          </NavLink>
          <NavLink
            to="/khuyen-mai"
            className={({ isActive }) => "tag" + (isActive ? " active" : "")}
          >
            Khuyến mãi
          </NavLink>
          <NavLink
            to="/thuoc"
            className={({ isActive }) => "tag" + (isActive ? " active" : "")}
          >
            Thuốc
          </NavLink>
        </div>
      </div>

      {/* Modal đăng nhập/đăng ký */}
      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </header>
  );
}
