// src/components/Topbar.jsx
export default function Topbar() {
  return (
    <div className="topbar">
      <div className="container topbar__wrap">
        <div className="topbar__left">
          <span className="chip">🚚 Miễn phí ship đơn từ 300K</span>
          <a href="#" className="link">
            Hệ thống nhà thuốc
          </a>
          <a href="#" className="link">
            Tra cứu đơn hàng
          </a>
        </div>
        <div className="topbar__right">
          <span>
            📞 Hotline: <strong>1800 6821</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
