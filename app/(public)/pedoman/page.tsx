import { Breadcrumb } from "@/components/article";

export default function PedomanPage() {
  return (
    <main className="max-w-6xl mx-auto px-12 py-12 bg-white text-gray-800 leading-relaxed ">
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }]}
        currentPage={"Pedoman Siber"}
      />
      <header className="mb-8  text-center  pt-6">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
          Pedoman Pemberitaan Media Siber
        </h1>
      </header>

      <section className="space-y-6 text-justify">
        <p>
          Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers
          adalah hak asasi manusia yang dilindungi Pancasila, Undang-Undang
          Dasar 1945, dan Deklarasi Universal Hak Asasi Manusia PBB. Keberadaan
          media siber di Indonesia juga merupakan bagian dari kemerdekaan
          berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers.
        </p>
        <p>
          Media siber memiliki karakter khusus sehingga memerlukan pedoman agar
          pengelolaannya dapat dilaksanakan secara profesional, memenuhi fungsi,
          hak, dan kewajibannya sesuai Undang-Undang Nomor 40 Tahun 1999 tentang
          Pers dan Kode Etik Jurnalistik. Untuk itu Dewan Pers bersama
          organisasi pers, pengelola media siber, dan masyarakat menyusun
          Pedoman Pemberitaan Media Siber sebagai berikut:
        </p>
      </section>

      <div className="mt-10 space-y-12">
        {/* Pasal 1 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-l-4 border-blue-900 pl-3">
            1. Ruang Lingkup
          </h2>
          <ol className="list-[lower-alpha] ml-8 space-y-2">
            <li>
              Media Siber adalah segala bentuk media yang menggunakan wahana
              internet dan melaksanakan kegiatan jurnalistik, serta memenuhi
              persyaratan Undang-Undang Pers dan Standar Perusahaan Pers yang
              ditetapkan Dewan Pers.
            </li>
            <li>
              Isi Buatan Pengguna (User Generated Content) adalah segala isi
              yang díbuat dan atau dípublikasikan oleh pengguna media siber,
              antara lain, artikel, gambar, komentar, suara, video dan berbagai
              bentuk unggahan yang melekat pada media siber, seperti blog,
              forum, komentar pembaca atau pemirsa, dan bentuk lain.
            </li>
          </ol>
        </section>

        {/* Pasal 2 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-900 pl-3">
            2. Verifikasi dan keberimbangan berita
          </h2>
          <ol className="list-[lower-alpha] ml-8 space-y-3">
            <li>Pada prinsipnya setiap berita harus melalui verifikasi.</li>
            <li>
              Berita yang dapat merugikan pihak lain memerlukan verifikasi pada
              berita yang sama untuk memenuhi prinsip akurasi dan keberimbangan.
            </li>
            <li>
              Ketentuan dalam butir (a) di atas dikecualikan, dengan syarat:
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                <li>
                  Berita benar-benar mengandung kepentingan publik yang bersifat
                  mendesak;
                </li>
                <li>
                  Sumber berita yang pertama adalah sumber yang jelas disebutkan
                  identitasnya, kredibel dan kompeten;
                </li>
                <li>
                  Media memberikan penjelasan kepada pembaca bahwa berita
                  tersebut masih memerlukan verifikasi lebih lanjut...
                </li>
              </ul>
            </li>
          </ol>
        </section>

        {/* Pasal 3 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-900 pl-3">
            3. Isi Buatan Pengguna (User Generated Content)
          </h2>
          <ol className="list-[lower-alpha] ml-8 space-y-3">
            <li>
              Media siber wajib mencantumkan syarat dan ketentuan mengenai Isi
              Buatan Pengguna yang tidak bertentangan dengan Undang-Undang No.
              40 tahun 1999 tentang Pers dan Kode Etik Jurnalistik, yang
              ditempatkan secara terang dan jelas.
            </li>
            <li>
              Media siber mewajibkan setiap pengguna untuk melakukan registrasi
              keanggotaan dan melakukan proses log-in terlebih dahulu untuk
              dapat mempublikasikan semua bentuk Isi Buatan Pengguna. Ketentuan
              mengenai log-in akan díatur lebih lanjut.
            </li>
            <li>
              Dalam registrasi tersebut, media siber mewajibkan pengguna memberi
              persetujuan tertulis bahwa Isi Buatan Pengguna yang
              dípublikasikan:
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                <li>Tidak memuat isi bohong, fitnah, sadis dan cabul;</li>
                <li>
                  Tidak memuat isi yang mengandung prasangka dan kebencian
                  terkait dengan suku, agama, ras, dan antargolongan (SARA),
                  serta menganjurkan tindakan kekerasan;
                </li>
                <li>
                  Tidak memuat isi diskriminatif atas dasar perbedaan jenis
                  kelamin dan bahasa, serta tidak merendahkan martabat orang
                  lemah, miskin, sakit, cacat jiwa, atau cacat jasmani.
                </li>
              </ul>
            </li>
            <li>
              Media siber memiliki kewenangan mutlak untuk mengedit atau
              menghapus Isi Buatan Pengguna yang bertentangan dengan butir (c).
            </li>
            <li>
              Media siber wajib menyediakan mekanisme pengaduan Isi Buatan
              Pengguna yang dínilai melanggar ketentuan pada butir (c).
              Mekanisme tersebut harus dísediakan di tempat yang dengan mudah
              dapat díakses pengguna.
            </li>
            <li>
              Media siber wajib menyunting, menghapus, dan melakukan tindakan
              koreksi setiap Isi Buatan Pengguna yang dilaporkan dan melanggar
              ketentuan butir (c), sesegera mungkin secara proporsional
              selambat-lambatnya 2 x 24 jam setelah pengaduan diterima.
            </li>
            <li>
              Media siber yang telah memenuhi ketentuan pada butir (a), (b),
              (c), dan (f) tidak díbebani tanggung jawab atas masalah yang
              dítimbulkan akibat pemuatan isi yang melanggar ketentuan pada
              butir (c).
            </li>
            <li>
              Media siber bertanggung jawab atas Isi Buatan Pengguna yang
              dilaporkan bila tidak mengambil tindakan koreksi setelah batas
              waktu sebagaimana tersebut pada butir (f).
            </li>
          </ol>
        </section>

        {/* Pasal 4 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-900 pl-3">
            4. Ralat, Koreksi, dan Hak Jawab
          </h2>
          <ol className="list-[lower-alpha] ml-8 space-y-3">
            <li>
              Ralat, koreksi, dan hak jawab mengacu pada Undang-Undang Pers,
              Kode Etik Jurnalistik, dan Pedoman Hak Jawab yang ditetapkan Dewan
              Pers.
            </li>
            <li>
              Ralat, koreksi dan atau hak jawab wajib ditautkan pada berita yang
              diralat, dikoreksi atau yang diberi hak jawab.
            </li>
            <li>
              Di setiap berita ralat, koreksi, dan hak jawab wajib dicantumkan
              waktu pemuatan ralat, koreksi, dan atau hak jawab tersebut.
            </li>
            <li>
              Bila suatu berita media siber tertentu disebarluaskan media siber
              lain, maka:
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700">
                <li>
                  Tanggung jawab media siber pembuat berita terbatas pada berita
                  yang dipublikasikan di media siber tersebut atau media siber
                  yang berada di bawah otoritas teknisnya;
                </li>
                <li>
                  Koreksi berita yang dilakukan oleh sebuah media siber, juga
                  harus dilakukan oleh media siber lain yang mengutip berita
                  dari media siber yang dikoreksi itu;
                </li>
                <li>
                  Media yang menyebarluaskan berita dari sebuah media siber dan
                  tidak melakukan koreksi atas berita sesuai yang dilakukan oleh
                  media siber pemilik dan atau pembuat berita tersebut,
                  bertanggung jawab penuh atas semua akibat hukum dari berita
                  yang tidak dikoreksinya itu.
                </li>
              </ul>
            </li>
            <li>
              Sesuai dengan Undang-Undang Pers, media siber yang tidak melayani
              hak jawab dapat díjatuhi sanksi hukum pidana denda paling banyak
              Rp500.000.000 (Lima ratus juta rupiah).
            </li>
          </ol>
        </section>

        {/* Pasal 5 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-900 pl-3">
            5. Pencabutan Berita
          </h2>
          <ol className="list-[lower-alpha] ml-8 space-y-3">
            <li>
              Berita yang sudah dípublikasikan tidak dapat dícabut karena alasan
              penyensoran dari pihak luar redaksi, kecuali terkait masalah SARA,
              kesusilaan, masa depan anak, pengalaman traumatik korban atau
              berdasarkan pertimbangan khusus lain yang dítetapkan Dewan Pers.
            </li>
            <li>
              Media siber lain wajib mengikuti pencabutan kutipan berita dari
              media asal yang telah dícabut.
            </li>
            <li>
              Pencabutan berita wajib dísertai dengan alasan pencabutan dan
              díumumkan kepada publik.
            </li>
          </ol>
        </section>

        {/* Pasal 6 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-900 pl-3">
            6. Iklan
          </h2>
          <ol className="list-[lower-alpha] ml-8 space-y-3">
            <li>
              Media siber wajib membedakan dengan tegas antara produk berita dan
              iklan.
            </li>
            <li>
              Setiap berita/artikel/isi yang merupakan iklan dan atau isi
              berbayar wajib mencantumkan keterangan &quot;advertorial&quot;,
              &quot;iklan&quot;, &quot;ads&quot;, &quot;sponsored&quot;, atau
              kata lain yang menjelaskan bahwa berita/artikel/isi tersebut
              adalah iklan.
            </li>
          </ol>
        </section>

        {/* Pasal 7 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-900 pl-3">
            7. Hak Cipta
          </h2>
          <p>
            Media siber wajib menghormati hak cipta sebagaimana díatur dalam
            peraturan perundang-undangan yang berlaku.
          </p>
        </section>

        {/* Pasal 8 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-900 pl-3">
            8. Pencantuman Pedoman
          </h2>
          <p>
            Media siber wajib mencantumkan Pedoman Pemberitaan Media Siber ini
            di medianya secara terang dan jelas.
          </p>
        </section>

        {/* Pasal 9 */}
        <section className="text-justify">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-900 pl-3">
            9. Sengketa
          </h2>
          <p>
            Penilaian akhir atas sengketa mengenai pelaksanaan Pedoman
            Pemberitaan Media Siber ini diselesaikan oleh Dewan Pers.
          </p>
        </section>
      </div>

      <footer className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <p>Jakarta, 3 Februari 2012</p>
        <p className="italic">
          (Pedoman ini ditandatangani oleh Dewan Pers dan komunitas pers di
          Jakarta, 3 Februari 2012).
        </p>
      </footer>
    </main>
  );
}
