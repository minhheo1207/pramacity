// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageBar from "../components/PageBar";
import {
  getProductById,
  getRelatedProducts,
  addToCart,
} from "../services/products";
import "../assets/css/product-detail.css";

const vnd = (n) => n.toLocaleString("vi-VN") + "đ";

// Toast mini
function toast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  t.className = "toast-item";
  t.textContent = msg;
  wrap.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 250);
  }, 2200);
}

// Lưu và lấy đánh giá từ localStorage
const getReviews = (productId) => {
  try {
    const reviews = localStorage.getItem(`reviews_${productId}`);
    return reviews ? JSON.parse(reviews) : [];
  } catch {
    return [];
  }
};

const saveReview = (productId, review) => {
  try {
    const reviews = getReviews(productId);
    reviews.push(review);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
  } catch (err) {
    console.error("Lỗi khi lưu đánh giá:", err);
  }
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = getProductById(id);
  
  // State cho form đánh giá
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    content: "",
  });
  const [userReviews, setUserReviews] = useState([]);

  // Scroll to top khi id sản phẩm thay đổi (khi click vào sản phẩm liên quan)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Load đánh giá khi id thay đổi
  useEffect(() => {
    if (id) {
      setUserReviews(getReviews(id));
    }
  }, [id]);

  if (!product) {
    return (
      <main className="pd">
        <PageBar title="Sản phẩm không tồn tại" />
        <div className="container pd-empty">
          Không tìm thấy sản phẩm. Có thể sản phẩm đã được cập nhật lại.
        </div>
      </main>
    );
  }

  const related = getRelatedProducts(product, 3);

  const handleAdd = (p = product) => {
    try {
      addToCart(p, 1);
      toast(`Đã thêm "${p.name}" vào giỏ`);
    } catch (err) {
      // Error đã được xử lý trong addToCart (hiển thị toast và mở modal)
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!reviewForm.name.trim() || !reviewForm.content.trim()) {
      toast("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewForm.name.trim(),
      rating: reviewForm.rating,
      content: reviewForm.content.trim(),
      date: new Date().toISOString(),
    };

    saveReview(id, newReview);
    setUserReviews([...userReviews, newReview]);
    setReviewForm({ name: "", rating: 5, content: "" });
    setShowReviewForm(false);
    toast("Cảm ơn bạn đã đánh giá sản phẩm!");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Tính sale text từ old price nếu không có sale
  const calculateSale = () => {
    if (product.sale) return product.sale;
    const oldPrice = product.old || product.oldPrice;
    if (oldPrice && oldPrice > product.price) {
      const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100);
      return `-${discount}%`;
    }
    return "";
  };
  const saleText = calculateSale();

  return (
    <main className="pd">
      <PageBar title="Chi tiết sản phẩm" />

      {/* CARD 2 CỘT */}
      <div className="container pd-layout">
        {/* CỘT ẢNH */}
        <div>
          <div className="pd-media-main">
            {saleText && <span className="pd-sale-badge">{saleText}</span>}
            <img src={product.img || product.cover} alt={product.name} />
          </div>

          {/* thumbnails – tạm dùng lại ảnh chính */}
          <div className="pd-thumbs">
            {[1, 2, 3, 4].map((i) => (
              <button className="pd-thumb" key={i} type="button">
                <img src={product.img || product.cover} alt={product.name} />
              </button>
            ))}
          </div>

          <div className="pd-meta-small">
            <span>
              <i className="ri-shield-check-line" /> Hàng chính hãng
            </span>
            <span>
              <i className="ri-truck-line" /> Giao nhanh trong ngày
            </span>
            <span>
              <i className="ri-24-hours-line" /> Tư vấn dược sĩ 24/7
            </span>
          </div>
        </div>

        {/* CỘT THÔNG TIN */}
        <div className="pd-info">
          <nav className="pd-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>{product.cat}</span>
          </nav>

          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-rating-row">
            <span className="pd-rating">
              <i className="ri-star-fill" /> {product.rating.toFixed(1)}
            </span>
            <span className="pd-dot" />
            <span>
              Đã bán{" "}
              <b>{product.sold ? product.sold.toLocaleString("vi-VN") : 0}</b>{" "}
              sản phẩm
            </span>
          </div>

          <div className="pd-brand-row">
            <span>
              Thương hiệu: <b>{product.brand || "Đang cập nhật"}</b>
            </span>
            <span>Danh mục: {product.cat}</span>
          </div>

          {/* GIÁ */}
          <div className="pd-price-box">
            <div>
              <div className="pd-price-main">{vnd(product.price)}</div>
              {product.old && (
                <div className="pd-price-old">
                  Giá niêm yết:
                  <s>{vnd(product.old)}</s>
                </div>
              )}
            </div>
            {saleText && <span className="pd-price-tag">{saleText}</span>}
          </div>

          {/* NÚT */}
          <div className="pd-actions">
            <button
              type="button"
              className="btn btn-main"
              onClick={() => handleAdd()}
            >
              Chọn mua
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
            >
              ← Quay lại
            </button>
          </div>

          {/* THÔNG TIN SẢN PHẨM */}
          <div className="pd-section">
            <h3>Thông tin sản phẩm</h3>
            <ul className="pd-info-list">
              <li>
                <strong>Tên sản phẩm:</strong> {product.name}
              </li>
              {product.brand && (
                <li>
                  <strong>Thương hiệu:</strong> {product.brand}
                </li>
              )}
              {product.cat && (
                <li>
                  <strong>Nhóm công dụng:</strong> {product.cat}
                </li>
              )}
              <li>
                <strong>Giá:</strong> {vnd(product.price)}
              </li>
              {(product.old || product.oldPrice) && (
                <li>
                  <strong>Giá gốc:</strong>{" "}
                  <s>{vnd(product.old || product.oldPrice)}</s>
                </li>
              )}
              {saleText && (
                <li>
                  <strong>Giảm giá:</strong> {saleText}
                </li>
              )}
              <li>
                <strong>Đánh giá:</strong> ⭐ {product.rating ? product.rating.toFixed(1) : "4.8"}/5.0
              </li>
              <li>
                <strong>Đã bán:</strong>{" "}
                {product.sold ? product.sold.toLocaleString("vi-VN") : "0"}{" "}
                sản phẩm
              </li>
            </ul>
          </div>

          {/* MÔ TẢ */}
          <div className="pd-section">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.desc || "Sản phẩm chất lượng cao, được sản xuất theo tiêu chuẩn GMP. Phù hợp cho sử dụng hàng ngày."}</p>
          </div>

          <div className="pd-section pd-note">
            <h4>Lưu ý sử dụng</h4>
            <ul>
              <li>Đọc kỹ hướng dẫn sử dụng trước khi dùng.</li>
              <li>
                Nếu đang mang thai, cho con bú hoặc có bệnh nền, hãy hỏi ý kiến
                bác sĩ/dược sĩ.
              </li>
              <li>
                Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp, để xa tầm tay
                trẻ em.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SẢN PHẨM LIÊN QUAN */}
      {related.length > 0 && (
        <section className="pd-related">
          <h3 className="pd-related-title">Sản phẩm liên quan</h3>
          <div className="pd-related-grid">
            {related.map((p) => (
              <article key={p.id} className="pd-rel-card">
                <Link to={`/san-pham/${p.id}`} className="pd-rel-thumb">
                  <img src={p.img || p.cover} alt={p.name} />
                  {p.sale && <span className="pd-rel-sale">{p.sale}</span>}
                </Link>
                <div className="pd-rel-body">
                  <h4 className="pd-rel-name" title={p.name}>
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
                  </h4>
                  <div className="pd-rel-price">
                    <span>{vnd(p.price)}</span>
                    {p.old && <s>{vnd(p.old)}</s>}
                  </div>
                  <button
                    type="button"
                    className="btn btn-rel"
                    onClick={() => handleAdd(p)}
                  >
                    Thêm giỏ
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ĐÁNH GIÁ KHÁCH HÀNG */}
      <section className="pd-reviews">
        <div className="container">
          <div className="pd-section">
            <h3>Đánh giá của khách hàng</h3>
            <div className="reviews-summary">
              <div className="review-rating">
                <span className="review-score">{product.rating.toFixed(1)}</span>
                <span className="review-stars">★</span>
              </div>
              <span className="review-count">
                ({(product.sold || 0) + userReviews.length} đánh giá)
              </span>
            </div>
          </div>

          {/* Form đánh giá */}
          {!showReviewForm ? (
            <div className="review-form-toggle">
              <button
                type="button"
                className="btn btn-main"
                onClick={() => setShowReviewForm(true)}
              >
                <i className="ri-edit-line" /> Viết đánh giá
              </button>
            </div>
          ) : (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h4>Viết đánh giá của bạn</h4>
              
              <div className="review-form-group">
                <label>Tên của bạn *</label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, name: e.target.value })
                  }
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              <div className="review-form-group">
                <label>Đánh giá *</label>
                <div className="review-star-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${
                        star <= reviewForm.rating ? "active" : ""
                      }`}
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: star })
                      }
                    >
                      ★
                    </button>
                  ))}
                  <span className="star-label">
                    {reviewForm.rating === 5
                      ? "Rất tốt"
                      : reviewForm.rating === 4
                      ? "Tốt"
                      : reviewForm.rating === 3
                      ? "Bình thường"
                      : reviewForm.rating === 2
                      ? "Không tốt"
                      : "Rất không tốt"}
                  </span>
                </div>
              </div>

              <div className="review-form-group">
                <label>Nội dung đánh giá *</label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, content: e.target.value })
                  }
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  rows={5}
                  required
                />
              </div>

              <div className="review-form-actions">
                <button type="submit" className="btn btn-main">
                  Gửi đánh giá
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewForm({ name: "", rating: 5, content: "" });
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          )}

          <div className="reviews-list">
            {/* Đánh giá của khách hàng (hiển thị trước) */}
            {userReviews.map((review) => (
              <article key={review.id} className="review-item review-item--user">
                <div className="review-header">
                  <div className="review-avatar">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="review-info">
                    <h4>{review.name}</h4>
                    <div className="review-rating">
                      <span className="review-stars">
                        {renderStars(review.rating)}
                      </span>
                      <span className="review-date">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="review-body">
                  <p>{review.content}</p>
                </div>
              </article>
            ))}

            {/* Demo reviews */}
            <article className="review-item">
              <div className="review-header">
                <div className="review-avatar">N</div>
                <div className="review-info">
                  <h4>Nguyễn Văn A</h4>
                  <div className="review-rating">
                    <span className="review-stars">★★★★☆</span>
                    <span className="review-date">2 ngày trước</span>
                  </div>
                </div>
              </div>
              <div className="review-body">
                <p>Sản phẩm chất lượng tốt, giao hàng nhanh. Tôi rất hài lòng với dịch vụ của PharmaCity. Sẽ tiếp tục ủng hộ!</p>
              </div>
            </article>

            <article className="review-item">
              <div className="review-header">
                <div className="review-avatar">T</div>
                <div className="review-info">
                  <h4>Trần Thị B</h4>
                  <div className="review-rating">
                    <span className="review-stars">★★★★★</span>
                    <span className="review-date">1 tuần trước</span>
                  </div>
                </div>
              </div>
              <div className="review-body">
                <p>Hiệu quả rõ rệt sau 3 ngày sử dụng. Giá cả hợp lý và có tư vấn nhiệt tình từ dược sĩ. Rất đáng tiền!</p>
              </div>
            </article>

            <article className="review-item">
              <div className="review-header">
                <div className="review-avatar">L</div>
                <div className="review-info">
                  <h4>Lê Văn C</h4>
                  <div className="review-rating">
                    <span className="review-stars">★★★★☆</span>
                    <span className="review-date">3 tuần trước</span>
                  </div>
                </div>
              </div>
              <div className="review-body">
                <p>Đóng gói cẩn thận, sản phẩm đúng như mô tả. Hiệu quả ổn, nhưng tôi mong có thêm ưu đãi cho khách hàng thân thiết.</p>
              </div>
            </article>

            <article className="review-item">
              <div className="review-header">
                <div className="review-avatar">H</div>
                <div className="review-info">
                  <h4>Hoàng Thị D</h4>
                  <div className="review-rating">
                    <span className="review-stars">★★★★★</span>
                    <span className="review-date">1 tháng trước</span>
                  </div>
                </div>
              </div>
              <div className="review-body">
                <p>Tuyệt vời! Sản phẩm chính hãng 100%, giao hàng siêu nhanh. Đã giới thiệu cho bạn bè và gia đình sử dụng.</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
