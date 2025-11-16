// src/pages/ProductDetail.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import PageBar from "../components/PageBar";
import {
  getProductById,
  getRelatedProducts,
  addToCart,
} from "../services/products";
import "../assets/css/product-detail.css";

const vnd = (n) => n.toLocaleString("vi-VN") + "đ";

// Toast mini
function toast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  t.className = "toast-item";
  t.textContent = msg;
  wrap.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 250);
  }, 2200);
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = getProductById(id);
  if (!product) {
    return (
      <main className="pd">
        <PageBar title="Sản phẩm không tồn tại" />
        <div className="container pd-empty">
          Không tìm thấy sản phẩm. Có thể sản phẩm đã được cập nhật lại.
        </div>
      </main>
    );
  }

  const related = getRelatedProducts(product, 3);

  const handleAdd = (p = product) => {
    try {
      addToCart(p, 1);
      toast(`Đã thêm "${p.name}" vào giỏ`);
    } catch (err) {
      // Error đã được xử lý trong addToCart (hiển thị toast và mở modal)
    }
  };

  const saleText = product.sale || "";

  return (
    <main className="pd">
      <PageBar title="Chi tiết sản phẩm" />

      {/* CARD 2 CỘT */}
      <div className="container pd-layout">
        {/* CỘT ẢNH */}
        <div>
          <div className="pd-media-main">
            {saleText && <span className="pd-sale-badge">{saleText}</span>}
            <img src={product.img} alt={product.name} />
          </div>

          {/* thumbnails – tạm dùng lại ảnh chính */}
          <div className="pd-thumbs">
            {[1, 2, 3, 4].map((i) => (
              <button className="pd-thumb" key={i} type="button">
                <img src={product.img} alt={product.name} />
              </button>
            ))}
          </div>

          <div className="pd-meta-small">
            <span>
              <i className="ri-shield-check-line" /> Hàng chính hãng
            </span>
            <span>
              <i className="ri-truck-line" /> Giao nhanh trong ngày
            </span>
            <span>
              <i className="ri-24-hours-line" /> Tư vấn dược sĩ 24/7
            </span>
          </div>
        </div>

        {/* CỘT THÔNG TIN */}
        <div className="pd-info">
          <nav className="pd-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>{product.cat}</span>
          </nav>

          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-rating-row">
            <span className="pd-rating">
              <i className="ri-star-fill" /> {product.rating.toFixed(1)}
            </span>
            <span className="pd-dot" />
            <span>
              Đã bán{" "}
              <b>{product.sold ? product.sold.toLocaleString("vi-VN") : 0}</b>{" "}
              sản phẩm
            </span>
          </div>

          <div className="pd-brand-row">
            <span>
              Thương hiệu: <b>{product.brand || "Đang cập nhật"}</b>
            </span>
            <span>Danh mục: {product.cat}</span>
          </div>

          {/* GIÁ */}
          <div className="pd-price-box">
            <div>
              <div className="pd-price-main">{vnd(product.price)}</div>
              {product.old && (
                <div className="pd-price-old">
                  Giá niêm yết:
                  <s>{vnd(product.old)}</s>
                </div>
              )}
            </div>
            {saleText && <span className="pd-price-tag">{saleText}</span>}
          </div>

          {/* NÚT */}
          <div className="pd-actions">
            <button
              type="button"
              className="btn btn-main"
              onClick={() => handleAdd()}
            >
              Chọn mua
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
            >
              ← Quay lại
            </button>
          </div>

          {/* MÔ TẢ */}
          <div className="pd-section">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.desc}</p>
          </div>

          <div className="pd-section pd-note">
            <h4>Lưu ý sử dụng</h4>
            <ul>
              <li>Đọc kỹ hướng dẫn sử dụng trước khi dùng.</li>
              <li>
                Nếu đang mang thai, cho con bú hoặc có bệnh nền, hãy hỏi ý kiến
                bác sĩ/dược sĩ.
              </li>
              <li>
                Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp, để xa tầm tay
                trẻ em.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SẢN PHẨM LIÊN QUAN */}
      {related.length > 0 && (
        <section className="pd-related">
          <h3 className="pd-related-title">Sản phẩm liên quan</h3>
          <div className="pd-related-grid">
            {related.map((p) => (
              <article key={p.id} className="pd-rel-card">
                <Link to={`/san-pham/${p.id}`} className="pd-rel-thumb">
                  <img src={p.img} alt={p.name} />
                  {p.sale && <span className="pd-rel-sale">{p.sale}</span>}
                </Link>
                <div className="pd-rel-body">
                  <h4 className="pd-rel-name" title={p.name}>
                    {p.name}
                  </h4>
                  <div className="pd-rel-price">
                    <span>{vnd(p.price)}</span>
                    {p.old && <s>{vnd(p.old)}</s>}
                  </div>
                  <button
                    type="button"
                    className="btn btn-rel"
                    onClick={() => handleAdd(p)}
                  >
                    Thêm giỏ
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
