// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/home.css";
import { useAuth } from "../utils/AuthContext";
import { getAllPosts } from "../services/posts";
import { NEW_PRODUCTS } from "../data/newProducts";
import { PRODUCTS, addToCart } from "../services/products";
import QuickViewModal from "../components/QuickViewModal";

export default function Home() {
  const { user } = useAuth();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [quick, setQuick] = useState(null);
  const [quickTab, setQuickTab] = useState("tong-quan");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    try {
      const posts = getAllPosts()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 6);
      setFeaturedPosts(posts || []);
    } catch (error) {
      console.error("Error loading posts:", error);
      setFeaturedPosts([]);
    }
  }, []);

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

  const categories = [
    {
      icon: "ri-medicine-bottle-line",
      title: "Thực phẩm chức năng",
      link: "/thuoc",
      color: "#10b981",
      subcategories: [
        "Vitamin & Khoáng chất",
        "Sinh lý - Nội tiết tố",
        "Hỗ trợ tiêu hóa",
      ],
    },
    {
      icon: "ri-cream-line",
      title: "Dược mỹ phẩm",
      link: "/thuoc",
      color: "#8b5cf6",
      subcategories: ["Chăm sóc da mặt", "Chăm sóc cơ thể", "Chăm sóc tóc"],
    },
    {
      icon: "ri-capsule-line",
      title: "Thuốc",
      link: "/thuoc",
      color: "#3b82f6",
      subcategories: ["Thuốc kê đơn", "Thuốc không kê đơn", "Tra cứu thuốc"],
    },
    {
      icon: "ri-user-heart-line",
      title: "Chăm sóc cá nhân",
      link: "/thuoc",
      color: "#f59e0b",
      subcategories: ["Vệ sinh cá nhân", "Chăm sóc răng miệng", "Chăm sóc tóc"],
    },
    {
      icon: "ri-hospital-line",
      title: "Thiết bị y tế",
      link: "/thuoc",
      color: "#ef4444",
      subcategories: ["Thiết bị đo", "Thiết bị hỗ trợ", "Dụng cụ y tế"],
    },
  ];

  const aboutPoints = [
    {
      icon: "ri-medicine-bottle-line",
      text: "Thuốc kê đơn & không kê đơn",
    },
    {
      icon: "ri-heart-pulse-line",
      text: "Thực phẩm chức năng & Vitamin",
    },
    {
      icon: "ri-stethoscope-line",
      text: "Thiết bị y tế gia đình",
    },
    {
      icon: "ri-shield-star-line",
      text: "Sản phẩm chăm sóc sức khỏe",
    },
  ];

  // Combine aboutPoints and features into one unified grid
  const allServiceCards = [
    ...aboutPoints.map((point) => ({
      icon: point.icon,
      title: point.text,
      description: "",
    })),
    ...features.map((feature) => ({
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
    })),
  ];

  const diseases = [
    {
      title: "BỆNH NAM GIỚI",
      icon: "ri-men-line",
      items: [
        "Yếu sinh lý",
        "Di tinh, mộng tinh",
        "Hẹp bao quy đầu",
        "Loãng xương ở nam",
      ],
      link: "/bai-viet",
    },
    {
      title: "BỆNH NỮ GIỚI",
      icon: "ri-women-line",
      items: [
        "Hội chứng tiền kinh nguyệt",
        "Hội chứng tiền mãn kinh",
        "Chậm kinh",
        "Mất kinh",
      ],
      link: "/bai-viet",
    },
    {
      title: "BỆNH NGƯỜI GIÀ",
      icon: "ri-user-star-line",
      items: ["Alzheimer", "Parkinson", "Đục thủy tinh thể", "Loãng xương"],
      link: "/bai-viet",
    },
    {
      title: "BỆNH TRẺ EM",
      icon: "ri-parent-line",
      items: ["Bại não trẻ em", "Tự kỷ", "Uốn ván", "Tắc ruột sơ sinh"],
      link: "/bai-viet",
    },
  ];

  // Get all products
  const allProducts = [...(PRODUCTS || []), ...(NEW_PRODUCTS || [])];

  // Get featured products for general use (best sellers)
  const featuredProducts = allProducts
    .filter((p) => p && (p.sold || 0) > 500)
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 8);

  // Helper function to filter products by category
  const filterProductsByCategory = (categories, limit = 6) => {
    const filtered = allProducts.filter((p) => {
      if (!p) return false;
      const productCat = (p.cat || p.tag || "").toLowerCase();
      const productName = (p.name || "").toLowerCase();
      return categories.some((cat) => {
        const catLower = cat.toLowerCase();
        return productCat.includes(catLower) || productName.includes(catLower);
      });
    });
    const sorted = filtered
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, limit);

    // Fallback to featured products if no matches found
    if (sorted.length === 0) {
      return featuredProducts.slice(0, limit);
    }

    // If we have less than limit, fill with featured products
    if (sorted.length < limit) {
      const remaining = limit - sorted.length;
      const additional = featuredProducts
        .filter((p) => !sorted.some((sp) => sp.id === p.id))
        .slice(0, remaining);
      return [...sorted, ...additional];
    }

    return sorted;
  };

  // Fallback products if no featured products found
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 8);

  // Banner slides data with category-specific products
  const bannerSlides = [
    {
      id: 1,
      title: "PHÁI MẠNH BẢN LĨNH",
      subtitle: "Sức khỏe Vững vàng",
      discounts: [
        { category: "Dược Mỹ Phẩm", percent: 35 },
        { category: "TPCN Hàng Nhật Âu Mỹ", percent: 30 },
      ],
      productCategories: [
        "dược mỹ phẩm",
        "chăm sóc da",
        "mỹ phẩm",
        "thực phẩm chức năng",
        "tpcn",
      ],
      bgGradient: "linear-gradient(180deg, #87CEEB 0%, #4682B4 100%)",
    },
    {
      id: 2,
      title: "SỨC KHỎE GIA ĐÌNH",
      subtitle: "Chăm sóc toàn diện",
      discounts: [
        { category: "Vitamin & Dinh dưỡng", percent: 40 },
        { category: "Thiết bị y tế", percent: 25 },
      ],
      productCategories: [
        "vitamin",
        "khoáng",
        "dinh dưỡng",
        "thiết bị y tế",
        "máy đo",
      ],
      bgGradient: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 3,
      title: "LÀM ĐẸP TỰ NHIÊN",
      subtitle: "Dưỡng da khỏe mạnh",
      discounts: [
        { category: "Chăm sóc da mặt", percent: 30 },
        { category: "Mỹ phẩm cao cấp", percent: 35 },
      ],
      productCategories: [
        "chăm sóc da",
        "dưỡng da",
        "kem",
        "serum",
        "mỹ phẩm",
        "sunscreen",
      ],
      bgGradient: "linear-gradient(180deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: 4,
      title: "MEGA SALE 11.11",
      subtitle: "Giảm đến 50%",
      discounts: [
        { category: "Tất cả sản phẩm", percent: 50 },
        { category: "Freeship toàn quốc", percent: 0 },
      ],
      productCategories: [], // All products - best sellers
      bgGradient: "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)",
    },
  ].map((slide) => {
    let products = [];
    if (slide.productCategories.length > 0) {
      products = filterProductsByCategory(slide.productCategories, 6);
    } else {
      products = featuredProducts.slice(0, 6);
    }
    return {
      ...slide,
      products,
    };
  });

  // Bottom banners - chỉ 2 banners như trong hình
  const bottomBanners = [
    {
      id: 2,
      title: "HIỂU VỀ UNG THƯ TỪ A-Z",
      subtitle:
        "Thông tin được biên soạn và kiểm duyệt bởi đội ngũ chuyên gia y tế",
      link: "/bai-viet?cat=ung-thu",
      color: "#fff",
      bgColor: "#1E3A8A",
      type: "cancer",
      logos: ["LONG CHÂU", "Gleneagles Hospital", "Mount Elizabeth"],
      ribbon: true,
      hasWorldMap: true,
    },
    {
      id: 3,
      title: "CẬP NHẬT ĐỊA CHỈ THEO NGHỊ QUYẾT MỚI",
      subtitle: "HIỂN THỊ ĐỒNG THỜI ĐỊA CHỈ TRƯỚC VÀ SAU SÁP NHẬP",
      link: "/dia-chi",
      color: "#1E3A8A",
      bgColor: "#E0F2FE",
      type: "address",
      buttonText: "TRA CỨU NGAY",
      buttonColor: "#EF4444",
      mascot: true,
      hasMap: true,
      hasHexPattern: true,
    },
  ];

  // Auto slide with pause on hover
  useEffect(() => {
    if (bannerSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return new Intl.NumberFormat("vi-VN").format(price) + "đ";
    }
    return price;
  };

  const handleAddToCart = (product) => {
    if (!user) {
      document.dispatchEvent(new CustomEvent("OPEN_AUTH"));
      return;
    }
    try {
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.cover || product.img,
      };
      addToCart(cartProduct, 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleQuickView = (product) => {
    // Calculate discount percentage
    const discountPercent =
      product.old && product.price
        ? Math.round(((product.old - product.price) / product.old) * 100)
        : 0;

    // Convert product format to match QuickViewModal expected format
    const quickViewData = {
      ...product,
      discount: discountPercent,
      tag: product.cat || "Sản phẩm",
      img: product.cover || product.img,
      cover: product.cover || product.img,
      oldPrice: product.old || product.oldPrice,
      price: product.price,
      name: product.name,
      rating: product.rating || 4.5,
      sold: product.sold || 0,
      brand: product.brand,
      form: product.form,
      desc: product.desc,
    };
    setQuickTab("tong-quan");
    setQuick(quickViewData);
  };

  return (
    <main className="home-page">
      {/* HERO SECTION - Banner Carousel */}
      <section className="hero-section">
        <div className="hero-carousel">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${
                index === currentSlide
                  ? "active"
                  : index < currentSlide
                  ? "prev"
                  : ""
              }`}
              style={{ background: slide.bgGradient }}
            >
              <div className="container">
                <div className="hero-content">
                  <div className="hero-text">
                    {/* Brand Logo for Durex */}
                    {slide.hasBrandLogo && (
                      <div className="hero-brand-logo">
                        <span className="brand-text">durex</span>
                      </div>
                    )}

                    {/* Decorative elements */}
                    {!slide.hasBrandLogo && (
                      <div className="hero-decorations">
                        <i className="ri-star-fill hero-star"></i>
                        <div className="hero-king">♔</div>
                      </div>
                    )}

                    <h1 className="hero-title">
                      {slide.title}
                      <br />
                      <span className="hero-subtitle">{slide.subtitle}</span>
                    </h1>

                    {/* Discount banners */}
                    <div className="discount-banners">
                      {slide.discounts.map((discount, i) => (
                        <div
                          key={i}
                          className={`discount-banner ${
                            discount.special ? "discount-banner-special" : ""
                          }`}
                        >
                          {discount.special ? (
                            <>
                              <div className="discount-category">
                                {discount.category}
                                {discount.text && (
                                  <span className="discount-text">
                                    {discount.text}
                                  </span>
                                )}
                              </div>
                              {discount.percent > 0 ? (
                                <div className="discount-percent">
                                  {discount.percent}%
                                </div>
                              ) : (
                                <div className="discount-special-text">
                                  {discount.category}
                                </div>
                              )}
                            </>
                          ) : discount.percent > 0 ? (
                            <>
                              <div className="discount-category">
                                {discount.category}
                              </div>
                              <div className="discount-label">Giảm đến</div>
                              <div className="discount-percent">
                                {discount.percent}%
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="discount-category">
                                {discount.category}
                              </div>
                              <div className="discount-label">Miễn phí</div>
                              <div className="discount-percent discount-freeship">
                                FREESHIP
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link to="/thuoc" className="btn-buy-now">
                      <i className="ri-shopping-cart-line"></i>
                      Mua ngay
                    </Link>
                  </div>

                  {/* Products display */}
                  <div className="hero-products">
                    <div className="products-display">
                      {slide.products && slide.products.length > 0
                        ? slide.products.slice(0, 6).map((product) => (
                            <div key={product.id} className="product-mini">
                              <img
                                src={
                                  product.img ||
                                  product.cover ||
                                  "/img/placeholder.jpg"
                                }
                                alt={product.name || "Sản phẩm"}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = "/img/placeholder.jpg";
                                }}
                              />
                            </div>
                          ))
                        : // Fallback placeholder products
                          Array.from({ length: 6 }).map((_, idx) => (
                            <div
                              key={`placeholder-${idx}`}
                              className="product-mini"
                            >
                              <img
                                src="/img/placeholder.jpg"
                                alt="Sản phẩm"
                                loading="lazy"
                              />
                            </div>
                          ))}
                    </div>
                    {/* Decorative column */}
                    <div className="hero-column"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel controls */}
          <button
            className="carousel-btn carousel-btn-prev"
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
              )
            }
            aria-label="Previous slide"
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          <button
            className="carousel-btn carousel-btn-next"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
            }
            aria-label="Next slide"
          >
            <i className="ri-arrow-right-line"></i>
          </button>

          {/* Carousel dots */}
          <div className="carousel-dots">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom banners - Right aligned, 2 banners */}
        <div className="bottom-banners">
          <div className="container">
            <div className="bottom-banners-wrapper">
              <div className="bottom-banners-grid">
                {bottomBanners.map((banner) => (
                  <Link
                    key={banner.id}
                    to={banner.link}
                    className={`bottom-banner bottom-banner-${banner.type}`}
                    style={{ backgroundColor: banner.bgColor }}
                  >
                    {/* World map background for cancer banner */}
                    {banner.hasWorldMap && <div className="world-map-bg"></div>}

                    {/* Hex pattern for address banner */}
                    {banner.hasHexPattern && (
                      <div className="hex-pattern-bg"></div>
                    )}

                    <div className="bottom-banner-content">
                      <h3
                        className="bottom-banner-title"
                        style={{ color: banner.color }}
                      >
                        {banner.title}
                      </h3>
                      {banner.subtitle && (
                        <div className="bottom-banner-subtitle">
                          {banner.type === "address" ? (
                            <div className="subtitle-oval">
                              <p style={{ color: "#fff" }}>{banner.subtitle}</p>
                            </div>
                          ) : (
                            <p style={{ color: "#fff" }}>{banner.subtitle}</p>
                          )}
                        </div>
                      )}

                      {/* Logos below subtitle for cancer banner */}
                      {banner.logos && banner.logos.length > 0 && (
                        <div className="bottom-banner-logos">
                          {banner.logos.map((logo, idx) => (
                            <span key={idx} className="bottom-banner-logo">
                              {logo}
                            </span>
                          ))}
                        </div>
                      )}

                      {banner.buttonText && (
                        <button
                          className={`bottom-banner-btn btn-lookup`}
                          style={{
                            backgroundColor: banner.buttonColor || "#EF4444",
                            color: "#fff",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = banner.link;
                          }}
                        >
                          {banner.buttonText}
                        </button>
                      )}
                    </div>

                    {/* Visual elements */}
                    {banner.type === "cancer" && banner.ribbon && (
                      <div className="cancer-ribbon">🎗️</div>
                    )}
                    {banner.type === "address" && banner.mascot && (
                      <div className="robot-mascot">
                        <div className="robot-body">🤖</div>
                      </div>
                    )}
                    {banner.type === "address" && banner.hasMap && (
                      <div className="vietnam-map">
                        <i className="ri-map-pin-fill"></i>
                        <i className="ri-map-pin-fill"></i>
                        <i className="ri-map-pin-fill"></i>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="category-card"
                style={{ "--category-color": category.color }}
              >
                <div
                  className="category-icon"
                  style={{ background: category.color }}
                >
                  <i className={category.icon}></i>
                </div>
                <h3>{category.title}</h3>
                <ul className="category-subcategories">
                  {category.subcategories.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>
                <span className="category-link">
                  Xem thêm <i className="ri-arrow-right-line"></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">PharmaCity là gì?</h2>
            <p className="about-description">
              <strong>PharmaCity</strong> là nền tảng thương mại điện tử chuyên
              về thuốc và sản phẩm chăm sóc sức khỏe hàng đầu. Chúng tôi cung
              cấp đầy đủ các sản phẩm y tế từ thuốc kê đơn, thực phẩm chức năng,
              đến thiết bị y tế gia đình với cam kết chất lượng và giá cả tốt
              nhất.
            </p>
            <div className="service-cards-grid">
              {allServiceCards.map((card, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">
                    <i className={card.icon}></i>
                  </div>
                  <h3>{card.title}</h3>
                  {card.description && <p>{card.description}</p>}
                </div>
              ))}
            </div>
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
            {displayProducts.length > 0 ? (
              displayProducts.slice(0, 4).map((product) => (
                <article key={product.id} className="product-card">
                  {product.sale && (
                    <span className="product-badge">{product.sale}</span>
                  )}
                  <div className="product-image">
                    <img
                      src={
                        product.img || product.cover || "/img/placeholder.jpg"
                      }
                      alt={product.name || "Sản phẩm"}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/img/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="product-content">
                    {product.cat && (
                      <span className="product-category">{product.cat}</span>
                    )}
                    <h3 className="product-name">
                      {product.name || "Sản phẩm"}
                    </h3>
                    <div className="product-price">
                      {product.old && (
                        <span className="price-old">
                          {formatPrice(product.old)}
                        </span>
                      )}
                      <span className="price-current">
                        {formatPrice(product.price || 0)}
                      </span>
                    </div>
                    <div className="product-rating">
                      <div className="stars">
                        <i className="ri-star-fill"></i>
                        <span>{product.rating || 4.5}</span>
                      </div>
                      <span className="sold-count">
                        Đã bán {product.sold || 0}
                      </span>
                    </div>
                    <div className="product-separator"></div>
                    <button
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="ri-shopping-cart-line"></i>
                      Thêm vào giỏ
                    </button>
                    <div className="product-actions">
                      <button
                        className="btn-action"
                        onClick={() => handleQuickView(product)}
                      >
                        <i className="ri-eye-line"></i>
                        Xem nhanh
                      </button>
                      <Link
                        to={`/san-pham/${product.id}`}
                        className="btn-action"
                      >
                        <i className="ri-file-list-line"></i>
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="products-empty">
                <p>Chưa có sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DISEASES SECTION */}
      <section className="diseases-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Bệnh</h2>
              <p className="section-subtitle">
                Thông tin về các bệnh thường gặp
              </p>
            </div>
            <Link to="/bai-viet" className="section-link">
              Xem tất cả <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
          <div className="diseases-grid">
            {diseases.map((disease, index) => (
              <div key={index} className="disease-card">
                <div className="disease-header">
                  <i className={disease.icon}></i>
                  <h3>{disease.title}</h3>
                </div>
                <ul className="disease-list">
                  {disease.items.map((item, i) => (
                    <li key={i}>
                      <Link to={disease.link}>{item}</Link>
                    </li>
                  ))}
                </ul>
                <Link to={disease.link} className="disease-link">
                  Tìm hiểu thêm <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="blog-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">📰 Góc sức khỏe</h2>
              <p className="section-subtitle">
                Kiến thức y tế và mẹo sống khỏe
              </p>
            </div>
            <Link to="/bai-viet" className="section-link">
              Xem tất cả <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
          <div className="blog-grid">
            {featuredPosts.length > 0 ? (
              featuredPosts.slice(0, 4).map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-image">
                    <img
                      src={post.cover || "/img/placeholder.jpg"}
                      alt={post.title || "Bài viết"}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/img/placeholder.jpg";
                      }}
                    />
                    {post.cat && (
                      <span
                        className={`blog-badge blog-badge--${
                          post.cat === "Dinh dưỡng"
                            ? "green"
                            : post.cat === "Bệnh lý"
                            ? "red"
                            : post.cat === "Thuốc"
                            ? "blue"
                            : post.cat === "Mẹo sống khỏe"
                            ? "purple"
                            : "gray"
                        }`}
                      >
                        {post.cat}
                      </span>
                    )}
                  </div>
                  <div className="blog-content">
                    <h3 className="blog-title">
                      <Link to={`/bai-viet/${post.id}`}>
                        {post.title || "Bài viết"}
                      </Link>
                    </h3>
                    <p className="blog-excerpt">{post.excerpt || ""}</p>
                    <div className="blog-meta">
                      {post.date && (
                        <span className="blog-date">
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                      {post.readMin && (
                        <span className="blog-read">
                          {post.readMin} phút đọc
                        </span>
                      )}
                      {post.views && (
                        <span className="blog-views">
                          {post.views} lượt xem
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="blog-empty">
                <p>Chưa có bài viết nào</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng bắt đầu mua sắm?</h2>
            <p>
              Khám phá hàng ngàn sản phẩm chăm sóc sức khỏe với giá tốt nhất
            </p>
            <Link to="/thuoc" className="btn btn-cta">
              Xem tất cả sản phẩm
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quick && (
        <QuickViewModal
          data={quick}
          initialTab={quickTab}
          onAdd={(product) => {
            if (!user) {
              document.dispatchEvent(new CustomEvent("OPEN_AUTH"));
              setQuick(null);
              return;
            }
            try {
              const cartProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.cover || product.img,
              };
              addToCart(cartProduct, 1);
              setQuick(null);
            } catch (err) {
              console.error("Error adding to cart:", err);
            }
          }}
          onClose={() => setQuick(null)}
        />
      )}
    </main>
  );
}
