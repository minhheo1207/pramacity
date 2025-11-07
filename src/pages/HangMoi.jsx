// src/pages/HangMoi.jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import PageBar from "../components/PageBar";
import { addToCart } from "../services/products"; // nếu bạn đã có
import "../assets/css/hangmoi.css";

const NEW_PRODUCTS = [
  {
    id: "p-01",
    name: "Vitamin C 1000mg Nature’s Way",
    price: 195000,
    oldPrice: 230000,
    img: "/products/vitc.png",
    badge: "new",
    brand: "Nature’s Way",
    rating: 4.7,
    sold: 3100,
  },
  {
    id: "p-02",
    name: "Kem chống nắng La Roche-Posay SPF50+",
    price: 420000,
    oldPrice: 480000,
    img: "/products/sunscreen.png",
    badge: "hot",
    brand: "La Roche-Posay",
    rating: 4.9,
    sold: 5200,
  },
  {
    id: "p-03",
    name: "Probiotic Enterogermina 5ml x 10 ống",
    price: 145000,
    img: "/products/probiotic.png",
    badge: "new",
    brand: "Enterogermina",
    rating: 4.6,
    sold: 2100,
  },
  {
    id: "p-04",
    name: "Viên uống bổ não Ginkgo Biloba 120mg",
    price: 185000,
    oldPrice: 210000,
    img: "/products/ginkgo.png",
    brand: "Herbal Lab",
    rating: 4.5,
    sold: 1750,
  },
  {
    id: "p-05",
    name: "Siro ho Prospan Kid 100ml",
    price: 99000,
    img: "/products/prospan.png",
    brand: "Prospan",
    rating: 4.8,
    sold: 4320,
  },
];

const fmt = (n) => n.toLocaleString("vi-VN") + "₫";
const offPercent = (p) =>
  p.oldPrice && p.oldPrice > p.price
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : 0;

// Tiny toast (dùng chung toàn app)
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
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

export default function HangMoi() {
  const sliderRef = useRef(null);
  const scrollBy = (dx) =>
    sliderRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <main className="lc new-products">
      <PageBar
        title="Hàng Mới Về"
        subtitle="Các sản phẩm vừa cập nhật – chính hãng, chất lượng, giá ưu đãi"
      />

      <div className="container np-wrap">
        {/* Nút trượt chỉ hiện ở tablet/mobile */}
        <div className="mob-arrows">
          <button
            className="arrow prev"
            onClick={() => scrollBy(-280)}
            aria-label="Prev"
          >
            <i className="ri-arrow-left-s-line" />
          </button>
          <button
            className="arrow next"
            onClick={() => scrollBy(280)}
            aria-label="Next"
          >
            <i className="ri-arrow-right-s-line" />
          </button>
        </div>

        <div className="fancy-grid as-slider" ref={sliderRef}>
          {NEW_PRODUCTS.map((p) => (
            <article className="card product product--neo" key={p.id}>
              {/* media */}
              <Link to={`/san-pham/${p.id}`} className="card__media neo-media">
                {p.badge && (
                  <span
                    className={
                      "pill-badge " + (p.badge === "hot" ? "is-hot" : "is-new")
                    }
                  >
                    {p.badge === "hot" ? "Hot" : "Mới"}
                  </span>
                )}
                {offPercent(p) > 0 && (
                  <span className="pill-badge is-sale">-{offPercent(p)}%</span>
                )}

                {/* Ưu tiên WebP nếu có */}
                <picture>
                  <source
                    srcSet={`${import.meta.env.BASE_URL}${p.img.replace(
                      /\.(png|jpg|jpeg)$/i,
                      ".webp"
                    )}`}
                    type="image/webp"
                  />
                  <img
                    src={`${import.meta.env.BASE_URL}${p.img}`}
                    alt={p.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    onError={(e) =>
                      (e.currentTarget.src = "/img/placeholder.jpg")
                    }
                  />
                </picture>

                <span className="shine" />
                <button
                  type="button"
                  className="icon-fav"
                  data-tip="Thêm vào yêu thích"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="ri-heart-3-line" />
                </button>
              </Link>

              {/* body */}
              <div className="card__body">
                <div className="meta-top">
                  <span className="brand">{p.brand}</span>
                  <span className="rating">
                    <i className="ri-star-fill" /> {p.rating.toFixed(1)}{" "}
                    <span className="muted">
                      • {p.sold.toLocaleString()} đã bán
                    </span>
                  </span>
                </div>

                <h3 className="card__title">
                  <Link to={`/hang-moi/${p.id}`}>{p.name}</Link>
                </h3>

                <div className="price-row big">
                  <span className="price">{fmt(p.price)}</span>
                  {p.oldPrice && (
                    <span className="price--old">{fmt(p.oldPrice)}</span>
                  )}
                </div>

                <div className="row actions">
                  <Link className="btn btn--ghost sm" to={`/san-pham/${p.id}`}>
                    Chi tiết
                  </Link>
                  <button
                    className="btn sm"
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
          ))}
        </div>
      </div>
    </main>
  );
}
