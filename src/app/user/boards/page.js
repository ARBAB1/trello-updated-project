"use client";
import React, { useRef } from 'react'
import { useState, useEffect } from "react";
import { Modal, Input, Select, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for routing
const Boards = () => {
    const { Option } = Select;
    const mountedRef = useRef(true);
    const [showBoardMembersModal, setShowBoardMembersModal] = useState(false);
    const [showBoardModal, setShowBoardModal] = useState(false); // To handle Board Modal visibility
   

    const [workspaceNote, setWorkspaceNote] = useState("");
    const [workspaceEmail, setWorkspaceEmail] = useState("");
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null); // Holds the ID of the workspace
    const [workspaces, setWorkspaces] = useState([]); // State to hold workspaces
    const [boardTitle, setBoardTitle] = useState(""); // State for the board title
    const [background, setBackground] = useState(""); // State for selected background
    const [visibility, setVisibility] = useState("Workspace");
    const [workspaceTypes, setWorkspaceTypes] = useState([]);
    const [boardMembers, setBoardMembers] = useState([]);
  const [error, setError] = useState(null);
    const router = useRouter(); // Initialize the router
    const [currentRole, setCurrentRole] = useState(null); // To store the current user's role
    const handleCancelBoard = () => {
        setShowBoardModal(false);
      };
    
 
    useEffect(() => {
        const currentUserId = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
    //   console.log(currentUserId)
        if (boardMembers.length > 0) {
          // Find the current user's role in the boardMembers list
          console.log(boardMembers)
          const currentUser = boardMembers.find((member) => member.user_id === parseInt(currentUserId));
      // console.log(currentUser, currentUserId)
      console.log(currentUser, currentUserId,"ss")
           if (currentUser) {
            if (currentUser && currentUser.role =="workspace_admin") {
                setCurrentRole("Admin"); // Set the role if found
              } else {
                setCurrentRole("Member"); // Default if user_id is not found
              }
          }else{
            setCurrentRole("Not a Member")
          }
       
        }

      }, [boardMembers]); // Re-run whenever boardMembers changes
      
   
      useEffect(() => {
        // Fetch workspace types
        
    
    
        // Fetch all workspaces
        const fetchWorkspaces = async () => {
          try {
            const token =await localStorage.getItem("access_token");
            const response = await fetch("https://13j4t1np-6000.inc1.devtunnels.ms/workspace/get-all-workspaces", {
              method: "GET",
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': "TrelloAPIkey$$%",
                'accesstoken': `Bearer ${token}`,
              },
            });
    
            const data = await response.json();
    
            if (data.success) {
              setWorkspaces(data.data);
            }
          } catch (error) {
            console.error("Error fetching workspaces:", error);
          }
        };
      
      
   
        fetchWorkspaces();
        return () => {
            mountedRef.current = false; // Cleanup on component unmount
          };
      }, []);
      const fetchWorkspaceMembers = async (workspace_id) => {
        const token =await localStorage.getItem("access_token");
        try {
          const response = await fetch(`https://13j4t1np-6000.inc1.devtunnels.ms/workspace/get-workspace-members-by-workspace-id/${workspace_id}`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': "TrelloAPIkey$$%",
              'accesstoken': `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
    console.log(data)
          if (data.success) {
           setBoardMembers(data.data);
          }
        } catch (error) {
          console.error("Error fetching workspaces:", error);
        }
      };
     
        const handleCreateBoard = () => {
    setShowBoardModal(true);
  };
      const handleCreateBoardMembers = (workspace_id) => {
        setShowBoardMembersModal(true);
        fetchWorkspaceMembers(workspace_id);
        setSelectedWorkspaceId(workspace_id);
      };
      const handleOkBoardMembers = async () => {
        const token =await localStorage.getItem("access_token");
        try {
    
          const response = await fetch("https://13j4t1np-6000.inc1.devtunnels.ms/workspace/send-email-invitation", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': "TrelloAPIkey$$%",
              'accesstoken': `Bearer ${token}`,
            },
            body: JSON.stringify({
             invitees: [
            {
                email: workspaceEmail,
                note: workspaceNote
            },
          ],
          workspace_id: selectedWorkspaceId
            }),
          });
    
          const data = await response.json();
    console.log(data)
          if (data.success) {
            // Fetch updated workspaces
         message.success("Invitation sent successfully")
            // Close modal and reset fields
            setWorkspaceEmail("");
            setWorkspaceNote("");
           setSelectedWorkspaceId(null);
            setShowBoardMembersModal(false);
          } else {
            console.log(data.message)
            // setError(data.message || "Workspace creation failed");
          }
        } catch (error) {
          console.error("Error creating workspace:", error);
          setError("An error occurred. Please try again later.");
        }
      };
      const handleRemoveMember = async (userId) => {
        try {
          const response = await fetch(
            "https://13j4t1np-6000.inc1.devtunnels.ms/workspace/remove-member-from-workspace",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "TrelloAPIkey$$%",
                'accesstoken': `Bearer ${token}`,
              },
              body: JSON.stringify({
                workspace_id: selectedWorkspaceId,
                user_id: userId,
              }),
            }
          );
      
          const data = await response.json();
      
          if (data.success) {
            message.success("Member removed successfully.");
            // import { useRef, useState, useEffect } from "react";
            
            const Boards = () => {
              // ...
            
              const mountedRef = useRef(false);
              const [currentRole, setCurrentRole] = useState(null);
            
              useEffect(() => {
                mountedRef.current = true;
            
                const currentUserId = localStorage.getItem("user_id");
            
                if (boardMembers.length > 0) {
                  const currentUser = boardMembers.find((member) => member.user_id === currentUserId);
            console.log(currentUser)
                  if (currentUser) {
                    if (mountedRef.current) {
                      setCurrentRole(currentUser.role);
                    }
                  } else {
                    if (mountedRef.current) {
                      setCurrentRole("Member");
                    }
                  }
                }
            
                return () => {
                  mountedRef.current = false;
                };
              }, [boardMembers]);
            };// Refresh members after deletion
            fetchWorkspaceMembers(selectedWorkspaceId);
          } else {
            message.error(data.message || "Failed to remove member.");
          }
        } catch (error) {
          console.error("Error removing member:", error);
          message.error("An error occurred while removing the member.");
        }
      };
      const handleCancelBoardMembers = () => {
        setShowBoardMembersModal(false);
      };
      const addBoardToWorkspace = (index) => {
        const updatedWorkspaces = [...workspaces].map(workspace => ({ ...workspace, boards: workspace.boards || [] }));
        updatedWorkspaces[index].boards.push({
          title: boardTitle,
          background: background,
          visibility: visibility
        })
            setWorkspaces(updatedWorkspaces);
          };
          console.log(workspaces.boards)
    return (
        <div  style={{  backgroundColor: "#1A202C", }}>
        <div>
          <h1 className="text-2xl mb-6">Most popular templates</h1>
          {/* Dropdown */}
          <div className="flex justify-between items-center mb-4">
            <p>Get going faster with a template from the community</p>
            <select className="bg-gray-800 text-white p-2 rounded-lg">
              <option>Choose a category</option>
              <option>Project Management</option>
              <option>Kanban</option>
              <option>Team Collaboration</option>
            </select>
          </div>
          {/* Template Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div
              className="bg-gray-700 p-10 rounded-lg"
              style={{
                backgroundImage: `url('/hero1.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <p className="text-lg">Project Management</p>
            </div>
            <div
              className="bg-gray-700 p-10 rounded-lg"
              style={{
                backgroundImage: `url('/hero2.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <p className="text-lg font-bold">Kanban Template</p>
            </div>
            <div
              className="bg-gray-700 p-10 rounded-lg"
              style={{
                backgroundImage: `url('/hero3.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <p className="text-lg font-bold">Simple Project Board</p>
            </div>
            <div
              className="bg-gray-700 p-10 rounded-lg"
              style={{
                backgroundImage: `url('/hero4.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <p className="text-lg font-bold">Remote Team Hub</p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl mb-6">Your Workspaces</h1>
          {workspaces.length > 0 ? (
            <div className="space-y-6">
              {workspaces.map((workspace, index) => (
                <div key={index} className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-500 p-2 rounded-lg text-black font-bold">
                        {workspace.workspace_name.charAt(0).toUpperCase()}
                      </span>
                      <span>{workspace.workspace_name}</span>
                    </div>
                    <div className="flex space-x-4">
                      <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-600">
                        Boards
                      </button>
                      <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-600">
                        Views
                      </button>
                      <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-600"   onClick={()=>handleCreateBoardMembers(workspace.workspace_id)}>
                        Members
                      </button>
                      <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-600">
                        Settings
                      </button>
                      <button className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500">
                        Upgrade
                      </button>
                    </div>
                  </div>

                  {/* Create new board button */}
                  <div className="mt-4">
                    <button
                      className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={handleCreateBoard} // Opens Board modal
                    >
                      Create new board
                    </button>
                  </div>

                  {/* Display boards associated with this workspace */}
                  <div className="mt-4">
                    {console.log(workspace.boards)}
                    {workspace.boards && workspace.boards.length > 0 ? (
                      <div className="grid grid-cols-4 gap-4">
                        {workspace.boards.map((board, i) => (
                          <div
                            key={i}
                            className="bg-gray-600 p-4 rounded-lg"
                            onClick={() => router.push(`/board/${i}`)}
                            style={{
                              backgroundImage: `url(${board.background})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            <p>{board.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 mt-2">No boards created yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No workspaces created yet.</p>
          )}
        </div>
        <Modal
        title="Create board"
        open={showBoardModal}
        onCancel={handleCancelBoard}
        footer={null}
        className="custom-modal"
        width={500}
      >
        <div className="space-y-4">
          {/* Background Selection */}
          <div>
            <p className="text-gray-400">Background</p>
            <div className="flex space-x-2">
              {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg"].map((imgSrc, index) => (
                <div
                  key={index}
                  onClick={() => setBackground(imgSrc)}
                  className={`w-16 h-16 bg-cover rounded-lg cursor-pointer ${
                    background === imgSrc ? "border-4 border-blue-500" : ""
                  }`}
                  style={{
                    backgroundImage: `url(${imgSrc})`,
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Board Title */}
          <div>
            <label className="block text-gray-400">Board title *</label>
            <Input
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="Enter board title"
              className="bg-white text-black"
            />
            {!boardTitle && (
              <p className="text-red-500 text-xs mt-1">Board title is required</p>
            )}
          </div>

          {/* Visibility Dropdown */}
          <div>
            <label className="block text-gray-400">Visibility</label>
            <Select
              value={visibility}
              onChange={(value) => setVisibility(value)}
              className="w-full bg-gray-800"
            >
              <Option value="Workspace">Workspace</Option>
              <Option value="Private">Private</Option>
            </Select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => addBoardToWorkspace(0)} // Assuming adding to the first workspace
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!boardTitle}
          >
            Create
          </button>
        </div>
      </Modal>
      <Modal
        title={null}
      open={showBoardMembersModal}
        onOk={handleOkBoardMembers}
        onCancel={handleCancelBoardMembers}
        footer={null}
        className="custom-modal"
        width={900}
  
      >
        <div className="flex flex-row"       style={{ backgroundColor: "#1A202C", color: "white", display: "flex" }}>
          {/* Left Section - Form */}
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-semibold mb-4">Let's add members to your Workspace</h1>
            <p className="mb-6">
              <span className="text-gray-400">Invite</span> your team members to your workspace.
            </p>

            <div className="mt-4">
              <label className="block mb-1 text-gray-300">Invitation email</label>
              <Input
                value={workspaceEmail}
                type="email"
                onChange={(e) => setWorkspaceEmail(e.target.value)}
                placeholder="Enter member Email"
                className="bg-white text-black border-none"
              />
              <p className="text-xs text-gray-400">Enter the email address of the member you want to invite.</p>
            </div>
            <div className="mt-4">
              <label className="block mb-1 text-gray-300">Invitation Note</label>
              <Input
                value={workspaceNote}
                onChange={(e) => setWorkspaceNote(e.target.value)}
                placeholder="Enter member Note"
                className="bg-white text-black border-none"
              />
              <p className="text-xs text-gray-400">Enter Note for the member</p>
            </div>
           

           

            <div className="mt-6">
              <button
                onClick={handleOkBoardMembers}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={!workspaceEmail || !workspaceNote}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Right Section - Image */}
     {/* Right Section - Board Members */}
<div className="flex-1 p-8  rounded-r-lg overflow-auto">
  <h2 className="text-xl font-semibold text-white mb-4">Workspace Members</h2>
  <div className="p-4 text-white rounded-lg mb-4">
  {currentRole ? (
    <p className="text-lg font-semibold">
      Your Role: <span className="text-green-400">{currentRole}</span>
    </p>
  ) : (
    <p className="text-lg font-semibold text-gray-400">Determining your role...</p>
  )}
</div>
  {boardMembers.length > 0 ? (
    <ul className="space-y-4">
      {boardMembers.map((member, index) => (
        <li
          key={index}
          className="flex items-center justify-between space-x-4 bg-gray-800 p-4 rounded-lg"
        >
          {/* Member Info */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{member.name || "Unnamed Member"}</p>
              <p className="text-gray-400 text-sm">{member.email}</p>
            </div>
          </div>

          {/* Role/Actions */}
          <div className="flex items-center space-x-4">
            {member.role === "workspace_admin" ? (
              <span className="bg-green-500 text-black px-2 py-1 rounded-lg text-sm font-bold">
                Admin
              </span>
            ) : (
              <button
                onClick={() => handleRemoveMember(member.user_id)}
                className="text-red-500 hover:text-red-700"
                title="Remove Member"
              >
                🗑️
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-400">No members have been added to this workspace yet.</p>
  )}
</div>

        </div>
      </Modal>
      </div>
    )
}

export default Boards
