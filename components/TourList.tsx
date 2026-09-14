import tours from "@/data/tours.json";
import type { Tour } from "@/lib/types";
import TourCard from "./TourCard";

export default function TourList() {
  const list = tours as Tour[];
  return (
    <section id="tours" className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            TOUR TREKKING NỔI BẬT
          </h2>
          <span className="mt-4 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-brand">
            🔥 Lịch khởi hành mới nhất từ 30/8/2025
          </span>
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
