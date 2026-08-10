import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { NavbarAuth } from "../components/navbar-auth";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#6366F1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "AutoMajstor.rs | Pronađi Najboljeg Majstora i Auto Servis u Srbiji",
  description: "Baza verifikovanih auto servisa, mehaničara, autoelektričara, vulkanizera i 00-24h šlep službi u Srbiji sa pravim recenzijama vozača.",
  keywords: ["auto servis", "auto mehanicar", "autoelektričar", "slep sluzba", "vulkanizer", "detailing", "beograd", "novi sad", "niš"],
  authors: [{ name: "AutoMajstor.rs" }],
  metadataBase: new URL("https://automobili.rs"),
  openGraph: {
    title: "AutoMajstor.rs | Najbolji Auto Servisi u Srbiji",
    description: "Brzo pronađite verifikovane auto servise, proverite cene i ocene vozača ili kontaktirajte majstora u 1-klik.",
    url: "https://automobili.rs",
    siteName: "AutoMajstor.rs",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "AutoMajstor.rs",
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoMajstor.rs | Pronađi Najboljeg Majstora u Srbiji",
    description: "Baza verifikovanih auto servisa sa ocenama vozača i direktnim čatom.",
    images: ["https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <header className="header">
          <div className="container nav">
            <Link href="/" className="logo">
              🚗 AutoMajstor <span className="logo-badge">RS</span>
            </Link>
            <nav className="nav-links">
              <Link href="/search">Pretraga Servisa</Link>
              <NavbarAuth />
            </nav>
          </div>
        </header>

        <main className="container main-content">{children}</main>

        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <Link href="/" className="logo">
                  🚗 AutoMajstor <span className="logo-badge">RS</span>
                </Link>
                <p>
                  Vodeća platforma za brzo i sigurno pronalaženje auto servisa, mehaničara i 00-24h pomoći na putu širom Srbije.
                </p>
              </div>

              <div className="footer-col">
                <h4>Kategorije</h4>
                <ul>
                  <li><Link href="/search?category=auto-mehanicari">Auto Mehaničari</Link></li>
                  <li><Link href="/search?category=autoelektricari">Autoelektričari</Link></li>
                  <li><Link href="/search?category=poliranje-detailing">Poliranje & Detailing</Link></li>
                  <li><Link href="/search?category=slep-sluzba">Šlep Služba 00-24h</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Gradovi</h4>
                <ul>
                  <li><Link href="/search?city=Beograd">Beograd</Link></li>
                  <li><Link href="/search?city=Novi+Sad">Novi Sad</Link></li>
                  <li><Link href="/search?city=Niš">Niš</Link></li>
                  <li><Link href="/search?city=Kragujevac">Kragujevac</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Za Majstore</h4>
                <ul>
                  <li><Link href="/dashboard/add-listing">Postavi Oglas</Link></li>
                  <li><Link href="/auth">Prijava na Nalog</Link></li>
                  <li><Link href="/dashboard/my-listings">Upravljanje Oglasima</Link></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              © {new Date().getFullYear()} AutoMajstor.rs. Sva prava zadržana.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
