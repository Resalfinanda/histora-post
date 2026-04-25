import { Breadcrumb } from "@/components/article";

export default function RedaksiPage() {
  return (
    <main className="max-w-6xl mx-auto px-12 py-12 bg-white text-gray-800 leading-relaxed">
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }]}
        currentPage={"Redaksi"}
      />

      <header className="mb-8 text-center pt-6">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
          Susunan Redaksi
        </h1>
        <p className="text-gray-500 mt-2 italic text-sm">
          Update Terakhir: April 2026
        </p>
      </header>

      {/* <section className="space-y-8">
        <div className="bg-slate-50 p-8 rounded-lg border-t-4 border-blue-900 shadow-sm">
          <p className="text-center text-lg mb-6 leading-relaxed">
            <strong>Histora Post</strong> dikelola oleh tenaga profesional yang
            menjunjung tinggi Kode Etik Jurnalistik dan kemandirian pers dalam
            menyampaikan informasi kepada publik.
          </p>

          <div className=" mt-10">
            <div className="space-y-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Manajemen
              </h2>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">Pimpinan Umum</span>
                <span className="font-bold text-right">[Nama Pimpinan]</span>
              </div>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">
                  Pimpinan Perusahaan
                </span>
                <span className="font-bold text-right">[Nama Pimpinan]</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Redaksi
              </h2>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">
                  Pemimpin Redaksi
                </span>
                <span className="font-bold text-right">[Nama Lengkap]</span>
              </div>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">
                  Redaktur Pelaksana
                </span>
                <span className="font-bold text-right">[Nama Lengkap]</span>
              </div>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">Editor</span>
                <span className="font-bold text-right">[Nama Lengkap]</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Teknologi & Produk
              </h2>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">
                  Fullstack Developer
                </span>
                <span className="font-bold text-right">[Nama Kamu/Tim]</span>
              </div>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">
                  UI/UX Designer
                </span>
                <span className="font-bold text-right">[Nama Lengkap]</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Tim Kreatif & Multimedia
              </h2>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">Videografer</span>
                <span className="font-bold text-right">[Nama Lengkap]</span>
              </div>
              <div className="flex justify-around border-b border-dotted border-gray-300 pb-1">
                <span className="font-medium text-gray-600">
                  Social Media Specialist
                </span>
                <span className="font-bold text-right">[Nama Lengkap]</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-200 text-gray-500 p-6 rounded-lg text-center">
          <h3 className="font-bold mb-2 uppercase">Alamat Redaksi</h3>
          <p className="text-sm ">
            JI. Batu Raja No. 10, Makassar, Sulawesi Selatan
          </p>
        </div>

        <p className="text-sm text-gray-500 italic text-center">
          Wartawan Histora Post dibekali kartu identitas (ID Card) saat
          bertugas. Pihak luar dilarang memberikan imbalan apapun kepada tim
          redaksi yang dapat mempengaruhi independensi pemberitaan.
        </p>
      </section> */}
    </main>
  );
}
