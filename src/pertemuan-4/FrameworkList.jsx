import frameworkData from "./framework.json";

export default function FrameworkList() {
    
    return (
        // Background dengan gradasi lembut agar tidak membosankan
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8 md:p-12">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {frameworkData.map((item) => (
                    // Card dengan efek hover transform dan shadow yang halus
                    <div 
                        key={item.id} 
                        className="group bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between"
                    >
                        <div>
                            {/* Header: Nama & Badge Tahun */}
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                    {item.name}
                                </h2>
                                <span className="text-[10px] uppercase tracking-widest font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                                    Est. {item.details.releaseYear}
                                </span>
                            </div>

                            {/* Deskripsi dengan line-height yang nyaman */}
                            <p className="text-slate-600 leading-relaxed mb-6 italic">
                                "{item.description}"
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Detail Developer */}
                            <div className="flex items-center text-sm font-medium text-slate-500">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                                    </svg>
                                </div>
                                <span>{item.details.developer}</span>
                            </div>

                            {/* Link Website sebagai Button */}
                            <a 
                                href={item.details.officialWebsite}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                            >
                                Visit Website
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}