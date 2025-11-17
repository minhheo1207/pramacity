// src/pages/Thuoc.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageBar from "../components/PageBar";
import QuickViewModal from "../components/QuickViewModal";
import { addToCart } from "../services/products";
import "../assets/css/thuoc.css";

// ==== DATA DEMO ====
const CATS = [
  "Tất cả",
  "Cảm cúm (OTC)",
  "Đau – hạ sốt",
  "Tiêu hóa",
  "Vitamin/ khoáng",
];

const BRANDS = [
  "Panadol",
  "Efferalgan",
  "Decolgen",
  "Enterogermina",
  "Neo-Tergynan",
  "UPSA",
];

const FORMS = ["Viên nén", "Viên sủi", "Gói bột", "Dung dịch", "Xịt mũi"];

const PRODUCTS = [
  {
    id: "t1",
    name: "Panadol Extra 500mg",
    tag: "Đau – hạ sốt",
    cover: "/thuoc/paradol.png",
    price: 39000,
    oldPrice: 55000,
    discount: 29,
    rating: 4.8,
    sold: 3200,
    brand: "Panadol",
    form: "Viên nén",
  },
  {
    id: "t2",
    name: "Efferalgan 500mg (viên sủi)",
    tag: "Đau – hạ sốt",
    cover: "/thuoc/viensui.png",
    price: 45000,
    oldPrice: 59000,
    discount: 24,
    rating: 4.7,
    sold: 2100,
    brand: "Efferalgan",
    form: "Viên sủi",
  },
  {
    id: "t3",
    name: "Decolgen ND",
    tag: "Cảm cúm (OTC)",
    cover: "/thuoc/DecolgenND.png",
    price: 29000,
    oldPrice: 36000,
    discount: 19,
    rating: 4.6,
    sold: 1800,
    brand: "Decolgen",
    form: "Viên nén",
  },
  {
    id: "t4",
    name: "Enterogermina 5 tỉ",
    tag: "Tiêu hóa",
    cover: "/thuoc/Enterogermina.png",
    price: 92000,
    oldPrice: 120000,
    discount: 23,
    rating: 4.9,
    sold: 950,
    brand: "Enterogermina",
    form: "Dung dịch",
  },
  {
    id: "t5",
    name: "Vitamin C UPSA 1000mg sủi",
    tag: "Vitamin/ khoáng",
    cover: "/thuoc/vitaminC.png",
    price: 69000,
    oldPrice: 99000,
    discount: 30,
    rating: 4.8,
    sold: 4100,
    brand: "UPSA",
    form: "Viên sủi",
  },
  {
    id: "t6",
    name: "Xịt mũi nước biển sâu",
    tag: "Cảm cúm (OTC)",
    cover: "/thuoc/xitmui.png",
    price: 59000,
    oldPrice: 79000,
    discount: 25,
    rating: 4.5,
    sold: 760,
    brand: "—",
    form: "Xịt mũi",
  },
  // thêm vài sản phẩm cho đẹp + có phân trang
  {
    id: "t7",
    name: "Panadol Cold & Flu",
    tag: "Cảm cúm (OTC)",
    cover: "/thuoc/PanadolCold&Flu.png",
    price: 52000,
    oldPrice: 68000,
    discount: 24,
    rating: 4.7,
    sold: 1320,
    brand: "Panadol",
    form: "Viên nén",
  },
  {
    id: "t8",
    name: "Probiotic hỗ trợ tiêu hoá",
    tag: "Tiêu hóa",
    cover: "/thuoc/Probiotic.png",
    price: 115000,
    oldPrice: 145000,
    discount: 21,
    rating: 4.9,
    sold: 640,
    brand: "Enterogermina",
    form: "Gói bột",
  },
  {
    id: "t9",
    name: "Vitamin tổng hợp cho người lớn",
    tag: "Vitamin/ khoáng",
    cover: "/thuoc/Vitamintonghop.png",
    price: 135000,
    oldPrice: 169000,
    discount: 20,
    rating: 4.8,
    sold: 980,
    brand: "UPSA",
    form: "Viên nén",
  },
  {
    id: "t10",
    name: "Si rô ho thảo dược",
    tag: "Cảm cúm (OTC)",
    cover: "/thuoc/siro.png",
    price: 72000,
    oldPrice: 89000,
    discount: 19,
    rating: 4.6,
    sold: 530,
    brand: "—",
    form: "Dung dịch",
  },
];

const PAGE_SIZE = 6;

const vnd = (n) => n.toLocaleString("vi-VN") + "đ";

export default function Thuoc() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tất cả");
  const [brand, setBrand] = useState("Tất cả");
  const [form, setForm] = useState("Tất cả");
  const [sort, setSort] = useState("pho-bien");
  const [quick, setQuick] = useState(null);
  const [quickTab, setQuickTab] = useState("tong-quan"); // "tong-quan" | "chi-tiet"
  const [page, setPage] = useState(1);

  // lọc + sắp xếp
  const list = useMemo(() => {
    let L = PRODUCTS.filter((p) => {
      const byCat = cat === "Tất cả" || p.tag === cat;
      const byBrand = brand === "Tất cả" || p.brand === brand;
      const byForm = form === "Tất cả" || p.form === form;
      const byQ = (p.name + " " + p.tag + " " + p.brand)
        .toLowerCase()
        .includes(q.toLowerCase());
      return byCat && byBrand && byForm && byQ;
    });

    switch (sort) {
      case "gia-tang":
        L.sort((a, b) => a.price - b.price);
        break;
      case "gia-giam":
        L.sort((a, b) => b.price - a.price);
        break;
      case "giam-gia":
        L.sort((a, b) => b.discount - a.discount);
        break;
      default:
        L.sort((a, b) => b.sold - a.sold);
    }
    return L;
  }, [q, cat, brand, form, sort]);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(list.length / PAGE_SIZE)),
    [list.length]
  );

  // mỗi lần filter/sort đổi thì quay về trang 1
  useEffect(() => {
    setPage(1);
  }, [q, cat, brand, form, sort]);

  // đảm bảo page không vượt pageCount
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  // danh sách hiển thị trên trang hiện tại
  const pageList = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }, [list, page]);

  const reset = () => {
    setQ("");
    setCat("Tất cả");
    setBrand("Tất cả");
    setForm("Tất cả");
    setSort("pho-bien");
  };

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(pageCount, p + 1));

  return (
    <>
      <main className="thuoc light">
        <PageBar
          title="Thuốc (OTC) • Nhà thuốc online"
          subtitle="Lọc nhanh, xem thông tin chi tiết và thêm vào giỏ trong một màn hình."
        />

        {/* HERO */}
        <section className="t-hero">
          <div className="t-hero__text">
            <h1>
              Thuốc OTC – <span>Giá tốt mỗi ngày</span>
            </h1>
            <p>
              Thuốc giảm đau, cảm cúm, tiêu hoá, vitamin... Mua online – nhận
              hàng trong ngày, tư vấn bởi dược sĩ.
            </p>
            <div className="t-hero__stats">
              <span>
                <i className="ri-shield-check-line" /> Chính hãng GPP
              </span>
              <span>
                <i className="ri-truck-line" /> Giao nhanh
              </span>
              <span>
                <i className="ri-24-hours-line" /> Tư vấn 24/7
              </span>
            </div>
          </div>

          {/* Banner thuốc bên phải */}
          <div className="t-hero__art">
            <div className="hero-banner">
              <div className="hero-banner__text">
                <span className="hero-badge">Flash sale OTC</span>
                <h2>Deal thuốc OTC -30%</h2>
                <p>Panadol, Efferalgan, Vitamin C, men tiêu hoá…</p>
                <button className="hero-btn">Xem khuyến mãi</button>
              </div>
              <div className="hero-banner__img" />
            </div>
          </div>
        </section>

        {/* WRAP 2 CỘT */}
        <section className="t-wrap">
          {/* SIDEBAR */}
          <aside className="t-side">
            <div className="t-panel">
              <div className="t-search">
                <i className="ri-search-line" />
                <input
                  placeholder="Tìm thuốc, công dụng…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                {q && (
                  <button className="clear" onClick={() => setQ("")}>
                    <i className="ri-close-line" />
                  </button>
                )}
              </div>

              {/* Nhóm công dụng */}
              <div className="t-group">
                <h4>Nhóm công dụng</h4>
                <div className="t-pills">
                  {CATS.map((c) => (
                    <button
                      key={c}
                      className={`pill ${c === "Tất cả" ? "pill--all" : ""} ${
                        cat === c ? "on" : ""
                      }`}
                      onClick={() => setCat(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thương hiệu */}
              <div className="t-group">
                <h4>Thương hiệu</h4>
                <div className="t-pills t-pills--grid">
                  <button
                    className={`pill pill--all ${
                      brand === "Tất cả" ? "on" : ""
                    }`}
                    onClick={() => setBrand("Tất cả")}
                  >
                    Tất cả
                  </button>
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      className={`pill ${brand === b ? "on" : ""}`}
                      onClick={() => setBrand(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dạng bào chế */}
              <div className="t-group">
                <h4>Dạng bào chế</h4>
                <div className="t-pills t-pills--grid">
                  <button
                    className={`pill pill--all ${
                      form === "Tất cả" ? "on" : ""
                    }`}
                    onClick={() => setForm("Tất cả")}
                  >
                    Tất cả
                  </button>
                  {FORMS.map((f) => (
                    <button
                      key={f}
                      className={`pill ${form === f ? "on" : ""}`}
                      onClick={() => setForm(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sắp xếp */}
              <div className="t-group">
                <h4>Sắp xếp</h4>
                <div className="t-pills t-pills--column">
                  <button
                    className={`pill ${sort === "pho-bien" ? "on" : ""}`}
                    onClick={() => setSort("pho-bien")}
                  >
                    Phổ biến
                  </button>
                  <button
                    className={`pill ${sort === "gia-tang" ? "on" : ""}`}
                    onClick={() => setSort("gia-tang")}
                  >
                    Giá tăng dần
                  </button>
                  <button
                    className={`pill ${sort === "gia-giam" ? "on" : ""}`}
                    onClick={() => setSort("gia-giam")}
                  >
                    Giá giảm dần
                  </button>
                  <button
                    className={`pill ${sort === "giam-gia" ? "on" : ""}`}
                    onClick={() => setSort("giam-gia")}
                  >
                    % giảm nhiều
                  </button>
                </div>
              </div>

              <button className="t-reset" onClick={reset}>
                <i className="ri-restart-line" /> Xóa tất cả bộ lọc
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="t-content">
            <div className="t-toolbar">
              <span>
                Đang hiển thị{" "}
                <b>
                  {pageList.length}/{list.length}
                </b>{" "}
                sản phẩm
              </span>
              <span className="t-legend">
                <span className="dot dot--hot" /> Bán chạy{" "}
                <span className="dot dot--sale" /> Đang giảm
              </span>
            </div>

            <div className="t-grid">
              {pageList.map((p) => (
                <article className="t-card" key={p.id}>
                  <div
                    className="t-thumb"
                    style={{ backgroundImage: `url(${p.cover || p.img})` }}
                  >
                    {p.discount > 0 && (
                      <span className="t-badge t-badge--sale">
                        -{p.discount}%
                      </span>
                    )}
                    <span className="t-badge t-badge--tag">{p.tag}</span>
                  </div>

                  <div className="t-body">
                    <h3 className="t-title" title={p.name}>
                      <Link 
                        to={`/san-pham/${p.id}`}
                        style={{ 
                          color: "inherit", 
                          textDecoration: "none",
                          cursor: "pointer"
                        }}
                      >
                        {p.name}
                      </Link>
                    </h3>

                    <div className="t-price">
                      <b>{vnd(p.price)}</b>
                      <s>{vnd(p.oldPrice)}</s>
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
                            // Convert thuoc product format to cart format
                            const cartProduct = {
                              id: p.id,
                              name: p.name,
                              price: p.price,
                              img: p.cover || p.img,
                            };
                            addToCart(cartProduct, 1);
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
                          justifyContent: "center"
                        }}
                      >
                        <i className="ri-file-list-line" /> Chi tiết
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="t-paging">
              <button
                className="t-page-btn"
                onClick={prevPage}
                disabled={page === 1}
              >
                ‹ Trước
              </button>
              <span className="t-page-current">{page}</span>
              <button
                className="t-page-btn"
                onClick={nextPage}
                disabled={page === pageCount}
              >
                Sau ›
              </button>
            </div>

            <div className="t-note">
              <details>
                <summary>
                  <i className="ri-information-line" /> Lưu ý khi mua thuốc
                  (OTC)
                </summary>
                <ul>
                  <li>Thuốc thuộc nhóm không kê đơn. Đọc kỹ hướng dẫn.</li>
                  <li>
                    Nếu có bệnh nền/đang dùng thuốc khác, nên hỏi ý kiến bác
                    sĩ/dược sĩ.
                  </li>
                  <li>Giá có thể thay đổi theo chương trình khuyến mãi.</li>
                </ul>
              </details>
            </div>
          </section>
        </section>
      </main>

      {quick && (
        <QuickViewModal
          data={quick}
          initialTab={quickTab}
          onAdd={(product) => {
            try {
              // Convert thuoc product format to cart format
              const cartProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.cover || product.img,
              };
              addToCart(cartProduct, 1);
              setQuick(null);
            } catch (err) {
              // Error đã được xử lý trong addToCart
            }
          }}
          onClose={() => setQuick(null)}
        />
      )}
    </>
  );
}
