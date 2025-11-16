// src/components/CartSidebar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  readCart,
  writeCart,
  dispatchCartUpdated,
  getProductById,
} from "../services/products";

export default function CartSidebar({ open, onClose }) {
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Lock body scroll when sidebar is open and listen for cart updates
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      loadCart();
    } else {
      document.body.style.overflow = "";
    }

    // Listen for cart updates from other pages
    const handleCartUpdate = () => {
      if (open) loadCart();
    };
    document.addEventListener("CART_UPDATED", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("CART_UPDATED", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, [open]);

  // Load cart and enrich with product details
  function loadCart() {
    const cartData = readCart();
    setCart(cartData);

    const enriched = cartData.map((item) => {
      const product = getProductById(item.id);
      return {
        ...item,
        ...product,
        qty: item.qty || 1,
      };
    });
    setCartItems(enriched);
  }

  // Format price
  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  }

  // Update quantity
  function updateQty(id, newQty) {
    if (newQty < 1) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: newQty } : item
    );
    writeCart(updated);
    dispatchCartUpdated();
    loadCart();
  }

  // Remove item
  function removeItem(id) {
    const updated = cart.filter((item) => item.id !== id);
    writeCart(updated);
    dispatchCartUpdated();
    loadCart();
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );
  const total = subtotal;

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay is-open" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="cart-sidebar is-open">
        <div className="cart-header">
          <h2>Giỏ hàng của bạn</h2>
          <button className="cart-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Giỏ hàng của bạn đang trống</p>
              <Link to="/ban-chay" className="btn" onClick={onClose}>
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={item.img || item.cover || "/img/vitc.png"}
                        alt={item.name}
                      />
                    </div>
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">
                        <Link to={`/san-pham/${item.id}`} onClick={onClose}>
                          {item.name}
                        </Link>
                      </h4>
                      <div className="cart-item-price">
                        {formatPrice(item.price || 0)}
                      </div>
                      <div className="cart-item-controls">
                        <div className="qty-wrapper">
                          <button
                            className="qty-btn qty-minus"
                            onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className="qty-input"
                            value={item.qty || 1}
                            min="1"
                            onChange={(e) =>
                              updateQty(item.id, parseInt(e.target.value) || 1)
                            }
                          />
                          <button
                            className="qty-btn qty-plus"
                            onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="cart-item-delete"
                          onClick={() => removeItem(item.id)}
                          title="Xóa sản phẩm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Tổng cộng:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              to="/gio-hang"
              className="btn btn--block btn-checkout"
              onClick={onClose}
            >
              Thanh toán
            </Link>
            <Link
              to="/ban-chay"
              className="cart-continue-link"
              onClick={onClose}
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

