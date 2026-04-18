import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoMajstor.rs",
  description: "Marketplace za auto usluge u Srbiji",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr">
      <body>
        <header className="header">
          <div className="container nav">
            <Link href="/">AutoMajstor.rs</Link>
            <nav className="nav-links">
              <Link href="/search">Pretraga</Link>
              <Link href="/auth">Prijava</Link>
              <Link href="/dashboard/add-listing">Dodaj oglas</Link>
              <Link href="/dashboard/my-listings">Moji oglasi</Link>
              <Link href="/admin/reviews">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
