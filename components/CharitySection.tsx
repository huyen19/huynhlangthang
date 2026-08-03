import Image from "next/image";
import charity from "@/data/charity.json";
import type { CharityEvent } from "@/lib/types";

export default function CharitySection() {
  const events = charity.events as CharityEvent[];
  return (
    <section id="charity" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">Quỹ Thiện Nguyện</h2>
        <p className="mt-1 text-2xl font-extrabold text-brand-red sm:text-3xl">
          &ldquo;Hành Trình Yêu Thương&rdquo;
        </p>
        <p className="mx-auto mt-6 max-w-3xl text-base italic leading-relaxed text-neutral-600">
          &ldquo;{charity.quote}&rdquo;
        </p>
        <a
          href={charity.transparencyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
        >
          Xem sao kê minh bạch tại đây ↗
        </a>
      </div>

      <div className="mx-auto mt-14 max-w-6xl columns-1 gap-8 px-4 sm:px-6 lg:columns-2 lg:px-8">
        {events.map((ev) => (
          <div key={ev.title} className="contents">
            <div className="mb-8 break-inside-avoid rounded-2xl bg-white p-2 shadow-sm ring-1 ring-neutral-100">
              <div className="grid grid-cols-2 gap-1.5">
                {ev.images.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image src={img} alt={ev.title} fill sizes="300px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8 break-inside-avoid">
              <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                {ev.date}
              </span>
              <h3 className="mt-3 text-lg font-bold text-neutral-900">{ev.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{ev.text}</p>
              <div className="mt-4 rounded-xl border-l-4 border-brand bg-orange-50/70 p-4 text-sm leading-relaxed text-neutral-700">
                {ev.result}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
