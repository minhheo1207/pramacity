// src/components/CartButton.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cartTotalQty } from "../services/products";

export default function CartButton() {
  const [qty, setQty] = useState(0);

  useEffect(() => {
    // Lần đầu vào lấy tổng số lượng hiện có
    setQty(cartTotalQty());

    // Lắng nghe event từ addToCart / xoá giỏ...
    const handler = (e) => {
      if (e.detail && typeof e.detail.qty === "number") {
        setQty(e.detail.qty);
      } else {
        setQty(cartTotalQty());
      }
    };

    document.addEventListener("CART_UPDATED", handler);
    return () => document.removeEventListener("CART_UPDATED", handler);
  }, []);

  return (
    <Link to="/gio-hang" className="header-cart" aria-label="Giỏ hàng">
      {/* vành ngoài mờ mờ */}
      <span className="header-cart__halo" />

      {/* vòng tròn chính */}
      <span className="header-cart__btn">
        {/* icon, bạn có thể đổi sang <i className="ri-shopping-cart-2-line" /> */}
        <span className="header-cart__icon">🛒</span>

        {/* badge xanh – chỉ hiện khi qty > 0 */}
        {qty > 0 && (
          <span className="header-cart__badge">{qty > 99 ? "99+" : qty}</span>
        )}
      </span>
    </Link>
  );
}
