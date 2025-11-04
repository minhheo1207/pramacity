// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await login({ email: data.email, password: data.password });
      navigate("/"); // về trang chủ
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-banner">
          <img src="/img/vitc.svg" alt="Login banner" />
        </div>
        <div className="auth-form">
          <h2>Đăng nhập</h2>
          <p>Chào mừng bạn quay lại Pharmacity!</p>

          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@email.com"
              />
            </label>
            <label>
              Mật khẩu
              <input
                name="password"
                type="password"
                required
                minLength={4}
                placeholder="••••"
              />
            </label>
            <button className="btn btn--block">Đăng nhập</button>
          </form>

          <p className="switch-link">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
