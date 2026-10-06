import Image from "next/image";
import type { Product } from "@/lib/types";
import { colorToHex } from "@/lib/colors";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-100">
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-neutral-800">
          {product.name}
        </h3>
        <p className="mt-2 font-mono text-base font-bold text-brand">
          {product.price.toLocaleString("vi-VN")} đ
        </p>
        {product.colors.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c}
                title={c}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-neutral-200"
                style={{ backgroundColor: colorToHex(c) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
