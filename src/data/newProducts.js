// src/data/newProducts.js
export const NEW_PRODUCTS = [
  {
    id: "p-01",
    name: "Vitamin C 1000mg Nature’s Way",
    brand: "Nature’s Way",
    cat: "Hàng mới",
    img: "/products/vitc.png",
    price: 195000,
    old: 230000,
    rating: 4.7,
    sold: 3100,
    sale: "-15%",
    desc: "Viên uống Vitamin C 1000mg hỗ trợ tăng cường đề kháng, chống oxy hóa, giúp cơ thể khỏe mạnh.",
  },
  {
    id: "p-02",
    name: "Kem chống nắng La Roche-Posay SPF50+",
    brand: "La Roche-Posay",
    cat: "Hàng mới",
    img: "/products/sunscreen.png",
    price: 420000,
    old: 480000,
    rating: 4.9,
    sold: 5200,
    sale: "-13%",
    desc: "Chống nắng SPF50+ bảo vệ phổ rộng, kết cấu mỏng nhẹ, phù hợp dùng hàng ngày cho mọi loại da.",
  },
  {
    id: "p-03",
    name: "Probiotic Enterogermina 5ml x 10 ống",
    brand: "Enterogermina",
    cat: "Hàng mới",
    img: "/products/probiotic.png",
    price: 145000,
    old: null,
    rating: 4.6,
    sold: 2100,
    sale: null,
    desc: "Men vi sinh hỗ trợ cân bằng hệ vi khuẩn đường ruột, giúp tiêu hóa tốt và giảm rối loạn tiêu hóa.",
  },
  {
    id: "p-04",
    name: "Viên uống bổ não Ginkgo Biloba 120mg",
    brand: "Herbal Lab",
    cat: "Hàng mới",
    img: "/products/ginkgo.png",
    price: 185000,
    old: 210000,
    rating: 4.5,
    sold: 1750,
    sale: "-12%",
    desc: "Chiết xuất bạch quả hỗ trợ tuần hoàn máu não, tăng cường trí nhớ và sự tập trung.",
  },
  {
    id: "p-05",
    name: "Siro ho Prospan Kid 100ml",
    brand: "Prospan",
    cat: "Hàng mới",
    img: "/products/prospan.png",
    price: 99000,
    old: null,
    rating: 4.8,
    sold: 4320,
    sale: null,
    desc: "Siro ho thảo dược cho trẻ em, giúp dịu cổ họng, giảm ho, dễ uống hương vị dễ chịu.",
  },
];

export const getNewProductById = (id) => NEW_PRODUCTS.find((p) => p.id === id);

export const getRelatedNewProducts = (product, n = 6) =>
  NEW_PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.brand === product.brand || p.cat === product.cat)
  ).slice(0, n);
