import Topbar from "../components/Topbar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const products = [
    {
      id: 1,
      name: "Vitamin C 500mg",
      old: "65.000đ",
      price: "45.000đ",
      sale: "-31%",
      img: "/img/vitc.png",
    },
    {
      id: 2,
      name: "Khẩu trang 4D",
      old: "40.000đ",
      price: "30.000đ",
      sale: "-25%",
      img: "/img/mask.png",
    },
    {
      id: 3,
      name: "Nhiệt kế điện tử",
      old: "150.000đ",
      price: "120.000đ",
      sale: "-20%",
      img: "/img/thermo.png",
    },
    {
      id: 4,
      name: "Kem chống nắng SPF50",
      old: null,
      price: "160.000đ",
      sale: "NEW",
      img: "/img/sunscreen.png",
    },
  ];

  return (
    <>
      <Topbar />
      <Header />

      <main className="container">
        {/* HERO */}
        <section className="hero section">
          <div className="hero__copy">
            <h1>Ưu đãi tháng này</h1>
            <p>Deal hot mỗi ngày – Giao nhanh trong 2 giờ.</p>
            <div className="hero__actions">
              <a className="btn" href="/khuyen-mai">
                Xem khuyến mãi
              </a>
              <a className="btn btn--ghost" href="/ban-chay">
                Top bán chạy
              </a>
            </div>
          </div>
          <div className="hero__media" role="img" aria-label="Banner ưu đãi" />
        </section>

        {/* DEAL GRID */}
        <section className="section">
          <div className="section__head">
            <h2>🔥 Siêu deal ngập trời</h2>
            <a className="link" href="/khuyen-mai">
              Xem tất cả →
            </a>
          </div>

          <div className="grid">
            {products.map((p) => (
              <article className="card" key={p.id}>
                {/* ẢNH: bọc trong .card__media để ăn đúng CSS chiều cao */}
                <div className="card__media">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>

                <div className="card__body">
                  <h3 className="card__title">{p.name}</h3>
                  <div className="price-row">
                    {p.old && <span className="price--old">{p.old}</span>}
                    <span className="price">{p.price}</span>
                    <span className="badge-sale">{p.sale}</span>
                  </div>
                  <button className="btn btn--block">Chọn mua</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
