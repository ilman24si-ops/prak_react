import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/landing.css';

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '📦',
    colorClass: 'lp-feature-icon-blue',
    title: 'Manajemen Produk & Stok',
    desc: 'Kelola ribuan SKU obat, pantau stok secara real-time, dan terima alert otomatis ketika stok mendekati batas kritis.',
  },
  {
    icon: '🧾',
    colorClass: 'lp-feature-icon-green',
    title: 'Pesanan & Invoice Otomatis',
    desc: 'Buat dan kelola pesanan dengan cepat. Generate invoice PDF secara otomatis dan pantau status pembayaran.',
  },
  {
    icon: '👥',
    colorClass: 'lp-feature-icon-purple',
    title: 'Manajemen Pelanggan',
    desc: 'Database pelanggan terpusat, lengkap dengan riwayat pembelian, segmentasi, dan histori transaksi.',
  },
  {
    icon: '📊',
    colorClass: 'lp-feature-icon-amber',
    title: 'Dashboard & Laporan Real-time',
    desc: 'Visualisasi data penjualan, revenue, dan performa inventori dalam dashboard yang intuitif dan informatif.',
  },
  {
    icon: '🔐',
    colorClass: 'lp-feature-icon-rose',
    title: 'Role-Based Access Control',
    desc: 'Atur hak akses per role (Admin / Member) dengan presisi. Keamanan data terjamin di setiap level.',
  },
  {
    icon: '💻',
    colorClass: 'lp-feature-icon-cyan',
    title: 'Akses Multi-Platform',
    desc: 'Dapat diakses dari browser manapun. Tampilan responsif untuk desktop, tablet, maupun smartphone.',
  },
];

const STATS = [
  { icon: '💊', number: '500+', label: 'Produk Terdaftar', desc: 'Berbagai jenis obat & suplemen' },
  { icon: '🧾', number: '10.000+', label: 'Transaksi Tercatat', desc: 'Pesanan diproses dengan akurat' },
  { icon: '🏥', number: '50+', label: 'Apotek Bergabung', desc: 'Dari apotek kecil hingga besar' },
];

const FAQS = [
  {
    q: 'Apakah PharmaCRM bisa digunakan untuk apotek kecil?',
    a: 'Ya, PharmaCRM dirancang untuk semua ukuran apotek — dari apotek kecil dengan 1 karyawan hingga jaringan apotek besar dengan banyak cabang. Anda bisa mulai dengan fitur dasar dan upgrade kapan saja.',
  },
  {
    q: 'Berapa banyak produk yang bisa didaftarkan di sistem?',
    a: 'Tidak ada batas jumlah produk. Anda dapat mendaftarkan ribuan SKU obat, suplemen, dan produk kesehatan lainnya tanpa khawatir batasan kapasitas.',
  },
  {
    q: 'Bagaimana keamanan data di PharmaCRM?',
    a: 'Data Anda disimpan secara aman menggunakan Supabase dengan enkripsi end-to-end. Sistem RBAC kami memastikan hanya pengguna yang berwenang yang dapat mengakses data sensitif.',
  },
  {
    q: 'Apakah ada batasan jumlah pengguna (karyawan)?',
    a: 'Tidak ada batasan pengguna. Anda bisa menambahkan admin dan member sebanyak yang dibutuhkan, lengkap dengan pengaturan hak akses yang berbeda untuk setiap role.',
  },
  {
    q: 'Bagaimana cara mulai menggunakan PharmaCRM?',
    a: 'Cukup klik tombol "Daftar Sekarang", buat akun Admin untuk apotek Anda, lalu mulai tambahkan produk dan undang karyawan Anda. Proses onboarding sangat mudah dan cepat.',
  },
];

/* ─────────────────────────────────────────────
   HOOK: useIntersection
   ───────────────────────────────────────────── */
function useIntersection(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Navbar
   ───────────────────────────────────────────── */
function LandingNavbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav id="lp-navbar" className={`lp-navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Navigasi utama">
      <div className="lp-navbar-inner">
        {/* Logo */}
        <div className="lp-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} role="button" tabIndex={0} aria-label="PharmaCRM - Kembali ke atas">
          <div className="lp-logo-icon" aria-hidden="true">💊</div>
          <span className="lp-logo-text">PharmaCRM</span>
        </div>

        {/* Nav Links */}
        <ul className="lp-nav-links" role="list">
          <li><a onClick={() => scrollTo('lp-features')} role="button" tabIndex={0} aria-label="Lihat Fitur">Fitur</a></li>
          <li><a onClick={() => scrollTo('lp-faq')} role="button" tabIndex={0} aria-label="Lihat FAQ">FAQ</a></li>
          <li><a onClick={() => scrollTo('lp-stats')} role="button" tabIndex={0} aria-label="Tentang kami">Tentang</a></li>
        </ul>

        {/* Actions */}
        <div className="lp-nav-actions">
          <button id="lp-nav-login-btn" className="lp-btn-ghost" onClick={() => onNavigate('Login')} aria-label="Masuk ke sistem">
            Masuk
          </button>
          <button id="lp-nav-register-btn" className="lp-btn-primary" onClick={() => onNavigate('Register')} aria-label="Daftar akun baru">
            Daftar Gratis
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Hero Section
   ───────────────────────────────────────────── */
function HeroSection({ onNavigate }) {
  return (
    <section id="lp-hero" className="lp-hero" aria-label="Hero PharmaCRM">
      {/* Animated blobs */}
      <div className="lp-hero-blob lp-hero-blob-1" aria-hidden="true" />
      <div className="lp-hero-blob lp-hero-blob-2" aria-hidden="true" />
      <div className="lp-hero-blob lp-hero-blob-3" aria-hidden="true" />

      <div className="lp-hero-container">
        {/* Badge */}
        <div className="lp-hero-badge" role="status">
          <span className="lp-hero-badge-dot" aria-hidden="true" />
          Sistem CRM untuk Apotek Modern
        </div>

        {/* Headline */}
        <h1 className="lp-hero-title">
          Kelola Apotek Anda{' '}
          <span className="lp-hero-title-highlight">Lebih Cerdas</span>
          {' '}&amp; Efisien
        </h1>

        {/* Sub-headline */}
        <p className="lp-hero-subtitle">
          Sistem manajemen apotek terpadu — stok obat, pesanan, pelanggan, dan laporan real-time
          dalam satu platform yang mudah digunakan.
        </p>

        {/* CTA Buttons */}
        <div className="lp-hero-actions">
          <button
            id="lp-hero-register-btn"
            className="lp-hero-btn-primary"
            onClick={() => onNavigate('Register')}
            aria-label="Mulai daftar sekarang"
          >
            🚀 Mulai Sekarang
          </button>
          <button
            id="lp-hero-login-btn"
            className="lp-hero-btn-secondary"
            onClick={() => onNavigate('Login')}
            aria-label="Masuk ke sistem"
          >
            Masuk ke Sistem →
          </button>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="lp-hero-preview" aria-hidden="true">
          <div className="lp-hero-preview-card">
            {/* Window chrome */}
            <div className="lp-preview-header">
              <div className="lp-preview-dots">
                <span className="lp-preview-dot" style={{ background: '#f87171' }} />
                <span className="lp-preview-dot" style={{ background: '#fbbf24' }} />
                <span className="lp-preview-dot" style={{ background: '#34d399' }} />
              </div>
              <span className="lp-preview-title">PharmaCRM — Dashboard Admin</span>
            </div>

            {/* Stat cards */}
            <div className="lp-preview-stats">
              {[
                { val: '248', label: 'Produk' },
                { val: 'Rp 84jt', label: 'Revenue' },
                { val: '12', label: 'Shortage' },
                { val: '56', label: 'Invoice' },
              ].map((s) => (
                <div className="lp-preview-stat" key={s.label}>
                  <span className="lp-preview-stat-val">{s.val}</span>
                  <span className="lp-preview-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Bar items */}
            <div className="lp-preview-bars">
              {[
                { icon: '📦', name: 'Manajemen Stok', pct: '85%' },
                { icon: '🧾', name: 'Pesanan Hari Ini', pct: '62%' },
                { icon: '👥', name: 'Pelanggan Aktif', pct: '74%' },
              ].map((b) => (
                <div className="lp-preview-bar-item" key={b.name}>
                  <span className="lp-preview-bar-icon">{b.icon}</span>
                  <div className="lp-preview-bar-text">
                    <div className="lp-preview-bar-name">{b.name}</div>
                    <div className="lp-preview-bar-fill" style={{ width: b.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Stats Section
   ───────────────────────────────────────────── */
function StatsSection() {
  const [ref, visible] = useIntersection();

  return (
    <section id="lp-stats" className="lp-stats" ref={ref} aria-label="Statistik PharmaCRM">
      <div className="lp-stats-container">
        <div className="lp-section-header">
          <div className={`lp-animate${visible ? ' visible' : ''}`}>
            <span className="lp-section-tag">Dipercaya Apotek Indonesia</span>
            <h2 className="lp-section-title">Angka yang Bicara Sendiri</h2>
            <p className="lp-section-subtitle">
              PharmaCRM telah membantu ratusan apotek mengelola bisnis mereka dengan lebih efisien dan akurat.
            </p>
          </div>
        </div>

        <div className="lp-stats-grid">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`lp-stat-card lp-animate lp-animate-delay-${i + 1}${visible ? ' visible' : ''}`}
            >
              <span className="lp-stat-icon" aria-hidden="true">{stat.icon}</span>
              <span className="lp-stat-number">{stat.number}</span>
              <p className="lp-stat-label">{stat.label}</p>
              <p className="lp-stat-desc">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Features Section
   ───────────────────────────────────────────── */
function FeaturesSection() {
  const [ref, visible] = useIntersection();

  return (
    <section id="lp-features" className="lp-features" ref={ref} aria-label="Fitur Utama PharmaCRM">
      <div className="lp-features-container">
        <div className="lp-section-header">
          <div className={`lp-animate${visible ? ' visible' : ''}`}>
            <span className="lp-section-tag">Fitur Unggulan</span>
            <h2 className="lp-section-title">Semua yang Apotek Anda Butuhkan</h2>
            <p className="lp-section-subtitle">
              Dari manajemen stok hingga laporan keuangan — semua tersedia dalam satu platform terintegrasi.
            </p>
          </div>
        </div>

        <div className="lp-features-grid">
          {FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              className={`lp-feature-card lp-animate lp-animate-delay-${(i % 3) + 1}${visible ? ' visible' : ''}`}
            >
              <div className={`lp-feature-icon-wrap ${feat.colorClass}`} aria-hidden="true">
                {feat.icon}
              </div>
              <h3 className="lp-feature-title">{feat.title}</h3>
              <p className="lp-feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: FAQ Section
   ───────────────────────────────────────────── */
function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  const [ref, visible] = useIntersection();

  const toggle = useCallback((i) => {
    setOpenIdx((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section id="lp-faq" className="lp-faq" ref={ref} aria-label="Pertanyaan Umum">
      <div className="lp-faq-container">
        <div className="lp-section-header">
          <div className={`lp-animate${visible ? ' visible' : ''}`}>
            <span className="lp-section-tag">FAQ</span>
            <h2 className="lp-section-title">Pertanyaan yang Sering Ditanyakan</h2>
            <p className="lp-section-subtitle">
              Temukan jawaban atas pertanyaan umum seputar PharmaCRM di sini.
            </p>
          </div>
        </div>

        <div
          className="lp-faq-list"
          role="list"
          aria-label="Daftar pertanyaan umum"
        >
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`lp-faq-item lp-animate lp-animate-delay-${i + 1}${visible ? ' visible' : ''}${openIdx === i ? ' open' : ''}`}
              role="listitem"
            >
              <button
                id={`lp-faq-btn-${i}`}
                className="lp-faq-question"
                onClick={() => toggle(i)}
                aria-expanded={openIdx === i}
                aria-controls={`lp-faq-answer-${i}`}
              >
                <span className="lp-faq-question-text">{faq.q}</span>
                <span className="lp-faq-chevron" aria-hidden="true">▼</span>
              </button>
              <div
                id={`lp-faq-answer-${i}`}
                className="lp-faq-answer"
                role="region"
                aria-labelledby={`lp-faq-btn-${i}`}
              >
                <div className="lp-faq-answer-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: CTA Section
   ───────────────────────────────────────────── */
function CTASection({ onNavigate }) {
  const [ref, visible] = useIntersection();

  return (
    <section id="lp-cta" className="lp-cta" ref={ref} aria-label="Ajakan bergabung">
      <div className="lp-cta-blob lp-cta-blob-1" aria-hidden="true" />
      <div className="lp-cta-blob lp-cta-blob-2" aria-hidden="true" />

      <div className="lp-cta-container">
        <div className={`lp-animate${visible ? ' visible' : ''}`}>
          <div className="lp-cta-badge">✨ Gratis untuk Dicoba</div>
          <h2 className="lp-cta-title">
            Siap Transformasi<br />Apotek Anda?
          </h2>
          <p className="lp-cta-subtitle">
            Bergabunglah dengan puluhan apotek yang telah merasakan kemudahan mengelola bisnis bersama PharmaCRM.
            Mulai sekarang, gratis.
          </p>
          <div className="lp-cta-actions">
            <button
              id="lp-cta-register-btn"
              className="lp-cta-btn-main"
              onClick={() => onNavigate('Register')}
              aria-label="Daftar sekarang gratis"
            >
              🚀 Daftar Sekarang — Gratis
            </button>
            <button
              id="lp-cta-login-btn"
              className="lp-cta-btn-outline"
              onClick={() => onNavigate('Login')}
              aria-label="Sudah punya akun, masuk"
            >
              Sudah punya akun? Masuk →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Footer
   ───────────────────────────────────────────── */
function LandingFooter({ onNavigate }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="lp-footer" className="lp-footer" role="contentinfo">
      <div className="lp-footer-container">
        <div className="lp-footer-top">
          {/* Brand */}
          <div className="lp-footer-brand">
            <div className="lp-logo" style={{ marginBottom: '0.75rem' }}>
              <div className="lp-logo-icon" aria-hidden="true">💊</div>
              <span className="lp-logo-text">PharmaCRM</span>
            </div>
            <p>
              Solusi CRM terpadu untuk apotek modern Indonesia. Kelola stok, pesanan,
              dan pelanggan Anda dengan lebih cerdas.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <p className="lp-footer-col-title">Navigasi</p>
            <ul className="lp-footer-links" role="list">
              <li><span onClick={() => scrollTo('lp-features')} role="button" tabIndex={0}>Fitur</span></li>
              <li><span onClick={() => scrollTo('lp-faq')} role="button" tabIndex={0}>FAQ</span></li>
              <li><span onClick={() => scrollTo('lp-stats')} role="button" tabIndex={0}>Tentang</span></li>
              <li><span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} role="button" tabIndex={0}>Kembali ke Atas</span></li>
            </ul>
          </div>

          {/* Akses */}
          <div>
            <p className="lp-footer-col-title">Akses Sistem</p>
            <ul className="lp-footer-links" role="list">
              <li><span onClick={() => onNavigate('Login')} role="button" tabIndex={0}>Masuk</span></li>
              <li><span onClick={() => onNavigate('Register')} role="button" tabIndex={0}>Daftar Akun</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="lp-footer-bottom">
          <span>© 2025 PharmaCRM. Dibuat dengan ❤️ untuk apotek Indonesia.</span>
          <div className="lp-footer-bottom-right">
            <span>React + Vite + Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT: LandingPage
   ───────────────────────────────────────────── */
export default function LandingPage({ onNavigate }) {
  return (
    <div className="lp-root">
      {/* TOP */}
      <LandingNavbar onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />

      {/* MIDDLE */}
      <StatsSection />
      <FeaturesSection />
      <FAQSection />

      {/* BOTTOM */}
      <CTASection onNavigate={onNavigate} />
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
