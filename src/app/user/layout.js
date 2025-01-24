"use client";
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import '../globals.css';



export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#1A202C" }}>
      {/* Pass the toggle function to Header */}
      <Header onToggleSidebar={handleToggleSidebar} />
      <div className="flex flex-1">
        {/* Sidebar visibility controlled by isSidebarOpen */}
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 p-4">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
