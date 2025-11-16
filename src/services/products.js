// src/services/products.js
export const CART_KEY = "demo_cart";

export const PRODUCTS = [
  {
    id: 1,
    name: "Khẩu trang 4D (10 cái)",
    img: "/img/mask.png", // thumb cũ (vẫn giữ)
    cover: "/banchay/khautrangmau.png", // ảnh banner lớn trong public/banchay
    price: 30000,
    old: 40000,
    sale: "-25%",
    cat: "Khẩu trang",
    brand: "MedPro",
    rating: 4.6,
    sold: 5100,
    desc: "Khẩu trang 4D lọc bụi mịn, thoáng khí, phù hợp da nhạy cảm.",
  },
  {
    id: 2,
    name: "Khẩu trang 4D (10 cái)",
    img: "/img/mask.png",
    cover: "/banchay/khautrangbth.png",
    price: 30000,
    old: 40000,
    sale: "-25%",
    cat: "Khẩu trang",
    brand: "MedPro",
    rating: 4.6,
    sold: 5100,
    desc: "Khẩu trang 4D lọc bụi mịn, thoáng khí, phù hợp da nhạy cảm.",
  },
  {
    id: 3,
    name: "Nhiệt kế điện tử",
    img: "/img/thermo.png",
    price: 120000,
    old: 150000,
    sale: "-20%",
    cat: "Thiết bị y tế",
    brand: "MedPro",
    rating: 4.7,
    sold: 2100,
    desc: "Nhiệt kế đo trán/miệng, cho kết quả nhanh và chính xác.",
  },
  {
    id: 4,
    name: "Kem chống nắng SPF50",
    img: "/img/sunscreen.png",
    price: 160000,
    old: null,
    sale: "NEW",
    cat: "Chăm sóc da",
    brand: "SunCare",
    rating: 4.5,
    sold: 980,
    desc: "Chống nắng quang phổ rộng, cấp ẩm nhẹ, không bết dính.",
  },
  {
    id: 5,
    name: "Vitamin D3 K2",
    img: "/img/vitc.png",
    cover: "/banchay/vitaminC-D3.png", // ảnh mới
    price: 89000,
    old: 109000,
    sale: "-18%",
    cat: "Vitamin",
    brand: "VitaPlus",
    rating: 4.9,
    sold: 1750,
    desc: "Bổ sung D3K2 hỗ trợ hấp thu canxi, khoẻ xương răng.",
  },
  {
    id: 6,
    name: "Khẩu trang y tế màu",
    img: "/img/mask.png",
    price: 35000,
    old: 45000,
    sale: "-22%",
    cat: "Khẩu trang",
    brand: "PharmaCity",
    rating: 4.4,
    sold: 2670,
    desc: "Khẩu trang y tế 3 lớp, nhiều màu, dễ thở cả ngày.",
  },
  {
    id: 7,
    name: "Máy đo huyết áp cổ tay",
    img: "/img/thermo.png",
    price: 549000,
    old: 599000,
    sale: "-8%",
    cat: "Thiết bị y tế",
    brand: "MedPro",
    rating: 4.3,
    sold: 620,
    desc: "Máy đo tự động, ghi nhớ kết quả, cảnh báo nhịp tim.",
  },
  {
    id: 8,
    name: "Gel rửa mặt dịu nhẹ",
    img: "/img/sunscreen.png",
    cover: "/banchay/suaruamat.png",
    price: 99000,
    old: 129000,
    sale: "-23%",
    cat: "Chăm sóc da",
    brand: "SunCare",
    rating: 4.6,
    sold: 1340,
    desc: "Làm sạch êm dịu, không khô căng, phù hợp da nhạy cảm.",
  },
];

export const getProductById = (id) =>
  PRODUCTS.find((p) => String(p.id) === String(id));
export const getRelatedProducts = (p, limit = 3) => {
  if (!p) return [];

  // Ưu tiên cùng danh mục / thương hiệu
  let list = PRODUCTS.filter(
    (x) => x.id !== p.id && (x.cat === p.cat || x.brand === p.brand)
  );

  const seen = new Set(list.map((x) => x.id));

  // Nếu chưa đủ thì lấy thêm SP bất kỳ (khác chính nó) cho đủ limit
  if (list.length < limit) {
    for (const x of PRODUCTS) {
      if (x.id === p.id || seen.has(x.id)) continue;
      list.push(x);
      seen.add(x.id);
      if (list.length >= limit) break;
    }
  }

  return list.slice(0, limit);
};

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
export function writeCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
}
export function cartTotalQty(c = readCart()) {
  return c.reduce((s, it) => s + (it.qty || 0), 0);
}
export function dispatchCartUpdated() {
  const qty = cartTotalQty();
  document.dispatchEvent(new CustomEvent("CART_UPDATED", { detail: { qty } }));
}
// Helper function to check if user is logged in
function checkUserLoggedIn() {
  try {
    const user = JSON.parse(localStorage.getItem("pc_user"));
    return !!user;
  } catch {
    return false;
  }
}

// Toast helper
function showToast(msg, type = "info") {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  t.className = `toast-item toast-item--${type}`;
  t.textContent = msg;
  wrap.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 250);
  }, 3000);
}

export function addToCart(p, qty = 1) {
  // Kiểm tra user đã đăng nhập chưa
  if (!checkUserLoggedIn()) {
    showToast("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", "warning");
    // Trigger event để mở modal đăng nhập
    document.dispatchEvent(new CustomEvent("OPEN_AUTH"));
    throw new Error("Chưa đăng nhập");
  }

  const cart = readCart();
  const i = cart.findIndex((it) => it.id === p.id);
  if (i === -1)
    cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty });
  else cart[i].qty += qty;
  writeCart(cart);
  dispatchCartUpdated();
}

// ===== PRODUCT MANAGEMENT (Admin) =====
const PRODUCTS_KEY = "demo_products";

function loadProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(PRODUCTS_KEY));
    if (stored && stored.length > 0) {
      return stored;
    }
    // Nếu chưa có trong localStorage, khởi tạo từ PRODUCTS array
    saveProducts(PRODUCTS);
    return PRODUCTS;
  } catch {
    // Nếu lỗi, khởi tạo từ PRODUCTS array
    saveProducts(PRODUCTS);
    return PRODUCTS;
  }
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getAllProducts() {
  return loadProducts();
}

export function getProductByIdAdmin(id) {
  const products = loadProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
}

export function createProduct(productData) {
  const products = loadProducts();
  
  // Validate required fields
  if (!productData.name || !productData.price || !productData.cat) {
    throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Giá, Danh mục)");
  }

  // Tìm ID mới (max ID + 1)
  const maxId = products.reduce((max, p) => Math.max(max, p.id || 0), 0);
  const newId = maxId + 1;

  // Tính sale nếu có old price
  let sale = null;
  if (productData.old && productData.old > productData.price) {
    const discount = Math.round(((productData.old - productData.price) / productData.old) * 100);
    sale = `-${discount}%`;
  } else if (!productData.old && productData.sale) {
    sale = productData.sale;
  }

  const newProduct = {
    id: newId,
    name: productData.name.trim(),
    img: productData.img || "/img/placeholder.jpg",
    cover: productData.cover || null,
    price: Number(productData.price),
    old: productData.old ? Number(productData.old) : null,
    sale: sale || null,
    cat: productData.cat.trim(),
    brand: productData.brand?.trim() || "",
    rating: productData.rating || 0,
    sold: productData.sold || 0,
    desc: productData.desc?.trim() || "",
    createdAt: Date.now(),
  };
  
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id, updates) {
  const products = loadProducts();
  const idx = products.findIndex((p) => String(p.id) === String(id));
  
  if (idx === -1) {
    throw new Error("Không tìm thấy sản phẩm");
  }

  // Validate required fields nếu đang cập nhật
  if (updates.name !== undefined && !updates.name.trim()) {
    throw new Error("Tên sản phẩm không được để trống");
  }
  if (updates.price !== undefined && (!updates.price || updates.price <= 0)) {
    throw new Error("Giá sản phẩm phải lớn hơn 0");
  }
  if (updates.cat !== undefined && !updates.cat.trim()) {
    throw new Error("Danh mục không được để trống");
  }

  // Tính sale nếu có old price
  let sale = updates.sale || products[idx].sale;
  if (updates.old !== undefined || updates.price !== undefined) {
    const oldPrice = updates.old !== undefined ? Number(updates.old) : products[idx].old;
    const newPrice = updates.price !== undefined ? Number(updates.price) : products[idx].price;
    
    if (oldPrice && oldPrice > newPrice) {
      const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
      sale = `-${discount}%`;
    } else if (!oldPrice) {
      sale = updates.sale || null;
    }
  }

  products[idx] = {
    ...products[idx],
    ...updates,
    name: updates.name !== undefined ? updates.name.trim() : products[idx].name,
    price: updates.price !== undefined ? Number(updates.price) : products[idx].price,
    old: updates.old !== undefined ? (updates.old ? Number(updates.old) : null) : products[idx].old,
    cat: updates.cat !== undefined ? updates.cat.trim() : products[idx].cat,
    brand: updates.brand !== undefined ? updates.brand.trim() : products[idx].brand,
    desc: updates.desc !== undefined ? updates.desc.trim() : products[idx].desc,
    sale: sale,
    updatedAt: Date.now(),
  };
  
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id) {
  const products = loadProducts();
  const filtered = products.filter((p) => String(p.id) !== String(id));
  
  if (filtered.length === products.length) {
    throw new Error("Không tìm thấy sản phẩm");
  }
  
  saveProducts(filtered);
  return true;
}

// Initialize products on first load
loadProducts();