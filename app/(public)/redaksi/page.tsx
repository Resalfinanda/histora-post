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
          Update Terakhir: Mei 2026
        </p>
      </header>

      <section className="space-y-8">
        <div className="bg-slate-50 p-8 rounded-lg border-t-4 border-blue-900 shadow-sm">
          <p className="text-center text-lg mb-6 leading-relaxed">
            <strong>Histora Post</strong> dikelola oleh tenaga profesional yang
            menjunjung tinggi Kode Etik Jurnalistik dan kemandirian pers dalam
            menyampaikan informasi kepada publik.
          </p>

          <div className=" mt-10">
            <div className="space-y-1 mb-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Direktur
              </h2>
              <p className="text-gray-700 text-center">MULIAWAN IDHAM</p>
            </div>
            <div className="space-y-1 mb-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Editorial
              </h2>
              <p className="text-gray-700 text-center uppercase">
                Insan IJ, Redo,resal
              </p>
            </div>
            <div className="space-y-1 mb-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Reporter
              </h2>
              <p className="text-gray-700 text-center uppercase">
                Akbar Senggol, Aditya, Putri, Najwa, Sesilia
              </p>
            </div>
            <div className="space-y-1 mb-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Medsos
              </h2>
              <p className="text-gray-700 text-center uppercase">Fikri </p>
            </div>
            <div className="space-y-1 mb-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                KONTAK
              </h2>
              <p className="text-gray-700 text-center uppercase">
                085190035643
              </p>
            </div>
            <div className="space-y-1 mb-4">
              <h2 className="text-blue-900 text-center font-bold uppercase border-b border-gray-200 pb-2">
                Email Redaksi
              </h2>
              <p className="text-gray-700 text-center uppercase">
                pintesiaenergi@gmail.com
              </p>
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
      </section>
    </main>
  );
}
