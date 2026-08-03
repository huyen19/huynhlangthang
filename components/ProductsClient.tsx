"use client";

import { useMemo, useState } from "react";
import type { Product, Category } from "@/lib/types";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

export default function ProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(5_000_000);
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (selectedCats.length > 0) {
      list = list.filter((p) => selectedCats.includes(p.category));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, search, selectedCats, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleCat(name: string) {
    setSelectedCats((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
    setPage(1);
  }

  function reset() {
    setSearch("");
    setSelectedCats([]);
    setMaxPrice(5_000_000);
    setSort("newest");
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit rounded-2xl bg-white p-5 ring-1 ring-neutral-100 lg:sticky lg:top-24">
          <h3 className="flex items-center gap-2 font-bold text-neutral-800">
            <span className="text-brand">▽</span> Bộ Lọc
          </h3>

          <div className="mt-5">
            <label className="text-xs font-semibold text-neutral-500">Tìm kiếm</label>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2">
              <span className="text-neutral-400">🔍</span>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tên sản phẩm..."
                className="w-full text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs font-semibold text-neutral-500">Danh mục</label>
            <div className="mt-2 space-y-2">
              {categories.map((c) => (
                <label key={c.code} className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(c.name)}
                    onChange={() => toggleCat(c.name)}
                    className="h-4 w-4 rounded border-neutral-300 accent-orange-500"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-xs font-semibold text-neutral-500">Khoảng giá</label>
            <p className="mt-1 text-sm font-semibold text-brand">
              0 ₫ - {maxPrice.toLocaleString("vi-VN")} ₫
            </p>
            <input
              type="range"
              min={0}
              max={5_000_000}
              step={50_000}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setPage(1);
              }}
              className="mt-2 w-full accent-orange-500"
            />
          </div>

          <div className="mt-6">
            <label className="text-xs font-semibold text-neutral-500">Sắp xếp theo</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          <div className="mt-6 flex gap-2">
            <button className="flex-1 rounded-full bg-gradient-to-r from-brand to-brand-red py-2.5 text-sm font-bold text-white">
              Lọc ngay
            </button>
            <button
              onClick={reset}
              className="flex-1 rounded-full border border-neutral-200 py-2.5 text-sm font-bold text-neutral-600"
            >
              Đặt lại
            </button>
          </div>
        </aside>

        {/* Product grid */}
        <div>
          <p className="flex items-center gap-2 font-semibold text-neutral-800">
            <span>▦</span> {filtered.length} Sản phẩm
          </p>

          {pageItems.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-4 py-16 text-center">
              <span className="text-5xl">🗂️</span>
              <p className="text-neutral-500">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-neutral-200 disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    n === page ? "bg-brand text-white" : "ring-1 ring-neutral-200 text-neutral-600"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-neutral-200 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
