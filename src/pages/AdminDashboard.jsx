// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProductCount,
} from "../services/categories";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
} from "../services/orders";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPostById,
} from "../services/posts";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByIdAdmin,
} from "../services/products";
import "../assets/css/admin.css";

// Mock data
const STATS = {
  totalUsers: 1250,
  totalOrders: 3420,
  totalRevenue: 125000000,
  totalProducts: 850,
  pendingOrders: 45,
  todayOrders: 23,
};

const RECENT_ORDERS = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    total: 250000,
    status: "pending",
    date: "2024-11-15 10:30",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    total: 180000,
    status: "shipping",
    date: "2024-11-15 09:15",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    total: 320000,
    status: "delivered",
    date: "2024-11-14 16:45",
  },
];

const PRODUCT_FORM_TEMPLATE = {
  name: "",
  price: "",
  old: "",
  cat: "",
  brand: "",
  img: "",
  cover: "",
  sale: "",
  rating: "4.5",
  sold: "0",
  desc: "",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoHome = () => {
    // Reset về tab dashboard (giao diện ban đầu)
    setActiveTab("dashboard");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs = [
    { id: "dashboard", label: "Tổng quan", icon: "ri-dashboard-line" },
    { id: "users", label: "Quản lý người dùng", icon: "ri-user-line" },
    { id: "employees", label: "Quản lý nhân viên", icon: "ri-team-line" },
    { id: "categories", label: "Quản lý danh mục", icon: "ri-folder-line" },
    {
      id: "products",
      label: "Quản lý sản phẩm",
      icon: "ri-shopping-cart-line",
    },
    { id: "orders", label: "Quản lý đơn hàng", icon: "ri-shopping-bag-line" },
    { id: "posts", label: "Quản lý tin tức", icon: "ri-article-line" },
    { id: "reports", label: "Báo cáo thống kê", icon: "ri-bar-chart-line" },
  ];

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h2>
            <i className="ri-admin-line"></i> Quản trị viên
          </h2>
        </div>
        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-nav__item ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <button className="admin-nav__item" onClick={handleGoHome}>
            <i className="ri-home-line"></i>
            <span>Về trang chủ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}</h1>
          <div className="admin-header__actions">
            <span className="admin-user">
              <i className="ri-user-3-line"></i>
              {user?.name || "Admin"}
            </span>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === "dashboard" && <DashboardOverview />}
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "employees" && <ManageEmployees />}
          {activeTab === "categories" && <ManageCategories />}
          {activeTab === "products" && <ManageProducts />}
          {activeTab === "orders" && <ManageOrders />}
          {activeTab === "posts" && <ManagePosts />}
          {activeTab === "reports" && <StatisticalReports />}
        </div>
      </main>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  return (
    <>
      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: "var(--primary-bg)", color: "var(--primary)" }}
          >
            <i className="ri-user-line"></i>
          </div>
          <div className="stat-card__content">
            <h3>{STATS.totalUsers.toLocaleString()}</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: "var(--success-bg)", color: "var(--success)" }}
          >
            <i className="ri-shopping-bag-line"></i>
          </div>
          <div className="stat-card__content">
            <h3>{STATS.totalOrders.toLocaleString()}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: "var(--warning-bg)", color: "var(--warning)" }}
          >
            <i className="ri-money-dollar-circle-line"></i>
          </div>
          <div className="stat-card__content">
            <h3>{(STATS.totalRevenue / 1000000).toFixed(1)}M</h3>
            <p>Doanh thu</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-card__icon"
            style={{ background: "var(--primary-bg)", color: "var(--primary)" }}
          >
            <i className="ri-box-line"></i>
          </div>
          <div className="stat-card__content">
            <h3>{STATS.totalProducts.toLocaleString()}</h3>
            <p>Tổng sản phẩm</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Đơn hàng gần đây</h3>
          <button className="btn btn--ghost btn-sm">Xem tất cả</button>
        </div>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.total.toLocaleString()}đ</td>
                  <td>
                    <span className={`badge badge--${order.status}`}>
                      {order.status === "pending" && "Chờ xử lý"}
                      {order.status === "shipping" && "Đang giao"}
                      {order.status === "delivered" && "Đã giao"}
                    </span>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <button className="btn btn--ghost btn-sm">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// Manage Users Component
function ManageUsers() {
  const { getAllUsers, toggleUserLock, updateUser, deleteUser, createUser } =
    useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search)
  );

  const handleToggleLock = (userId) => {
    try {
      toggleUserLock(userId);
      loadUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        deleteUser(userId);
        loadUsers();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
    });
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "", password: "" });
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          ...(formData.password && { password: formData.password }),
        });
      } else {
        createUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password || "123456",
          role: "customer",
        });
      }
      setShowAddModal(false);
      loadUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Quản lý tài khoản người dùng</h3>
          <div className="admin-actions">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="admin-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn" onClick={handleAdd}>
              Thêm người dùng
            </button>
          </div>
        </div>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Ngày tham gia</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <strong>{user.name}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td>
                      <span
                        className={`badge badge--${
                          user.locked ? "locked" : user.status || "active"
                        }`}
                      >
                        {user.locked
                          ? "Đã khóa"
                          : user.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </span>
                    </td>
                    <td>{user.joinDate || "-"}</td>
                    <td>
                      <div className="admin-actions-inline">
                        <button
                          className="btn btn--ghost btn-sm"
                          onClick={() => handleEdit(user)}
                        >
                          Sửa
                        </button>
                        <button
                          className={`btn btn--ghost btn-sm ${
                            user.locked ? "success" : "warning"
                          }`}
                          onClick={() => handleToggleLock(user.id)}
                          title={user.locked ? "Mở khóa" : "Khóa tài khoản"}
                        >
                          <i
                            className={
                              user.locked
                                ? "ri-lock-unlock-line"
                                : "ri-lock-line"
                            }
                          ></i>
                        </button>
                        <button
                          className="btn btn--ghost btn-sm danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editingUser ? "Sửa người dùng" : "Thêm người dùng"}</h3>
              <button
                className="admin-modal__close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="form-group">
                <label>Họ tên *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  Mật khẩu {editingUser ? "(để trống nếu không đổi)" : "*"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn">
                  {editingUser ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Manage Employees Component
function ManageEmployees() {
  const {
    getAllEmployees,
    toggleUserLock,
    updateUser,
    deleteUser,
    createUser,
  } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "consultant",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const allEmployees = getAllEmployees();
    setEmployees(allEmployees);
  };

  const handleToggleLock = (employeeId) => {
    try {
      toggleUserLock(employeeId);
      loadEmployees();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = (employeeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        deleteUser(employeeId);
        loadEmployees();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      password: "",
      role: employee.role || "consultant",
    });
    setShowAddModal(true);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "consultant",
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        updateUser(editingEmployee.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          ...(formData.password && { password: formData.password }),
        });
      } else {
        createUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password || "123456",
          role: "employee",
        });
      }
      setShowAddModal(false);
      loadEmployees();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Quản lý tài khoản nhân viên</h3>
          <button className="btn" onClick={handleAdd}>
            Thêm nhân viên
          </button>
        </div>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Chưa có nhân viên nào
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>
                      <strong>{emp.name}</strong>
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.role === "consultant" ? "Tư vấn" : "Quản lý"}</td>
                    <td>
                      <span
                        className={`badge badge--${
                          emp.locked
                            ? "locked"
                            : emp.status === "online"
                            ? "online"
                            : "offline"
                        }`}
                      >
                        {emp.locked
                          ? "Đã khóa"
                          : emp.status === "online"
                          ? "Đang trực tuyến"
                          : "Ngoại tuyến"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions-inline">
                        <button
                          className="btn btn--ghost btn-sm"
                          onClick={() => handleEdit(emp)}
                        >
                          Sửa
                        </button>
                        <button
                          className={`btn btn--ghost btn-sm ${
                            emp.locked ? "success" : "warning"
                          }`}
                          onClick={() => handleToggleLock(emp.id)}
                          title={emp.locked ? "Mở khóa" : "Khóa tài khoản"}
                        >
                          <i
                            className={
                              emp.locked
                                ? "ri-lock-unlock-line"
                                : "ri-lock-line"
                            }
                          ></i>
                        </button>
                        <button
                          className="btn btn--ghost btn-sm danger"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editingEmployee ? "Sửa nhân viên" : "Thêm nhân viên"}</h3>
              <button
                className="admin-modal__close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="form-group">
                <label>Họ tên *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Vai trò *</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="consultant">Tư vấn</option>
                  <option value="manager">Quản lý</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Mật khẩu {editingEmployee ? "(để trống nếu không đổi)" : "*"}
                </label>
                <input
                  type="password"
                  required={!editingEmployee}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn">
                  {editingEmployee ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Manage Categories Component
function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const allCategories = getAllCategories();
    // Get product count for each category
    const categoriesWithCount = allCategories.map((cat) => ({
      ...cat,
      count: getCategoryProductCount(cat.name),
    }));
    setCategories(categoriesWithCount);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", status: "active" });
    setShowAddModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      status: category.status || "active",
    });
    setShowAddModal(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        deleteCategory(categoryId);
        loadCategories();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        updateCategory(editingCategory.id, formData);
      } else {
        createCategory(formData);
      }
      setShowAddModal(false);
      loadCategories();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Quản lý danh mục</h3>
          <button className="btn" onClick={handleAdd}>
            Thêm danh mục
          </button>
        </div>
        <div className="admin-grid">
          {categories.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              Chưa có danh mục nào
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="category-card">
                <div className="category-card__header">
                  <h4>{cat.name}</h4>
                  <span className="badge badge--info">
                    {cat.count} sản phẩm
                  </span>
                </div>
                {cat.description && (
                  <p className="category-card__description">
                    {cat.description}
                  </p>
                )}
                <div className="category-card__status">
                  <span
                    className={`badge badge--${
                      cat.status === "active" ? "active" : "inactive"
                    }`}
                  >
                    {cat.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </div>
                <div className="category-card__actions">
                  <button
                    className="btn btn--ghost btn-sm"
                    onClick={() => handleEdit(cat)}
                  >
                    Sửa
                  </button>
                  <button className="btn btn--ghost btn-sm">
                    Xem sản phẩm
                  </button>
                  <button
                    className="btn btn--ghost btn-sm danger"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editingCategory ? "Sửa danh mục" : "Thêm danh mục"}</h3>
              <button
                className="admin-modal__close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="form-group">
                <label>Tên danh mục *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả danh mục"
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "var(--space-md)",
                    border: "2px solid var(--line)",
                    borderRadius: "var(--btn-radius)",
                    fontFamily: "inherit",
                    fontSize: "var(--font-size-sm)",
                    resize: "vertical",
                  }}
                />
              </div>
              <div className="form-group">
                <label>Trạng thái *</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn">
                  {editingCategory ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Manage Products Component
function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(() => ({
    ...PRODUCT_FORM_TEMPLATE,
  }));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
    const catList = getAllCategories();
    setCategories(catList);
    setFormData((prev) =>
      prev.cat
        ? prev
        : {
            ...prev,
            cat: catList[0]?.name || "",
          }
    );
  }, []);

  const loadProducts = () => {
    const allProducts = getAllProducts();
    setProducts(allProducts);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadProducts();
      setRefreshing(false);
    }, 400);
  };

  const categoryNames = Array.from(
    new Set([
      ...categories.map((cat) => cat.name),
      ...products.map((product) => product.cat),
    ])
  ).filter(Boolean);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      product.name?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.cat?.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "all" ? true : product.cat === categoryFilter;

    return matchesQuery && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getTimestamp = (item) =>
      item.updatedAt || item.createdAt || Number(item.id) || 0;
    switch (sortBy) {
      case "price-asc":
        return (a.price || 0) - (b.price || 0);
      case "price-desc":
        return (b.price || 0) - (a.price || 0);
      case "sold-desc":
        return (b.sold || 0) - (a.sold || 0);
      default:
        return getTimestamp(b) - getTimestamp(a);
    }
  });

  const totalValue = products.reduce(
    (sum, product) => sum + (Number(product.price) || 0),
    0
  );
  const avgPrice = products.length
    ? Math.round(totalValue / products.length)
    : 0;
  const bestSeller = products.reduce((best, product) => {
    if (!best) return product;
    return (product.sold || 0) > (best.sold || 0) ? product : best;
  }, null);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      ...PRODUCT_FORM_TEMPLATE,
      cat: categoryNames[0] || "",
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    const latestProduct = getProductByIdAdmin(product.id) || product;
    setEditingProduct(latestProduct);
    setFormData({
      name: latestProduct.name || "",
      price:
        latestProduct.price !== undefined ? String(latestProduct.price) : "",
      old: latestProduct.old ? String(latestProduct.old) : "",
      cat: latestProduct.cat || categoryNames[0] || "",
      brand: latestProduct.brand || "",
      img: latestProduct.img || "",
      cover: latestProduct.cover || "",
      sale: latestProduct.sale || "",
      rating:
        latestProduct.rating !== undefined ? String(latestProduct.rating) : "0",
      sold: latestProduct.sold !== undefined ? String(latestProduct.sold) : "0",
      desc: latestProduct.desc || "",
    });
    setShowModal(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        deleteProduct(productId);
        loadProducts();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      ...PRODUCT_FORM_TEMPLATE,
      cat: categoryNames[0] || "",
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Tên sản phẩm là bắt buộc");
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      alert("Giá bán phải lớn hơn 0");
      return false;
    }
    if (!formData.cat.trim()) {
      alert("Vui lòng chọn danh mục");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    name: formData.name.trim(),
    price: Number(formData.price),
    old: formData.old ? Number(formData.old) : null,
    cat: formData.cat.trim(),
    brand: formData.brand ? formData.brand.trim() : "",
    img: formData.img ? formData.img.trim() : "",
    cover: formData.cover ? formData.cover.trim() : "",
    sale: formData.sale ? formData.sale.trim() : "",
    rating: formData.rating ? Number(formData.rating) : 0,
    sold: formData.sold ? Number(formData.sold) : 0,
    desc: formData.desc ? formData.desc.trim() : "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = buildPayload();
      if (editingProduct) {
        updateProduct(editingProduct.id, payload);
      } else {
        createProduct(payload);
      }
      loadProducts();
      handleCloseModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return `${Number(value).toLocaleString("vi-VN")}đ`;
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Quản lý sản phẩm</h3>
          <div className="admin-actions">
            <button
              className="btn btn--ghost"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <i className="ri-refresh-line"></i>{" "}
              {refreshing ? "Đang tải..." : "Tải lại"}
            </button>
            <button className="btn" onClick={handleAdd}>
              <i className="ri-add-line"></i> Thêm sản phẩm
            </button>
          </div>
        </div>

        <div
          className="admin-stats"
          style={{ marginBottom: "var(--space-lg)" }}
        >
          <div className="stat-card">
            <div
              className="stat-card__icon"
              style={{
                background: "var(--primary-bg)",
                color: "var(--primary)",
              }}
            >
              <i className="ri-box-3-line"></i>
            </div>
            <div className="stat-card__content">
              <h3>{products.length}</h3>
              <p>Tổng sản phẩm</p>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-card__icon"
              style={{
                background: "var(--success-bg)",
                color: "var(--success)",
              }}
            >
              <i className="ri-stack-line"></i>
            </div>
            <div className="stat-card__content">
              <h3>{categoryNames.length}</h3>
              <p>Danh mục đang có</p>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-card__icon"
              style={{
                background: "var(--warning-bg)",
                color: "var(--warning)",
              }}
            >
              <i className="ri-price-tag-3-line"></i>
            </div>
            <div className="stat-card__content">
              <h3>{formatCurrency(avgPrice)}</h3>
              <p>Giá trung bình</p>
            </div>
          </div>
          <div className="stat-card">
            <div
              className="stat-card__icon"
              style={{ background: "var(--error-bg)", color: "var(--error)" }}
            >
              <i className="ri-fire-line"></i>
            </div>
            <div className="stat-card__content">
              <h3>{bestSeller ? bestSeller.name : "-"}</h3>
              <p>
                Bán chạy nhất{" "}
                {bestSeller
                  ? `(${bestSeller.sold?.toLocaleString() || 0})`
                  : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-table__filters">
          <form
            className="admin-search-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="Tìm theo tên, danh mục, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              <button type="submit" className="admin-search-btn">
                <i className="ri-search-line"></i> Tìm
              </button>
            </div>
          </form>
          <div className="admin-product-filters">
            <label className="admin-filter-label">Danh mục:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">Tất cả danh mục</option>
              {categoryNames.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label className="admin-filter-label">Sắp xếp:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="admin-filter-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="sold-desc">Bán chạy</option>
            </select>
          </div>
        </div>

        <div className="admin-table">
          {sortedProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              {searchQuery || categoryFilter !== "all"
                ? "Không tìm thấy sản phẩm phù hợp"
                : "Chưa có sản phẩm nào"}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Đã bán</th>
                  <th>Đánh giá</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.img || "/img/placeholder.jpg"}
                        alt={product.name}
                        style={{
                          width: "56px",
                          height: "56px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid var(--line)",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "/img/placeholder.jpg";
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ maxWidth: "260px" }}>
                        <strong>{product.name}</strong>
                        <br />
                        <small style={{ color: "var(--muted)" }}>
                          {product.brand || "Chưa có thương hiệu"}
                        </small>
                        {product.sale && (
                          <span
                            className="badge badge--info"
                            style={{ marginLeft: 8 }}
                          >
                            {product.sale}
                          </span>
                        )}
                        {product.desc && (
                          <>
                            <br />
                            <small style={{ color: "var(--muted)" }}>
                              {product.desc.length > 60
                                ? `${product.desc.substring(0, 60)}...`
                                : product.desc}
                            </small>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge--info">{product.cat}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong>{formatCurrency(product.price)}</strong>
                        {product.old && (
                          <small
                            style={{
                              textDecoration: "line-through",
                              color: "var(--muted)",
                            }}
                          >
                            {formatCurrency(product.old)}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>{product.sold?.toLocaleString() || 0}</td>
                    <td>
                      {product.rating
                        ? Number(product.rating).toFixed(1)
                        : "0.0"}
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          className="btn btn--ghost btn-sm"
                          onClick={() => handleEdit(product)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn--ghost btn-sm danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="admin-modal"
            style={{ maxWidth: "760px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal__header">
              <h3>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>
              <button className="admin-modal__close" onClick={handleCloseModal}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="form-group">
                <label>Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: Vitamin C 1000mg"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    value={formData.cat}
                    onChange={(e) =>
                      setFormData({ ...formData, cat: e.target.value })
                    }
                  >
                    {categoryNames.length === 0 ? (
                      <option value="">Chưa có danh mục</option>
                    ) : (
                      categoryNames.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))
                    )}
                  </select>
                  {categoryNames.length === 0 && (
                    <small style={{ color: "var(--muted)" }}>
                      Vui lòng thêm danh mục trước ở tab Danh mục
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label>Thương hiệu</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    placeholder="Ví dụ: PharmaCity"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label>Giá bán *</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Ví dụ: 150000"
                  />
                </div>
                <div className="form-group">
                  <label>Giá gốc</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.old}
                    onChange={(e) =>
                      setFormData({ ...formData, old: e.target.value })
                    }
                    placeholder="Nếu có"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nhãn hiển thị (Sale/NEW)</label>
                <input
                  type="text"
                  value={formData.sale}
                  onChange={(e) =>
                    setFormData({ ...formData, sale: e.target.value })
                  }
                  placeholder="-25% hoặc NEW"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label>Ảnh sản phẩm (URL)</label>
                  <input
                    type="text"
                    value={formData.img}
                    onChange={(e) =>
                      setFormData({ ...formData, img: e.target.value })
                    }
                    placeholder="/img/product.png hoặc https://..."
                  />
                  {formData.img && (
                    <div className="image-preview" style={{ marginTop: "8px" }}>
                      <img
                        src={formData.img}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "180px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid var(--line)",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "/img/placeholder.jpg";
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Ảnh banner (URL)</label>
                  <input
                    type="text"
                    value={formData.cover}
                    onChange={(e) =>
                      setFormData({ ...formData, cover: e.target.value })
                    }
                    placeholder="/banners/product.jpg"
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label>Đánh giá (0 - 5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Lượt bán</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.sold}
                    onChange={(e) =>
                      setFormData({ ...formData, sold: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  rows="4"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  placeholder="Thông tin mô tả ngắn gọn về sản phẩm"
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button type="submit" className="btn">
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Manage Orders Component
function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const allOrders = getAllOrders();
    // Transform orders to display format
    const formattedOrders = allOrders.map((order) => ({
      ...order,
      customer: `User ${order.userId}`,
      total: order.items.reduce((sum, item) => sum + item.price * item.qty, 0),
      date: new Date(order.createdAt).toLocaleString("vi-VN"),
    }));
    setOrders(formattedOrders);
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const handleStatusChange = (orderId, newStatus) => {
    try {
      updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleViewDetail = (orderId) => {
    const order = getOrderById(orderId);
    if (order) {
      setSelectedOrder({
        ...order,
        total: order.items.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        ),
        date: new Date(order.createdAt).toLocaleString("vi-VN"),
      });
      setShowDetailModal(true);
    }
  };

  const handlePrintInvoice = (orderId) => {
    const order = getOrderById(orderId);
    if (order) {
      // Create print window
      const printWindow = window.open("", "_blank");
      const total = order.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      printWindow.document.write(`
        <html>
          <head>
            <title>Hóa đơn ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <h1>HÓA ĐƠN BÁN HÀNG</h1>
            <p><strong>Mã đơn:</strong> ${order.id}</p>
            <p><strong>Ngày đặt:</strong> ${new Date(
              order.createdAt
            ).toLocaleString("vi-VN")}</p>
            <p><strong>Địa chỉ:</strong> ${order.address}</p>
            <p><strong>Phương thức vận chuyển:</strong> ${order.shipping}</p>
            <p><strong>Phương thức thanh toán:</strong> ${order.payment}</p>
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${item.price.toLocaleString()}đ</td>
                    <td>${(item.price * item.qty).toLocaleString()}đ</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <p class="total">Tổng tiền: ${total.toLocaleString()}đ</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        deleteOrder(orderId);
        loadOrders();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Quản lý đơn hàng</h3>
          <div className="admin-filters">
            <button
              className={`filter-chip ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tất cả ({orders.length})
            </button>
            <button
              className={`filter-chip ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Chờ xử lý ({orders.filter((o) => o.status === "pending").length})
            </button>
            <button
              className={`filter-chip ${filter === "shipping" ? "active" : ""}`}
              onClick={() => setFilter("shipping")}
            >
              Đang giao ({orders.filter((o) => o.status === "shipping").length})
            </button>
            <button
              className={`filter-chip ${
                filter === "delivered" ? "active" : ""
              }`}
              onClick={() => setFilter("delivered")}
            >
              Đã giao ({orders.filter((o) => o.status === "delivered").length})
            </button>
            <button
              className={`filter-chip ${
                filter === "cancelled" ? "active" : ""
              }`}
              onClick={() => setFilter("cancelled")}
            >
              Đã hủy ({orders.filter((o) => o.status === "cancelled").length})
            </button>
          </div>
        </div>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.total.toLocaleString()}đ</td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="shipping">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <div className="admin-actions-inline">
                        <button
                          className="btn btn--ghost btn-sm"
                          onClick={() => handleViewDetail(order.id)}
                        >
                          Chi tiết
                        </button>
                        <button
                          className="btn btn--ghost btn-sm"
                          onClick={() => handlePrintInvoice(order.id)}
                        >
                          In hóa đơn
                        </button>
                        <button
                          className="btn btn--ghost btn-sm danger"
                          onClick={() => handleDelete(order.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px" }}
          >
            <div className="admin-modal__header">
              <h3>Chi tiết đơn hàng {selectedOrder.id}</h3>
              <button
                className="admin-modal__close"
                onClick={() => setShowDetailModal(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="admin-modal__body">
              <div style={{ marginBottom: "var(--space-lg)" }}>
                <h4 style={{ marginBottom: "var(--space-md)" }}>
                  Thông tin đơn hàng
                </h4>
                <p>
                  <strong>Mã đơn:</strong> {selectedOrder.id}
                </p>
                <p>
                  <strong>Ngày đặt:</strong> {selectedOrder.date}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span className={`badge badge--${selectedOrder.status}`}>
                    {selectedOrder.status === "pending" && "Chờ xử lý"}
                    {selectedOrder.status === "shipping" && "Đang giao"}
                    {selectedOrder.status === "delivered" && "Đã giao"}
                    {selectedOrder.status === "cancelled" && "Đã hủy"}
                  </span>
                </p>
              </div>

              <div style={{ marginBottom: "var(--space-lg)" }}>
                <h4 style={{ marginBottom: "var(--space-md)" }}>
                  Thông tin giao hàng
                </h4>
                <p>
                  <strong>Địa chỉ:</strong> {selectedOrder.address}
                </p>
                <p>
                  <strong>Vận chuyển:</strong> {selectedOrder.shipping}
                </p>
                <p>
                  <strong>Thanh toán:</strong> {selectedOrder.payment}
                </p>
                {selectedOrder.note && (
                  <p>
                    <strong>Ghi chú:</strong> {selectedOrder.note}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "var(--space-lg)" }}>
                <h4 style={{ marginBottom: "var(--space-md)" }}>Sản phẩm</h4>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--primary-bg)" }}>
                      <th
                        style={{
                          padding: "var(--space-sm)",
                          textAlign: "left",
                        }}
                      >
                        Sản phẩm
                      </th>
                      <th
                        style={{
                          padding: "var(--space-sm)",
                          textAlign: "center",
                        }}
                      >
                        SL
                      </th>
                      <th
                        style={{
                          padding: "var(--space-sm)",
                          textAlign: "right",
                        }}
                      >
                        Đơn giá
                      </th>
                      <th
                        style={{
                          padding: "var(--space-sm)",
                          textAlign: "right",
                        }}
                      >
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "var(--space-sm)" }}>
                          {item.name}
                        </td>
                        <td
                          style={{
                            padding: "var(--space-sm)",
                            textAlign: "center",
                          }}
                        >
                          {item.qty}
                        </td>
                        <td
                          style={{
                            padding: "var(--space-sm)",
                            textAlign: "right",
                          }}
                        >
                          {item.price.toLocaleString()}đ
                        </td>
                        <td
                          style={{
                            padding: "var(--space-sm)",
                            textAlign: "right",
                          }}
                        >
                          {(item.price * item.qty).toLocaleString()}đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          padding: "var(--space-sm)",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        Tổng tiền:
                      </td>
                      <td
                        style={{
                          padding: "var(--space-sm)",
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "var(--font-size-lg)",
                        }}
                      >
                        {selectedOrder.total.toLocaleString()}đ
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: "var(--space-md)" }}>
                    Lịch sử đơn hàng
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-sm)",
                    }}
                  >
                    {selectedOrder.timeline.map((timeline, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "var(--space-sm)",
                          background: "var(--bg-light)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        <strong>{timeline.label}</strong> -{" "}
                        {new Date(timeline.at).toLocaleString("vi-VN")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="admin-modal__footer">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  handlePrintInvoice(selectedOrder.id);
                  setShowDetailModal(false);
                }}
              >
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Manage Posts Component
function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    cat: "Tin tức",
    cover: "",
    excerpt: "",
    content: "",
    author: "",
    readMin: 5,
    tags: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploadMethod, setImageUploadMethod] = useState("url"); // "url" or "file"

  const CATEGORIES = [
    "Tin tức",
    "Dinh dưỡng",
    "Bệnh lý",
    "Thuốc",
    "Mẹo sống khỏe",
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const allPosts = getAllPosts();
    setPosts(allPosts);
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.cat.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  });

  const handleAdd = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      cat: "Tin tức",
      cover: "",
      excerpt: "",
      content: "",
      author: "",
      readMin: 5,
      tags: "",
      date: new Date().toISOString().split("T")[0],
    });
    setImagePreview("");
    setImageUploadMethod("url");
    setShowAddModal(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      cat: post.cat,
      cover: post.cover,
      excerpt: post.excerpt,
      content: post.content || "",
      author: post.author,
      readMin: post.readMin || 5,
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
      date: post.date,
    });
    setImagePreview(post.cover || "");
    setImageUploadMethod(
      post.cover ? (post.cover.startsWith("data:") ? "file" : "url") : "url"
    );
    setShowAddModal(true);
  };

  const handleDelete = (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        deletePost(postId);
        loadPosts();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh hợp lệ");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({ ...formData, cover: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, cover: url });
    setImagePreview(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const postData = {
        ...formData,
        tags: tagsArray,
      };

      if (editingPost) {
        updatePost(editingPost.id, postData);
      } else {
        createPost(postData);
      }
      setShowAddModal(false);
      loadPosts();
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <>
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Quản lý tin tức</h3>
          <button className="btn" onClick={handleAdd}>
            <i className="ri-add-line"></i> Thêm bài viết
          </button>
        </div>

        <div className="admin-table__filters">
          <form
            className="admin-search-form"
            onSubmit={(e) => {
              e.preventDefault();
              // Search is already handled by searchQuery state
            }}
          >
            <div className="admin-search-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              <button type="submit" className="admin-search-btn">
                <i className="ri-search-line"></i> Tìm
              </button>
            </div>
          </form>
        </div>

        <div className="admin-table">
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              {searchQuery ? "Không tìm thấy bài viết" : "Chưa có bài viết nào"}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Tác giả</th>
                  <th>Ngày đăng</th>
                  <th>Lượt xem</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <img
                        src={post.cover || "/img/placeholder.jpg"}
                        alt={post.title}
                        style={{
                          width: "60px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "/img/placeholder.jpg";
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ maxWidth: "300px" }}>
                        <strong>{post.title}</strong>
                        <br />
                        <small style={{ color: "var(--muted)" }}>
                          {post.excerpt.length > 60
                            ? post.excerpt.substring(0, 60) + "..."
                            : post.excerpt}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge--info">{post.cat}</span>
                    </td>
                    <td>{post.author}</td>
                    <td>{formatDate(post.date)}</td>
                    <td>{post.views || 0}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          className="btn btn--ghost btn-sm"
                          onClick={() => handleEdit(post)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn--ghost btn-sm danger"
                          onClick={() => handleDelete(post.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "700px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal__header">
              <h3>{editingPost ? "Sửa bài viết" : "Thêm bài viết mới"}</h3>
              <button
                className="admin-modal__close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="form-group">
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>

              <div className="form-group">
                <label>Danh mục *</label>
                <select
                  required
                  value={formData.cat}
                  onChange={(e) =>
                    setFormData({ ...formData, cat: e.target.value })
                  }
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ảnh bìa</label>
                <div className="image-upload-tabs">
                  <button
                    type="button"
                    className={`upload-tab ${
                      imageUploadMethod === "url" ? "active" : ""
                    }`}
                    onClick={() => setImageUploadMethod("url")}
                  >
                    <i className="ri-link"></i> Link URL
                  </button>
                  <button
                    type="button"
                    className={`upload-tab ${
                      imageUploadMethod === "file" ? "active" : ""
                    }`}
                    onClick={() => setImageUploadMethod("file")}
                  >
                    <i className="ri-upload-2-line"></i> Tải lên
                  </button>
                </div>
                {imageUploadMethod === "url" ? (
                  <input
                    type="text"
                    value={formData.cover}
                    onChange={handleImageUrlChange}
                    placeholder="/blog/image.jpg hoặc https://example.com/image.jpg"
                  />
                ) : (
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="file-input"
                      id="cover-image-upload"
                    />
                    <label
                      htmlFor="cover-image-upload"
                      className="file-upload-label"
                    >
                      <i className="ri-image-add-line"></i>
                      <span>Chọn ảnh từ máy tính</span>
                    </label>
                  </div>
                )}
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => {
                        setImagePreview("");
                        setFormData({ ...formData, cover: "" });
                      }}
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Tóm tắt *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Nhập tóm tắt bài viết"
                />
              </div>

              <div className="form-group">
                <label>Nội dung</label>
                <textarea
                  rows="8"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Nhập nội dung bài viết (HTML được hỗ trợ)"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label>Tác giả</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="Tên tác giả"
                  />
                </div>

                <div className="form-group">
                  <label>Thời gian đọc (phút)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.readMin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        readMin: parseInt(e.target.value) || 5,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="Ví dụ: Vitamin, Sức khỏe, Dinh dưỡng"
                />
              </div>

              <div className="form-group">
                <label>Ngày đăng</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn">
                  {editingPost ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function StatisticalReports() {
  return (
    <div className="admin-reports">
      <div className="admin-card">
        <div className="admin-card__header">
          <h3>Báo cáo doanh thu</h3>
          <select className="period-select">
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>3 tháng qua</option>
            <option>Năm nay</option>
          </select>
        </div>
        <div className="report-chart">
          <div className="chart-placeholder">
            <i className="ri-bar-chart-line"></i>
            <p>Biểu đồ doanh thu</p>
            <small>Dữ liệu sẽ được hiển thị ở đây</small>
          </div>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-card">
          <h4>Đơn hàng theo trạng thái</h4>
          <div className="stat-list">
            <div className="stat-item">
              <span>Chờ xử lý</span>
              <strong>{STATS.pendingOrders}</strong>
            </div>
            <div className="stat-item">
              <span>Đang giao</span>
              <strong>12</strong>
            </div>
            <div className="stat-item">
              <span>Đã giao</span>
              <strong>320</strong>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h4>Hoạt động hôm nay</h4>
          <div className="stat-list">
            <div className="stat-item">
              <span>Đơn hàng mới</span>
              <strong>{STATS.todayOrders}</strong>
            </div>
            <div className="stat-item">
              <span>Người dùng mới</span>
              <strong>5</strong>
            </div>
            <div className="stat-item">
              <span>Doanh thu</span>
              <strong>2.5M</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
