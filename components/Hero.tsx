import site from "@/data/site.json";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[100dvh] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${site.heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-brand uppercase sm:text-base">
          {site.companyLine}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          Cùng <span className="text-brand">Khang Tu Hú</span>
        </h1>
        <p className="mt-4 text-xl font-semibold text-white sm:text-2xl">
          {site.heroTitleLine2}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#tours"
            className="rounded-full bg-gradient-to-r from-brand to-brand-red px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30 hover:opacity-90 sm:text-base"
          >
            Khám Phá Tour Ngay
          </a>
        </div>

        <a href="#about" className="mt-14 flex flex-col items-center gap-1 text-xs text-neutral-300">
          <span className="tracking-wide">CUỘN XUỐNG</span>
          <span className="animate-bounce text-lg">↓</span>
        </a>
      </div>
    </section>
  );
}
