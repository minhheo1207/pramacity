// src/services/auth.js
const USERS_KEY = "demo_users";
const TOKEN_KEY = "demo_token";
const PROFILE_KEY = "demo_profile";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signup({ name, email, password }) {
  const users = readUsers();
  if (users.some((u) => u.email === email))
    throw new Error("Email đã được đăng ký.");
  const user = { id: Date.now(), name, email, password, phone: "", avatar: "" };
  users.push(user);
  writeUsers(users);
  const token = String(user.id);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({ id: user.id, name, email, phone: "", avatar: "" })
  );
  return { token, user: { id: user.id, name, email, phone: "", avatar: "" } };
}

export async function login({ email, password }) {
  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Sai email hoặc mật khẩu.");
  const token = String(user.id);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
    })
  );
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
    },
  };
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

// NEW: cập nhật hồ sơ (name/phone/avatar)
export async function updateProfile({ id, name, phone, avatar }) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  users[idx] = {
    ...users[idx],
    name,
    phone,
    avatar: avatar ?? users[idx].avatar,
  };
  writeUsers(users);
  const profile = {
    id,
    name,
    email: users[idx].email,
    phone: users[idx].phone || "",
    avatar: users[idx].avatar || "",
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}
