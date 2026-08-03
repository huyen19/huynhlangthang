import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import ChatBubble from "@/components/ChatBubble";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Huyền Lang Thang - Du Lịch & Thiện Nguyện",
  description:
    "Cùng Huyền Lang Thang biến những chuyến đi trở thành hành trình ý nghĩa. Nơi kết hợp hoàn hảo giữa Du Lịch & Thiện Nguyện.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {children}
        <ChatBubble />
      </body>
    </html>
  );
}
