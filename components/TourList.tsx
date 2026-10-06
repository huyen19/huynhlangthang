import tours from "@/data/tours.json";
import type { Tour } from "@/lib/types";
import TourCard from "./TourCard";

// Tour hiển thị ở trang chủ (theo thứ tự). Bỏ comment slug để hiện lại.
const homeSlugs = [
  "ngu-chi-son",
  "ta-chi-nhu",
  "lung-cung",
  "phu-sa-phin",
  "samu",
  "ky-quan-san",
  // "fansipan",
  // "nam-kang-ho-tao",
  // "can-chu",
  // "can-chu-mieu",
  // "nui-muoi",
  // "lao-than",
  // "ta-chi-nhu-nam-nghiep",
  // "nhiu-co-san",
  // "ta-lien-son",
  // "putaleng2d",
  // "putaleng",
  // "quang-binh",
  // "cua-tu",
  // "ham-lon",
  // "ham-lon-suoi",
  // "da-giang",
  // "na-hang",
  // "ba-vi",
];

export default function TourList() {
  const all = tours as Tour[];
  const list = homeSlugs
    .map((slug) => all.find((t) => t.slug === slug))
    .filter((t): t is Tour => Boolean(t));
  return (
    <section id="tours" className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            TOUR TREKKING NỔI BẬT
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
