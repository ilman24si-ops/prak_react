import { FaHome, FaListAlt, FaUsers, FaPlus } from "react-icons/fa";

export default function Sidebar() {
    return (
        <div id="sidebar" className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
            {/* Logo */}
            <div id="sidebar-logo" className="flex flex-col">
                <span id="logo-title" className="font-poppins text-[48px] text-gray-900 leading-tight">
                    Sedap <b id="logo-dot" className="text-hijau">.</b>
                </span>
                <span id="logo-subtitle" className="font-semibold text-gray-400">Modern Admin Dashboard</span>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu" className="mt-10">
                <ul id="menu-list" className="space-y-3">
                    <li className="hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-100 transition-all">
                        <FaHome className="mr-4 text-xl" /> Dashboard
                    </li>
                    <li className="hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-100 transition-all">
                        <FaListAlt className="mr-4 text-xl" /> Orders
                    </li>
                    <li className="hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-100 transition-all">
                        <FaUsers className="mr-4 text-xl" /> Customers
                    </li>
                </ul>
            </div>

            {/* Footer */}
            <div id="sidebar-footer" className="mt-auto">
                <div id="footer-card" className="bg-hijau px-4 py-6 rounded-3xl shadow-lg mb-10 flex flex-col relative overflow-hidden">
                    <div id="footer-text" className="text-white text-sm z-10">
                        <p className="w-2/3">Please organize your menus through button below!</p>
                        <div id="add-menu-button" className="flex justify-center items-center p-2 mt-3 bg-white rounded-md space-x-2 cursor-pointer">
                            <span className="text-gray-600 flex items-center font-bold text-xs">
                                <FaPlus className="mr-2" /> Add Menus
                            </span>
                        </div>
                    </div>
                    <img id="footer-avatar" src="https://avatar.iran.liara.run/public/28" className="w-20 absolute -right-2 -top-2 opacity-50" />
                </div>
                <span id="footer-brand" className="font-bold text-gray-400 block">Sedap Restaurant Admin</span>
                <p id="footer-copyright" className="font-light text-gray-400 text-xs mt-1">&copy; 2025 All Right Reserved</p>
            </div>
        </div>
    );
}
