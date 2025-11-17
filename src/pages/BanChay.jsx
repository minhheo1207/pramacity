// src/pages/BanChay.jsx
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBar from "../components/PageBar";
import Frame from "../components/Frame";
import QuickViewModal from "../components/QuickViewModal";
import {
  PRODUCTS,
  CART_KEY,
  addToCart,
  dispatchCartUpdated,
} from "../services/products";
import "../assets/css/ban-chay.css";
import "../assets/css/thuoc.css";
const CATS = [
  "Tất cả",
  "Vitamin",
  "Thiết bị y tế",
  "Chăm sóc da",
  "Khẩu trang",
];
const BRANDS = ["PharmaCity", "MedPro", "SunCare", "VitaPlus"];
const PAGE_SIZE = 6;

export default function BanChay() {
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tất cả");
  const [brand, setBrand] = useState("Tất cả");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ratingMin, setRatingMin] = useState(0);
  const [sort, setSort] = useState("soldDesc");
  const [page, setPage] = useState(1);
  const [quick, setQuick] = useState(null);
  const [quickTab, setQuickTab] = useState("tong-quan");

  useEffect(() => {
    dispatchCartUpdated();
  }, []);

  const list = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase().trim();
    let l = PRODUCTS.slice();
    if (q.trim()) {
      const k = norm(q);
      l = l.filter((p) => norm(p.name).includes(k));
    }
    if (cat !== "Tất cả") l = l.filter((p) => p.cat === cat);
    if (brand !== "Tất cả") l = l.filter((p) => p.brand === brand);
    const mn = minPrice ? Number(minPrice) : -Infinity;
    const mx = maxPrice ? Number(maxPrice) : Infinity;
    l = l.filter((p) => p.price >= mn && p.price <= mx);
    if (ratingMin > 0) l = l.filter((p) => p.rating >= ratingMin);
    if (sort === "soldDesc") l.sort((a, b) => b.sold - a.sold);
    if (sort === "priceAsc") l.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") l.sort((a, b) => b.price - a.price);
    if (sort === "ratingDesc") l.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") l.sort((a, b) => b.id - a.id);
    return l;
  }, [q, cat, brand, minPrice, maxPrice, ratingMin, sort]);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setQ("");
    setCat("Tất cả");
    setBrand("Tất cả");
    setMinPrice("");
    setMaxPrice("");
    setRatingMin(0);
    setSort("soldDesc");
    setPage(1);
  };
  const fmt = (n) => n.toLocaleString("vi-VN") + "đ";
  const stars = (r) =>
    "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  return (
    <main className="lc shop">
      <PageBar
        title="Sản phẩm bán chạy"
        subtitle="Những sản phẩm được khách hàng tin dùng nhiều nhất"
        right={
          <form className="pb-search" onSubmit={(e) => e.preventDefault()}>
            <i className="ri-search-line"></i>
            <input
              placeholder="Tìm tên sản phẩm…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </form>
        }
      />

      <div className="container shop__wrap">
        <aside className="shop__side">
          <Frame title="Danh mục">
            <div className="chips">
              {CATS.map((c) => (
                <button
                  key={c}
                  className={"chip" + (c === cat ? " active" : "")}
                  onClick={() => {
                    setCat(c);
                    setPage(1);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </Frame>

          <Frame title="Thương hiệu">
            <div className="chips">
              {["Tất cả", ...BRANDS].map((b) => (
                <button
                  key={b}
                  className={"chip" + (b === brand ? " active" : "")}
                  onClick={() => {
                    setBrand(b);
                    setPage(1);
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </Frame>

          <Frame title="Đánh giá tối thiểu">
            <div className="chips">
              {[0, 3, 4, 4.5].map((v) => (
                <button
                  key={v}
                  className={"chip" + (v === ratingMin ? " active" : "")}
                  onClick={() => {
                    setRatingMin(v);
                    setPage(1);
                  }}
                >
                  {v === 0 ? "Bất kỳ" : `≥ ${v}★`}
                </button>
              ))}
            </div>
          </Frame>

          <Frame title="Khoảng giá">
            <div className="price-range">
              <input
                type="number"
                placeholder="Từ"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Đến"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <button
              className="btn btn-light sm"
              type="button"
              onClick={resetFilters}
            >
              Xóa lọc
            </button>
          </Frame>
        </aside>

        <section className="shop__main">
          <div className="shop__toolbar">
            <div className="muted">
              {total.toLocaleString()} sản phẩm
              {cat !== "Tất cả" ? ` • ${cat}` : ""}
              {brand !== "Tất cả" ? ` • ${brand}` : ""}
              {ratingMin ? ` • ≥ ${ratingMin}★` : ""}
            </div>
            <div className="shop__actions">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="soldDesc">Bán chạy nhất</option>
                <option value="priceAsc">Giá: thấp → cao</option>
                <option value="priceDesc">Giá: cao → thấp</option>
                <option value="ratingDesc">Đánh giá cao</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>

          <div className="t-grid">
            {pageList.map((p) => (
              <article className="t-card" key={p.id}>
                <div
                  className="t-thumb"
                  onClick={() => nav(`/san-pham/${p.id}`)}
                  style={{
                    cursor: "pointer",
                    backgroundImage: `url(${p.cover || p.img})`,
                  }}
                >
                  {p.sale && (
                    <span className="t-badge t-badge--sale">{p.sale}</span>
                  )}
                  <span className="t-badge t-badge--tag">{p.cat}</span>
                </div>

                <div className="t-body">
                  <h3 className="t-title" title={p.name}>
                    <Link
                      to={`/san-pham/${p.id}`}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      {p.name}
                    </Link>
                  </h3>

                  <div className="t-price">
                    <b>{fmt(p.price)}</b>
                    {p.old && <s>{fmt(p.old)}</s>}
                  </div>

                  <div className="t-meta">
                    <span className="rate">
                      <i className="ri-star-fill" /> {p.rating.toFixed(1)}
                    </span>
                    <span className="sold">
                      Đã bán {p.sold.toLocaleString("vi-VN")}
                    </span>
                  </div>

                  <div className="t-hot">
                    <span
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((p.sold / 5000) * 100)
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="t-actions">
                    <button
                      className="btn btn--buy"
                      onClick={() => {
                        try {
                          addToCart(p, 1);
                        } catch (err) {
                          // Error đã được xử lý trong addToCart
                        }
                      }}
                    >
                      <i className="ri-shopping-cart-2-line" /> Thêm vào giỏ
                    </button>
                    <button
                      className="btn btn--ghost"
                      onClick={() => {
                        setQuickTab("tong-quan");
                        setQuick(p);
                      }}
                    >
                      <i className="ri-eye-line" /> Xem nhanh
                    </button>
                    <Link
                      className="btn btn--ghost"
                      to={`/san-pham/${p.id}`}
                      style={{
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="ri-file-list-line" /> Chi tiết
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* PHÂN TRANG kiểu Thuốc / Khuyến mãi */}
          <div className="bc-paging">
            <button
              className="bc-nav bc-nav--prev"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Trước
            </button>

            <span className="bc-page">{page}</span>

            <button
              className="bc-nav bc-nav--next"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau ›
            </button>
          </div>
        </section>
      </div>

      {quick && (
        <QuickViewModal
          data={{
            ...quick,
            discount: quick.sale
              ? parseInt(quick.sale.replace(/[^0-9]/g, ""))
              : 0,
            tag: quick.cat || "",
            oldPrice: quick.old || quick.price,
          }}
          initialTab={quickTab}
          onAdd={(product) => {
            try {
              addToCart(product, 1);
              setQuick(null);
            } catch (err) {
              // Error đã được xử lý trong addToCart
            }
          }}
          onClose={() => setQuick(null)}
        />
      )}
    </main>
  );
}
