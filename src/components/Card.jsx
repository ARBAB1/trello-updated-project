import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import CardModal from "./CardModal";
import { deleteCard, updateDescription } from "@/utils/api";

const Card = ({ card, getCards }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: card.card_id,
  });
 
  console.log(card,"card")
  const [isModalOpen, setModalOpen] = useState(false);
const handleDeleteCard = async (card_id) => {
  const response = await deleteCard(card_id);
console.log(response)
  if (response.success) {
    getCards();
  }
};
  return (
    <>
      <div
       
        className="bg-gray-800 p-2 rounded shadow cursor-pointer"
     
      >
          <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white">{card.card_title}</h3>
      <div className="flex space-x-2">
      <div onClick={() => setModalOpen(true)} >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>

      </div>
      <div onClick={() => handleDeleteCard(card.card_id)} className="cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>


      </div>
      </div>
    
      </div>
  
      </div>

      {isModalOpen && (
        <CardModal card={card} closeModal={() => setModalOpen(false)} />
      )}
    </>
  );
};

export default Card;
