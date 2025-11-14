import { useEffect, useMemo, useState } from "react";
import PageBar from "../components/PageBar";
import "../assets/css/khuyenmai.css";
import QuickViewModal from "../components/QuickViewModal";

/* ===== Data ===== */
const CATS = [
  "Tất cả",
  "Chăm sóc da",
  "Dinh dưỡng",
  "Thuốc không kê đơn",
  "Thiết bị y tế",
];

const DEALS = [
  {
    id: "d1",
    title: "Giảm 30% – Chăm sóc da mùa lễ",
    desc: "Áp dụng cho sữa rửa mặt, kem dưỡng, serum. Tối đa 100k.",
    code: "SKIN30",
    cat: "Chăm sóc da",
    cover: "/khuyenmai/chamsoda.png",
    startsAt: addH(0),
    endsAt: addD(3),
    limit: 500,
    used: 210,
  },
  {
    id: "d2",
    title: "Mua 2 tặng 1 – Vitamin tổng hợp",
    desc: "Áp dụng size 60v & 120v. Tối đa 2 combo/khách.",
    code: "VITA21",
    cat: "Dinh dưỡng",
    cover: "/khuyenmai/VitaminC.png",
    startsAt: addH(12),
    endsAt: addD(4),
    limit: 300,
    used: 0,
  },
  {
    id: "d3",
    title: "Flash Sale 49k – Nhiệt kế điện tử",
    desc: "Số lượng có hạn, mỗi khách tối đa 1 sản phẩm.",
    code: "THERMO49",
    cat: "Thiết bị y tế",
    cover: "/khuyenmai/nhietketdientu.png",
    startsAt: addH(-8),
    endsAt: addH(10),
    limit: 200,
    used: 156,
  },
  {
    id: "d4",
    title: "Giảm 20% – Thuốc cảm cúm OTC",
    desc: "Không áp dụng cho thuốc kê đơn. Tối đa 50k.",
    code: "OTC20",
    cat: "Thuốc không kê đơn",
    cover: "/khuyenmai/panadol.png",
    startsAt: addD(-6),
    endsAt: addD(-1),
    limit: 400,
    used: 400,
  },
  {
    id: "d5",
    title: "Deal Hot – Máy đo huyết áp giảm 35%",
    desc: "Giá chỉ 385k, số lượng có hạn, Freeship toàn quốc.",
    code: "BP35",
    cat: "Thiết bị y tế",
    cover: "/khuyenmai/maydohuyetam.png",
    startsAt: addH(-3),
    endsAt: addH(18),
    limit: 250,
    used: 112,
  },
  {
    id: "d6",
    title: "Ưu đãi 40% – Dầu gội dược liệu thảo mộc",
    desc: "Chăm sóc tóc khỏe mạnh, hương thơm tự nhiên.",
    code: "HAIR40",
    cat: "Chăm sóc da",
    cover: "/khuyenmai/daugoi.png",
    startsAt: addH(-5),
    endsAt: addH(12),
    limit: 350,
    used: 146,
  },
];

const BANNERS = [
  {
    id: "b1",
    title: "Mega Sale 11.11",
    sub: "Giảm đến 49% + Freeship 2h",
    img: "/khuyenmai/Mega-Sale.png",
    icon: "/khuyenmai/VitaminC.png",
    badge: "HOT HÔM NAY",
    color: "pink",
  },
  {
    id: "b2",
    title: "Vitamin & Dinh dưỡng",
    sub: "Mua 2 tặng 1 – Sức khỏe cả nhà",
    img: "/khuyenmai/VitaminC.png",
    icon: "/khuyenmai/VitaminC.png",
    badge: "VITAMIN",
    color: "mint",
  },
  {
    id: "b3",
    title: "Thiết bị y tế gia đình",
    sub: "Ưu đãi nhiệt kế, máy đo huyết áp",
    img: "/khuyenmai/banner-ThietBiYTe.png",
    icon: "/khuyenmai/banner-ThietBiYTe.png",
    badge: "FLASH SALE",
    color: "indigo",
  },
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Serum Vitamin C 10%",
    cover: "/khuyenmai/serumC.png",
    price: 159000,
    oldPrice: 259000,
    discount: 39,
    rating: 4.7,
    sold: 320,
    tag: "Chăm sóc da",
  },
  {
    id: "p2",
    name: "Vitamin Tổng hợp A–Z (120v)",
    img: "/khuyenmai/vitaminA-Z.png",
    price: 199000,
    oldPrice: 329000,
    discount: 40,
    rating: 4.8,
    sold: 812,
    tag: "Dinh dưỡng",
  },
  {
    id: "p3",
    name: "Nhiệt kế điện tử",
    img: "/khuyenmai/nhietketdientu.png",
    price: 49000,
    oldPrice: 129000,
    discount: 62,
    rating: 4.5,
    sold: 1060,
    tag: "Thiết bị y tế",
  },
  {
    id: "p4",
    name: "Viên kẽm 15mg (60v)",
    img: "/khuyenmai/kem.png",
    price: 89000,
    oldPrice: 149000,
    discount: 40,
    rating: 4.6,
    sold: 540,
    tag: "Dinh dưỡng",
  },
  {
    id: "p5",
    name: "Sữa rửa mặt dịu nhẹ",
    img: "/khuyenmai/suaruamat.png",
    price: 119000,
    oldPrice: 189000,
    discount: 37,
    rating: 4.9,
    sold: 980,
    tag: "Chăm sóc da",
  },
  {
    id: "p6",
    name: "Máy đo huyết áp cổ tay",
    img: "/khuyenmai/maydohuyetapcotay.png",
    price: 399000,
    oldPrice: 590000,
    discount: 32,
    rating: 4.4,
    sold: 265,
    tag: "Thiết bị y tế",
  },
];

const HOT_PAGE_SIZE = 3; // 3 sp / trang → 2 trang

/* ===== Helpers ===== */
function addH(h) {
  const d = new Date();
  d.setHours(d.getHours() + h);
  return d.toISOString();
}
function addD(dy) {
  const d = new Date();
  d.setDate(d.getDate() + dy);
  return d.toISOString();
}
function leftTime(endISO) {
  const diff = new Date(endISO) - new Date();
  if (diff <= 0) return "00:00:00";
  const h = Math.floor(diff / 36e5),
    m = Math.floor((diff % 36e5) / 6e4),
    s = Math.floor((diff % 6e4) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
function formatVND(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

/* ===== Page ===== */
export default function KhuyenMai() {
  const [tab, setTab] = useState("dangdienra");
  const [cat, setCat] = useState("Tất cả");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(
    () => new Set(JSON.parse(localStorage.getItem("savedDeals") || "[]"))
  );
  const [slide, setSlide] = useState(0);
  const [quick, setQuick] = useState(null);

  // ✅ phân trang cho SẢN PHẨM HOT
  const [hotPage, setHotPage] = useState(1);

  // banner auto slide
  useEffect(() => {
    const id = setInterval(
      () => setSlide((s) => (s + 1) % BANNERS.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  // lọc deal (không phân trang)
  const filtered = useMemo(() => {
    const now = new Date();
    const byTab = (d) => {
      const s = new Date(d.startsAt),
        e = new Date(d.endsAt);
      if (tab === "dangdienra") return s <= now && e >= now;
      if (tab === "sapdienra") return s > now;
      return e < now;
    };
    const byCat = (d) => (cat === "Tất cả" ? true : d.cat === cat);
    const byQ = (d) =>
      (d.title + d.desc).toLowerCase().includes(q.toLowerCase());
    return DEALS.filter((d) => byTab(d) && byCat(d) && byQ(d));
  }, [tab, cat, q]);

  // ✅ tính trang cho Sản phẩm HOT
  const hotPageCount = useMemo(
    () => Math.max(1, Math.ceil(PRODUCTS.length / HOT_PAGE_SIZE)),
    []
  );

  const hotProducts = useMemo(() => {
    const start = (hotPage - 1) * HOT_PAGE_SIZE;
    return PRODUCTS.slice(start, start + HOT_PAGE_SIZE);
  }, [hotPage]);

  const saveCode = (code) => {
    const next = new Set(saved);
    next.has(code) ? next.delete(code) : next.add(code);
    setSaved(next);
    localStorage.setItem("savedDeals", JSON.stringify([...next]));
  };

  const handleAddToCart = (p) => {
    console.log("add to cart", p);
    setQuick(null);
  };

  const prevHotPage = () => setHotPage((p) => Math.max(1, p - 1));
  const nextHotPage = () => setHotPage((p) => Math.min(hotPageCount, p + 1));

  return (
    <>
      <main className="lc promo">
        <PageBar
          title="Khuyến mãi • Ưu đãi sốc"
          subtitle="Banner • Deal • Sản phẩm hot — Ố dề cho đã!"
        />

        {/* ===== Mega Banner + Ticker ===== */}
        <section className="mega-wrap">
          <div className="mega">
            {BANNERS.map((b, i) => (
              <article
                key={b.id}
                className={`slide ${i === slide ? "active" : ""}`}
                style={{ backgroundImage: `url(${b.img})` }}
              >
                <span className={`badge ${b.color}`}>{b.badge}</span>
                <h2>{b.title}</h2>
                <p>{b.sub}</p>
                <img className="slide-decor" src={b.icon} alt={b.title} />
                <div className="dots">
                  {BANNERS.map((_x, idx) => (
                    <button
                      key={idx}
                      className={idx === slide ? "on" : ""}
                      onClick={() => setSlide(idx)}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="ticker">
            <marquee scrollAmount="8">
              🔔 <b>Đang diễn ra:</b> Flash Sale 20:00 • Mã <b>SKIN30</b> giảm
              30% • Vitamin <b>Mua 2 Tặng 1</b> • Thiết bị y tế <b>đến 49%</b> —
              Săn nhanh kẻo hết!
            </marquee>
          </div>
        </section>

        {/* ===== SEARCH + CATEGORY ===== */}
        <section className="promo-search">
          <div className="search-left">
            <div className="search-box">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Tìm mã / sản phẩm / danh mục..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="search-cats">
              {CATS.map((c) => (
                <button
                  key={c}
                  className={`chip ${cat === c ? "active" : ""}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Tabs ===== */}
        <div className="kv-tabs">
          <button
            className={tab === "dangdienra" ? "active" : ""}
            onClick={() => setTab("dangdienra")}
          >
            <i className="ri-fire-line"></i> Đang diễn ra
          </button>
          <button
            className={tab === "sapdienra" ? "active" : ""}
            onClick={() => setTab("sapdienra")}
          >
            <i className="ri-timer-line"></i> Sắp diễn ra
          </button>
          <button
            className={tab === "daketthuc" ? "active" : ""}
            onClick={() => setTab("daketthuc")}
          >
            <i className="ri-flag-line"></i> Đã kết thúc
          </button>
        </div>

        {/* ===== Deals grid (không phân trang) ===== */}
        <section className="deal-grid">
          {filtered.length === 0 ? (
            <div className="empty">
              Không có ưu đãi phù hợp • Thử từ khóa khác?
            </div>
          ) : (
            filtered.map((d) => {
              const pct = Math.min(100, Math.round((d.used / d.limit) * 100));
              const timeLeft = leftTime(d.endsAt);
              const ended = new Date(d.endsAt) < new Date();
              const soon = !ended && new Date(d.endsAt) - new Date() < 36e5;
              return (
                <article
                  className={`deal-card ${ended ? "is-ended" : ""}`}
                  key={d.id}
                >
                  <div
                    className="media"
                    style={{ backgroundImage: `url(${d.cover})` }}
                  >
                    <div className="media-grad"></div>
                    <span className="tag">{d.cat}</span>
                    {ended ? (
                      <span className="state end">KẾT THÚC</span>
                    ) : (
                      <span className={`state ${soon ? "soon" : "run"}`}>
                        {tab === "sapdienra" ? "SẮP DIỄN RA" : "ĐANG DIỄN RA"}
                      </span>
                    )}
                  </div>
                  <div className="body">
                    <h3>{d.title}</h3>
                    <p className="desc">{d.desc}</p>
                    <div className="meta">
                      <div className="progress">
                        <i className="ri-fire-fill"></i>
                        <div className="bar">
                          <span style={{ width: `${pct}%` }} />
                        </div>
                        <small>{pct}% đã dùng</small>
                      </div>
                      <div className="timer">
                        <i className="ri-timer-2-line"></i>
                        <b>{ended ? "00:00:00" : timeLeft}</b>
                        <small>còn lại</small>
                      </div>
                    </div>
                    <div className="coupon">
                      <code>{d.code}</code>
                      <button
                        className={`btn ${saved.has(d.code) ? "saved" : ""}`}
                        onClick={() => saveCode(d.code)}
                      >
                        {saved.has(d.code) ? (
                          <>
                            <i className="ri-check-line"></i> Đã lưu
                          </>
                        ) : (
                          <>
                            <i className="ri-save-3-line"></i> Lưu mã
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* ===== Sản phẩm HOT (có phân trang) ===== */}
        <section className="hot-section">
          <div className="hot-head">
            <h2>Sản phẩm HOT</h2>
            <p>Giảm sâu – bán chạy – xem là muốn chốt!</p>
          </div>
          <div className="prod-grid">
            {hotProducts.map((p) => (
              <article className="prod-card" key={p.id}>
                <div
                  className="thumb"
                  style={{ backgroundImage: `url(${p.cover || p.img})` }}
                >
                  <span className="off">-{p.discount}%</span>
                  <span className="tag">{p.tag}</span>
                </div>
                <div className="p-body">
                  <h3>{p.name}</h3>
                  <div className="price">
                    <b>{formatVND(p.price)}</b>
                    <s>{formatVND(p.oldPrice)}</s>
                  </div>
                  <div className="meta">
                    <span className="rate">
                      <i className="ri-star-fill" /> {p.rating.toFixed(1)}
                    </span>
                    <span className="sold">
                      Đã bán {p.sold.toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="p-progress">
                    <span
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((p.sold / 1200) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="actions">
                    <button className="btn-buy">
                      <i className="ri-shopping-cart-2-line" /> Thêm vào giỏ
                    </button>
                    <button className="btn-ghost" onClick={() => setQuick(p)}>
                      <i className="ri-eye-line" /> Xem nhanh
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Thanh phân trang cho Sản phẩm HOT */}
          <div className="kv-paging">
            <button
              className="kv-page-btn"
              onClick={prevHotPage}
              disabled={hotPage === 1}
            >
              ‹ Trước
            </button>
            <span className="kv-page-current">{hotPage}</span>
            <button
              className="kv-page-btn"
              onClick={nextHotPage}
              disabled={hotPage === hotPageCount}
            >
              Sau ›
            </button>
          </div>
        </section>

        {/* ===== Note ===== */}
        <section className="promo-note">
          <details>
            <summary>
              <i className="ri-information-line"></i> Điều kiện & Lưu ý
            </summary>
            <ul>
              <li>Mỗi mã áp dụng 1 lần/khách, không cộng dồn với mã khác.</li>
              <li>Áp dụng cho đơn online tại hệ thống cửa hàng liên kết.</li>
              <li>Ưu đãi có thể kết thúc sớm khi hết ngân sách.</li>
            </ul>
          </details>
        </section>
      </main>

      {quick && (
        <QuickViewModal
          data={quick}
          onAdd={handleAddToCart}
          onClose={() => setQuick(null)}
        />
      )}
    </>
  );
}
