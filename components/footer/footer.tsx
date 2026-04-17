// components/footer/Footer.tsx
import Link from "next/link"
import { FooterColumn } from "./footerColumn"
import { SocialIcons } from "./socialIcons"

export function Footer() {
  return (
    <footer className="bg-[#1E2A44] text-white mt-16">
      
      {/* Top Section */}
      <div className="container mx-auto px-4 py-10 grid gap-8 
                      md:grid-cols-3">
        
        {/* Kolom 1 - Branding */}
        <FooterColumn>
          <h2 className="text-lg font-bold text-yellow-400">Historapost</h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Portal berita sejarah, budaya, dan politik terpercaya di Indonesia.
            Menyajikan informasi mendalam dan analisis berimbang dari berbagai penjuru Nusantara.
          </p>
        </FooterColumn>

        {/* Kolom 2 - Link Cepat */}
        <FooterColumn title="Link Cepat">
          <div className="flex flex-col gap-2 text-sm text-white/80 ">
            <Link href="/tentang" className="hover:text-yellow-400">Tentang Kami</Link>
            <Link href="/redaksi" className="hover:text-yellow-400">Redaksi</Link>
            <Link href="/pedoman" className="hover:text-yellow-400">Pedoman Siber</Link>
            <Link href="/privasi" className="hover:text-yellow-400">Kebijakan Privasi</Link>
          </div>
        </FooterColumn>

        {/* Kolom 3 - Social */}
        <FooterColumn title="Ikuti Kami">
          <SocialIcons />
        </FooterColumn>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-white/60">
          © 2026 Historapost. Seluruh hak cipta dilindungi.
        </div>
      </div>

    </footer>
  )
}