"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Modal, Input, Select, message } from "antd";
import Image from "next/image";

const Sidebar = () => {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceTypes, setWorkspaceTypes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className={`fixed z-50 inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 bg-gray-900 text-white w-64 p-4 md:relative md:translate-x-0`}>
      <button
        className="md:hidden absolute top-4 right-4 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "Close" : "Menu"}
      </button>
      <ul>
        <li className="mb-4">
          <Link href="/user/boards" className="text-lg font-semibold hover:text-blue-400">
            Boards
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/user/template" className="text-lg font-semibold hover:text-blue-400">
            Templates
          </Link>
        </li>
      </ul>

   
    </div>
  );
};

export default Sidebar;
