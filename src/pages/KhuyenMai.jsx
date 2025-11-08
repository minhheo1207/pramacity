// src/pages/KhuyenMai.jsx
import { useEffect, useMemo, useState } from "react";
import PageBar from "../components/PageBar";
import "../assets/css/khuyenmai.css";

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
    cover:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa0?q=80&w=1200&auto=format&fit=crop",
    startsAt: addH(0), // đang diễn ra
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
    cover:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    startsAt: addH(12), // sắp diễn ra
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
    cover:
      "https://images.unsplash.com/photo-1582719478250-02ad91dcf0b9?q=80&w=1200&auto=format&fit=crop",
    startsAt: addH(-8), // diễn ra
    endsAt: addH(10), // sắp hết
    limit: 200,
    used: 156,
  },
  {
    id: "d4",
    title: "Giảm 20% – Thuốc cảm cúm OTC",
    desc: "Không áp dụng cho thuốc kê đơn. Tối đa 50k.",
    code: "OTC20",
    cat: "Thuốc không kê đơn",
    cover:
      "https://images.unsplash.com/photo-1582719478250-88497a5a8a7f?q=80&w=1200&auto=format&fit=crop",
    startsAt: addD(-6), // đã kết thúc
    endsAt: addD(-1),
    limit: 400,
    used: 400,
  },
];

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
  const h = Math.floor(diff / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function useTick() {
  const [, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
}

export default function KhuyenMai() {
  const [tab, setTab] = useState("dangdienra"); // dangdienra | sapdienra | daketthuc
  const [cat, setCat] = useState("Tất cả");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(
    () => new Set(JSON.parse(localStorage.getItem("savedDeals") || "[]"))
  );

  useTick(); // cập nhật countdown mỗi giây

  const filtered = useMemo(() => {
    const now = new Date();
    const byTab = (deal) => {
      const s = new Date(deal.startsAt),
        e = new Date(deal.endsAt);
      if (tab === "dangdienra") return s <= now && e >= now;
      if (tab === "sapdienra") return s > now;
      return e < now;
    };
    const byCat = (deal) => (cat === "Tất cả" ? true : deal.cat === cat);
    const byQ = (deal) =>
      (deal.title + deal.desc).toLowerCase().includes(q.toLowerCase());
    return DEALS.filter((d) => byTab(d) && byCat(d) && byQ(d));
  }, [tab, cat, q]);

  const saveCode = (code) => {
    const next = new Set(saved);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setSaved(next);
    localStorage.setItem("savedDeals", JSON.stringify(Array.from(next)));
  };

  return (
    <main className="lc promo">
      <PageBar
        title="Khuyến mãi HOT"
        subtitle="Mã giảm – Flash sale – Ưu đãi độc quyền online"
      />

      {/* HERO */}
      <section className="kv-hero">
        <div className="kv-copy">
          <h1>Ưu đãi rộn ràng • Săn deal cực đã</h1>
          <p>
            Danh mục đa dạng, mã giảm sâu – cập nhật mỗi ngày. Lưu mã để dùng ở
            bước thanh toán.
          </p>
          <div className="kv-search">
            <i className="ri-search-line"></i>
            <input
              placeholder="Tìm mã / sản phẩm / danh mục…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="kv-cats">
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
        <div className="kv-banner">
          <div className="kv-glow" />
          <div className="kv-badge">Hôm nay</div>
          <h3>Deal Xịn Mỗi Ngày</h3>
          <p>Giảm đến 49% + Freeship 2h</p>
          <div className="kv-row">
            <span>
              <i className="ri-flashlight-fill"></i> Flash Sale 20:00
            </span>
            <span>
              <i className="ri-coupon-3-line"></i> Sưu tầm mã
            </span>
          </div>
        </div>
      </section>

      {/* TABS */}
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

      {/* GRID DEALS */}
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
            const soon = !ended && new Date(d.endsAt) - new Date() < 36e5; // < 1h
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

      {/* LƯU Ý */}
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
  );
}
