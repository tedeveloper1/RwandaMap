import {
  LayoutGrid,
  Map,
  Users,
  Settings,
  ChartBar,
  Mail,
  HelpCircle,
  Globe,
  LogOut,
  MapPin,
  PlusIcon,
  List,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion"
import { containerVariants, itemVariants, fadeIn } from "../utils/Nav";


const SideBar = () => {
  const menuItems = [
    { icon: <LayoutGrid size={20} />, label: "Dashboard", href: "/dashboard" },
    { icon: <PlusIcon size={20} />, label: "Create report", href: "/create-report" },
    { icon: <List size={20} />, label: "View reports", href: "/view-report" },
    { icon: <User size={20} />, label: "Manage profile", href: "/profile-manage" },
    { icon: <Map size={20} />, label: "Explore places", href: "/map" },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
    { icon: <HelpCircle size={20} />, label: "Help", href: "/help" },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <aside className=" w-[300px] h-[75vh]">
        {/* <div className="h-full dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 bg-gray-200/20 text-white shadow-xl flex flex-col justify-between rounded-2xl"> */}
        <div className="h-full  bg-white dark:text-white shadow-xl flex flex-col justify-between rounded-2xl">
          <div>
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <MapPin className="h-9 w-9 text-emerald-400" />
                <h1 className="text-2xl font-bold tracking-tight bg-black  bg-clip-text text-transparent">
                  Rwanda Map
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 space-y-2">
              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale : 1.05 }}
                    key={index}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-x-3 px-4 py-3 rounded-lg hover:bg-green-800 hover:backdrop-blur-sm transition-all duration-300 group"
                    >
                      <span className="text-gray-800 group-hover:text-emerald-400 transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </div>

          {/* Logout Button */}
          <div className="w-full p-4 border-t border-gray-700/50">
            <Link
              href="/logout"
              className="flex items-center gap-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 text-gray-200 font-bold" />
              <span className="text-sm text-gray-200 font-bold">
                Logout
              </span>
            </Link>
          </div>
        </div>
      </aside>
    </motion.div>
  );
};

export default SideBar;
