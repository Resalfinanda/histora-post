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
          Platform ini merupakan media online yang menyajikan berita dalam
          bentuk teks dan video untuk memenuhi kebutuhan informasi masyarakat.
          Konten kami disalurkan melalui website dan media sosial agar lebih
          mudah diakses oleh siapa saja.
        </p>
        <p className="bg-slate-100 border-l-6 border-blue-900 p-4">
          Visi kami adalah menjadi sumber berita yang terpercaya dengan
          penyajian visual yang jelas dan nyaman untuk diikuti, sehingga bisa
          menjangkau audiens yang lebih luas.
        </p>
        <p className="bg-slate-100 border-l-6 border-blue-900 p-4">
          Misi kami adalah menyampaikan informasi seputar sosialpolitik,
          ekonomi-bisnis, serta olahraga dan hiburan secara relevan dan dapat
          dipahami. Selain itu, kami juga membuka peluang kerja sama dengan
          berbagai lembaga dan pelaku usaha.
        </p>
        <p>
          Kami akan terus melakukan pengembangan agar konten yang disajikan
          tetap sesuai dengan kebutuhan audiens, sekaligus berupaya memberikan
          dampak positif bagi perkembangan media dan lingkungan sekitar, baik di
          sektor pemerintahan maupun nonpemerintahan.
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
