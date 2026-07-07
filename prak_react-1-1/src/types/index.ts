export type User = {
  id: string;
  email: string;
  username?: string;
  name?: string;
  created_at: string;
  updated_at?: string;
};

export type AuthResponse = {
  user: User | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  } | null;
  error: {
    message: string;
  } | null;
};

export type Dokter = {
  id?: string;
  nama: string;
  spesialis: string;
  no_hp: string;
  alamat: string;
  created_at?: string;
};

export type Supplier = {
  id?: string;
  nama: string;
  kontak: string;
  email: string;
  alamat: string;
  created_at?: string;
};

export type PembelianStok = {
  id?: string;
  nama_obat: string;
  jumlah: number;
  harga_satuan: number;
  total_harga?: number;
  supplier_id: string;
  supplier?: Supplier;
  tanggal_beli: string;
  catatan?: string;
  created_at?: string;
};
