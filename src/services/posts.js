// src/services/posts.js
const POSTS_KEY = "pc_posts";

// Seed default posts nếu chưa có
const DEFAULT_POSTS = [
  {
    id: "bv-6",
    title: "Cập nhật dịch cúm mùa: Những điều nên biết",
    cat: "Tin tức",
    cover: "/blog/news-flu.jpg",
    excerpt:
      "Tổng hợp tình hình cúm mùa và khuyến cáo phòng bệnh từ cơ quan y tế trong tuần qua.",
    date: "2025-01-09",
    readMin: 3,
    author: "Biên tập",
    views: 421,
    tags: ["Tin tức", "Cúm"],
    content: `
<p><b>Cúm mùa</b> đang có dấu hiệu tăng tại một số khu vực. Người dân nên chủ động tiêm vắc xin, đeo khẩu trang nơi đông người và vệ sinh tay thường xuyên.</p>
<ul>
  <li>Triệu chứng thường gặp: sốt, ho, đau họng, mệt mỏi.</li>
  <li>Khi nào cần khám: sốt cao kéo dài, khó thở, đau ngực, người có bệnh nền.</li>
</ul>
<p><i>Lưu ý:</i> Không tự ý dùng kháng sinh khi chưa có chỉ định bác sĩ.</p>
`,
  },
  {
    id: "bv-5",
    title: "Probiotic là gì? Lợi khuẩn có thật sự cần thiết?",
    cat: "Dinh dưỡng",
    cover: "/blog/probiotic.png",
    excerpt:
      "Probiotic hỗ trợ tiêu hóa, cân bằng hệ vi sinh. Khi nào nên dùng và chọn loại nào phù hợp?",
    date: "2025-01-08",
    readMin: 8,
    author: "DS. Bảo Trâm",
    views: 612,
    tags: ["Tiêu hóa", "Probiotic"],
    content: `
<p>Probiotic là các <b>vi khuẩn có lợi</b> giúp cân bằng hệ vi sinh đường ruột, hỗ trợ tiêu hóa và miễn dịch.</p>
<p><b>Cách dùng:</b> Nên dùng sau ăn, kiên trì ít nhất 2-4 tuần.</p>
`,
  },
  {
    id: "bv-3",
    title: "Paracetamol: Liều dùng an toàn cho người lớn",
    cat: "Thuốc",
    cover: "/blog/para.jpg",
    excerpt:
      "Paracetamol giảm đau, hạ sốt phổ biến. Lạm dụng có thể gây hại gan. Đây là liều an toàn bạn cần biết.",
    date: "2025-01-04",
    readMin: 6,
    author: "DS. Thanh Tâm",
    views: 1405,
    tags: ["Paracetamol", "Giảm đau"],
    content: `
<p>Liều dùng thông thường: <b>10–15 mg/kg/lần</b>, tối đa 60 mg/kg/ngày; người lớn tối đa <b>4g/ngày</b>.</p>
<p>Tránh phối hợp nhiều chế phẩm chứa paracetamol cùng lúc.</p>
`,
  },
  {
    id: "bv-1",
    title: "Vitamin C: Uống thế nào cho đúng?",
    cat: "Dinh dưỡng",
    cover: "/blog/vitc.png",
    excerpt:
      "Vitamin C giúp tăng đề kháng, nhưng liều dùng bao nhiêu mỗi ngày là phù hợp và có cần uống sau ăn?",
    date: "2025-01-02",
    readMin: 5,
    author: "DS. Lan Anh",
    views: 1203,
    tags: ["Vitamin", "Miễn dịch"],
    content: `
<p>Người trưởng thành nên bổ sung khoảng <b>65–90mg/ngày</b>, tối đa <b>2000mg/ngày</b>.</p>
<p>Nên dùng <i>sau ăn</i> để giảm kích ứng dạ dày.</p>
`,
  },
  {
    id: "bv-4",
    title: "5 mẹo ngủ ngon không cần thuốc",
    cat: "Mẹo sống khỏe",
    cover: "/blog/sleep.png",
    excerpt:
      "Giấc ngủ chất lượng giúp phục hồi cơ thể. Thử ngay 5 mẹo đơn giản này trong một tuần.",
    date: "2024-12-29",
    readMin: 4,
    author: "DS. Quang Huy",
    views: 1623,
    tags: ["Giấc ngủ", "Thói quen"],
    content: `
<ol>
  <li>Đi ngủ và thức dậy đúng giờ.</li>
  <li>Hạn chế màn hình 1 giờ trước khi ngủ.</li>
  <li>Vận động nhẹ nhàng ban ngày.</li>
</ol>
`,
  },
  {
    id: "bv-2",
    title: "Phân biệt cảm lạnh và cúm: Khi nào cần đi khám?",
    cat: "Bệnh lý",
    cover: "/blog/flu.png",
    excerpt:
      "Triệu chứng cảm lạnh và cúm khá giống nhau. Bài viết này giúp bạn nhận biết và xử trí ban đầu.",
    date: "2025-01-06",
    readMin: 7,
    author: "BS. Minh Đức",
    views: 987,
    tags: ["Cúm", "Sốt", "Hô hấp"],
    content: `
<p><b>Cảm lạnh</b> thường nhẹ hơn cúm và hiếm khi gây sốt cao. <b>Cúm</b> thường khởi phát đột ngột, đau nhức nhiều.</p>
`,
  },
];

function loadPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
    // Nếu chưa có posts, seed default data
    if (posts.length === 0) {
      savePosts(DEFAULT_POSTS);
      return DEFAULT_POSTS;
    }
    return posts;
  } catch (error) {
    console.error("Error loading posts:", error);
    // Nếu lỗi, seed default data
    savePosts(DEFAULT_POSTS);
    return DEFAULT_POSTS;
  }
}

function savePosts(arr) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(arr));
}

export function getAllPosts() {
  return loadPosts().sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostById(id) {
  return loadPosts().find((p) => p.id === id) || null;
}

export function getRelatedPosts(post, n = 6) {
  const posts = loadPosts();
  return posts
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.cat === post.cat || p.tags.some((t) => post.tags.includes(t)))
    )
    .slice(0, n);
}

export function createPost(postData) {
  const posts = loadPosts();
  
  // Validate required fields
  if (!postData.title || !postData.cat || !postData.excerpt) {
    throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
  }

  const newPost = {
    id: `bv-${Date.now()}`,
    title: postData.title.trim(),
    cat: postData.cat.trim(),
    cover: postData.cover || "/img/placeholder.jpg",
    excerpt: postData.excerpt.trim(),
    date: postData.date || new Date().toISOString().split("T")[0],
    readMin: postData.readMin || 5,
    author: postData.author || "Biên tập",
    views: 0,
    tags: Array.isArray(postData.tags) ? postData.tags : [],
    content: postData.content || "",
  };
  
  posts.push(newPost);
  savePosts(posts);
  return newPost;
}

export function updatePost(id, updates) {
  const posts = loadPosts();
  const idx = posts.findIndex((p) => p.id === id);
  
  if (idx === -1) {
    throw new Error("Không tìm thấy bài viết");
  }

  // Validate required fields nếu đang cập nhật
  if (updates.title !== undefined && !updates.title.trim()) {
    throw new Error("Tiêu đề không được để trống");
  }
  if (updates.cat !== undefined && !updates.cat.trim()) {
    throw new Error("Danh mục không được để trống");
  }
  if (updates.excerpt !== undefined && !updates.excerpt.trim()) {
    throw new Error("Tóm tắt không được để trống");
  }

  posts[idx] = {
    ...posts[idx],
    ...updates,
    title: updates.title !== undefined ? updates.title.trim() : posts[idx].title,
    cat: updates.cat !== undefined ? updates.cat.trim() : posts[idx].cat,
    excerpt: updates.excerpt !== undefined ? updates.excerpt.trim() : posts[idx].excerpt,
    tags: updates.tags !== undefined ? (Array.isArray(updates.tags) ? updates.tags : []) : posts[idx].tags,
  };
  
  savePosts(posts);
  return posts[idx];
}

export function deletePost(id) {
  const posts = loadPosts();
  const filtered = posts.filter((p) => p.id !== id);
  
  if (filtered.length === posts.length) {
    throw new Error("Không tìm thấy bài viết");
  }
  
  savePosts(filtered);
  return true;
}

// Initialize posts on first load
loadPosts();

