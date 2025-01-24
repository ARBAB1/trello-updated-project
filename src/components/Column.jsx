import React, { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import { createCard, fetchCardsByListId } from "@/utils/api";

const Column = ({ column }) => {
  console.log(column,"col")
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
  return (
    <div ref={setNodeRef} className="bg-gray-200 p-4 rounded w-80">
      <h2 className="text-lg font-bold" style={{ color: "black" }}>
        {column.list_name}
      </h2>
      <div className="mt-4 space-y-2">
        {  isAddingCard === false && (
          
         <button className="bg-white hover:bg-gray-200 text-black py-2 px-4 rounded" onClick={() => setIsAddingCard(true)
         } >
          Add Card
         </button>
        )

        }
        {cards.map((card) => (
          <Card key={card.card_id} card={card} />
        ))}
      </div>
      {isAddingCard && (
          <div className="bg-gray-200 p-4 rounded ">
            <input
              type="text"
              className="border p-2 w-full text-black"
              placeholder="Enter Card name..."
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setIsAddingCard(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateCard}
              >
                Add Card
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Column;
