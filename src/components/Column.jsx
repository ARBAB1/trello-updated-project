import React, { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import { createCard, deleteList, fetchCardsByListId } from "@/utils/api";

const Column = ({ column, getBoardData }) => {
  console.log(column, "col")
  const { setNodeRef } = useDroppable({ id: column.id });
  const [cards, setCards] = useState([]);
  const [newCardName, setNewCardName] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  useEffect(() => {
    const getCards = async () => {
      const cardsData = await fetchCardsByListId(column.list_id);
      // console.log(cardsData,"cardsData")
      setCards(cardsData);
    };

    getCards();
  }, [column.list_id]);

  const getCards = async () => {
    const cardsData = await fetchCardsByListId(column.list_id);
    // console.log(cardsData,"cardsData")
    setCards(cardsData);
  };
  const handleCreateCard = async () => {
    if (newCardName.trim() !== "") {
      const cardData = await createCard(column.list_id, newCardName);

      if (cardData.success) {
        getCards(column.list_id);
      }
      setCards([...cards]);
      setNewCardName("");
      setIsAddingCard(false);
    }
  }

  const handleUpdateList = async (list_id) => {
    const response = await deleteList(list_id);

    if (response.success) {
      getBoardData();
    }
  };
  const handleDeleteList = async (list_id) => {
    const response = await deleteList(list_id);

    if (response.success) {
      getBoardData();
    }
  };
  return (
    <div ref={setNodeRef} className="bg-gray-900 p-4 rounded w-80">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white" >
          {column.list_name}
        </h2>
        <div className="flex space-x-2">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>

          </div>
          <div onClick={() => handleDeleteList(column.list_id)} className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>


          </div>
        </div>

      </div>

      <div className="mt-4 space-y-2">
        {isAddingCard === false && (

          <div
            className="text-white px-4 py-2 rounded-lg border border-gray-600 cursor-pointer"
            onClick={() => setIsAddingCard(true)
            } >
            Add Card
          </div>
        )

        }
        {cards.map((card) => (
          <Card key={card.card_id} card={card} getCards={getCards} />
        ))}
      </div>
      {isAddingCard && (
        <div className="bg-gray-700 p-4 rounded ">
          <input
            type="text"
            className="border p-2 w-full text-black"
            placeholder="Enter Card name..."
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
              onClick={() => setIsAddingCard(false)}
            >
              Cancel
            </button>
            <div
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              onClick={handleCreateCard}
            >
              Add Card
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
