// src/pages/NewProductDetail.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PageBar from "../components/PageBar";
import Frame from "../components/Frame";
import { getNewProductById, getRelatedNewProducts } from "../data/newProducts";
import { addToCart } from "../services/products";
import "../assets/css/new-product-detail.css";

const withBase = (p) =>
  `${import.meta.env.BASE_URL}${p.startsWith("/") ? p.slice(1) : p}`;

export default function NewProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const product = useMemo(() => getNewProductById(id), [id]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");

  useEffect(() => window.scrollTo(0, 0), [id]);

  if (!product) {
    return (
      <main className="lc container">
        <PageBar
          title="Không tìm thấy sản phẩm"
          subtitle="Sản phẩm có thể đã bị xoá hoặc tạm ẩn"
          right={
            <button className="btn btn--ghost" onClick={() => nav(-1)}>
              ← Quay lại
            </button>
          }
        />
      </main>
    );
  }

  const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
  const stars = (r) =>
    "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
  const related = getRelatedNewProducts(product, 8);

  return (
    <main className="lc np-detail">
      <PageBar
        title={product.name}
        subtitle={`${product.brand} • ${product.cat}`}
        right={
          <Link className="btn btn--ghost" to="/hang-moi">
            ← Danh sách
          </Link>
        }
      />

      <div className="container pd-wrap">
        {/* Gallery */}
        <section className="pd-main">
          <div className="pd-gallery">
            <div className="pd-cover">
              <picture>
                <source
                  srcSet={withBase(
                    product.img.replace(/\.(png|jpg|jpeg)$/i, ".webp")
                  )}
                  type="image/webp"
                />
                <img
                  src={withBase(product.img)}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = "/img/placeholder.jpg";
                  }}
                />
              </picture>
              {product.sale && (
                <span className="badge-sale">{product.sale}</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-meta">
              <span className="stars">{stars(product.rating)}</span>
              <span className="dot">•</span>
              <span>{product.sold.toLocaleString()} đã bán</span>
              <span className="dot">•</span>
              <span className="pill">{product.brand}</span>
              <span className="pill">{product.cat}</span>
            </div>

            <div className="pd-price">
              {product.old && (
                <span className="price--old">{fmt(product.old)}</span>
              )}
              <span className="price">{fmt(product.price)}</span>
            </div>

            <div className="pd-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                –
              </button>
              <input
                type="number"
                value={qty}
                min={1}
                onChange={(e) =>
                  setQty(Math.max(1, Number(e.target.value || 1)))
                }
              />
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>

            <div className="pd-actions">
              <button className="btn" onClick={() => addToCart(product, qty)}>
                Thêm vào giỏ
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => {
                  addToCart(product, qty);
                  nav("/cart");
                }}
              >
                Mua ngay
              </button>
            </div>

            <ul className="pd-bullets">
              <li>
                <i className="ri-shield-check-line"></i> Hàng chính hãng, đổi
                trả 7 ngày
              </li>
              <li>
                <i className="ri-truck-line"></i> Giao nhanh trong 2 giờ nội
                thành
              </li>
              <li>
                <i className="ri-customer-service-2-line"></i> Tư vấn dược sĩ
                24/7
              </li>
            </ul>
          </div>
        </section>

        {/* Tabs */}
        <section className="pd-tabs">
          <nav className="tabs">
            <button
              className={tab === "desc" ? "active" : ""}
              onClick={() => setTab("desc")}
            >
              Mô tả
            </button>
            <button
              className={tab === "spec" ? "active" : ""}
              onClick={() => setTab("spec")}
            >
              Thành phần & thông tin
            </button>
            <button
              className={tab === "review" ? "active" : ""}
              onClick={() => setTab("review")}
            >
              Đánh giá (demo)
            </button>
          </nav>

          <div className="tab-body">
            {tab === "desc" && (
              <Frame title="Mô tả">
                <p>{product.desc}</p>
                <p>
                  Lưu ý: Không dùng cho người mẫn cảm với bất kỳ thành phần nào.
                </p>
              </Frame>
            )}
            {tab === "spec" && (
              <Frame title="Thành phần & thông tin">
                <ul className="spec">
                  <li>
                    Thương hiệu: <b>{product.brand}</b>
                  </li>
                  <li>
                    Danh mục: <b>{product.cat}</b>
                  </li>
                  <li>Xuất xứ: Việt Nam</li>
                  <li>Hạn dùng: 24 tháng</li>
                  <li>Bảo quản: Nơi khô ráo, dưới 30°C</li>
                </ul>
              </Frame>
            )}
            {tab === "review" && (
              <Frame title="Đánh giá (demo)">
                <p>⭐️⭐️⭐️⭐️☆ — “Sản phẩm tốt, giao nhanh!”</p>
                <p>⭐️⭐️⭐️⭐️⭐️ — “Dùng hợp, sẽ mua lại.”</p>
                <p className="muted">* Dữ liệu minh hoạ.</p>
              </Frame>
            )}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="pd-related">
            <Frame title="Sản phẩm liên quan">
              <div className="grid grid--product">
                {related.map((p) => (
                  <article className="card product" key={p.id}>
                    <div className="card__media">
                      <img src={withBase(p.img)} alt={p.name} />
                      {p.sale && <span className="badge-sale">{p.sale}</span>}
                    </div>
                    <div className="card__body">
                      <h3 className="card__title">
                        <Link to={`/hang-moi/${p.id}`}>{p.name}</Link>
                      </h3>
                      <div className="price-row">
                        {p.old && (
                          <span className="price--old">{fmt(p.old)}</span>
                        )}
                        <span className="price">{fmt(p.price)}</span>
                      </div>
                      <div className="row">
                        <Link
                          className="btn btn--ghost"
                          to={`/hang-moi/${p.id}`}
                        >
                          Xem chi tiết
                        </Link>
                        <button className="btn" onClick={() => addToCart(p, 1)}>
                          Thêm giỏ
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Frame>
          </section>
        )}
      </div>
    </main>
  );
}
