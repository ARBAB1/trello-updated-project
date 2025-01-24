import React, { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Column from "./Column";
import { baseUrl, token1 } from "@/constant";
import { fetchLists } from "@/utils/api";
// import { createList } from "@/utils/api"; // Import API to create a list

const KanbanBoard = ({ lists, boardId }) => {
    const [columns, setColumns] = useState(lists || []);
  const [newListName, setNewListName] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  useEffect(() => {
    const getBoardData = async () => {
    const listsData = await fetchLists(boardId);
        console.log(listsData,"listsData")
         setColumns(listsData);
    }

    getBoardData();
  }, [boardId]);
  const getBoardData = async () => {
    const listsData = await fetchLists(boardId);
        console.log(listsData,"listsData")
         setColumns(listsData);
    }
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumnIndex = columns.findIndex((col) =>
      col.tasks.some((task) => task.id === active.id)
    );

    const overColumnIndex = columns.findIndex((col) => col.id === over.id);

    if (activeColumnIndex !== overColumnIndex) {
      const activeTask = columns[activeColumnIndex].tasks.find(
        (task) => task.id === active.id
      );

      setColumns((prev) => {
        const updatedColumns = [...prev];
        updatedColumns[activeColumnIndex].tasks = updatedColumns[
          activeColumnIndex
        ].tasks.filter((task) => task.id !== active.id);
        updatedColumns[overColumnIndex].tasks.push(activeTask);
        return updatedColumns;
      });
    }
  };
const getHeaders = async () => {
  const token = await localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "x-api-key": token1,
    accesstoken: `Bearer ${token}`,
  };
};

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    console.log(boardId, newListName, "#ff6347")
    const newList = await fetch(`${baseUrl}/lists/create-list`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ board_id: boardId, list_name: newListName, list_colour: "#ff6347" }),
    })

    if (!newList.ok) {
      console.error("Error creating list:", newList.statusText);
      return;
    }

    if (newList?.ok) {
      const data = await newList.json();
      getBoardData()
      setColumns([...columns]);
      setNewListName("");
      setIsAddingList(false);
    }
  };

  return (
//     <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden">

//       <div className="mx-auto">
//       <button
//         onClick={() => createList()}
//         className="h-[60px]
// w-[350px]
// min-w-[350px]
// cursor-pointer rounded-1g @bg-mainBackgroundColor border-2
// •border-columnBackgroundColor p-4
// Dring-rose-500
// hover: ring-2"
//       >
//         + Add a List
//       </button>
//       </div>
  
//     </div>
//   )
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        <SortableContext items={columns.map((col) => col.list_id || col.list_nam)}>
          {/* {console.log(columns.length,"columns")} */}
          {columns.length > 0 && 
 columns.map((column, index) => (
  <Column key={column.list_id || `column-${index}`} column={column} />
))}
          
           
         
            <div className="bg-gray-200 p-4 rounded w-80 text-center">
              <button
                onClick={() => setIsAddingList(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                + Add a List
              </button>
            </div>
        
        </SortableContext>

        {/* Add List Input Field */}
        {isAddingList && (
          <div className="bg-gray-200 p-4 rounded w-80">
            <input
              type="text"
              className="border p-2 w-full text-black"
              placeholder="Enter list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setIsAddingList(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateList}
              >
                Add List
              </button>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );

     
};

export default KanbanBoard;
