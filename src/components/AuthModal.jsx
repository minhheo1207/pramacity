import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";

export default function AuthModal({ open: openProp = false, onClose }) {
  const { login, register } = useAuth();
  const [open, setOpen] = useState(openProp);
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // 🔔 Cho phép mở modal từ mọi nơi bằng sự kiện "OPEN_AUTH"
  useEffect(() => {
    const fn = () => setOpen(true);
    document.addEventListener("OPEN_AUTH", fn);
    return () => document.removeEventListener("OPEN_AUTH", fn);
  }, []);

  // 🔄 Cập nhật khi prop thay đổi (nếu truyền open từ cha)
  useEffect(() => setOpen(openProp), [openProp]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      setOpen(false);
      if (onClose) onClose();
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="auth-backdrop"
      onClick={() => {
        setOpen(false);
        onClose?.();
      }}
    >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={() => {
            setOpen(false);
            onClose?.();
          }}
        >
          ×
        </button>

        <div className="auth-tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Đăng nhập
          </button>
          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Đăng ký
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {tab === "register" && (
            <label>
              Họ và tên
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              required
              minLength={4}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <button className="btn btn-primary" disabled={loading}>
            {loading
              ? "Đang xử lý..."
              : tab === "login"
              ? "Đăng nhập"
              : "Tạo tài khoản"}
          </button>
        </form>
      </div>
    </div>
  );
}
