import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsClient from "@/components/ProductsClient";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import type { Product, Category } from "@/lib/types";

export const metadata = {
  title: "Cửa Hàng | Huyền Lang Thang",
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-orange-50/40">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-red to-brand-dark px-8 py-12 text-white sm:px-12">
            <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold tracking-wide backdrop-blur">
              ⚡ HOT DEALS
            </span>
            <h1 className="mt-4 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
              Sẵn Sàng Cho Mọi Hành Trình Trekking
            </h1>
            <p className="mt-3 max-w-md text-sm text-orange-100">
              Trang bị bền bỉ, sắc màu cá tính. Khám phá bộ sưu tập mới nhất với ưu đãi hấp dẫn.
            </p>
            <button className="mt-6 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-dark">
              🛍️ Mua Ngay
            </button>
            <span className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 text-9xl opacity-20 sm:block">
              🔥
            </span>
          </section>
        </div>

        <ProductsClient products={products as Product[]} categories={categories as Category[]} />
      </main>
      <Footer />
    </>
  );
}
