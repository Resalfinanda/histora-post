import { Breadcrumb } from "@/components/article";

export default function KebijakanPrivasi() {
  return (
    <main className="max-w-6xl mx-auto px-12 py-12 bg-white text-gray-800 leading-relaxed">
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }]}
        currentPage={"Kebijakan Privasi"}
      />

      <header className="mb-8 text-center pt-6">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
          Kebijakan Privasi
        </h1>
      </header>

      <section className="space-y-6 text-justify">
        <p>
          Kebijakan Privasi ini menjelaskan bagaimana{" "}
          <strong>Histora Post</strong> mengumpulkan, menggunakan, dan
          melindungi informasi pribadi Anda saat menggunakan layanan website
          kami. Kami berkomitmen untuk menjaga keamanan data pribadi Anda sesuai
          dengan peraturan perundang-undangan yang berlaku.
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-blue-900 pl-3">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p>
            Kami dapat mengumpulkan informasi identitas pribadi ketika Anda
            melakukan registrasi, berlangganan buletin, atau berinteraksi
            melalui fitur komentar. Informasi ini meliputi nama dan alamat email.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-blue-900 pl-3">
            2. Penggunaan Informasi
          </h2>
          <p>Informasi yang kami kumpulkan digunakan untuk:</p>
          <ul className="list-disc ml-8 space-y-2  p-4 ">
            <li>
              Menyediakan informasi dan berita yang relevan dengan minat Anda.
            </li>
            <li>
              Mengelola akun pengguna dan layanan interaktif (kolom komentar).
            </li>
            <li>Menganalisis performa website melalui statistik pengunjung.</li>
            <li>
              Mengirimkan notifikasi atau informasi terkait pembaruan layanan
              Histora Post.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-blue-900 pl-3">
            3. Keamanan Data
          </h2>
          <p className=" p-4">
            Kami menerapkan standar keamanan teknis untuk melindungi data
            pribadi Anda dari akses yang tidak sah. Namun, perlu diingat bahwa
            tidak ada metode pengiriman data melalui internet yang 100% aman,
            meskipun kami terus berupaya menggunakan cara yang diakui secara
            komersial untuk melindungi data Anda.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-blue-900 pl-3">
            4. Hak Pengguna
          </h2>
          <p>
            Anda memiliki hak untuk meminta akses, koreksi, atau penghapusan
            informasi pribadi Anda yang tersimpan di sistem kami. Jika Anda
            memiliki kekhawatiran mengenai privasi Anda, silakan hubungi kami
            melalui saluran komunikasi yang tersedia.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-l-4 border-blue-900 pl-3">
            5. Perubahan Kebijakan
          </h2>
          <p>
            Histora Post berhak untuk memperbarui Kebijakan Privasi ini kapan
            saja. Kami akan memberikan informasi jika terdapat perubahan
            signifikan melalui pengumuman di halaman ini.
          </p>
        </div>
      </section>
    </main>
  );
}
