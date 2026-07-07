import { useEffect, useRef, useState } from "react";

export default function Container({ children }) {
  const [timeNow, setTimeNow] = useState(() => new Date());
  const paragraphRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeNow(new Date());

      // Demo penggunaan useRef: simpan teks terbaru dari elemen.
      if (paragraphRef.current) {
        paragraphRef.current.dataset.lastUpdated = new Date().toISOString();
      }
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h1>Pemrograman Framework Lanjutan</h1>
      <br />
      {children}
      <br />

      <footer>
        <p ref={paragraphRef}>2025 - Politeknik Caltex Riau</p>
        <p>
          Waktu sekarang: <b>{timeNow.toLocaleTimeString()}</b>
        </p>
      </footer>
    </div>
  );
}
