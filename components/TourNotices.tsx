"use client";

import { useState } from "react";
import notices from "@/data/notices.json";

const SECTIONS: { key: keyof typeof notices; label: string }[] = [
  { key: "included", label: "✅ Giá tour bao gồm" },
  { key: "excluded", label: "❌ Giá tour không bao gồm" },
  { key: "prepare", label: "🎒 Bạn cần chuẩn bị gì khi đi tour" },
  { key: "provided", label: "🧑‍🤝‍🧑 HLT sẽ chuẩn bị gì cho bạn?" },
  { key: "cancellation", label: "⚠️ Lưu ý khi Hoàn & Huỷ tour" },
  { key: "childPolicy", label: "👶 Lưu ý giá trẻ em và ưu đãi" },
  { key: "forceMajeure", label: "🛡️ Trường hợp bất khả kháng" },
  { key: "groupSize", label: "👥 Số lượng khách tham gia" },
];

export default function TourNotices() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="border-t border-neutral-100 bg-neutral-50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-neutral-900">NHỮNG LƯU Ý QUAN TRỌNG</h2>
          <p className="mt-2 text-sm text-neutral-500">Hãy đọc kỹ để có chuyến đi trọn vẹn nhất</p>
        </div>

        <div className="mt-8 space-y-3">
          {SECTIONS.map((s) => {
            const isOpen = open === s.key;
            const items = notices[s.key] as string[];
            return (
              <div key={s.key} className="overflow-hidden rounded-xl bg-white ring-1 ring-neutral-100">
                <button
                  onClick={() => setOpen(isOpen ? null : s.key)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-neutral-800"
                >
                  {s.label}
                  <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </button>
                {isOpen && (
                  <ul className="space-y-2 border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-600">
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
