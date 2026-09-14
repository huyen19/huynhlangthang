import Image from "next/image";
import { notFound } from "next/navigation";
import tours from "@/data/tours.json";
import site from "@/data/site.json";
import type { Tour } from "@/lib/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourTabs from "@/components/TourTabs";
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
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">{tour.name}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-200">{tour.shortDesc}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
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

        {/* Intro */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand">
              ℹ️ Giới thiệu
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-neutral-900">{tour.introTitle}</h2>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {tour.introText}
          </p>
        </section>

        <TourTabs itinerary={tour.itinerary} duration={tour.duration} tourName={tour.name} />

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
      </main>
      <Footer />
    </>
  );
}
