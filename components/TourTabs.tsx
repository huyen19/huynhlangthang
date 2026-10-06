"use client";

import { useState } from "react";
import notices from "@/data/notices.json";
import type { ItineraryDay } from "@/lib/types";

type NoticeKey = keyof typeof notices;

/** Các nhóm nhỏ hiển thị dạng accordion bên trong một tab. */
type Group = { key: NoticeKey; label: string };

const TABS: { key: string; label: string }[] = [
  { key: "itinerary", label: "Lịch trình" },
  { key: "included", label: "Bao gồm" },
  { key: "excluded", label: "Không bao gồm" },
  { key: "prepare", label: "Chuẩn bị" },
  { key: "policy", label: "Chính sách" },
];

const INCLUDED_GROUPS: Group[] = [
  { key: "included", label: "✅ Giá tour bao gồm" },
  { key: "provided", label: "🧑‍🤝‍🧑 KTH sẽ chuẩn bị gì cho bạn?" },
];

const POLICY_GROUPS: Group[] = [
  { key: "cancellation", label: "⚠️ Lưu ý khi Hoàn & Huỷ tour" },
  { key: "childPolicy", label: "👶 Lưu ý giá trẻ em và ưu đãi" },
  { key: "forceMajeure", label: "🛡️ Trường hợp bất khả kháng" },
  { key: "groupSize", label: "👥 Số lượng khách tham gia" },
];

function NoticeList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-neutral-600">
      {items.map((item, i) => {
        // Dòng bọc trong **...** sẽ được in đậm.
        const bold = item.startsWith("**") && item.endsWith("**");
        return bold ? (
          <li key={i} className="font-bold text-neutral-900">{item.slice(2, -2)}</li>
        ) : (
          <li key={i}>{item}</li>
        );
      })}
    </ul>
  );
}

/** Nhiều nhóm trong cùng một tab — mở nhóm đầu tiên sẵn. */
function GroupedPanel({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<NoticeKey | null>(groups[0].key);

  return (
    <div className="space-y-3">
      {groups.map((g) => {
        const isOpen = open === g.key;
        return (
          <div key={g.key} className="overflow-hidden rounded-xl bg-white ring-1 ring-neutral-100">
            <button
              onClick={() => setOpen(isOpen ? null : g.key)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-neutral-800"
            >
              {g.label}
              <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            {isOpen && (
              <div className="border-t border-neutral-100 px-5 py-4">
                <NoticeList items={notices[g.key] as string[]} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TourTabs({
  itinerary,
  duration,
  tourName,
}: {
  itinerary: ItineraryDay[];
  duration: string;
  tourName: string;
}) {
  const [active, setActive] = useState("itinerary");

  return (
    <section id="schedule" className="border-t border-neutral-100 bg-neutral-50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-neutral-900">Thông tin chuyến đi</h2>
          <p className="mt-2 text-sm text-neutral-500">Hãy đọc kỹ để có chuyến đi trọn vẹn nhất</p>
        </div>

        {/* Tab bar */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-neutral-200" role="tablist">
          {TABS.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(t.key)}
                className={`-mb-px rounded-t-lg px-5 py-2.5 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Panels */}
        <div className="mt-6">
          {active === "itinerary" && (
            <div className="rounded-xl bg-white p-6 ring-1 ring-neutral-100">
              {itinerary.length > 0 ? (
                <>
                  <h3 className="text-lg font-extrabold text-neutral-900">
                    Lịch trình {duration} – Chinh phục {tourName.replace(/\s*\d+m$/, "")}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    🔔 Lưu ý: Ngày 0 là ngày di chuyển, các tour trekking sẽ di chuyển từ tối hôm trước.
                  </p>
                  <div className="mt-6 space-y-8 border-l-2 border-blue-200 pl-6">
                    {itinerary.map((day, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <h4 className="font-bold text-neutral-900">📅 {day.day}</h4>
                        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600">
                          {day.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-500">
                  Lịch trình chi tiết sẽ được KTH gửi khi bạn đăng ký tour.
                </p>
              )}
            </div>
          )}

          {active === "included" && <GroupedPanel groups={INCLUDED_GROUPS} />}

          {active === "excluded" && (
            <div className="rounded-xl bg-white p-6 ring-1 ring-neutral-100">
              <h3 className="text-lg font-extrabold text-neutral-900">❌ Giá tour không bao gồm</h3>
              <div className="mt-4">
                <NoticeList items={notices.excluded} />
              </div>
            </div>
          )}

          {active === "prepare" && (
            <div className="rounded-xl bg-white p-6 ring-1 ring-neutral-100">
              <h3 className="text-lg font-extrabold text-neutral-900">
                🎒 Bạn cần chuẩn bị gì khi đi tour
              </h3>
              <div className="mt-4">
                <NoticeList items={notices.prepare} />
              </div>
            </div>
          )}
          {active === "policy" && <GroupedPanel groups={POLICY_GROUPS} />}
        </div>
      </div>
    </section>
  );
}
