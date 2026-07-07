import React from "react";

export default function TailwindCSS() {
  // Fungsi untuk menangani klik pada tombol
  const handleButtonClick = () => {
    alert("Tombol berhasil dipanggil!");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Belajar Tailwind CSS
        </h1>
        <button 
          onClick={handleButtonClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          Click Me
        </button>
      </div>

      <hr className="border-gray-300" />

      {/* Grid Layout untuk komponen-komponen lainnya */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Spacing />
        <Typography />
        <BorderRadius />
        <BackgroundColors />
        <div className="md:col-span-2">
          <FlexboxGrid />
        </div>
        <div className="md:col-span-2">
          <ShadowEffects />
        </div>
      </div>
    </div>
  );
}

// --- Komponen-Komponen Pendukung ---

function Spacing() {
  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-lg font-semibold border-b pb-2">Spacing (Padding & Margin)</h2>
      <p className="mt-4 text-gray-600">
        Kotak ini menggunakan <span className="font-mono text-red-500">p-6</span> untuk jarak dalam dan <span className="font-mono text-red-500">mt-4</span> untuk jarak atas tulisan ini.
      </p>
    </div>
  );
}

function Typography() {
  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h1 className="text-3xl font-black text-blue-600 italic">Typography</h1>
      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
        Mengatur ukuran font, ketebalan, dan jarak antar baris dengan sangat mudah.
      </p>
    </div>
  );
}

function BorderRadius() {
  return (
    <div className="bg-white shadow-lg p-6 rounded-lg flex items-center justify-center">
      <button className="border-2 border-dashed border-blue-500 text-blue-500 px-8 py-2 rounded-xl hover:bg-blue-50">
        Rounded LG
      </button>
    </div>
  );
}

function BackgroundColors() {
  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold">Gradient Background</h3>
      <p className="mt-2 opacity-90">Perpaduan warna modern hanya dengan satu baris class.</p>
    </div>
  );
}

function FlexboxGrid() {
  return (
    <nav className="flex flex-wrap justify-between items-center bg-gray-900 p-4 text-white rounded-lg shadow-md">
      <h1 className="text-lg font-bold tracking-widest uppercase">MyBrand</h1>
      <ul className="flex space-x-6">
        <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
        <li><a href="#" className="hover:text-blue-400 transition">About</a></li>
        <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
      </ul>
    </nav>
  );
}

function ShadowEffects() {
  return (
    <div className="bg-white shadow-sm p-10 rounded-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer border border-gray-100 text-center">
      <h3 className="text-2xl font-semibold text-gray-700">Hover Shadow Effect</h3>
      <p className="text-gray-400 mt-2">Sentuh kotak ini untuk melihat perubahan shadow yang dramatis.</p>
    </div>
  );
}