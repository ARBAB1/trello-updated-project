"use client"
import { Modal, Input, Button, Select, DatePicker, Upload, message } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Assuming the workspaces are stored in localStorage or some API

const BoardPage=()=> {
  const params = useParams();
  const workspaces = [
    {
      name: "Workspace 1",
      boards: [
        { id: 0, title: "Board 1", background: "/hero1.jpg" },
        { id: 1, title: "Board 2", background: "/hero2.jpg" },
      ],
    },
    {
      name: "Workspace 2",
      boards: [
        { id: 2, title: "Board 3", background: "/hero3.jpg" },
        { id: 3, title: "Board 4", background: "/hero4.jpg" },
      ],
    },
  ];
  
  const initialColumns = {
    doing: {
      name: "Doing",
      items: [],
    },
    qa: {
      name: "QA",
      items: [],
    },
    todo: {
      name: "To Do",
      items: [],
    },
    done: {
      name: "Done",
      items: [],
    },
  };
  
  const router = useRouter();
  const { id } = params; // Get the board ID from the route

  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState(initialColumns);
  const [newTask, setNewTask] = useState({}); // Store new task name for each column
  const [isAddingTask, setIsAddingTask] = useState({}); // Store state to show input for each column
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [currentTask, setCurrentTask] = useState(null); // Current task being edited
  const [editedTaskContent, setEditedTaskContent] = useState(""); // Edited task content
  const [description, setDescription] = useState(""); // Task description
  const [labels, setLabels] = useState([]); // Task labels
  const [dueDate, setDueDate] = useState(null); // Task due date
  const [fileList, setFileList] = useState([]); // Task-specific attachments
  const [comments, setComments] = useState(""); // Task-specific comments

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setEditedTaskContent(task.content); // Set task content in modal input
    setDescription(task.description || ""); // Set description if available
    setLabels(task.labels || []); // Set labels if available
    setDueDate(task.dueDate || null); // Set due date if available
    setFileList(task.attachments || []); // Set attachments if available
    setComments(task.comments || ""); // Set comments if available
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (currentTask) {
      const updatedItems = columns[currentTask.columnId].items.map((item) => {
        if (item.id === currentTask.id) {
          return {
            ...item,
            content: editedTaskContent,
            description,
            labels,
            dueDate,
            attachments: fileList,
            comments,
          }; // Update task details
        }
        return item;
      });
      setColumns({
        ...columns,
        [currentTask.columnId]: {
          ...columns[currentTask.columnId],
          items: updatedItems,
        },
      });
    }
    setIsModalOpen(false);
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList((prevList) => prevList.filter((f) => f.uid !== file.uid));
    },
    beforeUpload: (file) => {
      setFileList((prevList) => [...prevList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  useEffect(() => {
    // Find the board by ID in the workspace data
    const foundBoard = workspaces
      .flatMap((workspace) => workspace.boards)
      .find((b) => b.id === parseInt(id));

    setBoard(foundBoard);
  }, [id]);

  if (!board) {
    return <div>Loading...</div>;
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const handleInputChange = (columnId, value) => {
    setNewTask({
      ...newTask,
      [columnId]: value,
    });
  };

  const handleAddCard = (columnId) => {
    if (!newTask[columnId]) return;

    const column = columns[columnId];
    const newItems = [
      ...column.items,
      { id: `${Date.now()}`, content: newTask[columnId], attachments: [], comments: "", dueDate: null }, // Task-specific data
    ];

    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: newItems,
      },
    });

    setNewTask({
      ...newTask,
      [columnId]: "",
    });

    setIsAddingTask({
      ...isAddingTask,
      [columnId]: false,
    });
  };

  const handleShowInput = (columnId) => {
    setIsAddingTask({
      ...isAddingTask,
      [columnId]: true,
    });
  };

  const handleHideInput = (columnId) => {
    setIsAddingTask({
      ...isAddingTask,
      [columnId]: false,
    });
    setNewTask({
      ...newTask,
      [columnId]: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-green-500 p-2 rounded-lg">
            <span className="text-black font-bold">W</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">work</h2>
            <p className="text-sm">Free</p>
          </div>
        </div>
        <nav className="space-y-4">
          {/* Tabs in the sidebar */}
          <div className="space-y-2">
            <button className="flex items-center space-x-2 w-full py-2 px-4 text-left hover:bg-gray-700 rounded-lg">
              <span className="text-white">📋</span> <span>Boards</span>
            </button>
            <button className="flex items-center space-x-2 w-full py-2 px-4 text-left hover:bg-gray-700 rounded-lg">
              <span>👥</span> <span>Members</span>
              <span className="ml-auto">+</span>
            </button>
            <button className="flex items-center space-x-2 w-full py-2 px-4 text-left hover:bg-gray-700 rounded-lg">
              <span>⚙️</span> <span>Workspace settings</span>
            </button>
          </div>

          {/* Workspace views */}
          <div className="mt-4">
            <h3 className="text-sm text-gray-400">Workspace views</h3>
            <button className="flex items-center space-x-2 w-full py-2 px-4 text-left hover:bg-gray-700 rounded-lg">
              <span>📊</span> <span>Table</span>
            </button>
            <button className="flex items-center space-x-2 w-full py-2 px-4 text-left hover:bg-gray-700 rounded-lg">
              <span>📅</span> <span>Calendar</span>
            </button>
          </div>

          {/* Your boards section */}
          <div className="mt-4">
            <h3 className="text-sm text-gray-400">Your boards</h3>
            <button className="flex items-center space-x-2 w-full py-2 px-4 text-left hover:bg-gray-700 rounded-lg">
              <span>➕</span> <span>Create a board</span>
            </button>

            {/* List of boards in the workspace */}
            <div className="mt-4 space-y-2">
              {workspaces.flatMap((workspace) =>
                workspace.boards.map((b) => (
                  <button
                    key={b.id}
                    className={`flex items-center space-x-2 w-full py-2 px-4 text-left hover:bg-gray-700 rounded-lg ${
                      board.id === b.id ? "bg-gray-700" : ""
                    }`}
                    onClick={() => router.push(`/board/${b.id}`)}
                  >
                    <img
                      src={b.background}
                      alt={b.title}
                      className="w-8 h-8 rounded-lg"
                    />
                    <span>{b.title}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Board Content */}
      <main
        className="w-3/4 relative"
        style={{
          backgroundImage: `url(${board.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Board Title */}
        <header className="p-4 bg-black bg-opacity-50 text-white">
          <h1 className="text-3xl font-bold">{board.title}</h1>
        </header>

        {/* Draggable Tabs and Cards */}
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          <div className="p-6 space-x-4 flex overflow-x-auto">
            {Object.entries(columns).map(([columnId, column], index) => (
              <Droppable droppableId={columnId} key={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-900 bg-opacity-70 p-4 rounded-lg w-64"
                  >
                    <h2 className="text-lg font-semibold mb-2">{column.name}</h2>

                    <div className="space-y-2">
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-700 p-2 rounded-lg flex items-center justify-between"
                            >
                              <h3 className="text-white">{item.content}</h3>
                              <EditOutlined
                                className="ml-2 text-white cursor-pointer"
                                onClick={() =>
                                  handleEditTask({ ...item, columnId })
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {/* Add a card */}
                    {isAddingTask[columnId] ? (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Enter a name for this card..."
                          className="w-full p-2 rounded-lg bg-gray-700 text-white"
                          value={newTask[columnId] || ""}
                          onChange={(e) =>
                            handleInputChange(columnId, e.target.value)
                          }
                        />
                        <div className="flex justify-between mt-2">
                          <button
                            className="p-1 bg-blue-600 rounded-lg"
                            onClick={() => handleAddCard(columnId)}
                          >
                            Add card
                          </button>
                          <button
                            className="p-1 bg-gray-600 rounded-lg"
                            onClick={() => handleHideInput(columnId)}
                          >
                            ✖️
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="mt-2 p-1 rounded-lg w-full"
                        onClick={() => handleShowInput(columnId)}
                      >
                        + Add a card
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </main>

      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        visible={isModalOpen}
        onOk={handleSaveTask}
        onCancel={() => setIsModalOpen(false)}
        bodyStyle={{ backgroundColor: "white" }} // White background for modal
      >
        {/* Task Title */}
        <div className="mb-4">
          <label className="block mb-2">Task Title</label>
          <Input
            placeholder="Enter task title"
            value={editedTaskContent}
            onChange={(e) => setEditedTaskContent(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <Input.TextArea
            rows={4}
            placeholder="Add a more detailed description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Labels */}
        <div className="mb-4">
          <label className="block mb-2">Labels</label>
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Add labels"
            value={labels}
            onChange={setLabels}
          >
            <Select.Option value="Urgent">Urgent</Select.Option>
            <Select.Option value="Bug">Bug</Select.Option>
            <Select.Option value="Feature">Feature</Select.Option>
          </Select>
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="block mb-2">Due Date</label>
          <DatePicker
            style={{ width: "100%" }}
            value={dueDate}
            onChange={(date) => setDueDate(date)}
          />
        </div>

        {/* Attachments */}
        <div className="mb-4">
          <label className="block mb-2">Attachments</label>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </div>

        {/* Comments */}
        <div className="mb-4">
          <label className="block mb-2">Comments</label>
          <Input.TextArea
            rows={2}
            placeholder="Write a comment..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
export default BoardPage

