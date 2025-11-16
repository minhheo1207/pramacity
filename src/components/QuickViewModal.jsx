import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function QuickViewModal({ data, onClose, onAdd, initialTab = "tong-quan" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  if (!data) return null;

  // Khóa cuộn khi mở modal, trả lại như cũ khi đóng
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Cập nhật tab khi initialTab thay đổi
    setActiveTab(initialTab);
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [initialTab]);

  const node = (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="qv-header">
          <div className="qv-tabs">
            <button 
              className={activeTab === "tong-quan" ? "on" : ""}
              onClick={() => setActiveTab("tong-quan")}
            >
              Tổng quan
            </button>
            <button 
              className={activeTab === "chi-tiet" ? "on" : ""}
              onClick={() => setActiveTab("chi-tiet")}
            >
              Chi tiết
            </button>
          </div>
          <button className="qv-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="qv-body">
          <div
            className="qv-media"
            style={{ backgroundImage: `url(${data.cover || data.img})` }}
          >
            <span className="qv-badge off">-{data.discount}%</span>
            <span className="qv-badge tag">{data.tag}</span>
          </div>

          <div className="qv-info">
            <h3 className="qv-title">{data.name}</h3>

            <div className="qv-price">
              <b>{data.price.toLocaleString("vi-VN")}đ</b>
              <s>{data.oldPrice?.toLocaleString("vi-VN")}đ</s>
            </div>

            <div className="qv-meta">
              <span>⭐ {data.rating?.toFixed?.(1) ?? "4.8"}</span>
              <span>Đã bán {data.sold?.toLocaleString?.("vi-VN") ?? "0"}</span>
            </div>

            {/* Tab Content */}
            {activeTab === "tong-quan" ? (
              <>
                <p className="qv-desc">
                  Sản phẩm đang được ưu đãi mạnh. Thêm vào giỏ để giữ giá ngay!
                </p>

                <div className="qv-actions">
                  <button
                    className="qv-btn qv-primary"
                    onClick={() => onAdd?.(data)}
                  >
                    <i className="ri-shopping-cart-2-line" />
                    Thêm vào giỏ
                  </button>
                  <button className="qv-btn" onClick={onClose}>
                    Đóng
                  </button>
                </div>
              </>
            ) : (
              <div className="qv-detail">
                <div className="qv-detail-section">
                  <h4>Thông tin sản phẩm</h4>
                  <ul>
                    <li><strong>Tên sản phẩm:</strong> {data.name}</li>
                    {data.brand && <li><strong>Thương hiệu:</strong> {data.brand}</li>}
                    {data.form && <li><strong>Dạng bào chế:</strong> {data.form}</li>}
                    {data.tag && <li><strong>Nhóm công dụng:</strong> {data.tag}</li>}
                    <li><strong>Giá:</strong> {data.price.toLocaleString("vi-VN")}đ</li>
                    {data.oldPrice && (
                      <li><strong>Giá gốc:</strong> <s>{data.oldPrice.toLocaleString("vi-VN")}đ</s></li>
                    )}
                    {data.discount && (
                      <li><strong>Giảm giá:</strong> -{data.discount}%</li>
                    )}
                    <li><strong>Đánh giá:</strong> ⭐ {data.rating?.toFixed?.(1) ?? "4.8"}/5.0</li>
                    <li><strong>Đã bán:</strong> {data.sold?.toLocaleString("vi-VN") ?? "0"} sản phẩm</li>
                  </ul>
                </div>

                <div className="qv-detail-section">
                  <h4>Mô tả sản phẩm</h4>
                  <p>
                    {data.desc || "Sản phẩm chất lượng cao, được sản xuất theo tiêu chuẩn GMP. Phù hợp cho sử dụng hàng ngày."}
                  </p>
                </div>

                <div className="qv-detail-section">
                  <h4>Hướng dẫn sử dụng</h4>
                  <p>
                    Vui lòng đọc kỹ hướng dẫn sử dụng trước khi dùng. Nếu có bất kỳ thắc mắc nào, 
                    hãy liên hệ với dược sĩ hoặc bác sĩ để được tư vấn chi tiết.
                  </p>
                </div>

                <div className="qv-actions">
                  <button
                    className="qv-btn qv-primary"
                    onClick={() => onAdd?.(data)}
                  >
                    <i className="ri-shopping-cart-2-line" />
                    Thêm vào giỏ
                  </button>
                  <button className="qv-btn" onClick={onClose}>
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="qv-footer">
          <div className="qv-coupon">
            <i className="ri-ticket-2-line" />
            Mã hot hôm nay: <code>SKIN30</code>
          </div>
          <small>Giao nhanh 2h tại nội thành.</small>
        </div>
      </div>
    </div>
  );

  // Dùng portal để modal luôn phủ toàn trang, không bị overflow/stacking chặn
  return createPortal(node, document.body);
}
