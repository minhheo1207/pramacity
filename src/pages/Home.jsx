import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../services/products";
import "../assets/css/home.css";

const HERO_BANNERS = ["/banners/b4.png", "/banners/b2.png", "/banners/b3.png"];

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const prevHero = () =>
    setHeroIndex((i) => (i - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);

  const nextHero = () => setHeroIndex((i) => (i + 1) % HERO_BANNERS.length);

  const hotDeals = PRODUCTS.slice(0, 4);
  const suggest = PRODUCTS.slice(0, 4);

  return (
    <main className="home-page">
      {/* ================= HERO FULL WIDTH ================= */}
      {/* ===== HERO FULL WIDTH ===== */}
      <section className="hero-full">
        <div className="hero-bg"></div>

        <div
          className="hero-slide"
          style={{ backgroundImage: `url(${HERO_BANNERS[heroIndex]})` }}
        >
          <div className="hero-dots">
            {HERO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={"dot" + (idx === heroIndex ? " active" : "")}
                onClick={() => setHeroIndex(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTENT TRẮNG BÊN DƯỚI ================= */}
      <div className="home-container">
        {/* ---- Siêu deal ---- */}
        <section className="section">
          <div className="section-head">
            <h2>🔥 Siêu deal đang diễn ra</h2>
            <Link to="/khuyen-mai" className="view-all">
              Xem tất cả →
            </Link>
          </div>

          <div className="deal-grid">
            {hotDeals.map((p) => (
              <article className="deal-card" key={p.id}>
                <div className="deal-top">
                  <span className="deal-tag">{p.cat || "Khác"}</span>
                  <span className="deal-status">ĐANG DIỄN RA</span>
                </div>

                <div className="deal-body">
                  <img src={p.img} className="deal-img" alt={p.name} />
                  <div className="deal-info">
                    <h3>{p.name}</h3>
                    <p className="desc">Giá tốt, số lượng có hạn.</p>
                    <div className="price-wrap">
                      {p.old && <span className="old">{p.old}đ</span>}
                      <span className="price">{p.price}đ</span>
                      {p.sale && <span className="badge-sale">{p.sale}</span>}
                    </div>
                    <div className="deal-actions">
                      <button className="btn-sm">Chọn mua</button>
                      <Link className="btn-sm ghost" to={`/san-pham/${p.id}`}>
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---- Suggest ---- */}
        <section className="section">
          <div className="section-head">
            <h2>Gợi ý hôm nay</h2>
            <Link to="/ban-chay" className="view-all">
              Xem thêm →
            </Link>
          </div>

          <div className="suggest-grid">
            {suggest.map((p) => (
              <article className="suggest-card" key={p.id}>
                <img
                  src={p.cover || p.img}
                  alt={p.name}
                  className="suggest-img"
                />
                <h3>{p.name}</h3>
                <div className="price-wrap">
                  {p.old && <span className="old">{p.old}đ</span>}
                  <span className="price">{p.price}đ</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
