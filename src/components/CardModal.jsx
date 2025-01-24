import React, { useState, useEffect } from "react";
import { fetchCardDetails, assignMembers, removeMember, addLabel, removeLabel, addAttachment, removeAttachment, getCardComments, deleteComment } from "@/utils/api";

const CardModal = ({ card, closeModal }) => {
  const [details, setDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  const [labelTitle, setLabelTitle] = useState("");
  const [labelColor, setLabelColor] = useState("#ff6347");

  useEffect(() => {
    const fetchDetails = async () => {
      const cardDetails = await fetchCardDetails(card.card_id);
      setDetails(cardDetails);

      const cardComments = await getCardComments(card.card_id);
      setComments(cardComments);
    };

    fetchDetails();
  }, [card.card_id]);

  const handleAssignMembers = async () => {
    await assignMembers(card.card_id, memberIds);
    alert("Members assigned!");
  };

  const handleAddLabel = async () => {
    await addLabel(card.card_id, labelTitle, labelColor);
    alert("Label added!");
  };

  const handleRemoveLabel = async (labelId) => {
    await removeLabel(card.card_id, labelId);
    alert("Label removed!");
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments(comments.filter((c) => c.comment_id !== commentId));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{details?.card_title}</h2>
        <p className="text-gray-700">{details?.description}</p>

        <h3 className="text-lg font-semibold mt-4">Members</h3>
        <input
          type="text"
          placeholder="Enter member IDs (comma separated)"
          className="border p-2 w-full"
          onChange={(e) => setMemberIds(e.target.value.split(","))}
        />
        <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={handleAssignMembers}>
          Assign Members
        </button>

        <h3 className="text-lg font-semibold mt-4">Labels</h3>
        <input
          type="text"
          placeholder="Label Title"
          className="border p-2 w-full"
          onChange={(e) => setLabelTitle(e.target.value)}
        />
        <button className="bg-green-500 text-white px-4 py-2 mt-2" onClick={handleAddLabel}>
          Add Label
        </button>

        <h3 className="text-lg font-semibold mt-4">Comments</h3>
        {comments.map((comment) => (
          <div key={comment.comment_id} className="flex justify-between bg-gray-100 p-2 rounded mt-2">
            <p>{comment.comment_text}</p>
            <button className="text-red-500" onClick={() => handleDeleteComment(comment.comment_id)}>
              Delete
            </button>
          </div>
        ))}

        <button className="mt-4 bg-red-500 text-white px-4 py-2" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CardModal;
