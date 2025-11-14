// src/services/products.js
export const CART_KEY = "demo_cart";

export const PRODUCTS = [
  {
    id: 1,
    name: "Vitamin C 500mg",
    img: "/img/vitc.png",
    price: 45000,
    old: 65000,
    sale: "-31%",
    cat: "Vitamin",
    brand: "VitaPlus",
    rating: 4.8,
    sold: 3200,
    desc: "Viên nén Vitamin C 500mg hỗ trợ tăng sức đề kháng, chống oxy hoá.",
  },
  {
    id: 2,
    name: "Khẩu trang 4D (10 cái)",
    img: "/img/mask.png",
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
export function addToCart(p, qty = 1) {
  const cart = readCart();
  const i = cart.findIndex((it) => it.id === p.id);
  if (i === -1)
    cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty });
  else cart[i].qty += qty;
  writeCart(cart);
  dispatchCartUpdated();
}
