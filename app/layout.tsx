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
  title: "Khang Tu Hú - Du Lịch Trekking",
  description:
    "Cùng Khang Tu Hú biến những chuyến đi trở thành hành trình ý nghĩa.",
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
