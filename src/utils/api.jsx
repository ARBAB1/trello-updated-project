// export const baseUrl = "YOUR_BACKEND_URL";
// export const token1 = "YOUR_API_KEY";

import { baseUrl, token1 } from "@/constant";

const getHeaders = async () => {
  const token = await localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "x-api-key": token1,
    accesstoken: `Bearer ${token}`,
  };
};

/** =========================== BOARD APIs =========================== */

// Fetch Board Details
export const fetchBoard = async (boardId) => {
  const response = await fetch(`${baseUrl}/boards/get-board-by-board-Id/${boardId}`, {
    method: "GET",
    headers: await getHeaders(),
  });
  const data = await response.json();
  return data.success ? data.data : null;
};

// Fetch Board Members
export const fetchBoardMembers = async (boardId) => {
  const response = await fetch(`${baseUrl}/boards/get-board-members-by-board-id/${boardId}`, {
    method: "GET",
    headers: await getHeaders(),
  });
  const data = await response.json();
  return data.success ? data.data : [];
};

/** =========================== LIST (COLUMN) APIs =========================== */

// Fetch Lists by Board ID
export const fetchLists = async (boardId) => {
  const response = await fetch(`${baseUrl}/lists/get-all-lists-by-board-id/${boardId}`, {
    method: "GET",
    headers: await getHeaders(),
  });
  const data = await response.json();
  return data.success ? data.data : [];
};

// Create a List (Column)
export const createList = async (boardId, listName, listColor) => {

  const response = await fetch(`${baseUrl}/lists/create-list`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ board_id: boardId, list_name: listName, list_colour: listColor }),
  });
  return response.json();
};

// Delete a List (Column)
export const deleteList = async (listId) => {
  const response = await fetch(`${baseUrl}/lists/delete-list`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ list_id: listId }),
  });
  return response.json();
};

/** =========================== CARD APIs =========================== */

// Fetch Cards by List ID
export const fetchCardsByListId = async (listId) => {
  const response = await fetch(`${baseUrl}/cards/get-all-cards-by-list-id/${listId}`, {
    method: "GET",
    headers: await getHeaders(),
  });
  const data = await response.json();
  return data.success ? data.data : [];
};

// Fetch Card Details
export const fetchCardDetails = async (cardId) => {
  // console.log(cardId)
  const response = await fetch(`${baseUrl}/cards/get-card-details-by-card-id/${cardId}`, {
    method: "GET",
    headers: await getHeaders(),
  });
  const data = await response.json();
  //console.log(data)
  return data.success ? data.data : null;
};

// Create a Card
export const createCard = async (listId, cardTitle) => {
  const response = await fetch(`${baseUrl}/cards/create-card`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ list_id: listId, card_title: cardTitle }),
  });
  return response.json();
};

// Update a Card
export const updateCard = async (formData) => {
  const response = await fetch(`${baseUrl}/cards/update-card`, {
    method: "POST",
    headers: await getHeaders(),
    body: formData,
  });
  return response.json();
};
export const updateDescription = async (formData) => {
  const token = await localStorage.getItem("access_token");
  const response = await fetch(`${baseUrl}/cards/update-card`, {
    method: "POST",
    headers: {
      "x-api-key": token1,
    accesstoken: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  console.log(data)
  return response.json();
};
// Delete a Card
export const deleteCard = async (cardId) => {
  const response = await fetch(`${baseUrl}/cards/delete-card`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ card_id: cardId }),
  });
return response.json();
};

/** =========================== CARD MEMBERS APIs =========================== */

// Assign Members to Card
export const assignMembers = async (cardId, memberIds) => {
  const response = await fetch(`${baseUrl}/cards/assign-card-to-members`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ card_id: cardId, member_ids: memberIds }),
  });
  return response.json();
};

// Remove Member from Card
export const removeMember = async (cardId, userId) => {
  await fetch(`${baseUrl}/cards/remove-card-members`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ card_id: cardId, user_id_to_remove: userId }),
  });
};

/** =========================== CARD LABEL APIs =========================== */

// Add Label to Card
export const addLabel = async (cardId, title, color) => {
  await fetch(`${baseUrl}/cards/add-card-label`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ card_id: cardId, label_title: title, label_colour: color }),
  });
};

// Remove Label from Card
export const removeLabel = async (cardId, labelId) => {
  await fetch(`${baseUrl}/cards/remove-card-label`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ card_id: cardId, label_id: labelId }),
  });
};

/** =========================== CARD ATTACHMENTS APIs =========================== */

// Add Attachment to Card
export const addAttachment = async (formData) => {
  const response = await fetch(`${baseUrl}/cards/add-attachment-to-card`, {
    method: "POST",
    headers: await getHeaders(),
    body: formData,
  });
  return response.json();
};

// Remove Attachment from Card
export const removeAttachment = async (cardId, attachmentId) => {
  await fetch(`${baseUrl}/cards/remove-attachment-from-card`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ card_id: cardId, attachment_id: attachmentId }),
  });
};

/** =========================== CARD COMMENTS APIs =========================== */

// Fetch Card Comments
export const getCardComments = async (cardId) => {
  const response = await fetch(`${baseUrl}/cards/get-card-comments-by-card-id/${cardId}`, {
    method: "GET",
    headers: await getHeaders(),
  });
  const data = await response.json();
  return data.success ? data.data.comments : [];
};

// Delete a Comment
export const deleteComment = async (commentId) => {
  await fetch(`${baseUrl}/cards/delete-comment`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify({ comment_id: commentId }),
  });
};
export const getCardActivity = async (cardId) => {
  const response = await fetch(`${baseUrl}/cards/get-card-activity-by-card-id/${cardId}`, {
    method: "GET",
    headers: await getHeaders(),
  });
  const data = await response.json();
// console.log(data,"data")
  return data.success ? data.data.activities : [];
};

export const fetchWorkspaceMembers = async (workspaceId) => {
     const response = await fetch(
          `${baseUrl}/workspace/get-workspace-members-by-workspace-id/${workspaceId}`,
          {
            method: "GET",
            headers: await getHeaders(),
            body: JSON.stringify({ workspace_id: workspaceId }),
          }
       
        );
        const data = await response.json();
        return data.success ? data.data : [];
}
// const fetchBoardMembers = async (board_id) => {


//     const response = await fetch(
//       `${baseUrl}/boards/get-board-members-by-board-id/${board_id}`,
//       {
//         method: "GET",
//         headers: await getHeaders(),
//       }
//     );

//     const data = await response.json();
//     return data.success ? data.data : [];
// };