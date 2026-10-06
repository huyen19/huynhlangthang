// Best-effort Vietnamese color-name -> swatch hex mapping (keyword based).
export function colorToHex(name: string): string {
  const n = name.toLowerCase();
  const has = (s: string) => n.includes(s);

  if (has("đen")) return "#1a1a1a";
  if (has("trắng") || has("ngà") && has("trắng")) return "#f5f5f4";
  if (has("kem") || has("ngà")) return "#f0e6d2";
  if (has("be") || has("nude")) return "#e3c9a3";
  if (has("bạc") && !has("cam")) return "#c7c7c7";
  if (has("xám") || has("ghi") || has("tro")) return "#8a8a8a";
  if (has("rêu")) return "#7a7f4b";
  if (has("oliu") || has("olive")) return "#6b6f3a";
  if (has("nâu")) return "#6b4a2f";
  if (has("đỏ")) return "#c0392b";
  if (has("cam")) return "#e8722c";
  if (has("vàng")) return "#e6b800";
  if (has("hồng")) return "#e79bb5";
  if (has("tím")) return "#8e6bb0";
  if (has("navy") || has("hải quân")) return "#1f2d50";
  if (has("than")) return "#2b2f36";
  if (has("ngọc")) return "#2fa88f";
  if (has("bạc hà")) return "#a3e4d7";
  if (has("teal")) return "#2c7a7b";
  if (has("coban")) return "#3b5ba9";
  if (has("dương") || has("lam") || has("biển") || has("băng")) return "#3b7dd8";
  if (has("lá") || has("bơ") || has("chuối")) return "#5c9a3b";
  if (has("xanh")) return "#3b7dd8";
  if (has("gold") || has("đồng")) return "#b8860b";
  if (has("gỗ óc chó")) return "#4a3222";
  return "#c7c7c7";
}
