import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={site.logo}
            alt={`${site.name} Logo`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="text-lg font-bold text-neutral-900">{site.name}</span>
        </Link>
      </div>
    </header>
  );
}
