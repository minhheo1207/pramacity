// src/pages/Account.jsx
import { useAuth } from "../utils/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { getOrdersByUser, seedOrdersIfEmpty } from "../services/orders";
import {
  getAddressesByUser,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addresses";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByProvinceAndDistrict,
} from "../data/vietnam-locations";
import OrderDetailModal from "../components/OrderDetailModal";
import Frame from "../components/Frame";

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // Modal chi tiết đơn
  const [openDetail, setOpenDetail] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Modal địa chỉ
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    isDefault: false,
  });

  // Dữ liệu địa danh
  const [availableProvinces] = useState(getProvinces());
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);

  // --- 🔎 Trạng thái tìm kiếm/lọc cho Đơn hàng ---
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); // all | pending | shipping | delivered | cancelled
  const [sort, setSort] = useState("newest"); // newest | oldest | totalDesc | totalAsc

  // --- ✏️ Trạng thái chỉnh sửa thông tin cá nhân ---
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    gender: "",
    birthday: "",
  });

  useEffect(() => {
    if (user?.id) {
      seedOrdersIfEmpty(user.id);
      setOrders(getOrdersByUser(user.id));
      setAddresses(getAddressesByUser(user.id));
    }
  }, [user?.id]);

  // Khởi tạo dữ liệu edit khi user thay đổi
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        phone: user.phone || "",
        gender: user.gender || "",
        birthday: user.birthday || "",
      });
    }
  }, [user]);

  const ordersCount = useMemo(() => orders.length, [orders]);

  // --- 🔎 Tính toán danh sách sau khi tìm kiếm/lọc/sắp xếp ---
  const filteredOrders = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase().trim();
    let list = orders.map((o) => ({
      ...o,
      subtotal: o.items.reduce((s, it) => s + it.price * it.qty, 0),
    }));

    // Tìm kiếm theo mã đơn, tên sản phẩm
    if (q.trim()) {
      const k = norm(q);
      list = list.filter(
        (o) =>
          norm(o.id).includes(k) ||
          o.items.some((it) => norm(it.name).includes(k))
      );
    }

    // Lọc theo trạng thái
    if (status !== "all") {
      list = list.filter((o) => o.status === status);
    }

    // Sắp xếp
    if (sort === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "oldest") list.sort((a, b) => a.createdAt - b.createdAt);
    if (sort === "totalDesc") list.sort((a, b) => b.subtotal - a.subtotal);
    if (sort === "totalAsc") list.sort((a, b) => a.subtotal - b.subtotal);

    return list;
  }, [orders, q, status, sort]);

  if (!user) {
    return (
      <main className="auth-empty">
        <div className="card">
          <div className="auth-empty-icon">
            <i className="ri-user-line"></i>
          </div>
          <h2>Vui lòng đăng nhập</h2>
          <p className="auth-empty-desc">
            Đăng nhập để quản lý tài khoản và đơn hàng của bạn
          </p>
          <a className="btn btn-primary" href="/login">
            <i className="ri-login-box-line"></i> Đăng nhập ngay
          </a>
        </div>
      </main>
    );
  }

  // Bật chế độ chỉnh sửa
  function handleEdit() {
    setIsEditing(true);
  }

  // Hủy chỉnh sửa
  function handleCancel() {
    setIsEditing(false);
    // Khôi phục dữ liệu gốc
    setEditData({
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      birthday: user.birthday || "",
    });
  }

  // Lưu thông tin đã chỉnh sửa
  async function handleSave(e) {
    e.preventDefault();
    try {
      await updateProfile({
        id: user.id,
        name: editData.name.trim(),
        phone: editData.phone.trim(),
        gender: editData.gender,
        birthday: editData.birthday,
      });
      setIsEditing(false);
      // Toast notification
      showToast("Đã cập nhật thông tin thành công!");
    } catch (error) {
      showToast("Có lỗi xảy ra khi cập nhật thông tin", "error");
    }
  }

  // Cập nhật từng field
  function handleFieldChange(field, value) {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }

  // Toast notification
  function showToast(message, type = "success") {
    let toastWrap = document.querySelector(".toast-wrap");
    if (!toastWrap) {
      toastWrap = document.createElement("div");
      toastWrap.className = "toast-wrap";
      document.body.appendChild(toastWrap);
    }
    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;
    toast.textContent = message;
    toastWrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // --- 📍 Xử lý địa chỉ ---
  function handleOpenAddressModal(addr = null) {
    if (addr) {
      setEditingAddress(addr);
      const province = addr.province || "";
      const district = addr.district || "";

      setAddressForm({
        name: addr.name || user.name || "",
        phone: addr.phone || user.phone || "",
        province: province,
        district: district,
        ward: addr.ward || "",
        street: addr.street || "",
        isDefault: addr.isDefault || false,
      });

      // Load districts và wards khi edit
      if (province) {
        setAvailableDistricts(getDistrictsByProvince(province));
        if (district) {
          setAvailableWards(getWardsByProvinceAndDistrict(province, district));
        } else {
          setAvailableWards([]);
        }
      } else {
        setAvailableDistricts([]);
        setAvailableWards([]);
      }
    } else {
      setEditingAddress(null);
      setAddressForm({
        name: user.name || "",
        phone: user.phone || "",
        province: "",
        district: "",
        ward: "",
        street: "",
        isDefault: addresses.length === 0, // Mặc định nếu chưa có địa chỉ nào
      });
      setAvailableDistricts([]);
      setAvailableWards([]);
    }
    setOpenAddressModal(true);
  }

  function handleProvinceChange(province) {
    const districts = province ? getDistrictsByProvince(province) : [];
    setAddressForm({
      ...addressForm,
      province: province,
      district: "", // Reset district khi đổi province
      ward: "", // Reset ward khi đổi province
    });
    setAvailableDistricts(districts);
    setAvailableWards([]);
  }

  function handleDistrictChange(district) {
    const wards =
      district && addressForm.province
        ? getWardsByProvinceAndDistrict(addressForm.province, district)
        : [];
    setAddressForm({
      ...addressForm,
      district: district,
      ward: "", // Reset ward khi đổi district
    });
    setAvailableWards(wards);
  }

  function handleCloseAddressModal() {
    setOpenAddressModal(false);
    setEditingAddress(null);
    setAddressForm({
      name: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      street: "",
      isDefault: false,
    });
  }

  function handleSaveAddress(e) {
    e.preventDefault();

    if (!addressForm.name.trim() || !addressForm.phone.trim()) {
      showToast("Vui lòng nhập đầy đủ thông tin người nhận", "error");
      return;
    }

    if (
      !addressForm.street.trim() ||
      !addressForm.ward.trim() ||
      !addressForm.district.trim() ||
      !addressForm.province.trim()
    ) {
      showToast("Vui lòng nhập đầy đủ địa chỉ", "error");
      return;
    }

    try {
      const addressData = {
        userId: user.id,
        name: addressForm.name.trim(),
        phone: addressForm.phone.trim(),
        province: addressForm.province.trim(),
        district: addressForm.district.trim(),
        ward: addressForm.ward.trim(),
        street: addressForm.street.trim(),
        isDefault: addressForm.isDefault,
      };

      if (editingAddress) {
        updateAddress(editingAddress.id, addressData);
        showToast("Đã cập nhật địa chỉ thành công!");
      } else {
        addAddress(addressData);
        showToast("Đã thêm địa chỉ thành công!");
      }

      setAddresses(getAddressesByUser(user.id));
      handleCloseAddressModal();
    } catch (error) {
      showToast("Có lỗi xảy ra khi lưu địa chỉ", "error");
      console.error("Error saving address:", error);
    }
  }

  function handleDeleteAddress(id) {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        deleteAddress(id);
        setAddresses(getAddressesByUser(user.id));
        showToast("Đã xóa địa chỉ thành công!");
      } catch (error) {
        showToast("Có lỗi xảy ra khi xóa địa chỉ", "error");
        console.error("Error deleting address:", error);
      }
    }
  }

  function handleSetDefault(id) {
    try {
      setDefaultAddress(id, user.id);
      setAddresses(getAddressesByUser(user.id));
      showToast("   Đã đặt làm địa chỉ mặc định!");
    } catch (error) {
      showToast("Có lỗi xảy ra", "error");
      console.error("Error setting default address:", error);
    }
  }

  async function onPickAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước file (tối đa 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ảnh không được vượt quá 2MB", "error");
      return;
    }

    // Kiểm tra định dạng file
    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn file ảnh hợp lệ", "error");
      return;
    }

    try {
      showToast("Đang tải ảnh...", "info");
      const b64 = await toB64(file);
      await updateProfile({
        id: user.id,
        name: user.name,
        phone: user.phone || "",
        avatar: b64,
      });
      // Reset input để có thể chọn lại cùng file
      e.target.value = "";
      showToast("Đã cập nhật ảnh đại diện!");
    } catch (error) {
      console.error("Error updating avatar:", error);
      showToast("Có lỗi xảy ra khi cập nhật ảnh", "error");
    }
  }

  // Tính toán thống kê đơn hàng
  const orderStats = useMemo(() => {
    const stats = {
      pending: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      if (stats[o.status] !== undefined) {
        stats[o.status]++;
      }
    });
    return stats;
  }, [orders]);

  return (
    <main className="account lc">
      <div className="account__wrap container">
        {/* SIDEBAR */}
        <aside className="acc-side">
          {/* Hero Card với gradient */}
          <div className="acc-card acc-hero">
            <div className="acc-ava-wrapper">
              <div className="acc-ava">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    key={user.avatar.substring(0, 50)}
                  />
                ) : (
                  <i className="ri-user-3-line"></i>
                )}
              </div>
              <label className="acc-ava-edit" title="Đổi ảnh đại diện">
                <i className="ri-camera-line"></i>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onPickAvatar}
                />
              </label>
            </div>
            <div className="acc-info">
              <div className="acc-name">{user.name}</div>
              <div className="acc-phone">
                <i className="ri-phone-line"></i> {user.phone || "Chưa có SĐT"}
              </div>
              <div className="acc-email">
                <i className="ri-mail-line"></i> {user.email}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="acc-nav acc-card">
            <button
              className={tab === "profile" ? "active" : ""}
              onClick={() => setTab("profile")}
            >
              <div className="nav-icon">
                <i className="ri-user-settings-line"></i>
              </div>
              <div className="nav-content">
                <span className="nav-title">Thông tin cá nhân</span>
                <span className="nav-desc">Quản lý hồ sơ của bạn</span>
              </div>
              <i className="ri-arrow-right-s-line chevron"></i>
            </button>
            <button
              className={tab === "orders" ? "active" : ""}
              onClick={() => setTab("orders")}
            >
              <div className="nav-icon">
                <i className="ri-file-list-3-line"></i>
              </div>
              <div className="nav-content">
                <span className="nav-title">Đơn hàng của tôi</span>
                <span className="nav-desc">
                  {ordersCount} đơn hàng
                  {orderStats.pending > 0 && (
                    <span className="nav-badge">
                      {orderStats.pending} chờ xử lý
                    </span>
                  )}
                </span>
              </div>
              <span className="pill">{ordersCount}</span>
              <i className="ri-arrow-right-s-line chevron"></i>
            </button>
            <button
              className={tab === "address" ? "active" : ""}
              onClick={() => setTab("address")}
            >
              <div className="nav-icon">
                <i className="ri-map-pin-line"></i>
              </div>
              <div className="nav-content">
                <span className="nav-title">Quản lý sổ địa chỉ</span>
                <span className="nav-desc">Địa chỉ giao hàng</span>
              </div>
              <i className="ri-arrow-right-s-line chevron"></i>
            </button>
            <button
              className={tab === "password" ? "active" : ""}
              onClick={() => setTab("password")}
            >
              <div className="nav-icon">
                <i className="ri-lock-2-line"></i>
              </div>
              <div className="nav-content">
                <span className="nav-title">Đổi mật khẩu</span>
                <span className="nav-desc">Bảo mật tài khoản</span>
              </div>
              <i className="ri-arrow-right-s-line chevron"></i>
            </button>
          </nav>
        </aside>

        {/* CONTENT */}
        <section className="acc-main">
          {tab === "profile" && (
            <Frame
              title="Thông tin cá nhân"
              actions={
                !isEditing ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleEdit}
                    type="button"
                  >
                    <i className="ri-edit-line"></i> Chỉnh sửa thông tin
                  </button>
                ) : (
                  <div className="frame-actions-group">
                    <button
                      className="btn btn--ghost"
                      onClick={handleCancel}
                      type="button"
                    >
                      <i className="ri-close-line"></i> Hủy
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      type="button"
                    >
                      <i className="ri-save-line"></i> Lưu thay đổi
                    </button>
                  </div>
                )
              }
            >
              <form onSubmit={handleSave} className="profile-form">
                <div className="profile-header">
                  <div className="profile-avatar-section">
                    <div className="acc-ava lg">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          key={user.avatar.substring(0, 50)}
                        />
                      ) : (
                        <i className="ri-user-3-line"></i>
                      )}
                    </div>
                    <div className="profile-avatar-info">
                      <h4>Ảnh đại diện</h4>
                      <p>JPG, PNG hoặc GIF. Tối đa 2MB</p>
                      <label className="btn btn-light sm">
                        <i className="ri-image-edit-line"></i> Chọn ảnh
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={onPickAvatar}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="profile-fields">
                  <div className="profile-field">
                    <label>
                      <i className="ri-user-line"></i> Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        className="profile-input"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    ) : (
                      <div className="profile-value">
                        <b>{user.name || "Chưa có thông tin"}</b>
                      </div>
                    )}
                  </div>

                  <div className="profile-field">
                    <label>
                      <i className="ri-mail-line"></i> Email
                    </label>
                    <div className="profile-value">
                      <b className="readonly">{user.email}</b>
                      <span className="field-note">
                        <i className="ri-information-line"></i> Email không thể
                        thay đổi
                      </span>
                    </div>
                  </div>

                  <div className="profile-field">
                    <label>
                      <i className="ri-phone-line"></i> Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) =>
                          handleFieldChange("phone", e.target.value)
                        }
                        className="profile-input"
                        placeholder="09xxxxxxxx"
                        pattern="[0-9]{10,11}"
                      />
                    ) : (
                      <div className="profile-value">
                        <b>{user.phone || "Chưa có thông tin"}</b>
                      </div>
                    )}
                  </div>

                  <div className="profile-field">
                    <label>
                      <i className="ri-genderless-line"></i> Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        value={editData.gender}
                        onChange={(e) =>
                          handleFieldChange("gender", e.target.value)
                        }
                        className="profile-input"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    ) : (
                      <div className="profile-value">
                        <b>
                          {editData.gender === "male"
                            ? "Nam"
                            : editData.gender === "female"
                            ? "Nữ"
                            : editData.gender === "other"
                            ? "Khác"
                            : "Chưa có thông tin"}
                        </b>
                      </div>
                    )}
                  </div>

                  <div className="profile-field">
                    <label>
                      <i className="ri-calendar-line"></i> Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.birthday}
                        onChange={(e) =>
                          handleFieldChange("birthday", e.target.value)
                        }
                        className="profile-input"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    ) : (
                      <div className="profile-value">
                        <b>
                          {editData.birthday
                            ? new Date(editData.birthday).toLocaleDateString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Chưa có thông tin"}
                        </b>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Frame>
          )}

          {tab === "orders" && (
            <>
              {/* Thống kê nhanh */}
              {ordersCount > 0 && (
                <div className="order-stats">
                  <div className="stat-card">
                    <div className="stat-icon stat-pending">
                      <i className="ri-time-line"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{orderStats.pending}</div>
                      <div className="stat-label">Chờ xử lý</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-shipping">
                      <i className="ri-truck-line"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{orderStats.shipping}</div>
                      <div className="stat-label">Đang giao</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-delivered">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{orderStats.delivered}</div>
                      <div className="stat-label">Đã giao</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Thanh công cụ: tìm kiếm + lọc + sắp xếp */}
              <div className="orders-toolbar">
                <div className="toolbar-search">
                  <i className="ri-search-line"></i>
                  <input
                    className="input"
                    placeholder="Tìm theo mã đơn / sản phẩm…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="totalDesc">Tổng tiền: cao → thấp</option>
                  <option value="totalAsc">Tổng tiền: thấp → cao</option>
                </select>
                {(q || status !== "all" || sort !== "newest") && (
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={() => {
                      setQ("");
                      setStatus("all");
                      setSort("newest");
                    }}
                  >
                    <i className="ri-close-line"></i> Xóa lọc
                  </button>
                )}
              </div>

              {/* Khung: Đơn hàng */}
              <Frame
                title={`Đơn hàng của tôi`}
                actions={
                  <span className="frame-subtitle">
                    {filteredOrders.length} / {ordersCount} đơn hàng
                  </span>
                }
              >
                {filteredOrders.length === 0 ? (
                  <div className="orders-empty">
                    <div className="empty-icon">
                      <i className="ri-shopping-bag-line"></i>
                    </div>
                    <h3>Không tìm thấy đơn hàng</h3>
                    <p>
                      {ordersCount === 0
                        ? "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!"
                        : "Không có đơn hàng nào phù hợp với bộ lọc của bạn."}
                    </p>
                    {ordersCount === 0 && (
                      <a href="/thuoc" className="btn btn-primary">
                        <i className="ri-shopping-cart-line"></i> Mua sắm ngay
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="orders-grid">
                    {filteredOrders.map((o) => (
                      <div
                        className="order-card"
                        key={o.id}
                        onClick={() => {
                          setActiveOrder(o);
                          setOpenDetail(true);
                        }}
                      >
                        <div className="order-head">
                          <div className="order-id">
                            <i className="ri-file-list-line"></i>
                            <b>#{o.id}</b>
                          </div>
                          <span className={`status ${o.status}`}>
                            {statusLabel(o.status)}
                          </span>
                        </div>
                        <ul className="order-items">
                          {o.items.slice(0, 3).map((it, idx) => (
                            <li key={idx}>
                              <i className="ri-capsule-line"></i>
                              <span className="item-name">{it.name}</span>
                              <span className="item-qty">× {it.qty}</span>
                              <em>{fmt(it.price * it.qty)}</em>
                            </li>
                          ))}
                          {o.items.length > 3 && (
                            <li className="order-more">
                              <i className="ri-more-line"></i>
                              <span>và {o.items.length - 3} sản phẩm khác</span>
                            </li>
                          )}
                        </ul>
                        <div className="order-foot">
                          <div className="order-date">
                            <i className="ri-calendar-line"></i>
                            <span>
                              {new Date(o.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                          <div className="order-total">
                            <span className="total-label">Tổng tiền</span>
                            <b>{fmt(o.subtotal)}</b>
                          </div>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrder(o);
                            setOpenDetail(true);
                          }}
                        >
                          <i className="ri-eye-line"></i> Xem chi tiết
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Frame>
            </>
          )}

          {tab === "address" && (
            <Frame
              title="Sổ địa chỉ"
              actions={
                <button
                  className="btn btn-primary"
                  onClick={() => handleOpenAddressModal()}
                >
                  <i className="ri-add-line"></i> Thêm địa chỉ
                </button>
              }
            >
              {addresses.length === 0 ? (
                <div className="address-empty">
                  <div className="empty-icon">
                    <i className="ri-map-pin-line"></i>
                  </div>
                  <h3>Bạn chưa lưu địa chỉ nào</h3>
                  <p>Thêm địa chỉ để việc đặt hàng trở nên nhanh chóng hơn</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenAddressModal()}
                  >
                    <i className="ri-add-line"></i> Thêm địa chỉ đầu tiên
                  </button>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-card ${
                        addr.isDefault ? "is-default" : ""
                      }`}
                    >
                      <div className="address-card__header">
                        <div className="address-card__title">
                          <b>{addr.name}</b>
                          {addr.isDefault && (
                            <span className="address-badge">Mặc định</span>
                          )}
                        </div>
                        <div className="address-card__phone">
                          <i className="ri-phone-line"></i>
                          {addr.phone}
                        </div>
                      </div>
                      <div className="address-card__body">
                        <div className="address-card__address">
                          <i className="ri-map-pin-line"></i>
                          <span>
                            {addr.street}, {addr.ward}, {addr.district},{" "}
                            {addr.province}
                          </span>
                        </div>
                      </div>
                      <div className="address-card__actions">
                        {!addr.isDefault && (
                          <button
                            className="btn btn-light btn-sm"
                            onClick={() => handleSetDefault(addr.id)}
                          >
                            <i className="ri-star-line"></i> Đặt mặc định
                          </button>
                        )}
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => handleOpenAddressModal(addr)}
                        >
                          <i className="ri-edit-line"></i> Sửa
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          <i className="ri-delete-bin-line"></i> Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Frame>
          )}

          {tab === "password" && (
            <Frame title="Đổi mật khẩu">
              <form
                className="form grid-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Chức năng đang được phát triển", "info");
                }}
              >
                <div className="form-field">
                  <label>
                    <i className="ri-lock-password-line"></i> Mật khẩu hiện tại
                  </label>
                  <input type="password" required minLength={4} />
                </div>
                <div className="form-field">
                  <label>
                    <i className="ri-key-line"></i> Mật khẩu mới
                  </label>
                  <input type="password" required minLength={4} />
                </div>
                <div className="form-field">
                  <label>
                    <i className="ri-key-2-line"></i> Nhập lại mật khẩu mới
                  </label>
                  <input type="password" required minLength={4} />
                </div>
                <div className="row-end">
                  <button className="btn btn-primary" type="submit">
                    <i className="ri-save-line"></i> Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </Frame>
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

      {/* Modal thêm/sửa địa chỉ */}
      {openAddressModal && (
        <div className="modal-backdrop" onClick={handleCloseAddressModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</h3>
              <button
                className="admin-modal__close"
                onClick={handleCloseAddressModal}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="admin-modal__body">
              <div className="form-group">
                <label>
                  <i className="ri-user-line"></i> Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.name}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, name: e.target.value })
                  }
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="form-group">
                <label>
                  <i className="ri-phone-line"></i> Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  placeholder="09xxxxxxxx"
                  pattern="[0-9]{10,11}"
                />
              </div>

              <div className="form-group">
                <label>
                  <i className="ri-building-line"></i> Tỉnh/Thành phố *
                </label>
                <select
                  required
                  value={addressForm.province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="form-select"
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {availableProvinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <i className="ri-map-pin-2-line"></i> Quận/Huyện *
                </label>
                <select
                  required
                  value={addressForm.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="form-select"
                  disabled={!addressForm.province}
                >
                  <option value="">
                    {addressForm.province
                      ? "Chọn Quận/Huyện"
                      : "Chọn Tỉnh/Thành phố trước"}
                  </option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <i className="ri-community-line"></i> Phường/Xã *
                </label>
                <select
                  required
                  value={addressForm.ward}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, ward: e.target.value })
                  }
                  className="form-select"
                  disabled={!addressForm.district}
                >
                  <option value="">
                    {addressForm.district
                      ? "Chọn Phường/Xã"
                      : "Chọn Quận/Huyện trước"}
                  </option>
                  {availableWards.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <i className="ri-road-map-line"></i> Số nhà, tên đường *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, street: e.target.value })
                  }
                  placeholder="Ví dụ: 123 Nguyễn Huệ"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        isDefault: e.target.checked,
                      })
                    }
                  />
                  <span>Đặt làm địa chỉ mặc định</span>
                </label>
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleCloseAddressModal}
                >
                  <i className="ri-close-line"></i> Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="ri-save-line"></i>{" "}
                  {editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
