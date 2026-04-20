import type { Metadata } from "next";
import Link from "next/link";
import { NavbarAuth } from "../components/navbar-auth";
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
            <Link href="/" className="logo">AutoMajstor</Link>
            <nav className="nav-links">
              <Link href="/search">Pretraga</Link>
              <NavbarAuth />
            </nav>
          </div>
        </header>
        <main className="container main-content">{children}</main>
      </body>
    </html>
  );
}
