// src/pages/HangMoi.jsx
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageBar from "../components/PageBar";
import { addToCart } from "../services/products";
import "../assets/css/hangmoi.css";

const NEW_PRODUCTS = [
  {
    id: "p-01",
    name: "Vitamin C 1000mg Nature’s Way",
    price: 195000,
    oldPrice: 230000,
    cover: "/hangmoi/vitaminC.png",
    badge: "new",
    brand: "Nature’s Way",
    rating: 4.7,
    sold: 3100,
    category: "health",
  },
  {
    id: "p-02",
    name: "Kem chống nắng La Roche-Posay SPF50+",
    price: 420000,
    oldPrice: 480000,
    cover: "/hangmoi/kemchongnang.png",
    badge: "hot",
    brand: "La Roche-Posay",
    rating: 4.9,
    sold: 5200,
    category: "skin",
  },
  {
    id: "p-03",
    name: "Probiotic Enterogermina 5ml x 10 ống",
    price: 145000,
    cover: "/hangmoi/ProbioticEnterogermina.png",
    badge: "new",
    brand: "Enterogermina",
    rating: 4.6,
    sold: 2100,
    category: "health",
  },
  {
    id: "p-04",
    name: "Viên uống bổ não Ginkgo Biloba 120mg",
    price: 185000,
    oldPrice: 210000,
    cover: "/hangmoi/bonao.png",
    brand: "Herbal Lab",
    rating: 4.5,
    sold: 1750,
    category: "health",
  },
  {
    id: "p-05",
    name: "Siro ho Prospan Kid 100ml",
    price: 99000,
    cover: "/hangmoi/siro.png",
    brand: "Prospan",
    rating: 4.8,
    sold: 4320,
    category: "kids",
  },
  {
    id: "p-06",
    name: "Collagen nước DHC 50ml x 10 chai",
    price: 375000,
    oldPrice: 420000,
    cover: "/hangmoi/Collagen.png",
    badge: "new",
    brand: "DHC",
    rating: 4.8,
    sold: 2890,
    category: "skin",
  },
  {
    id: "p-07",
    name: "Sữa rửa mặt Cerave Foaming Cleanser 236ml",
    price: 285000,
    cover: "/hangmoi/suaruamat.png",
    badge: "hot",
    brand: "CeraVe",
    rating: 4.9,
    sold: 6120,
    category: "skin",
  },
  {
    id: "p-08",
    name: "Omega-3 Fish Oil 1000mg",
    price: 210000,
    oldPrice: 245000,
    cover: "/hangmoi/Omega3.png",
    brand: "Healthy Care",
    rating: 4.6,
    sold: 3310,
    category: "health",
  },
  {
    id: "p-09",
    name: "Sữa bột Optimum Gold 4 cho bé 2–6 tuổi 850g",
    price: 495000,
    cover: "/hangmoi/suaobot.png",
    badge: "new",
    brand: "Vinamilk",
    rating: 4.7,
    sold: 1980,
    category: "kids",
  },
  {
    id: "p-10",
    name: "Khẩu trang y tế 4 lớp kháng khuẩn hộp 50 cái",
    price: 39000,
    cover: "/hangmoi/khautrang.png",
    brand: "ProCare",
    rating: 4.5,
    sold: 8450,
    category: "health",
  },
];

const TAGS = [
  { key: "all", label: "Tất cả" },
  { key: "health", label: "Chăm sóc sức khỏe" },
  { key: "skin", label: "Chăm sóc da" },
  { key: "kids", label: "Cho bé" },
];

const fmt = (n) => n.toLocaleString("vi-VN") + "₫";
const offPercent = (p) =>
  p.oldPrice && p.oldPrice > p.price
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : 0;

// Toast đơn giản
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
    setTimeout(() => t.remove(), 280);
  }, 2300);
}

export default function HangMoi() {
  const sliderRef = useRef(null);
  const [activeTag, setActiveTag] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const scrollBy = (dx) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dx, behavior: "smooth" });
  };

  // lọc theo tag
  const filtered = NEW_PRODUCTS.filter((p) =>
    activeTag === "all" ? true : p.category === activeTag
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleProducts = filtered.slice(start, start + PAGE_SIZE);

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    sliderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTagClick = (key) => {
    setActiveTag(key);
    setPage(1);
  };

  return (
    <main className="lc new-products">
      <PageBar
        title="Hàng Mới Về"
        subtitle="Các sản phẩm mới cập nhật, chính hãng – được khách hàng tin dùng"
      />

      {/* HERO */}
      <section className="np-hero">
        <div className="np-hero-main">
          <span className="np-chip">Hàng mới mỗi ngày</span>
          <h2 className="np-hero-title">Khám phá sản phẩm vừa lên kệ</h2>
          <p className="np-hero-sub">
            Bổ sung vitamin, chăm sóc da, sản phẩm cho bé… luôn được cập nhật
            liên tục để bạn dễ dàng chọn mua.
          </p>
        </div>

        <div className="np-hero-side">
          <ul className="np-tags">
            {TAGS.map((tag) => (
              <li key={tag.key}>
                <button
                  type="button"
                  className={
                    "np-tag-btn" + (activeTag === tag.key ? " is-active" : "")
                  }
                  onClick={() => handleTagClick(tag.key)}
                >
                  {tag.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="np-small-note">
            <i className="ri-information-line" />
            <span>Giá và số lượng có thể thay đổi theo từng thời điểm.</span>
          </div>
        </div>
      </section>

      {/* Nút trượt mobile */}
      <div className="np-arrows">
        <button
          type="button"
          className="np-arrow prev"
          onClick={() => scrollBy(-260)}
          aria-label="Sản phẩm trước"
        >
          <i className="ri-arrow-left-s-line" />
        </button>
        <button
          type="button"
          className="np-arrow next"
          onClick={() => scrollBy(260)}
          aria-label="Sản phẩm sau"
        >
          <i className="ri-arrow-right-s-line" />
        </button>
      </div>

      {/* Grid / slider */}
      <div className="container">
        <div className="np-grid" ref={sliderRef}>
          {visibleProducts.map((p) => {
            const imgSrc = p.cover || p.img; // fallback nếu sau này bạn còn dùng img
            const webpSrc =
              imgSrc &&
              `${import.meta.env.BASE_URL}${imgSrc.replace(
                /\.(png|jpg|jpeg)$/i,
                ".webp"
              )}`;
            const fullSrc = imgSrc && `${import.meta.env.BASE_URL}${imgSrc}`;

            return (
              <article className="np-card" key={p.id}>
                {/* media */}
                <Link to={`/san-pham/${p.id}`} className="np-card__media">
                  {p.badge && (
                    <span
                      className={
                        "np-badge " +
                        (p.badge === "hot" ? "np-badge--hot" : "np-badge--new")
                      }
                    >
                      {p.badge === "hot" ? "Hot" : "Mới"}
                    </span>
                  )}
                  {offPercent(p) > 0 && (
                    <span className="np-badge np-badge--sale">
                      -{offPercent(p)}%
                    </span>
                  )}

                  <img
                    src={p.cover}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/img/placeholder.jpg"; // hoặc bỏ hẳn dòng này
                    }}
                  />
                </Link>

                {/* body */}
                <div className="np-card__body">
                  <div className="np-meta">
                    <span className="np-meta-brand">{p.brand}</span>
                    <span className="np-meta-rating">
                      <i className="ri-star-fill" /> {p.rating.toFixed(1)}
                      <span className="np-meta-muted">
                        {" "}
                        • {p.sold.toLocaleString()} đã bán
                      </span>
                    </span>
                  </div>

                  <h3 className="np-title">
                    <Link to={`/hang-moi/${p.id}`}>{p.name}</Link>
                  </h3>

                  <div className="np-price-row">
                    <span className="np-price">{fmt(p.price)}</span>
                    {p.oldPrice && (
                      <span className="np-price-old">{fmt(p.oldPrice)}</span>
                    )}
                  </div>

                  <div className="np-actions">
                    <Link
                      className="btn btn--ghost sm"
                      to={`/san-pham/${p.id}`}
                    >
                      Chi tiết
                    </Link>
                    <button
                      type="button"
                      className="btn sm btn-main"
                      onClick={() => {
                        try {
                          addToCart?.(p, 1);
                        } catch {}
                        toast(`Đã thêm “${p.name}” vào giỏ`);
                      }}
                    >
                      <i className="ri-shopping-bag-3-line" />
                      <span>Thêm giỏ</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Phân trang (dùng chung style như Thuốc) */}
        {totalPages > 1 && (
          <div className="t-paging">
            <button
              className="t-page-btn"
              onClick={() => gotoPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹ Trước
            </button>
            <span className="t-page-current">{currentPage}</span>
            <button
              className="t-page-btn"
              onClick={() => gotoPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau ›
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
