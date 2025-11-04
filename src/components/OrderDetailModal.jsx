// src/components/OrderDetailModal.jsx
export default function OrderDetailModal({ open, order, user, onClose }) {
  if (!open || !order) return null;

  const subtotal = order.items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipFee = subtotal >= 300000 ? 0 : 15000;
  const total = subtotal + shipFee;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="om-head">
          <div>
            <b>Chi tiết đơn hàng</b> <span className="muted">#{order.id}</span>
          </div>
          <span className={`status ${order.status}`}>
            {statusLabel(order.status)}
          </span>
          <button className="om-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="om-body">
          {/* Cột trái: danh sách item */}
          <div className="om-col">
            <h4>Sản phẩm</h4>
            <ul className="om-items">
              {order.items.map((it, i) => (
                <li key={i}>
                  <div className="thumb">💊</div>
                  <div className="info">
                    <div className="name">{it.name}</div>
                    <div className="muted">x{it.qty}</div>
                  </div>
                  <div className="price">{fmt(it.price * it.qty)}</div>
                </li>
              ))}
            </ul>

            <div className="om-summary">
              <div>
                <span>Tạm tính</span>
                <b>{fmt(subtotal)}</b>
              </div>
              <div>
                <span>Phí vận chuyển</span>
                <b>{shipFee ? fmt(shipFee) : "Miễn phí"}</b>
              </div>
              <div className="total">
                <span>Tổng cộng</span>
                <b>{fmt(total)}</b>
              </div>
            </div>
          </div>

          {/* Cột phải: thông tin giao hàng + timeline */}
          <div className="om-col">
            <h4>Thông tin giao hàng</h4>
            <div className="om-card">
              <div>
                <span>Người nhận</span>
                <b>{user?.name}</b>
              </div>
              <div>
                <span>SĐT</span>
                <b>{user?.phone || "—"}</b>
              </div>
              <div>
                <span>Địa chỉ</span>
                <b>{order.address}</b>
              </div>
              <div>
                <span>Vận chuyển</span>
                <b>{order.shipping}</b>
              </div>
              <div>
                <span>Thanh toán</span>
                <b>{order.payment}</b>
              </div>
              {order.note && (
                <div>
                  <span>Ghi chú</span>
                  <b>{order.note}</b>
                </div>
              )}
              <div>
                <span>Ngày tạo</span>
                <b>{new Date(order.createdAt).toLocaleString()}</b>
              </div>
            </div>

            <h4>Tiến trình</h4>
            <ul className="om-timeline">
              {order.timeline?.map((t, idx) => (
                <li key={idx}>
                  <div className="dot" />
                  <div className="tl-content">
                    <b>{t.label}</b>
                    <div className="muted">
                      {new Date(t.at).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmt(n) {
  return n.toLocaleString("vi-VN") + "đ";
}
function statusLabel(s) {
  return (
    {
      shipping: "Đang giao",
      delivered: "Đã giao",
      pending: "Chờ xử lý",
      cancelled: "Đã hủy",
    }[s] || s
  );
}
