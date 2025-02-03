import React, { useState, useEffect, useRef } from "react";
import { fetchCardDetails, assignMembers, removeMember, addLabel, removeLabel, addAttachment, removeAttachment, getCardComments, deleteComment, getCardActivity, updateDescription } from "@/utils/api";
import { baseUrl } from "@/constant";

const CardModal = ({ card, closeModal }) => {
  const [details, setDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [description, setDescription] = useState("");
// console.log(card)
console.log(card,"card123")
const [showMembersModal, setShowMembersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([
    // { id: 1, name: "Ghayas Ali", initials: "GA" },
    // Add more dummy members as needed
  ]);
  const membersButtonRef = useRef(null);
  const membersModalRef = useRef(null);

useEffect(() => {
  
  const fetchDetails = async () => {
     //  console.log(card.card_id,"card_id")
      const cardDetails = await fetchCardDetails(card.card_id);
       console.log(cardDetails,"cardDetails")
     
      setDetails(cardDetails);

       const cardComments = await getCardComments(card.card_id);
       setComments(cardComments);
       const CardActivity = await getCardActivity(card.card_id);
       //setComments(cardComments);
       setActivity(CardActivity);
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
  console.log(response)
    if (response.success) {
      getCards();
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[800px] flex relative">
        
        {/* Left Side: Title, Description, Activity */}
        <div className="w-2/3 pr-4">
          {/* Title & List Info */}
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold">{details?.card?.card_title}</h2>
            <span className="text-gray-400">in list {details?.list_name}</span>
          </div>

          {/* Description */}
          <h3 className="text-lg font-semibold mt-4">Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 p-2 rounded mt-2 text-white"
            placeholder="Need formatting help? Type /help."
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleUpdateDescription(description)} className="bg-blue-500 px-4 py-2 rounded">Save</button>
            <button className="bg-gray-500 px-4 py-2 rounded">Cancel</button>
            <button className="bg-gray-700 px-4 py-2 rounded">Formatting Help</button>
            <button className=" bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>
        Close
      </button>
          </div>

          {/* Activity */}
          <h3 className="text-lg font-semibold mt-4">Comment</h3>
          <div className="mt-2 bg-gray-800 p-3 rounded">
            <input type="text" className="w-full bg-gray-700 p-2 rounded" placeholder="Write a comment..." />
          </div>
          {comments.map((comment) => (
            <div key={comment.comment_id} className="flex justify-between bg-gray-800 p-2 rounded mt-2">
              <p>{comment.comment_text}</p>
              <button className="text-red-500" onClick={() => deleteComment(comment.comment_id)}>
                Delete
              </button>
            </div>
          ))}
    <h3 className="text-lg font-semibold mt-4">Activity</h3>
    {activity.map((activityItem) => (
  <div key={activityItem.activity_id} className="flex items-center bg-gray-800 p-4 rounded-lg mt-2 shadow-md">
    {/* {console.log(`${baseUrl}${activityItem.profile_picture_url}`,"profile_picture_url")} */}
    {/* Profile Picture */}
    <img 
      src={`${baseUrl}${activityItem.profile_picture_url}`} 
      alt={activityItem.performed_by} 
      className="w-10 h-10 rounded-full object-cover mr-3"
    />
    
    <div>
      {/* User Name */}
      <p className="text-white font-semibold">{activityItem.performed_by}</p>
      
      {/* Activity Description */}
      <p className="text-gray-300 text-sm">{activityItem.activity_description}</p>
      
      {/* Formatted Date */}
      <p className="text-gray-500 text-xs">
        {new Date(activityItem.created_at).toLocaleString()}
      </p>
    </div>
  </div>
))}

        </div>

        {/* Right Side: Sidebar Actions */}
        <div className="w-1/3 border-l pl-4">
          {/* <button className="bg-gray-800 px-4 py-1 rounded text-white w-full">Watch</button> */}
          <div className="mt-4 grid grid-cols-1 gap-2">
          <button
              ref={membersButtonRef}
              className="bg-gray-700 p-2 rounded w-full text-left"
              onClick={() => setShowMembersModal(!showMembersModal)}
            >
              Members
            </button>
            <button className="bg-gray-700 p-2 rounded">Labels</button>
            {/* <button className="bg-gray-700 p-2 rounded">Checklist</button> */}
            <button className="bg-gray-700 p-2 rounded">Dates</button>
            <button className="bg-gray-700 p-2 rounded">Attachment</button>
            <button className="bg-gray-700 p-2 rounded">Cover</button>
            <button className="bg-gray-700 p-2 rounded">Custom Fields</button>
            <button className="bg-gray-700 p-2 rounded">Add Power-Ups</button>
            <button className="bg-gray-700 p-2 rounded">Move</button>
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
              <ul>
                {members
                  .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((member) => (
                    <li key={member.id} className="flex items-center p-2 hover:bg-gray-700 rounded">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">
                        {member.initials}
                      </div>
                      <span>{member.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {/* Actions */}

       
        </div>
      </div>
    
    </div>
  );
};

export default CardModal;
