// src/components/Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header__wrap">
        <Link to="/" className="logo">
          Pharma<span>City</span>
        </Link>

        <div
          className="menu-trigger"
          tabIndex={0}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          <button className="btn btn--ghost">☰ Danh mục</button>
          {open && (
            <div className="dropdown">
              <Link to="/ban-chay">Bán chạy</Link>
              <Link to="/hang-moi">Hàng mới</Link>
              <Link to="/khuyen-mai">Khuyến mãi</Link>
              <Link to="/dich-vu">Dịch vụ</Link>
              <Link to="/bai-viet">Bài viết</Link>
            </div>
          )}
        </div>

        <form className="search" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Bạn đang tìm gì hôm nay..." />
          <button className="btn">Tìm</button>
        </form>

        <nav className="quick-nav">
          <Link to="/bai-viet" className="quick-link">
            📰 Bài viết
          </Link>
          <Link to="/khuyen-mai" className="quick-link">
            🔥 KM
          </Link>
          <Link to="#" className="quick-link">
            👤
          </Link>
          <Link to="#" className="quick-link">
            🛒 <span className="badge">0</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
