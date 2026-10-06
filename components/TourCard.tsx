import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/lib/types";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm shadow-neutral-200/60 ring-1 ring-neutral-100 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* <span className="absolute left-3 top-3 rounded-full bg-brand-red/90 px-3 py-1 text-xs font-bold text-white">
          🔥 {tour.tag}
        </span> */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
            🕐 {tour.duration}
          </span>
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
            ⛰️ Độ khó: {tour.difficulty}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold text-neutral-900 group-hover:text-brand">{tour.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-neutral-500">{tour.shortDesc}</p>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
          <div>
            <p className="text-xs text-neutral-400">GIÁ TOUR</p>
            <p className="text-lg font-extrabold text-brand">{tour.price}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
