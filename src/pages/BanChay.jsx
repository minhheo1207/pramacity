// src/pages/BanChay.jsx
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBar from "../components/PageBar";
import Frame from "../components/Frame";
import {
  PRODUCTS,
  CART_KEY,
  addToCart,
  dispatchCartUpdated,
} from "../services/products";

const CATS = [
  "Tất cả",
  "Vitamin",
  "Thiết bị y tế",
  "Chăm sóc da",
  "Khẩu trang",
];
const BRANDS = ["PharmaCity", "MedPro", "SunCare", "VitaPlus"];
const PAGE_SIZE = 12;

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

          <div className="grid grid--product">
            {pageList.map((p) => (
              <article className="card product" key={p.id}>
                <div
                  className="card__media"
                  onClick={() => nav(`/san-pham/${p.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={p.img} alt={p.name} loading="lazy" />
                  {p.sale && <span className="badge-sale">{p.sale}</span>}
                </div>
                <div className="card__body">
                  <h3 className="card__title">
                    <Link to={`/san-pham/${p.id}`}>{p.name}</Link>
                  </h3>

                  <div className="rating">
                    <span className="stars">{stars(p.rating)}</span>
                    <span className="sold">
                      {p.sold.toLocaleString()} đã bán
                    </span>
                  </div>

                  <div className="price-row">
                    {p.old && <span className="price--old">{fmt(p.old)}</span>}
                    <span className="price">{fmt(p.price)}</span>
                  </div>

                  <div className="meta-row">
                    <span className="pill">{p.cat}</span>
                    <span className="pill">{p.brand}</span>
                  </div>

                  <div className="row">
                    <button className="btn" onClick={() => addToCart(p, 1)}>
                      Thêm vào giỏ
                    </button>
                    <Link className="btn btn--ghost" to={`/san-pham/${p.id}`}>
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pager">
            <button
              className="btn sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Trước
            </button>
            <div className="pager__pages">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={"pager__dot" + (page === i + 1 ? " active" : "")}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="btn sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
