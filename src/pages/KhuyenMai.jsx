import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageBar from "../components/PageBar";
import "../assets/css/khuyenmai.css";
import "../assets/css/thuoc.css";
import QuickViewModal from "../components/QuickViewModal";
import { addToCart } from "../services/products";

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
    img: "/khuyenmai/serumC.png",
    cover: "/khuyenmai/serumC.png",
    price: 159000,
    old: 259000,
    oldPrice: 259000,
    sale: "-39%",
    discount: 39,
    rating: 4.7,
    sold: 320,
    tag: "Chăm sóc da",
    cat: "Chăm sóc da",
    brand: "La Roche-Posay",
    desc: "Serum Vitamin C 10% giúp làm sáng da, giảm thâm nám, chống oxy hóa. Phù hợp cho da thường đến da dầu. Sử dụng buổi sáng sau bước làm sạch.",
  },
  {
    id: "p2",
    name: "Vitamin Tổng hợp A–Z (120v)",
    img: "/khuyenmai/vitaminA-Z.png",
    cover: "/khuyenmai/vitaminA-Z.png",
    price: 199000,
    old: 329000,
    oldPrice: 329000,
    sale: "-40%",
    discount: 40,
    rating: 4.8,
    sold: 812,
    tag: "Dinh dưỡng",
    cat: "Dinh dưỡng",
    brand: "Nature Made",
    desc: "Vitamin tổng hợp A-Z cung cấp đầy đủ các vitamin và khoáng chất thiết yếu cho cơ thể. Hỗ trợ tăng cường sức đề kháng, cải thiện sức khỏe tổng thể. Dùng 1 viên mỗi ngày sau bữa ăn.",
  },
  {
    id: "p3",
    name: "Nhiệt kế điện tử",
    img: "/khuyenmai/nhietketdientu.png",
    cover: "/khuyenmai/nhietketdientu.png",
    price: 49000,
    old: 129000,
    oldPrice: 129000,
    sale: "-62%",
    discount: 62,
    rating: 4.5,
    sold: 1060,
    tag: "Thiết bị y tế",
    cat: "Thiết bị y tế",
    brand: "SIKA",
    desc: "Nhiệt kế điện tử đo nhiệt độ nhanh chóng và chính xác trong 10 giây. Màn hình LCD dễ đọc, có cảnh báo sốt. An toàn cho trẻ em và người lớn.",
  },
  {
    id: "p4",
    name: "Viên kẽm 15mg (60v)",
    img: "/khuyenmai/kem.png",
    cover: "/khuyenmai/kem.png",
    price: 89000,
    old: 149000,
    oldPrice: 149000,
    sale: "-40%",
    discount: 40,
    rating: 4.6,
    sold: 540,
    tag: "Dinh dưỡng",
    cat: "Dinh dưỡng",
    brand: "OstroVit",
    desc: "Viên kẽm 15mg hỗ trợ tăng cường miễn dịch, cải thiện sức khỏe da và tóc. Phù hợp cho người thiếu kẽm, người hay ốm vặt. Uống 1 viên mỗi ngày.",
  },
  {
    id: "p5",
    name: "Sữa rửa mặt dịu nhẹ",
    img: "/khuyenmai/suaruamat.png",
    cover: "/khuyenmai/suaruamat.png",
    price: 119000,
    old: 189000,
    oldPrice: 189000,
    sale: "-37%",
    discount: 37,
    rating: 4.9,
    sold: 980,
    tag: "Chăm sóc da",
    cat: "Chăm sóc da",
    brand: "Cetaphil",
    desc: "Sữa rửa mặt dịu nhẹ không chứa xà phòng, phù hợp cho da nhạy cảm. Làm sạch sâu mà không gây khô da. Sử dụng sáng và tối.",
  },
  {
    id: "p6",
    name: "Máy đo huyết áp cổ tay",
    img: "/khuyenmai/maydohuyetapcotay.png",
    cover: "/khuyenmai/maydohuyetapcotay.png",
    price: 399000,
    old: 590000,
    oldPrice: 590000,
    sale: "-32%",
    discount: 32,
    rating: 4.4,
    sold: 265,
    tag: "Thiết bị y tế",
    cat: "Thiết bị y tế",
    brand: "OMRON",
    desc: "Máy đo huyết áp cổ tay tự động, dễ sử dụng. Màn hình LCD lớn, bộ nhớ lưu 60 kết quả. Phù hợp cho gia đình, người cao tuổi.",
  },
  {
    id: "p7",
    name: "Omega-3 Fish Oil 1000mg",
    img: "/khuyenmai/VitaminC.png",
    cover: "/khuyenmai/VitaminC.png",
    price: 210000,
    old: 280000,
    oldPrice: 280000,
    sale: "-25%",
    discount: 25,
    rating: 4.7,
    sold: 450,
    tag: "Dinh dưỡng",
    cat: "Dinh dưỡng",
    brand: "Nature's Bounty",
    desc: "Omega-3 Fish Oil 1000mg hỗ trợ sức khỏe tim mạch, não bộ và mắt. Chiết xuất từ cá biển sâu, không mùi tanh. Uống 1-2 viên mỗi ngày.",
  },
  {
    id: "p8",
    name: "Kem dưỡng ẩm ban đêm",
    img: "/khuyenmai/chamsoda.png",
    cover: "/khuyenmai/chamsoda.png",
    price: 185000,
    old: 245000,
    oldPrice: 245000,
    sale: "-24%",
    discount: 24,
    rating: 4.8,
    sold: 620,
    tag: "Chăm sóc da",
    cat: "Chăm sóc da",
    brand: "Neutrogena",
    desc: "Kem dưỡng ẩm ban đêm phục hồi và nuôi dưỡng da trong khi ngủ. Công thức không gây mụn, phù hợp mọi loại da. Thoa đều lên mặt trước khi ngủ.",
  },
  {
    id: "p9",
    name: "Máy đo đường huyết",
    img: "/khuyenmai/maydohuyetam.png",
    cover: "/khuyenmai/maydohuyetam.png",
    price: 450000,
    old: 650000,
    oldPrice: 650000,
    sale: "-31%",
    discount: 31,
    rating: 4.6,
    sold: 180,
    tag: "Thiết bị y tế",
    cat: "Thiết bị y tế",
    brand: "Accu-Chek",
    desc: "Máy đo đường huyết cá nhân, kết quả trong 5 giây. Màn hình lớn dễ đọc, lưu 500 kết quả. Kèm theo que thử và kim lấy máu.",
  },
  {
    id: "p10",
    name: "Collagen Peptide 5000mg",
    img: "/khuyenmai/vitaminA-Z.png",
    cover: "/khuyenmai/vitaminA-Z.png",
    price: 320000,
    old: 450000,
    oldPrice: 450000,
    sale: "-29%",
    discount: 29,
    rating: 4.9,
    sold: 890,
    tag: "Dinh dưỡng",
    cat: "Dinh dưỡng",
    brand: "Vital Proteins",
    desc: "Collagen Peptide 5000mg hỗ trợ làm đẹp da, tóc, móng. Giúp da đàn hồi, giảm nếp nhăn. Hòa tan trong nước, không mùi vị. Uống 1-2 muỗng mỗi ngày.",
  },
  {
    id: "p11",
    name: "Dầu gội dược liệu",
    img: "/khuyenmai/daugoi.png",
    cover: "/khuyenmai/daugoi.png",
    price: 95000,
    old: 135000,
    oldPrice: 135000,
    sale: "-30%",
    discount: 30,
    rating: 4.5,
    sold: 340,
    tag: "Chăm sóc da",
    cat: "Chăm sóc da",
    brand: "Herbal Essences",
    desc: "Dầu gội dược liệu thảo mộc tự nhiên, làm sạch và nuôi dưỡng tóc. Phù hợp cho tóc khô, xơ rối. Không chứa paraben, sulfate.",
  },
  {
    id: "p12",
    name: "Thuốc cảm cúm Panadol",
    img: "/khuyenmai/panadol.png",
    cover: "/khuyenmai/panadol.png",
    price: 35000,
    old: 50000,
    oldPrice: 50000,
    sale: "-30%",
    discount: 30,
    rating: 4.7,
    sold: 1520,
    tag: "Thuốc không kê đơn",
    cat: "Thuốc không kê đơn",
    brand: "Panadol",
    desc: "Thuốc cảm cúm Panadol giảm đau, hạ sốt, trị các triệu chứng cảm cúm. Dạng viên nén, dễ uống. Uống 1-2 viên mỗi 4-6 giờ khi cần.",
  },
];

const HOT_PAGE_SIZE = 4; // 4 sp / trang

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
      (d.title + d.desc + d.code).toLowerCase().includes(q.toLowerCase());
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

  const saveCode = async (code) => {
    const next = new Set(saved);
    const isAdding = !next.has(code);
    isAdding ? next.add(code) : next.delete(code);
    setSaved(next);
    localStorage.setItem("savedDeals", JSON.stringify([...next]));

    // Copy mã vào clipboard khi lưu
    if (isAdding) {
      try {
        await navigator.clipboard.writeText(code);
      } catch (err) {
        // Fallback cho trình duyệt không hỗ trợ clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
        } catch (fallbackErr) {
          console.error("Could not copy code:", fallbackErr);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleAddToCart = (p) => {
    try {
      addToCart(p, 1);
      setQuick(null);
    } catch (err) {
      // Error đã được xử lý trong addToCart
    }
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
            <marquee scrollAmount="6">
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
        <section className="deals-section">
          <div className="deals-header">
            <h2>⚡ Ưu đãi đặc biệt</h2>
            <p>Mã giảm giá • Deal sốc • Săn ngay kẻo hết!</p>
          </div>
          <div className="deal-grid">
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
          </div>
        </section>

        {/* ===== Sản phẩm HOT (có phân trang) ===== */}
        <section className="hot-section">
          <div className="hot-head">
            <h2>🔥 Sản phẩm HOT</h2>
            <p>Giảm sâu – bán chạy – xem là muốn chốt!</p>
          </div>
          <div className="t-grid">
            {hotProducts.map((p) => (
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
                    {p.name}
                  </h3>
                  <div className="t-price">
                    <b>{formatVND(p.price)}</b>
                    <s>{formatVND(p.oldPrice)}</s>
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
                          Math.round((p.sold / 1200) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="t-actions">
                    <button
                      className="btn btn--buy"
                      onClick={() => handleAddToCart(p)}
                    >
                      <i className="ri-shopping-cart-2-line" /> Thêm vào giỏ
                    </button>
                    <button
                      className="btn btn--ghost"
                      onClick={() => setQuick(p)}
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
