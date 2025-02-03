"use client";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for routing
import { baseUrl, token1 } from "@/constant";
import { message, Modal } from "antd";
import { enqueueSnackbar } from "notistack";
// import { useRouter } from "next/navigation";
const Boards = () => {
  const mountedRef = useRef(true);
  const [showBoardMembersModal, setShowBoardMembersModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false); // To handle Board Modal visibility
  const [workspaceNote, setWorkspaceNote] = useState("");
  const [workspaceEmail, setWorkspaceEmail] = useState("");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null); // Holds the ID of the workspace
  const [workspaces, setWorkspaces] = useState([]); // State to hold workspaces
  const [boardTitle, setBoardTitle] = useState(""); // State for the board title
  const [background, setBackground] = useState(); // State for selected background
  const [visibility, setVisibility] = useState("Workspace");
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardvisibility, setBoardVisibility] = useState("Public")
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const router = 
  const [currentRole, setCurrentRole] = useState(null); // To store the current user's role
  const router = useRouter(); // Initialize the router
  const [showWorkspaceModal,setShowWorkspaceModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceType, setWorkspaceType] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceTypes, setWorkspaceTypes] = useState([]);
  const [boardDescription, setBoardDescription] = useState("");
  const [boards,setBoards]=useState([])


  //Workspace Settings
  const handleCancelWorkspace = () => {
    setShowWorkspaceModal(false);
  };
  const handleOkWorkspace = async () => {
   
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/workspace/create-workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token1,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_name: workspaceName,
          workspace_type: workspaceType,
          workspace_description: workspaceDescription,
        }),
      });
      const data = await response.json();
      console.log('data',data)
      if (data.success) {
        enqueueSnackbar(data.message, { variant: "success" });
        setShowWorkspaceModal(false);
        fetchWorkspaces();
        setWorkspaceName("");
        setWorkspaceType("");
        setWorkspaceDescription("");
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
  
        
    
    } catch (error) {
      console.error("Error removing admin role:", error);
    }
  };

  const handleAssignAdminRole = async (userId) => {
    try {
      const token =localStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/workspace/assign-workspace-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token1,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_id: selectedWorkspaceId,
          user_id: userId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchWorkspaceMembers(selectedWorkspaceId);
        setBoardMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.user_id === userId ? { ...member, role: "workspace_admin" } : member
          )
        );
      }
    } catch (error) {
      console.error("Error assigning admin role:", error);
    }
  };
  const handleLeaveWorkspace = async (userId) => {
    try {
      const token =localStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/workspace/leave-workspace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token1,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_id: selectedWorkspaceId,
        
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchWorkspaceMembers(selectedWorkspaceId);
      
      }
    } catch (error) {
      console.error("Error assigning admin role:", error);
    }
  };
  const handleOkBoardMembers = async () => {
    const token =await localStorage.getItem("access_token");
    try {
setLoading(true);
      const response = await fetch(`${baseUrl}/workspace/send-email-invitation`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${token1}`,
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
// console.log(data)
      if (data.success) {
        // Fetch updated workspaces
        enqueueSnackbar(data.message, { variant: "success" });
     setLoading(false);
        // Close modal and reset fields
        setWorkspaceEmail("");
        setWorkspaceNote("");
       setSelectedWorkspaceId(null);
        setShowBoardMembersModal(false);
      } else {
        setLoading(false);
        enqueueSnackbar('I love hooks')
        setWorkspaceEmail("");
        setWorkspaceNote("");
       setSelectedWorkspaceId(null);
        setShowBoardMembersModal(false);
        
        // setError(data.message || "Workspace creation failed");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      setError("An error occurred. Please try again later.");
    }
  };
const handleDeleteWorkspace = async (workspaceId) => {
  try {
    const token = await localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/workspace/delete-workspace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token1,
        accesstoken: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workspace_id: workspaceId,
      }),
    });
    const data = await response.json();
    console.log(data,"deleted")
    if (data.success) {
      enqueueSnackbar(data.message, { variant: "warning" });
      fetchWorkspaces();
    }
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
}
const handleDeleteBoard = async (boardId) => {
  try {
    const token = await localStorage.getItem("access_token");
    const response = await fetch(`${baseUrl}/boards/delete-board`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token1,
        accesstoken: `Bearer ${token}`,
      },
      body: JSON.stringify({
        board_id: boardId,
      }),
    });
    const data = await response.json();
    console.log(data,"deleted")
    if (data.success) {
      fetchWorkspaceBoards()
      enqueueSnackbar(data.message, { variant: "error" });
    }
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
}
  const fetchWorkspaces = async () => {
    try {
      const token = await localStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/workspace/get-all-workspaces`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${token1}`,
          accesstoken: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setWorkspaces(data.data);
        console.log(data.data)
  
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };
  const fetchWorkspaceBoards = async () => {
    try {
    
      const token = await localStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/boards/get-all-boards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${token1}`,
          accesstoken: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log(data)
        setBoards(data.data)
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };
  const handleRemoveAdminRole = async (userId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/workspace/remove-from-admin-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token1,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_id: selectedWorkspaceId,
          user_id: userId,
        }),
      });
      const data = await response.json();
      console.log('data',data)
      if (data.success) {
        fetchWorkspaceMembers(selectedWorkspaceId);
        setBoardMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.user_id === userId ? { ...member, role: "Member" } : member
          )
        );
      }else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Error removing admin role:", error);
    }
  };

  const fetchWorkspaceMembers = async (workspace_id) => {
    const token = await localStorage.getItem("access_token");
    try {
      const response = await fetch(`${baseUrl}/workspace/get-workspace-members-by-workspace-id/${workspace_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${token1}`,
          accesstoken: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBoardMembers(data.data);
        const currentUserId = localStorage.getItem("user_id");
        const currentUser = data.data.find((member) => member.user_id === parseInt(currentUserId));
        if (currentUser) {
          setCurrentRole(currentUser.role === "workspace_admin" ? "Admin" : "Member");
        } else {
          setCurrentRole("Not a Member");
        }
      }
    } catch (error) {
      console.error("Error fetching workspace members:", error);
    }
  };
  useEffect(() => {
    fetchWorkspaces();
     fetchWorkspaceBoards();
    return () => {
      mountedRef.current = false; // Cleanup on component unmount
    };
  }, []);


  //Board Settings
  const handleCancelBoard = () => {
    setShowBoardModal(false);
  };
  const addBoardToWorkspace = async(workspace_id) => {
    try {
      // console.log(workspace_id,'sss')
      // console.log(workspace_id,boardTitle,boardvisibility,background,boardDescription)
      const token =await localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("board_name", `${boardTitle}` );
      formData.append("workspace_id", workspace_id);
      formData.append("visibility", boardvisibility);
      formData.append('boardBgImage',background)
      formData.append('description',boardDescription)
      const response =await fetch(`${baseUrl}/boards/create-board`,{
        method: "POST",
        headers: {

          "x-api-key": `${token1}`,
          accesstoken: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const data = response.json()
    if(response.ok){
      // console.log(data)
      setShowBoardModal(false)
      fetchWorkspaceBoards()
      // enqueueSnackbar(data.message, { variant: "success" });
   
      setShowBoardModal(false);
      setSelectedWorkspaceId('')
      setBoardTitle('')
      setBoardVisibility("")
      setBoardDescription("")
      setBackground(null)

      
    }
    } catch (error) {
      console.log(error,"error")
    }
 
  };

  const handleCreateBoardMembers = (workspace_id) => {
    setShowBoardMembersModal(true);
    fetchWorkspaceMembers(workspace_id);
    setSelectedWorkspaceId(workspace_id);
  };
const handleCreateBoard = (workspace_id) => {
  setShowBoardModal(true);
  setSelectedWorkspaceId(workspace_id)
  // addBoardToWorkspace(workspace_id)
}
  const handleRemoveMember = async (userId) => {
    try {
      const token = await localStorage.getItem("access_token");
      const response = await fetch(
        `${baseUrl}/workspace/remove-member-from-workspace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${token1}`,
            accesstoken: `Bearer ${token}`,
          },
          body: JSON.stringify({
            workspace_id: selectedWorkspaceId,
            user_id: userId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setBoardMembers((prevMembers) =>
          prevMembers.filter((member) => member.user_id !== userId)
        );
      } else {
        console.error("Failed to remove member:", data.message);
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };
  const handleLeaveMember = async (userId) => {
    try {
      const token = await localStorage.getItem("access_token");
      const response = await fetch(
        `${baseUrl}/workspace/leave-workspace`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${token1}`,
            accesstoken: `Bearer ${token}`,
          },
          body: JSON.stringify({
            workspace_id: selectedWorkspaceId,
            user_id: userId,
          }),
        }
      );

      const data = await response.json();
console.log(data)
      if (data.success) {
        setBoardMembers((prevMembers) =>
          prevMembers.filter((member) => member.user_id !== userId)
        );
      } else {
       alert(data.message);
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };
  return (
    <div style={{ backgroundColor: "#1A202C",color:"#fff" }} className="p-6">
      {/* Main content */}
      <div>
        <h1 className="text-2xl mb-6">Most popular templates</h1>
        <div className="grid grid-cols-4 gap-4">
          {[
            { title: "Project Management", img: "/hero1.jpg" },
            { title: "Kanban Template", img: "/hero2.jpg" },
            { title: "Simple Project Board", img: "/hero3.jpg" },
            { title: "Remote Team Hub", img: "/hero4.jpg" },
          ].map((template, index) => (
            <div
              key={index}
              className="bg-gray-700 p-10 rounded-lg"
              style={{
                backgroundImage: `url(${template.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p className="text-lg font-bold">{template.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workspaces Section */}
      <div>
        <div className="flex justify-between items-center m-6">

        <h1 className="text-2xl mb-6">Your Workspaces</h1>
        <button
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowWorkspaceModal(true)}
        >
          Create Workspace
        </button>
        </div>

        {workspaces.length > 0 ? (
          <div className="space-y-6">
            {workspaces.map((workspace, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-500 p-2 rounded-lg text-white font-bold">
                      {workspace.workspace_name.charAt(0).toUpperCase()}
                    </span>
                    <span>{workspace.workspace_name}</span>
                  </div>
                  <div className="flex space-x-4">
                    {
                      workspace?.visibility === "public" ? (
                        <span className=" p-2 rounded-lg text-green-500 font-bold">Public</span>
                      ) : (
                        <span className=" p-2 rounded-lg text-red-500 font-bold">Private</span>
                      )
                    }
                    {
                      workspace?.created_by === localStorage.getItem("user_name") ? (
                        <button
                        className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
                        onClick={() => handleDeleteWorkspace(workspace.workspace_id)}
                      >
                      Delete Workspace
                      </button>
                      ) : (
                        <span className=" p-2 rounded-lg text-red-500 font-bold">Member</span>
                      )
                    }
               
                    <button
                      className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={() => handleCreateBoard(workspace.workspace_id)}
                    >
                      Create Board
                    </button>
                    <button
                      className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={() => handleCreateBoardMembers(workspace.workspace_id)}
                    >
                      Members
                    </button>
                  </div>
                </div>

                {/* Display boards associated with this workspace */}
                <div className="mt-4">
                  {boards && boards.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                      {boards?.filter(board => board.workspace_id === workspace?.workspace_id).map((board, i) => (
                        <div
                          key={i}
                          className="flex justify-around p-4 bg-slate-500 rounded-xl"
                          style={{
                            backgroundImage: `url(${baseUrl}/${board.background_image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <p>{board.board_name}</p>
                          <button onClick={()=>     
        router.push(`boards/${board.board_id}`)} className="cursor-pointer bg-green-900 px-4 py-2 rounded-lg hover:bg-green-600 ">
                    View Board

                             </button>
                             {
                               workspace?.created_by === localStorage.getItem("user_name")?
                               (
                                         <button onClick={()=>handleDeleteBoard(board?.board_id)} className="cursor-pointer bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 ">
                    Delete

                             </button>
                               ):(
                                null
                               )
                             }
                 
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

      {/* Create Board Modal */}
      {showBoardModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 ">Create Board</h2>
            <div className="mb-4">
              <label className="block text-gray-300">Board Title</label>
              <input
                type="text"
                className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Visibility</label>
              <select
                className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
                value={boardvisibility}
                onChange={(e) => setBoardVisibility(e.target.value)}
              >
                 {/* <option value="">Workspace</option> */}
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Description</label>
              <textarea
                className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
              />
            </div>
            <label className="block text-gray-300">Background</label>
            {/* File Upload Input */}
            <input type="file" accept="image/*" className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => { setBackground(file); };
                reader.readAsDataURL(file);
              }
            }} />
            <div className="flex justify-end space-x-2 pt-10">
              <button
                onClick={() => setShowBoardModal(false)}
                className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                addBoardToWorkspace(selectedWorkspaceId)
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                disabled={!boardTitle}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Board Members Modal */}
      {showBoardMembersModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">Workspace Members</h2>
            <div className="flex space-x-8">
              {/* Invitation Form */}
              <div className="flex-1">
                <div className="mb-4">
                <h3 className="text-lg font-bold mb-4">Invite New Member</h3>
                  <label className="block text-gray-300">Invitation Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
                    value={workspaceEmail}
                    onChange={(e) => setWorkspaceEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300">Invitation Note</label>
                  <input
                    type="text"
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
                    value={workspaceNote}
                    onChange={(e) => setWorkspaceNote(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowBoardMembersModal(false)}
                    className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Functionality to invite a new member
                      handleOkBoardMembers()
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    disabled={!workspaceEmail || !workspaceNote}
                  >
                    Invite
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">Current Members</h3>
                <div className="mb-4">
                  <p className="text-gray-300 font-semibold">Your Role: {currentRole}</p>
                </div>
                <ul className="space-y-2">
              
                  {boardMembers.length > 0 ? (
                    boardMembers.map((member, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-700 p-2 rounded-lg"
                      >
                        <span>{member.name || member.email}</span>
                        <span className="text-sm text-gray-400">{member.role}</span>
                        {currentRole === "Admin" && member.user_id === parseInt(localStorage.getItem("user_id")) ? (
                          <button
                            onClick={() => handleLeaveMember(member.user_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove Me
                          </button>
                        ) : currentRole === "Admin" ? (
                          <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        ) : currentRole === "Not a Member" ? null : null}
                          {currentRole === "Admin" && member.role === "workspace_admin" && member.user_id != parseInt(localStorage.getItem("user_id")) && (
                    <button
                      onClick={() => handleRemoveAdminRole(member.user_id)}
                       className="text-red-300 hover:text-red-500"
                    >
                      Remove Admin
                    </button>
                  )}
                    {currentRole === "Admin" && member.role === "member" && (
                    <button
                      onClick={() => handleAssignAdminRole(member.user_id)}
                className="text-green-300 hover:text-green-500"
                    >
                      Make Admin
                    </button>
                  )}
                   {currentRole === "Member" && member.role === "member" && member.user_id === parseInt(localStorage.getItem("user_id")) && (
                    <button
                      onClick={() => handleLeaveWorkspace(member.user_id)}
                className="text-green-300 hover:text-green-500"
                    >
                      Leave Workspace
                    </button>
                  )}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No members in this workspace.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
     {showWorkspaceModal && (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
     <div className="bg-gray-800 text-white rounded-lg p-6 w-96">
       <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
       <div className="mb-4">
         <label className="block text-gray-300">Workspace Name</label>
         <input
           type="text"
           className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
           value={workspaceName}
           onChange={(e) => setWorkspaceName(e.target.value)}
         />
       </div>
       <div className="mb-4">
         <label className="block text-gray-300">Visibility</label>
         <select
           className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
           value={visibility}
           onChange={(e) => setVisibility(e.target.value)}
         >
           <option value="public">Public</option>
           <option value="private">Private</option>
         </select>
       </div>
     <div className="mb-4">
         <label className="block text-gray-300">Description</label>
         <textarea
           className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg p-2"
           value={workspaceDescription}
           onChange={(e) => setWorkspaceDescription(e.target.value)}
         />
     </div>
       <div className="flex justify-end space-x-2 ">
       <button
           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
           onClick={handleCancelWorkspace}
         >
           Cancel
         </button>
         <button
           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
           onClick={handleOkWorkspace}
         >
           Create
         </button>
       </div>
     </div>
   </div>
   
      )}

     
    </div>
  );
};

export default Boards;
