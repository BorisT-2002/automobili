import type { Metadata } from "next";
import Link from "next/link";
import { NavbarAuth } from "../components/navbar-auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoMajstor.rs | Pronađi Najboljeg Majstora i Auto Servis u Srbiji",
  description: "Najveća baza verificiranih auto mehaničara, autoelektričara, vulkanizera, detailing centara i šlep službi u Srbiji.",
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
                  Vodeća platforma za brzo i sigurno pronalaženje auto servisa, mehanikara i 00-24h pomoći na putu širom Srbije.
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
