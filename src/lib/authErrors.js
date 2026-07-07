const AUTH_ERROR_MESSAGES = {
  invalid_credentials:
    'Email atau password salah. Jika baru daftar, pastikan registrasi berhasil dan email sudah dikonfirmasi.',
  email_address_invalid:
    'Alamat email tidak diterima oleh Supabase. Gunakan email aktif (bukan domain contoh seperti @test.com).',
  email_address_not_authorized:
    'Email tidak diizinkan. Proyek Supabase free tier hanya mengirim konfirmasi ke email anggota tim Supabase. Nonaktifkan konfirmasi email atau pasang SMTP custom.',
  email_exists: 'Email sudah terdaftar. Silakan login.',
  over_email_send_rate_limit:
    'Terlalu banyak percobaan daftar. Tunggu beberapa menit lalu coba lagi.',
  signup_disabled: 'Pendaftaran akun baru dinonaktifkan di server Supabase.',
};

export function getAuthErrorMessage(error) {
  if (!error) return '';
  const code = error.code ?? error.error_code;
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  return error.message ?? 'Terjadi kesalahan autentikasi.';
}
