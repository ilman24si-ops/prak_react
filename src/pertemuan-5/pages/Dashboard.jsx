import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
    const stats = [
        { id: "orders", label: "Total Orders", value: "75", icon: <FaShoppingCart />, color: "bg-hijau" },
        { id: "delivered", label: "Total Delivered", value: "175", icon: <FaTruck />, color: "bg-biru" },
        { id: "canceled", label: "Total Canceled", value: "40", icon: <FaBan />, color: "bg-merah" },
        { id: "revenue", label: "Total Revenue", value: "Rp.128", icon: <FaDollarSign />, color: "bg-kuning" },
    ];

    return (
        <div id="dashboard-container" className="w-full">
            <PageHeader />
            
            <div id="dashboard-grid" className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((item) => (
                    <div key={item.id} className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className={`${item.color} rounded-full p-4 text-3xl text-white`}>
                            {item.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-gray-800">{item.value}</span>
                            <span className="text-gray-400 text-sm font-medium">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}