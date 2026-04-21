import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cyber Capstone - Image Gallery",
  description: "Ứng dụng chia sẻ ảnh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="header">
          <nav className="nav">
            <div className="nav-brand">
              <Link href="/">Cyber Gallery</Link>
            </div>
            <ul className="nav-links">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              <li>
                <Link href="/search">Tìm kiếm</Link>
              </li>
              <li>
                <a href="/login">Đăng nhập</a>
              </li>
              <li>
                <a href="/register">Đăng ký</a>
              </li>
              <li>
                <a href="/profile">Profile</a>
              </li>
              <li>
                <a href="/my-images">Ảnh của tôi</a>
              </li>
              <li>
                <a href="/saved-images">Ảnh đã lưu</a>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
