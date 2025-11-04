// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (data.password !== data.repassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-banner">
          <img src="/img/sunscreen.svg" alt="Register banner" />
        </div>
        <div className="auth-form">
          <h2>Đăng ký tài khoản</h2>
          <p>Tạo tài khoản để tận hưởng ưu đãi và tích điểm!</p>

          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>
              Họ tên
              <input name="name" required placeholder="Nguyễn Văn A" />
            </label>
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
            <label>
              Nhập lại mật khẩu
              <input
                name="repassword"
                type="password"
                required
                minLength={4}
                placeholder="••••"
              />
            </label>
            <button className="btn btn--block">Tạo tài khoản</button>
          </form>

          <p className="switch-link">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
