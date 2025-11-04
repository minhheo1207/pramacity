// src/pages/Account.jsx
import { useAuth } from "../utils/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { getOrdersByUser, seedOrdersIfEmpty } from "../services/orders";
import OrderDetailModal from "../components/OrderDetailModal";
import PageBar from "../components/PageBar";
import Frame from "../components/Frame";

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState("profile");
  const [orders, setOrders] = useState([]);

  // Modal chi tiết đơn
  const [openDetail, setOpenDetail] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    if (user?.id) {
      seedOrdersIfEmpty(user.id);
      setOrders(getOrdersByUser(user.id));
    }
  }, [user?.id]);

  const ordersCount = useMemo(() => orders.length, [orders]);

  if (!user) {
    return (
      <main className="auth-empty">
        <div className="card">
          <h2>Vui lòng đăng nhập</h2>
          <a className="btn btn-primary" href="/login">
            Đăng nhập
          </a>
        </div>
      </main>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await updateProfile({
      id: user.id,
      name: f.get("name").toString().trim(),
      phone: f.get("phone").toString().trim(),
    });
    alert("Đã lưu hồ sơ!");
  }

  async function onPickAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await toB64(file);
    await updateProfile({
      id: user.id,
      name: user.name,
      phone: user.phone || "",
      avatar: b64,
    });
  }

  return (
    <main className="account lc">
      {/* ➊ Thanh xanh trên đầu trang */}
      <PageBar
        title="Tài khoản của tôi"
        subtitle="Quản lý hồ sơ, địa chỉ, đơn hàng và bảo mật"
      />

      <div className="account__wrap container">
        {/* SIDEBAR */}
        <aside className="acc-side">
          <div className="acc-card acc-hero">
            <div className="acc-ava">
              {user.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                <i className="ri-user-3-line"></i>
              )}
            </div>
            <div className="acc-name">{user.name}</div>
            <div className="acc-phone">{user.phone || "Chưa có SĐT"}</div>
            <label className="btn btn-light sm">
              <i className="ri-image-edit-line"></i> Đổi ảnh
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={onPickAvatar}
              />
            </label>
          </div>

          <nav className="acc-nav acc-card">
            <button
              className={tab === "profile" ? "active" : ""}
              onClick={() => setTab("profile")}
            >
              <i className="ri-user-settings-line"></i> Thông tin cá nhân{" "}
              <i className="ri-arrow-right-s-line chevron"></i>
            </button>
            <button
              className={tab === "orders" ? "active" : ""}
              onClick={() => setTab("orders")}
            >
              <i className="ri-file-list-3-line"></i> Đơn hàng của tôi{" "}
              <span className="pill">{ordersCount}</span>
              <i className="ri-arrow-right-s-line chevron"></i>
            </button>
            <button
              className={tab === "address" ? "active" : ""}
              onClick={() => setTab("address")}
            >
              <i className="ri-map-pin-line"></i> Quản lý sổ địa chỉ{" "}
              <i className="ri-arrow-right-s-line chevron"></i>
            </button>
            <button
              className={tab === "password" ? "active" : ""}
              onClick={() => setTab("password")}
            >
              <i className="ri-lock-2-line"></i> Đổi mật khẩu{" "}
              <i className="ri-arrow-right-s-line chevron"></i>
            </button>
          </nav>
        </aside>

        {/* CONTENT */}
        <section className="acc-main acc-card">
          {tab === "profile" && (
            <>
              {/* ➋ Khung 1: Thông tin cá nhân */}
              <Frame
                title="Thông tin cá nhân"
                actions={
                  <button className="btn btn-primary">
                    Chỉnh sửa thông tin
                  </button>
                }
              >
                <div className="profile-row">
                  <div className="acc-ava lg">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" />
                    ) : (
                      <i className="ri-user-3-line"></i>
                    )}
                  </div>
                  <div className="profile-table">
                    <div>
                      <span>Họ và tên</span>
                      <b>{user.name}</b>
                    </div>
                    <div>
                      <span>Email</span>
                      <b>{user.email}</b>
                    </div>
                    <div>
                      <span>Số điện thoại</span>
                      <b>{user.phone || "Thêm thông tin"}</b>
                    </div>
                    <div>
                      <span>Giới tính</span>
                      <b>Thêm thông tin</b>
                    </div>
                    <div>
                      <span>Ngày sinh</span>
                      <b>Thêm thông tin</b>
                    </div>
                  </div>
                </div>
              </Frame>

              {/* ➌ Khung 2: Form cập nhật */}
              <Frame title="Cập nhật hồ sơ">
                <form className="form grid-2" onSubmit={handleSave}>
                  <label>
                    Họ và tên
                    <input name="name" defaultValue={user.name} />
                  </label>
                  <label>
                    Số điện thoại
                    <input
                      name="phone"
                      defaultValue={user.phone || ""}
                      placeholder="09xxxxxxxx"
                    />
                  </label>
                  <div className="row-end">
                    <button className="btn btn-primary">Lưu thay đổi</button>
                  </div>
                </form>
              </Frame>
            </>
          )}

          {tab === "orders" && (
            <>
              {/* ➍ Khung: Đơn hàng */}
              <Frame title={`Đơn hàng của tôi (${ordersCount})`}>
                {orders.length === 0 ? (
                  <p>Chưa có đơn hàng.</p>
                ) : (
                  <div className="orders-grid">
                    {orders.map((o) => (
                      <div
                        className="order-card"
                        key={o.id}
                        onClick={() => {
                          setActiveOrder(o);
                          setOpenDetail(true);
                        }}
                      >
                        <div className="order-head">
                          <b>{o.id}</b>
                          <span className={`status ${o.status}`}>
                            {statusLabel(o.status)}
                          </span>
                        </div>
                        <ul className="order-items">
                          {o.items.map((it, idx) => (
                            <li key={idx}>
                              <i className="ri-capsule-line"></i> {it.name} ×{" "}
                              {it.qty}
                              <em>{fmt(it.price)}</em>
                            </li>
                          ))}
                        </ul>
                        <div className="order-foot">
                          <span>
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                          <b>
                            {fmt(
                              o.items.reduce(
                                (s, it) => s + it.price * it.qty,
                                0
                              )
                            )}
                          </b>
                        </div>
                        <button
                          className="btn btn-light sm"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrder(o);
                            setOpenDetail(true);
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Frame>
            </>
          )}

          {tab === "address" && (
            <>
              {/* ➎ Khung: Sổ địa chỉ */}
              <Frame
                title="Sổ địa chỉ"
                actions={
                  <button className="btn btn-primary">
                    <i className="ri-add-line"></i> Thêm địa chỉ
                  </button>
                }
              >
                <p>Bạn chưa lưu địa chỉ nào.</p>
              </Frame>
            </>
          )}

          {tab === "password" && (
            <>
              {/* ➏ Khung: Đổi mật khẩu */}
              <Frame title="Đổi mật khẩu">
                <form
                  className="form grid-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Demo: gọi API đổi mật khẩu");
                  }}
                >
                  <label>
                    Mật khẩu hiện tại
                    <input type="password" required minLength={4} />
                  </label>
                  <label>
                    Mật khẩu mới
                    <input type="password" required minLength={4} />
                  </label>
                  <label>
                    Nhập lại mật khẩu mới
                    <input type="password" required minLength={4} />
                  </label>
                  <div className="row-end">
                    <button className="btn btn-primary">Cập nhật</button>
                  </div>
                </form>
              </Frame>
            </>
          )}
        </section>
      </div>

      {/* Modal chi tiết đơn hàng */}
      <OrderDetailModal
        open={openDetail}
        order={activeOrder}
        user={user}
        onClose={() => setOpenDetail(false)}
      />
    </main>
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
function toB64(f) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(f);
  });
}
