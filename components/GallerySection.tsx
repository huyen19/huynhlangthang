import Image from "next/image";
import gallery from "@/data/gallery.json";

export default function GallerySection() {
  const images = gallery as string[];
  return (
    <section className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-extrabold text-neutral-900 sm:text-3xl">
          Khoảnh Khắc Đáng Nhớ
        </h2>

        <div className="mt-10 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {images.map((img, i) => (
            <div
              key={img}
              className="group relative mb-3 block break-inside-avoid overflow-hidden rounded-xl"
              style={{ aspectRatio: i % 5 === 0 ? "3/4" : "1/1" }}
            >
              <Image
                src={img}
                alt={`Moment ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-semibold text-white opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                Xem
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
