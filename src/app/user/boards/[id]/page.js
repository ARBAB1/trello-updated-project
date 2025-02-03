"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchBoard, fetchLists } from "@/utils/api";
import KanbanBoard from "@/components/KanbanBoard";
import { baseUrl, token1 } from "@/constant";
import { enqueueSnackbar } from "notistack";

const BoardPage = () => {
  const params = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [showBoardMembersModal, setShowBoardMembersModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]); // State to hold workspaces
  const [workspaceNote, setWorkspaceNote] = useState("");
  const [board_name, setBoardName] = useState();
  useEffect(() => {
    const getBoardData = async () => {
      const boardData = await fetchBoard(params.id);
      console.log(boardData, "boardData");
      setBoard(boardData);

      //   const listsData = await fetchLists(params?.id);
      //   console.log(listsData,"listsData")
      //    setLists(listsData);
    };

    getBoardData();
  }, [params?.id]);
  const handleAssignAdminRole = async (userId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${baseUrl}/boards/assign-board-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": token1,
            accesstoken: `Bearer ${token}`,
          },
          body: JSON.stringify({
            board_id: params?.id,
            user_id: userId,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        // fetchWorkspaceMembers(selectedWorkspaceId);
        fetchBoardMembers(params?.id);
        setBoardMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.user_id === userId
              ? { ...member }
              : member
          )
        );
      }
    } catch (error) {
      console.error("Error assigning admin role:", error);
    }
  };
  const handleLeaveWorkspace = async (userId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/boards/leave-board`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token1,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify({
          board_id: params?.id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // fetchWorkspaceMembers(selectedWorkspaceId);
        fetchBoardMembers(params?.id);
        // setBoardMembers((prevMembers) =>
        //   prevMembers.filter((member) => member.user_id !== userId)
        // );
      }
    } catch (error) {
      console.error("Error assigning admin role:", error);
    }
  };
  const handleOkBoardMembers = async () => {
    const token = await localStorage.getItem("access_token");
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/boards/add-board-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${token1}`,
            accesstoken: `Bearer ${token}`,
          },
          body: JSON.stringify({
         
              
                board_id: params?.id,
                user_id: board_name,
          }
          )
        }
      );
      const data = await response.json();
      // console.log(data)
      if (data.success) {
        // Fetch updated workspaces
        
        fetchBoardMembers(params?.id);
        enqueueSnackbar(data.message, { variant: "success" });
        setLoading(false);
        // setShowBoardMembersModal(false);
      } else {
        setLoading(false);
        enqueueSnackbar("I love hooks");
      
        // setShowBoardMembersModal(false);

        // setError(data.message || "Workspace creation failed");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      setError("An error occurred. Please try again later.");
    }
  };
  const handleRemoveAdminRole = async (userId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${baseUrl}/boards/remove-from-admin-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": token1,
            accesstoken: `Bearer ${token}`,
          },
          body: JSON.stringify({
            board_id: params?.id,
            user_id: userId,
          }),
        }
      );
      const data = await response.json();
      console.log("data", data);
      if (data.success) {
        fetchBoardMembers(params?.id);
        // setCurrentRole("Member");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error removing admin role:", error);
    }
  };
const fetchBoardMembers = async (board_id) => {
  const token = await localStorage.getItem("access_token");
  try {
    const response = await fetch(
      `${baseUrl}/boards/get-board-members-by-board-id/${board_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${token1}`,
          accesstoken: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setBoardMembers(data.data);
    
      const currentUserId = localStorage.getItem("user_id");
      const currentUser = data.data.find(
        (member) => member.user_id === parseInt(currentUserId)
      );
      if (currentUser) {
        setCurrentRole(
          currentUser.role === "admin" ? "Admin" : "Member"
        );
      } else {
        setCurrentRole("Not a Member");
      }
    }
  } catch (error) {
    console.error("Error fetching workspace members:", error);
  }
};
  const fetchWorkspaceMembers = async (workspace_id) => {
    const token = await localStorage.getItem("access_token");
    try {
      const response = await fetch(
        `${baseUrl}/workspace/get-workspace-members-by-workspace-id/${workspace_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${token1}`,
            accesstoken: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setWorkspaceMembers(data.data);
       
      
      }
    } catch (error) {
      console.error("Error fetching workspace members:", error);
    }
  };
  const handleCreateBoardMembers = (board_id, workspace_id) => {
    setShowBoardMembersModal(true);
    fetchWorkspaceMembers(workspace_id);
    fetchBoardMembers(board_id);
    // setSelectedWorkspaceId(workspace_id);
  };

  const handleRemoveMember = async (userId) => {
    try {
      const token = await localStorage.getItem("access_token");
      const response = await fetch(
        `${baseUrl}/boards/remove-board-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": `${token1}`,
            accesstoken: `Bearer ${token}`,
          },
          body: JSON.stringify({
            board_id: params?.id,
            user_id: userId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
    fetchBoardMembers(params?.id);
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
      const response = await fetch(`${baseUrl}/workspace/leave-workspace`, {
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
      });

      const data = await response.json();
      console.log(data);
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
    <div
      style={{
        color: "white",
        backgroundImage: `url(${baseUrl}/${board?.background_image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <div className="flex justify-between">
        <h1 className="text-white text-3xl font-bold">{board?.board_name}</h1>
        <button
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => handleCreateBoardMembers(params.id,board?.workspace_id)}
        >
          Add Members
        </button>
      </div>

      <KanbanBoard boardId={params?.id} />

      {showBoardMembersModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">Board Members</h2>
            <div className="flex space-x-8">
              {/* Invitation Form */}
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-4">
                
                  </h3>
                  <label className="block text-gray-300">
                    Users to invite
                  </label>
                  <select
  id="small"
  className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  value={board_name}
  onChange={(e) => setBoardName(e.target.value)}
>
  <option value="">Choose Members</option>
  {workspaceMembers.length > 0 ? (
    workspaceMembers.map((member) => (
      <option key={member.user_id} value={member.user_id}>
        {member.name || member.email}
      </option>
    ))
  ) : (
    <option disabled>No members in this workspace.</option> // ✅ Correct way
  )}
</select>

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
                      handleOkBoardMembers();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    // disabled={!workspaceEmail || !workspaceNote}
                  >
                    Invite
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4">Current Members</h3>
                <div className="mb-4">
                  <p className="text-gray-300 font-semibold">
                    Your Role: {currentRole}
                  </p>
                </div>
                <ul className="space-y-2">
                  {boardMembers.length > 0 ? (
                    boardMembers.map((member, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-700 p-2 rounded-lg"
                      >
                        <span>{member.user_name }</span>
                        <span className="text-sm text-gray-400">
                          {member.role}
                        </span>
                        {currentRole === "Admin" &&
                        member.user_id ===
                          parseInt(localStorage.getItem("user_id")) ? (
                          <button
                            onClick={() => handleLeaveMember(member.user_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove Me
                          </button>
                        ) : currentRole === "Admin" ? (
                          <>
                         
                          <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                         
                            Remove
                          </button>
                       
                         </>
                        ) : currentRole === "Not a Member" ? null : null}
                        {currentRole === "Admin" &&
                          member.role === "admin" &&
                          member.user_id !=
                            parseInt(localStorage.getItem("user_id")) && (
                            <button
                              onClick={() =>
                                handleRemoveAdminRole(member.user_id)
                              }
                              className="text-red-300 hover:text-red-500"
                            >
                              Remove Admin
                            </button>
                          )}
                        {currentRole === "Admin" &&
                          member.role === "member" && (
                            <button
                              onClick={() =>
                                handleAssignAdminRole(member.user_id)
                              }
                              className="text-green-300 hover:text-green-500"
                            >
                              Make Admin
                            </button>
                          )}
                        {currentRole === "Member" &&
                          member.role === "member" &&
                          member.user_id ===
                            parseInt(localStorage.getItem("user_id")) && (
                            <button
                              onClick={() =>
                                handleLeaveWorkspace(member.user_id)
                              }
                              className="text-green-300 hover:text-green-500"
                            >
                              Leave Workspace
                            </button>
                          )}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No members in this workspace.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
