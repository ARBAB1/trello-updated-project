"use client";
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Modal, Input, Select, message } from "antd";
import Image from "next/image";

const Sidebar = () => {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceTypes, setWorkspaceTypes] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaceTypes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("https://13j4t1np-6000.inc1.devtunnels.ms/workspace/get-workspace-types", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "TrelloAPIkey$$%",
            "accesstoken": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setWorkspaceTypes(data.data);
        }
      } catch (error) {
        console.error("Error fetching workspace types:", error);
      }
    };

    fetchWorkspaceTypes();
  }, []);

  const handleCreateWorkspace = () => {
    setIsWorkspaceModalOpen(true);
  };

  const handleCancelWorkspace = () => {
    setIsWorkspaceModalOpen(false);
  };

  const handleOkWorkspace = async () => {
    try {
      await createWorkspace({
        workspace_name: workspaceName,
        workspace_type: workspaceType,
        workspace_description: workspaceDescription,
      }).unwrap();
      message.success('Workspace created successfully');
      setWorkspaceName('');
      setWorkspaceType('');
      setWorkspaceDescription('');
      setIsWorkspaceModalOpen(false);
    } catch (error) {
      console.error('Error creating workspace:', error);
      message.error('Failed to create workspace');
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
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
        {/* <li className="mb-4">
          <Link href={{pathname:"/user/invitation/[token]?token=?/[email]?email=?/[id]?id=?"}} className="text-lg font-semibold hover:text-blue-400">
            Invitations
          </Link>
        </li> */}
      </ul>
      <div className="mt-10">
        <p className="text-gray-400">Workspaces</p>
        <button className="text-blue-400 mt-2" onClick={handleCreateWorkspace}>
          Create a Workspace
        </button>
      </div>
      <Modal
        title={null}
        open={isWorkspaceModalOpen}
        onOk={handleOkWorkspace}
        onCancel={handleCancelWorkspace}
        footer={null}
        className="custom-modal"
        width={900}
        style={{ backgroundColor: "#1A202C", color: "white", display: "flex" }}
      >
        <div className="flex flex-row">
          {/* Left Section - Form */}
          <div className="flex-1 p-8" style={{ backgroundColor: "#1A202C", color: "white" }}>
            <h1 className="text-2xl font-semibold mb-4">Let's build a Workspace</h1>
            <p className="mb-6">
              Boost your productivity by making it easier for everyone to access boards in one location.
            </p>

            <div className="mt-4">
              <label className="block mb-1 text-gray-300">Workspace name</label>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name"
                className="bg-white text-black border-none"
              />
              <p className="text-xs text-gray-400">This is the name of your company, team, or organization.</p>
            </div>

            <div className="mt-4">
              <label className="block mb-1 text-gray-300">Workspace type</label>
              <Select
                value={workspaceType}
                onChange={(value) => setWorkspaceType(value)}
                placeholder="Choose..."
                className="w-full"
              >
                {workspaceTypes.map((type) => (
                  <Option key={type.type_id} value={type.type_name}>{type.type_name}</Option>
                ))}
              </Select>
            </div>

            <div className="mt-4">
              <label className="block mb-1 text-gray-300">Workspace description</label>
              <Input.TextArea
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
                placeholder="Describe your workspace (Optional)"
                className="bg-white text-black border-none"
              />
              <p className="text-xs text-gray-400">Get your members on board with a few words about your workspace.</p>
            </div>

            <div className="mt-6">
              <button
                onClick={handleOkWorkspace}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={!workspaceName || !workspaceType}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="flex-1 p-8 flex justify-center items-center bg-gray-700 rounded-r-lg">
            <Image
              src="/image1.png" // Adjust your image source as per your image location
              alt="Workspace Illustration"
              width={300}
              height={300}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
