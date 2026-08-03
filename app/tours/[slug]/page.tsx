import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import tours from "@/data/tours.json";
import site from "@/data/site.json";
import type { Tour } from "@/lib/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourNotices from "@/components/TourNotices";
import TourCard from "@/components/TourCard";

const allTours = tours as Tour[];

export function generateStaticParams() {
  return allTours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = allTours.find((t) => t.slug === slug);
  return { title: tour ? `${tour.name} | ${site.name}` : site.name };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = allTours.find((t) => t.slug === slug);
  if (!tour) return notFound();

  const related = allTours.filter((t) => t.slug !== tour.slug).slice(0, 6);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative flex min-h-[70vh] items-center bg-cover bg-center"
          style={{ backgroundImage: `url(${tour.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
          <div className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
              🌍 Cùng {site.name} muôn nơi
            </span>
            <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-5xl">{tour.name}</h1>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-200">
              ❤️ Trích 50.000đ vào Quỹ &ldquo;Hành Trình Yêu Thương&rdquo;
            </p>
            <p className="mt-2 max-w-2xl text-base text-neutral-200">{tour.shortDesc}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-to-r from-brand to-brand-red px-7 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                Đăng ký ngay
              </a>
              <a
                href={site.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/20"
              >
                Xem Video Tiktok
              </a>
            </div>
          </div>
        </section>

        {/* Intro + booking box */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand">
              ℹ️ Giới thiệu
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-neutral-900">{tour.introTitle}</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
              {tour.introText}
            </p>

            {tour.leaderTip && (
              <div className="mt-8 flex gap-4 rounded-2xl bg-orange-50/70 p-5 ring-1 ring-orange-100">
                <span className="text-2xl">🧑‍🦱</span>
                <div>
                  <h4 className="font-bold text-neutral-900">Lời khuyên từ Leader</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    ⚠️ Cảnh báo địa hình: {tour.leaderTip}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-neutral-200/60 ring-1 ring-neutral-100 lg:sticky lg:top-24 lg:h-fit">
            <p className="text-sm text-neutral-500">Đặt tour</p>
            <p className="mt-1 text-3xl font-extrabold text-brand">{tour.price}</p>
            {tour.priceNote && (
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">💰 {tour.priceNote}</p>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500">Ngày dự kiến khởi hành</label>
                <div className="mt-1 flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                  <span>Chọn ngày</span>
                  <span>📅</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-500">Số khách</label>
                  <div className="mt-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm">1</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-500">Số điện thoại</label>
                  <div className="mt-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-400">
                    VD: 0912...
                  </div>
                </div>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-red py-3 text-sm font-bold text-white hover:opacity-90">
                Yêu cầu tư vấn ngay →
              </button>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-neutral-400">
                🛡️ Đội ngũ HLT sẽ liên hệ lại để xác nhận chi phí và lịch trình chi tiết trước khi bạn thanh
                toán.
              </p>
            </div>
          </div>
        </section>

        {/* Itinerary */}
        {tour.itinerary.length > 0 && (
          <section id="schedule" className="bg-neutral-50 py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-extrabold text-neutral-900">
                Lịch trình {tour.duration} – Chinh phục {tour.name.replace(/\s*\d+m$/, "")}
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                🔔 Lưu ý: Ngày 0 là ngày di chuyển, các tour trekking sẽ di chuyển từ tối hôm trước.
              </p>

              <div className="mt-8 space-y-8 border-l-2 border-orange-200 pl-6">
                {tour.itinerary.map((day, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-neutral-900">📅 {day.day}</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600">
                      {day.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <TourNotices />

        {/* Gallery */}
        <section id="images" className="py-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-2xl">📷</span>
            <h2 className="mt-2 text-2xl font-extrabold text-neutral-900">Khoảnh Khắc Đáng Nhớ</h2>
            <p className="mt-1 text-sm text-neutral-500">Lưu giữ kỷ niệm trên từng bước chân</p>

            <div className="mt-8 columns-2 gap-3 sm:columns-4">
              {tour.gallery.map((img, i) => (
                <div key={i} className="group relative mb-3 block aspect-square break-inside-avoid overflow-hidden rounded-xl">
                  <Image src={img} alt={`${tour.name} ${i + 1}`} fill sizes="300px" className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-semibold text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    Xem ảnh
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related tours */}
        <section className="bg-neutral-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-extrabold text-neutral-900">Khám Phá Thêm</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <TourCard key={t.slug} tour={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Charity CTA */}
        <section id="charity" className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-wide text-brand">Hành trình yêu thương</span>
            <h2 className="mt-3 text-2xl font-extrabold text-neutral-900">
              Kết Hợp Trekking & Thiện Nguyện
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Trong mỗi chuyến đi, {site.name} luôn dành tâm huyết để kết hợp hoạt động thiện nguyện.
              Mỗi khách tham gia tour sẽ đóng góp 50.000đ vào quỹ, góp phần mang đến giá trị thật sự cho bà
              con và các em nhỏ vùng cao hẻo lánh.
            </p>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-green-600">
              ✅ Cam kết công khai, minh bạch và hiệu quả!
            </p>
            <Link
              href="/#charity"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-brand to-brand-red px-7 py-3 text-sm font-bold text-white hover:opacity-90"
            >
              Xem hoạt động thiện nguyện
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
