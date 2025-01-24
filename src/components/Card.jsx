import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import CardModal from "./CardModal";

const Card = ({ card }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: card.card_id,
  });
 
  console.log(card,"card")
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="bg-white p-2 rounded shadow cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <h3 className="font-semibold text-black">{card.card_title}</h3>
      </div>

      {isModalOpen && (
        <CardModal card={card} closeModal={() => setModalOpen(false)} />
      )}
    </>
  );
};

export default Card;
