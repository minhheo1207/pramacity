// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/home.css";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      title: "Giảm giá lên đến 50%",
      subtitle: "Cho tất cả sản phẩm chăm sóc sức khỏe",
      description: "Ưu đãi đặc biệt trong tháng này - Giao hàng miễn phí toàn quốc",
      image: "/img/sunscreen.png",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      buttonText: "Mua ngay",
      buttonLink: "/khuyen-mai",
    },
    {
      id: 2,
      title: "Vitamin & Thực phẩm chức năng",
      subtitle: "Tăng cường sức khỏe mỗi ngày",
      description: "Nhập VITAMIN20 giảm thêm 20% cho đơn hàng đầu tiên",
      image: "/img/vitc.png",
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      buttonText: "Khám phá ngay",
      buttonLink: "/thuoc",
    },
    {
      id: 3,
      title: "Khẩu trang y tế chất lượng cao",
      subtitle: "Bảo vệ sức khỏe cho cả gia đình",
      description: "Mua 2 tặng 1 - Giao nhanh trong 2 giờ",
      image: "/img/mask.png",
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      buttonText: "Xem ngay",
      buttonLink: "/ban-chay",
    },
    {
      id: 4,
      title: "Thiết bị y tế gia đình",
      subtitle: "Chăm sóc sức khỏe tại nhà",
      description: "Nhiệt kế, máy đo huyết áp - Giá ưu đãi đặc biệt",
      image: "/img/thermo.png",
      bgColor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      buttonText: "Mua ngay",
      buttonLink: "/hang-moi",
    },
  ];

  const features = [
    {
      icon: "ri-truck-line",
      title: "Giao hàng nhanh",
      description: "Giao trong 2 giờ nội thành",
    },
    {
      icon: "ri-shield-check-line",
      title: "Hàng chính hãng",
      description: "100% sản phẩm chính hãng",
    },
    {
      icon: "ri-price-tag-3-line",
      title: "Giá tốt nhất",
      description: "Cam kết giá rẻ nhất thị trường",
    },
    {
      icon: "ri-customer-service-2-line",
      title: "Tư vấn 24/7",
      description: "Hỗ trợ khách hàng mọi lúc",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Vitamin C 500mg",
      old: "65.000đ",
      price: "45.000đ",
      sale: "-31%",
      img: "/img/vitc.png",
      rating: 4.8,
      sold: 1200,
    },
    {
      id: 2,
      name: "Khẩu trang 4D",
      old: "40.000đ",
      price: "30.000đ",
      sale: "-25%",
      img: "/img/mask.png",
      rating: 4.9,
      sold: 2500,
    },
    {
      id: 3,
      name: "Nhiệt kế điện tử",
      old: "150.000đ",
      price: "120.000đ",
      sale: "-20%",
      img: "/img/thermo.png",
      rating: 4.7,
      sold: 890,
    },
    {
      id: 4,
      name: "Kem chống nắng SPF50",
      old: null,
      price: "160.000đ",
      sale: "NEW",
      img: "/img/sunscreen.png",
      rating: 4.6,
      sold: 650,
    },
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <main className="home-page">
      {/* HERO CAROUSEL */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
              style={{ background: banner.bgColor }}
            >
              <div className="container">
                <div className="carousel-content">
                  <div className="carousel-text">
                    <span className="carousel-subtitle">{banner.subtitle}</span>
                    <h1 className="carousel-title">{banner.title}</h1>
                    <p className="carousel-description">{banner.description}</p>
                    <Link to={banner.buttonLink} className="btn btn-hero">
                      {banner.buttonText}
                      <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                  <div className="carousel-image">
                    <img src={banner.image} alt={banner.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <button className="carousel-nav carousel-nav--prev" onClick={prevSlide}>
          <i className="ri-arrow-left-s-line"></i>
        </button>
        <button className="carousel-nav carousel-nav--next" onClick={nextSlide}>
          <i className="ri-arrow-right-s-line"></i>
        </button>

        {/* Dots */}
        <div className="carousel-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Sản phẩm nổi bật</h2>
              <p className="section-subtitle">Ưu đãi đặc biệt trong tuần</p>
            </div>
            <Link to="/khuyen-mai" className="section-link">
              Xem tất cả <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                {product.sale && (
                  <span className="product-badge">{product.sale}</span>
                )}
                <div className="product-image">
                  <img src={product.img} alt={product.name} loading="lazy" />
                  <button className="quick-view-btn">
                    <i className="ri-eye-line"></i>
                  </button>
                </div>
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <div className="stars">
                      <i className="ri-star-fill"></i>
                      <span>{product.rating}</span>
                    </div>
                    <span className="sold-count">Đã bán {product.sold}</span>
                  </div>
                  <div className="product-price">
                    {product.old && <span className="price-old">{product.old}</span>}
                    <span className="price-current">{product.price}</span>
                  </div>
                  <button className="btn-add-cart">
                    <i className="ri-shopping-cart-line"></i>
                    Thêm vào giỏ
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Tải ứng dụng ngay để nhận ưu đãi</h2>
            <p>Giảm ngay 50.000đ cho đơn hàng đầu tiên khi đặt qua app</p>
            <div className="cta-buttons">
              <a href="#" className="app-button">
                <i className="ri-apple-fill"></i>
                <div>
                  <small>Tải trên</small>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="app-button">
                <i className="ri-google-play-fill"></i>
                <div>
                  <small>Tải trên</small>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
