import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import UserManagement from '../components/Admin/UserManagement';
import DokterManagement from '../components/Admin/DokterManagement';
import SupplierManagement from '../components/Admin/SupplierManagement';
import PembelianStok from '../components/Admin/PembelianStok';
import LaporanAdmin from '../components/Admin/LaporanAdmin';

const tabTitles: Record<string, string> = {
  users: 'Kelola User',
  dokter: 'Kelola Dokter',
  supplier: 'Kelola Supplier',
  pembelian: 'Pembelian Stok',
  laporan: 'Laporan & Statistik',
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'dokter':
        return <DokterManagement />;
      case 'supplier':
        return <SupplierManagement />;
      case 'pembelian':
        return <PembelianStok />;
      case 'laporan':
        return <LaporanAdmin />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{tabTitles[activeTab]}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Halaman admin — {tabTitles[activeTab]}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
