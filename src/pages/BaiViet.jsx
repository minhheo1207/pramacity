// src/pages/BaiViet.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageBar from "../components/PageBar";
import Frame from "../components/Frame";
import { getAllPosts } from "../services/posts";

const CATS = [
  "Tất cả",
  "Dinh dưỡng",
  "Bệnh lý",
  "Thuốc",
  "Mẹo sống khỏe",
  "Tin tức",
];
const PAGE_SIZE = 9;

export default function BaiViet() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tất cả");
  const [sort, setSort] = useState("newest"); // newest | oldest | popular
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const list = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase().trim();
    let l = getAllPosts();

    if (cat !== "Tất cả") l = l.filter((p) => p.cat === cat);
    if (q.trim()) {
      const k = norm(q);
      l = l.filter(
        (p) =>
          norm(p.title).includes(k) ||
          norm(p.excerpt).includes(k) ||
          p.tags.some((t) => norm(t).includes(k))
      );
    }
    if (sort === "newest") l.sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "oldest") l.sort((a, b) => a.date.localeCompare(b.date));
    if (sort === "popular") l.sort((a, b) => b.views - a.views);
    return l;
  }, [q, cat, sort]);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateQ = (v) => {
    setQ(v);
    setPage(1);
  };
  const updateCat = (v) => {
    setCat(v);
    setPage(1);
  };
  const updateSort = (v) => {
    setSort(v);
    setPage(1);
  };

  return (
    <main className="lc blog">
      <PageBar
        title="Bài viết"
        subtitle="Kiến thức sức khỏe, dược học và mẹo sống khỏe mỗi ngày"
        right={
          <form className="pb-search" onSubmit={(e) => e.preventDefault()}>
            <i className="ri-search-line"></i>
            <input
              placeholder="Tìm tiêu đề, thẻ tag, nội dung…"
              value={q}
              onChange={(e) => updateQ(e.target.value)}
            />
          </form>
        }
      />

      <div className="container blog__wrap">
        {/* Sidebar */}
        <aside className="blog__side">
          <Frame title="Danh mục">
            <div className="chips">
              {CATS.map((c) => (
                <button
                  key={c}
                  className={"chip chip--cat" + (cat === c ? " active" : "")}
                  onClick={() => updateCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </Frame>

          <Frame title="Bài nổi bật">
            <ul className="hotlist">
              {getAllPosts()
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 6)
                .map((p) => (
                  <li key={p.id}>
                    <Link to={`/bai-viet/${p.id}`}>
                      <span className="dot" />
                      {p.title}
                    </Link>
                    <em>{p.views.toLocaleString()} lượt xem</em>
                  </li>
                ))}
            </ul>
          </Frame>
        </aside>

        {/* Main */}
        <section className="blog__main">
          <div className="blog__toolbar">
            <div className="muted">
              {total.toLocaleString()} kết quả
              {q ? ` cho “${q}”` : ""} {cat !== "Tất cả" ? ` • ${cat}` : ""}
            </div>
            <div className="blog__actions">
              <select value={sort} onChange={(e) => updateSort(e.target.value)}>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="popular">Phổ biến</option>
              </select>
            </div>
          </div>

          {/* Masonry grid */}
          <div className={"blog__masonry" + (loading ? " loading" : "")}>
            {(loading ? Array.from({ length: 6 }) : pageList).map((p, i) =>
              loading ? (
                <div key={i} className="post post--sk">
                  <div className="sk sk-img" />
                  <div className="sk sk-line" />
                  <div className="sk sk-line w-70" />
                  <div className="sk sk-meta" />
                </div>
              ) : (
                <article className="post" key={p.id}>
                  <div className="post__media">
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/img/placeholder.jpg";
                      }}
                    />
                    <span className={"badge badge--cat " + toCatClass(p.cat)}>
                      {p.cat}
                    </span>
                  </div>
                  <div className="post__body">
                    <h3 className="post__title">
                      <Link to={`/bai-viet/${p.id}`}>{p.title}</Link>
                    </h3>
                    <p className="post__excerpt">{p.excerpt}</p>
                    <div className="post__meta">
                      <span className="chip chip--soft">{fmtDate(p.date)}</span>
                      <span className="chip chip--soft">
                        {p.readMin} phút đọc
                      </span>
                      <span className="chip chip--soft">{p.author}</span>
                    </div>
                    <div className="post__tags">
                      {p.tags.map((t) => (
                        <button
                          key={t}
                          className="tag"
                          onClick={() => updateQ(t)}
                          title={"Tìm theo: " + t}
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          {/* Pagination */}
          <div className="pager">
            <button
              className="btn sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Trước
            </button>
            <div className="pager__pages">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={"pager__dot" + (page === i + 1 ? " active" : "")}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="btn sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function fmtDate(s) {
  return new Date(s).toLocaleDateString("vi-VN");
}
function toCatClass(c) {
  return (
    {
      "Dinh dưỡng": "is-green",
      "Bệnh lý": "is-red",
      Thuốc: "is-blue",
      "Mẹo sống khỏe": "is-purple",
      "Tin tức": "is-gray",
    }[c] || "is-blue"
  );
}
