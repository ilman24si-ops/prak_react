import React, { useEffect, useState } from "react";
import { listProducts } from "@/lib/apiProducts";
import { listOrders } from "@/lib/apiOrders";
import StatCard from "../components/StatCard";

const Dashboard = ({ onNavigate = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMsg("");
      try {
        const [prodList, ordList] = await Promise.all([
          listProducts(),
          listOrders(),
        ]);
        setProducts(prodList || []);
        setOrders(ordList || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setErrorMsg(err.message || "Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Compute metrics
  const productsCount = products.length;
  const shortageProducts = products.filter((p) => p.stock <= 0);
  const shortageCount = shortageProducts.length;

  const completedOrders = orders.filter((o) => o.status === "Completed");
  const totalRevenue = completedOrders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  const inventoryStatus = shortageCount === 0 ? "Good" : `${shortageCount} Alert(s)`;
  const inventoryColor = shortageCount === 0 ? "green" : "red";

  // Total quantity of items sold in completed orders
  const totalQtySold = completedOrders.reduce((total, order) => {
    const orderItemsQty = (order.order_items || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
    return total + orderItemsQty;
  }, 0);

  const invoicesGenerated = orders.length;

  // Derive simple count of unique categories or estimate groups as distinct first words of product names
  const uniqueGroups = new Set(
    products.map((p) => p.name.trim().split(" ")[0].toLowerCase())
  ).size;

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/70 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(59,130,246,0.18),transparent)] opacity-60" />
        <div className="relative p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" />
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Dashboard
              </h2>
            </div>
            <p className="text-slate-500 text-sm italic">
              A quick data overview of the inventory.
            </p>
          </div>

          <button
            onClick={() => onNavigate("Orders")}
            className="bg-white border border-slate-200 shadow-sm px-5 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            Manage Invoices <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="➕"
          color={inventoryColor}
          title="Inventory Status"
          value={inventoryStatus}
          linkText="View Detailed Report"
          onClick={() => onNavigate("Products")}
        />
        <StatCard
          icon="💰"
          color="yellow"
          title="Total Revenue"
          value={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
          linkText="View Detailed Report"
          onClick={() => onNavigate("Orders")}
        />
        <StatCard
          icon="💊"
          color="blue"
          title="Medicines Available"
          value={productsCount.toString()}
          linkText="Visit Inventory"
          onClick={() => onNavigate("Products")}
        />
        <StatCard
          icon="⚠️"
          color="red"
          title="Medicine Shortage"
          value={formatNumber(shortageCount)}
          linkText="Resolve Now"
          onClick={() => onNavigate("Products")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden relative hover:shadow-md transition-all">
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),transparent)]" />
          <div className="relative p-4 border-b flex justify-between items-center bg-slate-50/60">
            <h4 className="font-bold text-slate-800">Inventory</h4>
            <button
              onClick={() => onNavigate("Products")}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
              type="button"
            >
              Go to Configuration <span>»</span>
            </button>
          </div>
          <div className="relative p-6 grid grid-cols-2 gap-6">
            <div className="border rounded-xl p-4 bg-white shadow-inner hover:-translate-y-0.5 transition-transform">
              <p className="text-3xl font-black text-slate-900">{productsCount}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Total no of Medicines
              </p>
            </div>
            <div className="border rounded-xl p-4 bg-white shadow-inner hover:-translate-y-0.5 transition-transform">
              <p className="text-3xl font-black text-slate-900">{uniqueGroups}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Medicine Groups
              </p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden relative hover:shadow-md transition-all">
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),transparent)]" />
          <div className="relative p-4 border-b flex justify-between items-center bg-slate-50/60">
            <h4 className="font-bold text-slate-800">Quick Report</h4>
            <button
              onClick={() => onNavigate("Orders")}
              className="text-xs font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1"
              type="button"
            >
              All Invoices <span>▼</span>
            </button>
          </div>
          <div className="relative p-6 grid grid-cols-2 gap-6">
            <div className="border rounded-xl p-4 bg-white shadow-inner hover:-translate-y-0.5 transition-transform">
              <p className="text-3xl font-black text-slate-900">{totalQtySold}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Qty of Medicines Sold
              </p>
            </div>
            <div className="border rounded-xl p-4 bg-white shadow-inner hover:-translate-y-0.5 transition-transform">
              <p className="text-3xl font-black text-slate-900">{invoicesGenerated}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                Invoices Generated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
