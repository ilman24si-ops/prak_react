import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import MemberDashboard from './pages/MemberDashboard';
import MyOrders from './pages/MyOrders';
import UserManagement from './pages/UserManagement';
import GuestDashboard from './pages/GuestDashboard';
import PagePlaceholder from './pages/PagePlaceholder';
import LandingPage from './pages/LandingPage';
import Inventory from './pages/Inventory';
import PointOfSales from './pages/PointOfSales';
import Chatbox from './pages/Chatbox';
import UploadResep from './pages/UploadResep';
import RiwayatResep from './pages/RiwayatResep';
import KeranjangObat from './pages/KeranjangObat';
import BroadcastPromo from './pages/BroadcastPromo';
import ArtikelKesehatan from './pages/ArtikelKesehatan';
import Testimoni from './pages/Testimoni';
import KelolaDokter from './pages/KelolaDokter';
import Supplier from './pages/Supplier';
import PembelianStok from './pages/PembelianStok';
import LaporanAdmin from './pages/LaporanAdmin';

const ADMIN_TABS = new Set([
  'Dashboard',
  'Inventory',
  'Point of Sales',
  'Products',
  'Customers',
  'Orders',
  'User Management',
  'Chatbox',
  'Broadcast Promo',
  'Artikel Kesehatan',
  'Testimoni',
  'Application Settings',
  'Kelola Dokter',
  'Supplier',
  'Pembelian Stok',
  'Laporan Admin',
]);

const MEMBER_TABS = new Set([
  'Member Dashboard',
  'Keranjang Obat',
  'Upload Resep',
  'Riwayat Resep Obat',
  'Chatbox',
  'Products',
  'My Orders',
  'Broadcast Promo',
  'Artikel Kesehatan',
  'Testimoni',
]);

const GUEST_TABS = new Set([
  'Guest Dashboard',
  'Products',
  'Artikel Kesehatan',
  'Testimoni',
]);

const PUBLIC_TABS = new Set(['Landing', 'Login', 'Register']);

export default function AppShell() {
  const { isAuthenticated, isAdmin, isMember, isGuest, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('Landing');

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      setActiveTab((tab) => (PUBLIC_TABS.has(tab) ? tab : 'Landing'));
      return;
    }

    if (!profile) return;

    setActiveTab((tab) => {
      if (isAdmin) return ADMIN_TABS.has(tab) ? tab : 'Dashboard';
      if (isMember) return MEMBER_TABS.has(tab) ? tab : 'Member Dashboard';
      if (isGuest) return GUEST_TABS.has(tab) ? tab : 'Guest Dashboard';
      return 'Login';
    });
  }, [loading, isAuthenticated, isAdmin, isMember, profile]);

  const handleNavigate = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const renderContent = useMemo(() => {
    if (!isAuthenticated) {
      switch (activeTab) {
        case 'Register':
          return <Register onNavigate={handleNavigate} />;
        case 'Login':
          return <Login onNavigate={handleNavigate} />;
        case 'Landing':
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    }
    if (!profile) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      );
    }

    if (isAdmin) {
      switch (activeTab) {
        case 'Inventory':
          return <Inventory />;
        case 'Point of Sales':
          return <PointOfSales />;
        case 'Products':
          return <Products />;
        case 'Customers':
          return <Customers />;
        case 'Orders':
          return <Orders />;
        case 'User Management':
          return <UserManagement />;
        case 'Chatbox':
          return <Chatbox />;
        case 'Broadcast Promo':
          return <BroadcastPromo />;
        case 'Artikel Kesehatan':
          return <ArtikelKesehatan />;
        case 'Testimoni':
          return <Testimoni />;
        case 'Kelola Dokter':
          return <KelolaDokter />;
        case 'Supplier':
          return <Supplier />;
        case 'Pembelian Stok':
          return <PembelianStok />;
        case 'Laporan Admin':
          return <LaporanAdmin />;
        case 'Application Settings':
          return <PagePlaceholder title="Application Settings" icon="⚙️" />;
        case 'Dashboard':
        default:
          return <Dashboard onNavigate={setActiveTab} />;
      }
    }

    if (isMember) {
      switch (activeTab) {
        case 'Keranjang Obat':
          return <KeranjangObat onNavigate={setActiveTab} />;
        case 'Upload Resep':
          return <UploadResep />;
        case 'Riwayat Resep Obat':
          return <RiwayatResep />;
        case 'Chatbox':
          return <Chatbox />;
        case 'Products':
          return <Products />;
        case 'My Orders':
          return <MyOrders onNavigate={setActiveTab} />;
        case 'Broadcast Promo':
          return <BroadcastPromo />;
        case 'Artikel Kesehatan':
          return <ArtikelKesehatan />;
        case 'Testimoni':
          return <Testimoni />;
        case 'Member Dashboard':
        default:
          return <MemberDashboard />;
      }
    }

    if (isGuest) {
      switch (activeTab) {
        case 'Products':
          return <Products />;
        case 'Artikel Kesehatan':
          return <ArtikelKesehatan />;
        case 'Testimoni':
          return <Testimoni />;
        case 'Guest Dashboard':
        default:
          return <GuestDashboard />;
      }
    }

    return <Login onNavigate={handleNavigate} />;
  }, [activeTab, handleNavigate, isAdmin, isAuthenticated, isGuest, isMember, profile]);

  const showShell = isAuthenticated;

  if (!showShell) {
    return (
      <div className="min-h-screen font-barlow">
        <main className="min-h-screen">{renderContent}</main>
      </div>
    );
  }

  return (
    <div id="app-container" className="bg-slate-50 min-h-screen flex font-barlow">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div id="main-content" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto">{renderContent}</div>
        </main>
      </div>
    </div>
  );
}
