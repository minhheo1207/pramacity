// src/utils/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

const USER_KEY = "pc_user"; // user đang đăng nhập
const USERS_KEY = "pc_users"; // danh sách user đã đăng ký

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveUsers(arr) {
  localStorage.setItem(USERS_KEY, JSON.stringify(arr));
}

export function AuthProvider({ children }) {
  // Lấy user đang đăng nhập nếu có
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch {
      return null;
    }
  });

  // Đồng bộ user -> localStorage
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  async function login(email, password) {
    const users = loadUsers();
    const found = users.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!found) throw new Error("Email hoặc mật khẩu không đúng");
    // Không lưu password vào state
    const safe = {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone || "",
      avatar: found.avatar || "",
    };
    setUser(safe);
    return safe;
  }

  async function register(name, email, password) {
    const users = loadUsers();
    const existed = users.some(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (existed) throw new Error("Email đã tồn tại");

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password, // chỉ lưu ở DS users, không trả về qua state
      phone: "",
      avatar: "",
    };
    users.push(newUser);
    saveUsers(users);

    const safe = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: "",
      avatar: "",
    };
    setUser(safe);
    return safe;
  }

  function logout() {
    setUser(null);
  }

  async function updateProfile(partial) {
    // Cập nhật state hiện tại
    setUser((prev) => ({ ...prev, ...partial }));

    // Cập nhật trong danh sách đã đăng ký
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === partial.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...partial };
      saveUsers(users);
    }
  }

  const value = { user, login, register, logout, updateProfile };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
