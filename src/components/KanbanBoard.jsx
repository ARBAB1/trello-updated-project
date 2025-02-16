"use client"
import React, { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import Column from "./Column";
import { baseUrl, token1 } from "@/constant";
import { fetchLists } from "@/utils/api";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import { createList } from "@/utils/api"; // Import API to create a list

const KanbanBoard = ({ lists, boardId }) => {
  const [columns, setColumns] = useState(lists || []);
  const [newListName, setNewListName] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  useEffect(() => {
    const getBoardData = async () => {
      const listsData = await fetchLists(boardId);
      console.log(listsData, "listsData")
      setColumns(listsData);
    }

    getBoardData();
  }, [boardId]);
  const getBoardData = async () => {
    const listsData = await fetchLists(boardId);
    console.log(listsData, "listsData")
    setColumns(listsData);
  }
  const getHeaders = async () => {
    const token = await localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      "x-api-key": token1,
      accesstoken: `Bearer ${token}`,
    };
  };
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = reorder(columns, result.source.index, result.destination.index);
    setColumns(reorderedColumns);

    // Optional: Call function to update board data after reordering
    if (getBoardData) getBoardData(reorderedColumns);
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
  const initialColumns = [
    { list_id: "1", title: "To Do" },
    { list_id: "2", title: "In Progress" },
    { list_id: "3", title: "Done" },
  ];

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        <SortableContext items={columns.map((col) => col.list_id || col.list_nam)}>
          {/* {console.log(columns.length,"columns")} */}
          {/* {columns.length > 0 &&
            columns.map((column, index) => (
              <Column key={column.list_id || `column-${index}`} column={column} getBoardData={getBoardData} />
            ))} */}


          <DragAndDropBoard initialColumns={initialColumns} getBoardData={(data) => console.log("Updated Board:", data)} />

          <div className="bg-gray-900 p-4 rounded w-80 h-20 text-center">
            <div
              onClick={() => setIsAddingList(true)}
              className="text-white px-4 py-2 rounded-lg border border-gray-600 cursor-pointer"
            >
              + Add a List
            </div>
          </div>

        </SortableContext>

        {/* Add List Input Field */}
        {isAddingList && (
          <div className="bg-gray-700 p-4 h-35 rounded w-80">
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

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DragAndDropBoard = ({ initialColumns, getBoardData }) => {
  const [columns, setColumns] = useState(initialColumns || []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = reorder(columns, result.source.index, result.destination.index);
    setColumns(reorderedColumns);

    // Optional: Call function to update board data after reordering
    if (getBoardData) getBoardData(reorderedColumns);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: "flex",
              gap: "16px",
              padding: "16px",
              background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
            }}
          >
            {columns.length > 0 &&
              columns.map((column, index) => (
                <Draggable key={column.list_id || `column-${index}`} draggableId={column.list_id || `column-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: "16px",
                        background: snapshot.isDragging ? "lightgreen" : "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <Column column={column} getBoardData={getBoardData} />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};


// ‹div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
// ‹div className="m-auto">
// <button className="h- [60px] W- [350px] min-w-[350px] cursor-pointer rounded-1g bg-black border-2 border-columnBackgroundColor p-4ring-rose-500
// hover: ring-2
// Add Column </button>
// </div>
// </div>
