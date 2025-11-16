// src/utils/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

const USER_KEY = "pc_user"; // user đang đăng nhập
const USERS_KEY = "pc_users"; // danh sách user đã đăng ký

function loadUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    // Kiểm tra và tạo tài khoản mặc định nếu chưa có
    const hasAdmin = users.some((u) => u.email === "admin@gmail.com");
    const hasEmployee = users.some((u) => u.email === "nhanvien@gmail.com");
    
    if (!hasAdmin) {
      users.push({
        id: 1,
        name: "Administrator",
        email: "admin@gmail.com",
        password: "admin",
        phone: "",
        avatar: "",
        gender: "",
        birthday: "",
        role: "admin",
      });
    }
    
    if (!hasEmployee) {
      users.push({
        id: 2,
        name: "Nhân viên",
        email: "nhanvien@gmail.com",
        password: "nhanvien",
        phone: "",
        avatar: "",
        gender: "",
        birthday: "",
        role: "employee",
      });
    }
    
    // Lưu lại nếu đã thêm tài khoản mặc định
    if (!hasAdmin || !hasEmployee) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    return users;
  } catch {
    // Nếu lỗi, tạo tài khoản mặc định
    const defaultUsers = [
      {
        id: 1,
        name: "Administrator",
        email: "admin@gmail.com",
        password: "admin",
        phone: "",
        avatar: "",
        gender: "",
        birthday: "",
        role: "admin",
      },
      {
        id: 2,
        name: "Nhân viên",
        email: "nhanvien@gmail.com",
        password: "nhanvien",
        phone: "",
        avatar: "",
        gender: "",
        birthday: "",
        role: "employee",
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
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

  async function login(emailOrObj, password) {
    // Hỗ trợ cả object và tham số riêng lẻ
    let email, pass;
    if (typeof emailOrObj === "object" && emailOrObj !== null) {
      email = emailOrObj.email;
      pass = emailOrObj.password;
    } else {
      email = emailOrObj;
      pass = password;
    }

    const users = loadUsers();
    const found = users.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === pass
    );
    if (!found) throw new Error("Email hoặc mật khẩu không đúng");
    
    // Kiểm tra tài khoản bị khóa
    if (found.locked) {
      throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
    }
    
    // Không lưu password vào state
    const safe = {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone || "",
      avatar: found.avatar || "",
      gender: found.gender || "",
      birthday: found.birthday || "",
      role: found.role || "customer", // Mặc định là customer nếu không có role
    };
    setUser(safe);
    return safe;
  }

  async function register(nameOrObj, email, password) {
    // Hỗ trợ cả object và tham số riêng lẻ
    let name, emailVal, pass;
    if (typeof nameOrObj === "object" && nameOrObj !== null) {
      name = nameOrObj.name;
      emailVal = nameOrObj.email;
      pass = nameOrObj.password;
    } else {
      name = nameOrObj;
      emailVal = email;
      pass = password;
    }

    const users = loadUsers();
    const existed = users.some(
      (u) => u.email.trim().toLowerCase() === emailVal.trim().toLowerCase()
    );
    if (existed) throw new Error("Email đã tồn tại");

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: emailVal.trim().toLowerCase(),
      password: pass, // chỉ lưu ở DS users, không trả về qua state
      phone: "",
      avatar: "",
      gender: "",
      birthday: "",
      role: "customer", // Mặc định là customer khi đăng ký
    };
    users.push(newUser);
    saveUsers(users);

    const safe = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: "",
      avatar: "",
      gender: "",
      birthday: "",
      role: "customer",
    };
    setUser(safe);
    return safe;
  }

  // Alias cho register để tương thích với signup
  const signup = register;

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

  // Admin functions
  function getAllUsers() {
    return loadUsers().filter((u) => u.role === "customer" || !u.role);
  }

  function getAllEmployees() {
    return loadUsers().filter((u) => u.role === "employee");
  }

  function toggleUserLock(userId) {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("Không tìm thấy người dùng");
    
    users[idx].locked = !users[idx].locked;
    users[idx].status = users[idx].locked ? "locked" : "active";
    saveUsers(users);
    return users[idx];
  }

  function updateUser(userId, updates) {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("Không tìm thấy người dùng");
    
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    return users[idx];
  }

  function deleteUser(userId) {
    const users = loadUsers();
    const filtered = users.filter((u) => u.id !== userId);
    saveUsers(filtered);
    return true;
  }

  function createUser(userData) {
    const users = loadUsers();
    const existed = users.some(
      (u) => u.email.trim().toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (existed) throw new Error("Email đã tồn tại");

    const newUser = {
      id: Date.now(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password || "123456", // Mật khẩu mặc định
      phone: userData.phone || "",
      avatar: userData.avatar || "",
      gender: userData.gender || "",
      birthday: userData.birthday || "",
      role: userData.role || "customer",
      locked: false,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  }

  const value = {
    user,
    login,
    register,
    signup,
    logout,
    updateProfile,
    // Admin functions
    getAllUsers,
    getAllEmployees,
    toggleUserLock,
    updateUser,
    deleteUser,
    createUser,
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
