// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="logo logo--footer">
              Pharma<span>City</span>
            </div>
            <p className="muted">Sức khoẻ cho mọi nhà. Tư vấn dược sĩ 24/7.</p>
          </div>
          <div>
            <h4>Hỗ trợ</h4>
            <a className="link" href="#">
              Chính sách đổi trả
            </a>
            <br />
            <a className="link" href="#">
              Chính sách giao hàng
            </a>
            <br />
            <a className="link" href="#">
              Hỏi đáp
            </a>
          </div>
          <div>
            <h4>Kết nối</h4>
            <p className="muted">Hotline: 1800 6821</p>
            <p className="muted">Email: support@pharma.demo</p>
          </div>
        </div>
        <p className="footnote">© 2025 PharmaCity demo. All rights reserved.</p>
      </div>
    </footer>
  );
}
