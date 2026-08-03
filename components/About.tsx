import site from "@/data/site.json";

const ICONS: Record<string, string> = {
  "Hướng dẫn viên tận tâm": "👥",
  "Ẩm thực phong phú": "🍴",
  "Du lịch & Thiện nguyện": "💗",
  "Năng lượng tích cực": "✨",
};

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-neutral-900">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function About() {
  return (
    <section id="about" className="bg-gradient-to-b from-orange-50/60 to-white py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold tracking-wide text-brand">
            {site.aboutTag.toUpperCase()}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            Khám Phá <span className="text-brand">&</span> Lan Toả
          </h2>
          <p className="text-2xl font-bold text-neutral-500 sm:text-3xl">{site.aboutTitleLine2}</p>

          <p className="mt-6 text-base leading-relaxed text-neutral-700">
            {renderBold(site.aboutText1)}
          </p>

          <blockquote className="mt-5 border-l-4 border-brand bg-orange-50/70 py-3 pl-5 text-base italic leading-relaxed text-neutral-700">
            {renderBold(site.aboutText2)}
          </blockquote>

          <a href="#tours" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline">
            Tìm hiểu thêm về chúng tôi <span>→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {site.features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm shadow-neutral-100"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-red text-lg text-white">
                {ICONS[f.title] ?? "⭐"}
              </div>
              <h4 className="mt-4 font-bold text-neutral-900">{f.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
