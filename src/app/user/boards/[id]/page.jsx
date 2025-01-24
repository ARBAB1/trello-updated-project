"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchBoard, fetchLists } from "@/utils/api";
import KanbanBoard from "@/components/KanbanBoard";
import { baseUrl } from "@/constant";

const BoardPage = () => {
  const params = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
console.log(params.id)
  useEffect(() => {
    const getBoardData = async () => {
      const boardData = await fetchBoard(params.id);
      console.log(boardData)
      setBoard(boardData);

    //   const listsData = await fetchLists(params?.id);
    //   console.log(listsData,"listsData")
    //    setLists(listsData);
    };

    getBoardData();
  }, [params?.id]);

  return (
    <div
      style={{
        backgroundImage: `url(${baseUrl}/${board?.background_image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h1 className="text-white text-3xl font-bold">{board?.board_name}</h1>
      <KanbanBoard  boardId={params?.id}/>
    </div>
  );
};

export default BoardPage;
