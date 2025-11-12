import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function QuickViewModal({ data, onClose, onAdd }) {
  if (!data) return null;

  // Khóa cuộn khi mở modal, trả lại như cũ khi đóng
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  const node = (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="qv-header">
          <div className="qv-tabs">
            <button className="on">Tổng quan</button>
            <button>Chi tiết</button>
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
              <s>{data.oldPrice.toLocaleString("vi-VN")}đ</s>
            </div>

            <div className="qv-meta">
              <span>⭐ {data.rating?.toFixed?.(1) ?? "4.8"}</span>
              <span>Đã bán {data.sold?.toLocaleString?.("vi-VN") ?? "0"}</span>
            </div>

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
