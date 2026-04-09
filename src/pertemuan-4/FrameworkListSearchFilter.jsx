import { useState } from "react";
import frameworkData from "./framework.json";

export default function FrameworkListSearchFilter() {
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [selectedTag, setSelectedTag] = useState("");

  /*Inisialisasi DataForm*/
  const [dataForm, setDataForm] = useState({
    searchTerm: "",
    selectedTag: "",
    /*Tambah state lain beserta default value*/
  });

  /*Inisialisasi Handle perubahan nilai input form*/
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const _searchTerm = dataForm.searchTerm.toLowerCase();

  const filteredFrameworks = frameworkData.filter((framework) => {
    // MODIFIKASI DISINI: Menambahkan framework.details.developer ke dalam pencarian
    const matchesSearch =
      framework.name.toLowerCase().includes(_searchTerm) ||
      framework.description.toLowerCase().includes(_searchTerm) ||
      framework.details.developer.toLowerCase().includes(_searchTerm);

    const matchesTag = dataForm.selectedTag
      ? framework.tags.includes(dataForm.selectedTag)
      : true;

    return matchesSearch && matchesTag;
  });

  const allTags = [
    ...new Set(frameworkData.flatMap((framework) => framework.tags)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Framework Library
            </h1>
            <p className="text-slate-500 mt-2">
              Temukan alat yang tepat untuk proyek Anda berikutnya.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/50">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search name, description, or developer..."
                className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700"
                name="searchTerm"
                onChange={handleChange}
              />
            </div>

            {/* PERBAIKAN: onChange dipindah ke tag select, bukan option */}
            <select
              name="selectedTag"
              onChange={handleChange}
              className="w-full md:w-48 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-medium cursor-pointer"
            >
              <option value="">All Tags</option>
              {allTags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Grid Display tetap sama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrameworks.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h2>
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg border border-indigo-100">
                    {item.details.releaseYear}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-2 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1"
                      />
                    </svg>
                  </div>
                  {item.details.developer}
                </div>
                <a
                  href={item.details.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
                >
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
