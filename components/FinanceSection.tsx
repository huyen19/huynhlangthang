import site from "@/data/site.json";

export default function FinanceSection() {
  const f = site.finance;
  return (
    <section className="bg-gradient-to-r from-brand-red via-orange-600 to-brand py-14 text-center text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold sm:text-3xl">{f.title}</h2>
        <p className="mt-2 text-sm text-orange-100">{f.subtitle}</p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard label="Tổng Tiền Gây Quỹ" value={f.totalRaised} accent="border-pink-400 text-pink-500" />
          <StatCard label="Đã Sử Dụng" value={f.totalUsed} accent="border-yellow-400 text-yellow-500" />
          <StatCard label="Số Dư Hiện Tại" value={f.currentBalance} accent="border-green-400 text-green-600" />
        </div>

        <a
          href={f.statementLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full border-2 border-white px-8 py-3 text-sm font-bold hover:bg-white hover:text-brand-dark transition-colors"
        >
          Kiểm tra sao kê trực tiếp
        </a>
      </div>
    </section>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-2xl border-2 bg-white px-6 py-6 ${accent}`}>
      <p className="text-xs font-semibold tracking-wide text-neutral-500">{label}</p>
      <p className={`mt-2 text-2xl font-extrabold sm:text-3xl ${accent.split(" ")[1]}`}>{value}</p>
    </div>
  );
}
