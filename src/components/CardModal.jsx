import React, { useState, useEffect, useRef } from "react";
import {
  fetchCardDetails,
  assignMembers,
  removeMember,
  addLabel,
  removeLabel,
  addAttachment,
  removeAttachment,
  getCardComments,
  deleteComment,
  getCardActivity,
  updateDescription,
  fetchBoardMembers,
  updateDueDate,
  addCover,
  fetchLists,
  movelist,
} from "@/utils/api";
import { baseUrl } from "@/constant";
import moment from "moment";
import { Activity, Delete, DeleteIcon } from "lucide-react";
import ActivityList from "./Activity";
import { enqueueSnackbar } from "notistack";
import { token1 } from "@/constant";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

const getHeaders = async () => {
  const token = await localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "x-api-key": token1,
    accesstoken: `Bearer ${token}`,
  };
};

const CardModal = ({ card, closeModal }) => {
  const [details, setDetails] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [description, setDescription] = useState("");
  const [boardMembers, setBoardMembers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
  // cont [attachments, setAttachments] = useState([]);
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dueTime, setDueTime] = useState("20:48"); // Default time
  const [members, setMembers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null)
  const [attachments, setAttachments] = useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [selectedListId, setSelectedListId] = useState(""); // Use empty string instead of null

  const [listsData, setListsData] = useState([]);
  const formatDueDateTime = (dueDate, dueTime) => {
    if (!dueDate || !dueTime) return null;

    // Convert dueDate to YYYY-MM-DD
    const formattedDate = dueDate.toISOString().split("T")[0];

    // Ensure dueTime is in HH:mm format, then append seconds ":00"
    const formattedTime = dueTime.length === 5 ? `${dueTime}:00` : dueTime;

    // Combine into ISO format
    return `${formattedDate}T${formattedTime}`;
  };

  const labelsDData = [
    {
      id: 1,
      name: "High",
      color: "#FF0000",
    },
    {
      id: 2,
      name: "Moderate",
      color: "#00FF00",
    },
    {
      id: 3,
      name: "Low",
      color: "#0000FF",
    },
  ];
  const membersButtonRef = useRef(null);
  const membersModalRef = useRef(null);
  const labelsButtonRef = useRef(null);
  const datesButtonRef = useRef(null);
  const attachmentsButtonRef = useRef(null);
  const coverButtonRef = useRef(null);
  const moveButtonRef = useRef(null);
  const fetchCardDetail = async (cardId) => {
    const cardDetails = await fetchCardDetails(card.card_id);
    setSelectedUsers(cardDetails?.members);
    setDescription(cardDetails.card.description);
    setDetails(cardDetails?.card);
    setSelectedLabels(cardDetails?.labels);
    setSelectedDate(cardDetails?.card?.due_date);
    setSelectedCover(cardDetails?.card?.card_cover)
  };

  useEffect(() => {
    const fetchDetails = async () => {
      //  console.log(card.card_id,"card_id")
      const listsData = await fetchLists(card.board_id);
   setListsData(listsData)
      const cardDetails = await fetchCardDetails(card.card_id);
      console.log(cardDetails,"cardDetails")
      const boardMembers = await fetchBoardMembers(card.board_id);
      setBoardMembers(boardMembers);
      // console.log(boardMembers,"boardMembers")

      setSelectedUsers(cardDetails?.members);
      setSelectedLabels(cardDetails?.labels);
      setDescription(cardDetails.card.description);
      setDetails(cardDetails?.card);
      setSelectedDate(cardDetails?.card?.due_date);
      setSelectedCover(cardDetails?.card?.card_cover)
      // const boardMembers = await fetch
      const cardComments = await getCardComments(card.card_id);
      setComments(cardComments);
      const CardActivity = await getCardActivity(card.card_id);
      //setComments(cardComments);
      setActivity(CardActivity);
       
      
              //  setSelectedListId(listsData);
          
    };

    fetchDetails();
  }, [card]);
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        membersModalRef.current &&
        !membersModalRef.current.contains(event.target) &&
        !membersButtonRef.current.contains(event.target)
      ) {
        setShowMembersModal(false);
      }
    }
    if (showMembersModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMembersModal]);

  const handleUpdateDescription = async (description) => {
    const formData = new FormData();
    formData.append("card_id", card.card_id);
    formData.append("description", description);
    const response = await updateDescription(formData);

    if (response.success) {
      fetchCardDetail(card.card_id);
      enqueueSnackbar("Description updated successfully", { variant: "success" });
    }
  };

  const handleMemberClick = async (cardId, userId) => {
    try {
      const response = await fetch(`${baseUrl}/cards/assign-card-to-members`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ card_id: cardId, member_ids: [userId] }),
      });
      const data = await response.json();

      // console.log(data,"data")
      if (data.success) {
        fetchCardDetail(card.card_id);
        // fetchCardDetail(card.card_id)
        enqueueSnackbar("Member assigned successfully", { variant: "success" });
      }
    } catch (error) {}
  };
  const handleRemoveMemberClick = async (cardId, userId) => {
    try {
      const response = await fetch(`${baseUrl}/cards/remove-card-members`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ card_id: cardId, user_id_to_remove: userId }),
      });
      const data = await response.json();

      //  console.log(data,"data")

      //  console.log(response,"response")
      if (data.success) {
        fetchCardDetail(card.card_id);
        // fetchCardDetail(card.card_id)
        enqueueSnackbar("Member removed successfully", { variant: "success" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLabelClick = async (name, label_color) => {
    try {
      const response = await fetch(`${baseUrl}/cards/add-card-label`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({
          card_id: card.card_id,
          label_title: name,
          label_colour: label_color,
        }),
      });
      const data = await response.json();

      // console.log(data,"data")
      if (data.success) {
        fetchCardDetail(card.card_id);
        // fetchCardDetail(card.card_id)
        enqueueSnackbar("Label added successfully", { variant: "success" });
      }
    } catch (error) {}
  };
  const handleRemoveLabelClick = async (cardId, labelId) => {
    // console.log(labelId,"labelId")
    //  const id =labelId[0]
    try {
      const response = await fetch(`${baseUrl}/cards/remove-card-label`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ card_id: cardId, label_id: labelId }),
      });
      const data = await response.json();

      // console.log(data,"data")

      if (data.success) {
        fetchCardDetail(card.card_id);
        // fetchCardDetail(card.card_id)
        enqueueSnackbar("Label removed successfully", { variant: "success" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSaveDueDate = async (cardId, dueDate, dueTime) => {
    const formattedDueDateTime = formatDueDateTime(dueDate, dueTime);
    const formData = new FormData();
    formData.append("card_id", cardId);
    formData.append("due_date", formattedDueDateTime);
    const response = await updateDueDate(formData);
    if (response.success) {
      fetchCardDetail(card.card_id);
      enqueueSnackbar("Due date updated successfully", { variant: "success" });
      setShowDatesModal(false);
      setDueDate(new Date());
      setDueTime("20:48");
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return; // Ensure a file is selected
  
    setAttachments((prevAttachments) => [...(prevAttachments || []), file]);
  };
  const handleUploadCover = async (cardId) => {
    try {
      const formData = new FormData();
      formData.append("card_id", cardId);
      for (let i = 0; i < attachments.length; i++) {
        formData.append("card_cover", attachments[i]);
      }
      const response = await addCover(formData);
      if (response.success) {
        fetchCardDetail(card.card_id);
        enqueueSnackbar("Cover uploaded successfully", { variant: "success" });
        setAttachments([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUploadAttachment = async (cardId) => {
    try {
      const formData = new FormData();
      formData.append("card_id", cardId);
      for (let i = 0; i < attachments.length; i++) {
        formData.append("card_attachment", attachments[i]);
      }
      const response = await addAttachment(formData);
      console.log(response,"res")
      if (response.success) {
        fetchCardDetail(card.card_id);
        enqueueSnackbar("Attachment uploaded successfully", { variant: "success" });
        setAttachments([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleMoveCard = async (cardId) => {
    try {
      console.log(selectedListId,cardId,"selectedListId")
      const formData = new FormData();
      formData.append("card_id", cardId);
      formData.append("list_id", selectedListId);
      const response = await movelist(formData);
      if (response.success) {
        
        enqueueSnackbar("Card moved successfully", { variant: "success" });
        setShowMembersModal(false);
        setSelectedListId(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[800px] flex relative">
        {/* {console.log(selectedUsers,"selectedUsers")}sssssssss */}
        {/* Left Side: Title, Description, Activity */}
      
        <div className="w-2/3 pr-4">
          {/* Title & List Info */}
          {selectedCover && (
          <div>
             <img
                     src={`${baseUrl}${selectedCover}`}
                    //  alt={activityItem.performe}
                     className="w-full h-20  object-cover mr-3"
                   />
          </div>
        )

        }
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold">{details?.card_title}</h2>
            <div className="flex items-center flex-row">
            <div className="flex items-center mt-5 gap-2">
              {selectedUsers &&
                selectedUsers.map((user) => (
                  <span
                    key={user.user_id}
                    className="w-9 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold "
                  >
                    {getInitials(user.member_name)}
                  </span>
                ))}
            </div>
            <div className="flex items-center mt-5 ml-5 gap-2">
              {selectedLabels &&
                selectedLabels.map((label) => (
                  <span
                    key={label.card_label_id}
                    style={{ backgroundColor: label.label_colour }}
                    className=" h-10 p-5 rounded-full flex items-center justify-center text-white font-bold "
                  >
                    {label.label_title}
                  </span>
                ))}
            </div>
            </div>
          <div className="flex items-center mt-5 gap-2">
            {
              selectedDate && (
                <div className="flex items-center w-full">
                  <span className="h-8 p-5 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold ">Due Date : {moment(selectedDate).format("YYYY-MM-DD")}</span>
                </div>
              )
            }
          </div>
          </div>

          {/* Description */}
          <h3 className="text-lg font-semibold mt-4">Description</h3>
          <textarea
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded mt-2 text-white"
            placeholder="Need formatting help? Type /help."
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleUpdateDescription(description)}
              className="bg-blue-500 px-4 py-2 rounded"
            >
              Save
            </button>
            <button className="bg-gray-500 px-4 py-2 rounded">Cancel</button>
            {/* <button className="bg-gray-700 px-4 py-2 rounded">Formatting Help</button> */}
            <button
              className=" bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>

          {/* Activity */}
          <h3 className="text-lg font-semibold mt-4">Comment</h3>
          <div className="mt-2 bg-gray-800 p-3 rounded">
            <input
              type="text"
              className="w-full bg-gray-700 p-2 rounded"
              placeholder="Write a comment..."
            />
          </div>
          {comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="flex justify-between bg-gray-800 p-2 rounded mt-2"
            >
              <p>{comment.comment_text}</p>
              <button
                className="text-red-500"
                onClick={() => deleteComment(comment.comment_id)}
              >
                Delete
              </button>
            </div>
          ))}
          <ActivityList activity={activity} />
        </div>

        {/* Right Side: Sidebar Actions */}
        <div className="w-1/3 border-l pl-4">
          {/* <button className="bg-gray-800 px-4 py-1 rounded text-white w-full">Watch</button> */}
          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              ref={membersButtonRef}
              className="bg-gray-700 p-2 rounded"
              onClick={() => setShowMembersModal(!showMembersModal)}
            >
              Members
            </button>
            <button
              className="bg-gray-700 p-2 rounded"
              onClick={() => setShowLabelsModal(!showLabelsModal)}
            >
              Labels
            </button>
            {/* <button className="bg-gray-700 p-2 rounded">Checklist</button> */}
            <button
              className="bg-gray-700 p-2 rounded"
              onClick={() => setShowDatesModal(!showDatesModal)}
            >
              Dates
            </button>
            <button className="bg-gray-700 p-2 rounded" onClick={()=>setShowAttachmentsModal(!showAttachmentsModal)}>Attachment</button>
            <button className="bg-gray-700 p-2 rounded" onClick={()=>setShowCoverModal(!showCoverModal)}>Cover</button>

            <button className="bg-gray-700 p-2 rounded" onClick={()=>setShowMoveModal(!showMoveModal)}>Move</button>
          </div>
          {showMembersModal && (
            <div
              ref={membersModalRef}
              className="absolute left-120 top-16 mt-2 w-64 bg-gray-800 text-white p-4 rounded shadow-lg z-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Members</h3>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="text-gray-400 hover:text-white text-lg"
                >
                  &times;
                </button>
              </div>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                placeholder="Search members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <h4 className="text-sm text-gray-400 mb-2">Board Members</h4>
              <ul className="space-y-2 ">
                {boardMembers?.length > 0 &&
                  boardMembers
                    .filter((m) =>
                      m.user_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((member, index) => (
                      <li
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer justify-between"
                      >
                        <div className="w-8 h-8  bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">
                          {getInitials(member.user_name)}
                        </div>
                        <span
                          onClick={() =>
                            handleMemberClick(card.card_id, member.user_id)
                          }
                        >
                          {member.user_name}
                        </span>
                        {selectedUsers.some(
                          (u) => u.user_id === member.user_id
                        ) && (
                          <>
                            <DeleteIcon
                              className="text-red-500"
                              onClick={() =>
                                handleRemoveMemberClick(
                                  card.card_id,
                                  member.user_id,
                                  "delete"
                                )
                              }
                            />
                            <span className="text-green-500 ml-2">✓</span>
                          </>
                        )}
                      </li>
                    ))}
              </ul>
            </div>
          )}
          {showLabelsModal && (
            <div
              ref={labelsButtonRef}
              className="absolute left-190 top-20 mt-2 w-64 bg-gray-800 text-white p-4 rounded shadow-lg z-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Labels</h3>
                <button
                  onClick={() => setShowLabelsModal(false)}
                  className="text-gray-400 hover:text-white text-lg"
                >
                  &times;
                </button>
              </div>
              <input
                type="text"
                className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                placeholder="Search labels"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <h4 className="text-sm text-gray-400 mb-2">Labels</h4>
              <ul className="space-y-2">
                {labelsDData?.length > 0 &&
                  labelsDData
                    .filter((l) =>
                      l.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((label, index) => (
                      <li
                        key={index}
                        style={{ backgroundColor: label.color }}
                        className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
                      >
                        <span
                          onClick={() =>
                            handleLabelClick(label.name, label.color)
                          }
                          className="mr-2"
                        >
                          {label.name}
                        </span>
                        {selectedLabels.some(
                          (l) => l.label_colour === label.color
                        ) && (
                          <>
                            <span className="text-green-500 ml-2">✓</span>
                            {/* {console.log(selectedLabels.filter((l) => l.label_colour === label.color).map((l) => l.card_label_id))} */}
                            <DeleteIcon
                              className="text-red-500"
                              onClick={() =>
                                handleRemoveLabelClick(
                                  card.card_id,
                                  selectedLabels.find(
                                    (l) => l.label_colour === label.color
                                  )?.card_label_id
                                )
                              }
                            />
                          </>
                        )}
                      </li>
                    ))}
              </ul>
            </div>
          )}
          {showDatesModal && (
            <div
              ref={datesButtonRef}
              className="absolute left-260 top-20 mt-2  bg-gray-800 text-white p-4 rounded shadow-lg z-50"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-semibold">Dates</h3>
                <button
                  onClick={() => setShowDatesModal(false)}
                  className="text-gray-400 hover:text-white text-lg"
                >
                  &times;
                </button>
              </div>
              <div className="mt-4 ">
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  inline
                  calendarClassName="bg-gray-900 text-white p-2 rounded"
                />
                <div className="mt-4">
                  <label className="text-sm">Due date</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      className="w-2/3 p-2 bg-gray-700 text-white rounded"
                      value={dueDate.toLocaleDateString("en-GB")}
                      readOnly
                    />
                    <input
                      type="time"
                      className="w-1/3 p-2 bg-gray-700 text-white rounded"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                    />
                  </div>
                  <button
                    className="w-full mt-4 bg-blue-500 p-2 rounded text-white font-bold"
                    onClick={() =>
                      handleSaveDueDate(card.card_id, dueDate, dueTime)
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          {showAttachmentsModal && (
            <div
              ref={attachmentsButtonRef}
              className="absolute left-260 top-20 mt-2  bg-gray-800 text-white p-4 rounded shadow-lg z-50"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-semibold">Attachments</h3>
                <button
                  onClick={() => setShowAttachmentsModal(false)}
                  className="text-gray-400 hover:text-white text-lg"
                >
                  &times;
                </button>
              </div>
              <div className="mt-4">
                <input
                  type="file"
                  className="w-full p-2 bg-gray-700 text-white rounded"
                  onChange={(e) => handleFileChange(e)}
                />
                <button
                  className="w-full mt-4 bg-blue-500 p-2 rounded text-white font-bold"
                  onClick={() => handleUploadAttachment(card.card_id)}
                >
                  Upload
                </button>
              </div>
            </div>
          )}
{
  showCoverModal && (
    <div
    ref={coverButtonRef}
    className="absolute left-260 top-20 mt-2  bg-gray-800 text-white p-4 rounded shadow-lg z-50"
  >
    <div className="flex justify-between items-center border-b pb-2">
      <h3 className="text-sm font-semibold">Cover</h3>
      <button
        onClick={() => setShowCoverModal(false)}
        className="text-gray-400 hover:text-white text-lg"
      >
        &times;
      </button>
    </div>
    <div className="mt-4">
      <input
        type="file"
        className="w-full p-2 bg-gray-700 text-white rounded"
        onChange={(e) => handleFileChange(e)}
      />
      <button
        className="w-full mt-4 bg-blue-500 p-2 rounded text-white font-bold"
        onClick={() => handleUploadCover(card.card_id)}
      >
        Upload
      </button>
    </div>
  </div>
  )
}
{
  showMoveModal && (
    <div
    ref={moveButtonRef}
    className="absolute left-260 top-20 mt-2  bg-gray-800 text-white p-4 rounded shadow-lg z-50"
  >
    <div className="flex justify-between items-center border-b pb-2">
      <h3 className="text-sm font-semibold">Move</h3>
      <button
        onClick={() => setShowMoveModal(false)}
        className="text-gray-400 hover:text-white text-lg"
      >
        &times;
      </button>
    </div>
    <div className="mt-4">
    <select 
  className="w-full p-2 bg-gray-700 text-white rounded"
  value={selectedListId || ""}  // Ensure it's not null
  onChange={(e) => setSelectedListId(e.target.value)}
>
  <option value="">Select a list</option>
  {listsData.map((list) => (
    <option key={list.list_id} value={list.list_id}>
      {list.list_name}
    </option>
  ))}
</select>

      <button
        className="w-full mt-4 bg-blue-500 p-2 rounded text-white font-bold"
        onClick={() => handleMoveCard(card.card_id)}
      >
      Move
      </button>
    </div>
  </div>
  )
}

          
        </div>
      </div>
    </div>
  );
};

export default CardModal;
