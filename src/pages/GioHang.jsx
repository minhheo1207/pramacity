// src/pages/GioHang.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBar from "../components/PageBar";
import {
  readCart,
  writeCart,
  dispatchCartUpdated,
  getProductById,
  PRODUCTS,
} from "../services/products";

export default function GioHang() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    loadCart();
    
    // Listen for cart updates from other pages
    const handleCartUpdate = () => {
      loadCart();
    };
    window.addEventListener("storage", handleCartUpdate);
    document.addEventListener("CART_UPDATED", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      document.removeEventListener("CART_UPDATED", handleCartUpdate);
    };
  }, []);

  // Load cart and enrich with product details
  function loadCart() {
    const cartData = readCart();
    setCart(cartData);

    // Enrich cart items with product details
    const enriched = cartData.map((item) => {
      const product = getProductById(item.id);
      return {
        ...item,
        ...product,
        // Keep cart qty if exists
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

  // Remove item from cart
  function removeItem(id) {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      const updated = cart.filter((item) => item.id !== id);
      writeCart(updated);
      dispatchCartUpdated();
      loadCart();
    }
  }

  // Clear entire cart
  function clearCart() {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      writeCart([]);
      dispatchCartUpdated();
      loadCart();
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );
  const shipping = subtotal >= 300000 ? 0 : 30000;
  const total = subtotal + shipping;

  // Handle checkout
  function handleCheckout() {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    alert("Chức năng thanh toán sẽ được tích hợp sau!");
    // Navigate to checkout page when ready
    // navigate('/thanh-toan');
  }

  return (
    <main className="lc cart-page">
      <PageBar
        title="Giỏ hàng của bạn"
        subtitle={`${cartItems.length} sản phẩm trong giỏ hàng`}
        right={
          cartItems.length > 0 && (
            <button className="btn btn--ghost" onClick={clearCart}>
              Xóa tất cả
            </button>
          )
        }
      />

      <div className="container">
        {cartItems.length === 0 ? (
          // Empty cart
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
            <Link to="/ban-chay" className="btn">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items List */}
            <section className="cart-items-section">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <Link to={`/san-pham/${item.id}`}>
                        <img
                          src={item.img || item.cover || "/img/vitc.png"}
                          alt={item.name}
                        />
                      </Link>
                    </div>

                    <div className="cart-item-info">
                      <h3 className="cart-item-name">
                        <Link to={`/san-pham/${item.id}`}>{item.name}</Link>
                      </h3>
                      {item.brand && (
                        <div className="cart-item-brand">{item.brand}</div>
                      )}

                      <div className="cart-item-price-row">
                        {item.old && (
                          <span className="price--old">
                            {formatPrice(item.old)}
                          </span>
                        )}
                        <span className="price">
                          {formatPrice(item.price || 0)}
                        </span>
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

                        <div className="cart-item-total">
                          {formatPrice((item.price || 0) * (item.qty || 1))}
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
            </section>

            {/* Cart Summary */}
            <aside className="cart-summary">
              <div className="cart-summary-box">
                <h3>Tóm tắt đơn hàng</h3>

                <div className="cart-summary-row">
                  <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="cart-summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="free-shipping">Miễn phí</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {subtotal < 300000 && (
                  <div className="shipping-notice">
                    💡 Mua thêm {formatPrice(300000 - subtotal)} để được miễn
                    phí ship!
                  </div>
                )}

                <div className="cart-summary-row cart-summary-total">
                  <span>Tổng cộng:</span>
                  <span className="total-price">{formatPrice(total)}</span>
                </div>

                <button
                  className="btn btn--block btn-checkout"
                  onClick={handleCheckout}
                >
                  Thanh toán
                </button>

                <Link
                  to="/ban-chay"
                  className="btn btn--ghost btn--block"
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>

              {/* Promo code section (optional) */}
              <div className="cart-promo">
                <h4>Mã giảm giá</h4>
                <div className="promo-input-group">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="promo-input"
                  />
                  <button className="btn btn--ghost">Áp dụng</button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

