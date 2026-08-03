import site from "@/data/site.json";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#c2410c] to-[#7c2d12] text-white">
      <div className="dot-pattern absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <h3 className="flex items-center gap-2 text-2xl font-extrabold">
              <span>⛰️</span> {site.name}
            </h3>
            <p className="mt-4 max-w-sm border-l-2 border-brand/60 pl-4 text-sm leading-relaxed text-orange-100">
              {site.footerText}
            </p>
            <div className="mt-6 flex gap-3">
              {["facebook", "instagram", "youtube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <SocialIcon name={s} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-lg font-bold">
              <span className="h-4 w-0.5 bg-brand" /> Liên Hệ
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-orange-100">
              <li className="flex items-center gap-2">
                <IconBubble>📞</IconBubble>
                <a href={`tel:${site.phone.replace(/\./g, "")}`} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <IconBubble>✉️</IconBubble>
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <IconBubble>📍</IconBubble>
                <span>{site.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-lg font-bold">
              <span className="h-4 w-0.5 bg-brand" /> Đăng ký nhận tin
            </h4>
            <div className="mt-4 rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-orange-100">
                Nhận thông tin tour mới & hoạt động thiện nguyện sớm nhất.
              </p>
              <form className="mt-3 flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-orange-200 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Đăng ký"
                  className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full bg-brand text-white"
                >
                  ➤
                </button>
              </form>
              <p className="mt-2 text-xs text-orange-200">Không spam, chỉ gửi yêu thương.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-orange-100 sm:flex-row">
          <p>{site.copyright}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Điều khoản</a>
            <a href="#" className="hover:text-white">Chính sách</a>
            <span className="rounded-full bg-white/10 px-3 py-1">Made with ♥ in Vietnam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs">
      {children}
    </span>
  );
}

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    facebook: "M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5Z",
    instagram:
      "M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm5.5-1.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 3.5c-2.4 0-2.7 0-3.6.05-.9.04-1.5.18-2 .38-.55.2-1 .48-1.45.93-.45.45-.73.9-.93 1.45-.2.5-.34 1.1-.38 2C3.5 9.3 3.5 9.6 3.5 12s0 2.7.05 3.6c.04.9.18 1.5.38 2 .2.55.48 1 .93 1.45.45.45.9.73 1.45.93.5.2 1.1.34 2 .38.9.05 1.2.05 3.6.05s2.7 0 3.6-.05c.9-.04 1.5-.18 2-.38.55-.2 1-.48 1.45-.93.45-.45.73-.9.93-1.45.2-.5.34-1.1.38-2 .05-.9.05-1.2.05-3.6s0-2.7-.05-3.6c-.04-.9-.18-1.5-.38-2-.2-.55-.48-1-.93-1.45a3.9 3.9 0 0 0-1.45-.93c-.5-.2-1.1-.34-2-.38-.9-.05-1.2-.05-3.6-.05Z",
    youtube:
      "M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.5c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.9.8 2.3.9 1.7.2 7 .2 7 .2s3.9 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.5v-1.5c0-1.8-.2-3.5-.2-3.5ZM9.9 14.6V8.9l5.4 2.9-5.4 2.8Z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d={paths[name]} />
    </svg>
  );
}
