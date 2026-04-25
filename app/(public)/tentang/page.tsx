import { Breadcrumb } from "@/components/article";

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-12 py-12 bg-white text-gray-800 leading-relaxed ">
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }]}
        currentPage={"Tentang Kami"}
      />
      <header className="mb-8  text-center  pt-6">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
          Tentang Kami
        </h1>
      </header>

      <section className="space-y-6 text-justify">
        <p>
          platform media online yang memproduksi berita teks dan video news
          untuk memenuhi kebutuhan masyarakat akan informasi (berita) melalui
          saluran website dan media sosial.
        </p>
        <p className="bg-slate-100 border-l-6 border-blue-900 p-4">
          Visi kami adalah menjadi sumber berita terdepan dalam kemasan visual
          yang dapat dinikmati khalayak di seluruh dunia.
        </p>
        <p className="bg-slate-100 border-l-6 border-blue-900 p-4">
          Misi kami, selain memberikan informasi peristiwa dan fakta seputar
          sosial-politik, ekonomi-bisnis, dan olahraga-hiburan bagi masyarakat,
          juga menjalin kolaborasi bisnis dengan lembaga maupun pelaku usaha
          lainnya.
        </p>
        <p>
          Kami juga akan terus berinovasi untuk memenuhi harapan audiens kami
          dan berharap ikut memberi pengaruh positif dalam perkembangan industri
          media dan pembangunan baik pemerintahan maun non pemerintahan.
        </p>
      </section>
      <footer className="pt-20 text-center">
        <h2 className="text-2xl font-bold mb-6">Tertarik Berkolaborasi?</h2>
        <p className="text-gray-600 mb-8">
          Kami selalu terbuka untuk kontributor dan pembaca yang ingin berbagi
          perspektif.
        </p>
        <a
          href="https://wa.me/6282293718474"
          className="bg-blue-900 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Hubungi Kami
        </a>
      </footer>
    </main>
  );
}
