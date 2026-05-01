import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';

import { MdOutlineDone } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoClipboardOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";

const formatDisplayDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${month}/${day}/${year}`;
};

function TodoItem({
  todo,
  editingTodo,
  editedText,
  setEditedText,
  setEditingTodo,
  saveEdit,
  startEditing,
  deleteTodo,
  toggleTodo,
  isCompleted = false,
  updateDueDate
  }) {
  const isEditing = editingTodo === todo._id && !isCompleted;
  const [localDueDate, setLocalDueDate] = useState(todo.dueDate || "");

  useEffect(() => {
    setLocalDueDate(todo.dueDate || "");
  }, [todo.dueDate]);

  const handleSave = async () => {
    await updateDueDate(todo._id, localDueDate);
    await saveEdit(todo._id);
    setEditingTodo(null);
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex items-center gap-x-3"> 
          <input className="flex-1 p-2 border border-sea-green 
            rounded-md outline-none focus:ring-2 focus:ring-dark-green
            font-caveat text-xl text-dark-green"
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}/>
          <input className="w-40 min-w-40 shrink-0 flex-none text-xs border border-sea-green rounded px-2 py-1 bg-white"
            type="date"
            value={localDueDate}
            onChange={(e) => setLocalDueDate(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}/>
          <div className="flex gap-x-2">
            <button onClick={handleSave} className="px-3 py-2 bg-blue-400 text-white
              rounded-lg hover:bg-blue-500 cursor-pointer">
              <MdOutlineDone/>
            </button>
            <button onClick={() => setEditingTodo(null)} className="px-3 py-2 bg-red-400 text-white
              rounded-lg hover:bg-red-500 cursor-pointer">
              <IoClose/>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-x-3">
            <button onClick={() => toggleTodo(todo._id)} className={`h-6 w-6 border-2 border-sea-green rounded-full 
              flex shrink-0 items-center justify-center ${todo.completed ? "bg-sea-green" 
              : "hover:border-dark-green"}`}>
              {todo.completed && <MdOutlineDone/>}
            </button>
            <span className="text-dark-green font-caveat text-xl truncate p-2 min-w-0 flex-1">{todo.text}</span>
            {isCompleted && (
              <span className="text-m opacity-60 ml-2 text-dark-green font-caveat self-center">
                completed: {formatDisplayDate(todo.dueDate)}
              </span>
            )}
            {!isCompleted && todo.dueDate && (
              <div className="text-m text-dark-green font-caveat opacity-60 ml-2 self-center">
                due: {formatDisplayDate(todo.dueDate)}
              </div>
            )}
          </div>
          {!isCompleted && (
            <div className="flex gap-x-2">
              <button onClick={() => startEditing(todo)} className="p-2 text-xl text-sea-green hover:text-dark-green rounded-lg 
                hover:bg-sea-green duration-200">
                <MdModeEditOutline/>
              </button>
              <button onClick={() => deleteTodo(todo._id)} className="p-2 text-xl text-red-400 hover:text-red-500 rounded-lg
                hover:bg-sea-green duration-200" >
                <FaTrash/>
              </button>
          </div>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  console.log("API URL =", import.meta.env.VITE_API_URL); 
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);  
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/todos`, {text:newTodo});
      setTodos(prev => [...prev, response.data]);
      setNewTodo("");
    }
    catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/todos`);
      console.log("API response:", response.data);
      setTodos(response.data);
    }
    catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, {
        text: editedText
      });
      setTodos(prev =>
        prev.map((todo) => (todo._id === id ? response.data : todo))
      );
      setEditingTodo(null);
    }
    catch (error) {
      console.log("Error updating todos:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/todos/${id}`);
      setTodos(prev => prev.filter((todo) => todo._id !== id));
    }
    catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(prev =>
        prev.map((t) => (t._id === id ? response.data : t))
      );
    }
    catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  const updateDueDate = async (id, date) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/todos/${id}`,
        { dueDate: date }
      );
  
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? response.data : t))
      );
    } catch (error) {
      console.log("Error updating due date:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-sea-green flex flex-col items-center pt-5 gap-20">
      {/* Top right, completed tasks button */}
      <div className="w-full flex justify-end pr-10">
        <button onClick={() => setShowCompleted(prev => !prev)} 
          className="text-xl text-dark-green font-caveat font-bold shadow-xl shadow-dark-green bg-jasmine rounded-2xl pl-2 pr-3">Completed</button>
        {showCompleted && (
          <div onClick={() => setShowCompleted(false)} className="fixed inset-0 bg-dark-green/30 flex items-center justify-center z-50">
            {/* modal */}
            <div onClick={(e) => e.stopPropagation()} className="bg-jasmine rounded-2xl shadow-xl shadow-dark-green w-150 max-h-500 p-6 flex flex-col">
              {/* header */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-caveat text-dark-green">Completed Tasks</p>
                <button onClick={() => setShowCompleted(false)} className="text-xl font-caveat text-dark-green">X</button>
              </div>
              {/* content */}
              <div className="flex flex-col gap-4 overflow-y-auto">
                {completedTodos.length === 0 ? (
                  <p className="text-dark-green font-caveat text-xl">No completed tasks</p>
                ) : (
                  completedTodos.map(todo => (
                    <TodoItem
                      key={todo._id}
                      todo={todo}
                      toggleTodo={toggleTodo}
                      isCompleted={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between w-9/10">
        {/* Left side - enter today's tasks */}
        <div className="bg-jasmine rounded-2xl shadow-xl shadow-dark-green w-full max-w-lg p-8 mr-3">
          <h1 className="text-5xl text-dark-green font-caveat font-bold mb-7">Tasks</h1>
          <form onSubmit={addTodo} className="font-caveat flex items-center shadow-sm 
          shadow-dark-green border border-sea-green p-1 rounded-lg my-4">
            <input className="outline-none text-2xl text-dark-green placeholder-sea-green flex-1"
              type="text" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter tasks :)"
              required 
            />
            <button type="submit" className="bg-sea-green hover:bg-yellow-500 font-caveat text-dark-green 
              text-xl px-4 py-2 rounded-md cursor-pointer">Add Task</button>
          </form>

          <div>
            {todos.length === 0 ? (
              <div></div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeTodos.map((todo) => (
                  <TodoItem 
                    key={todo._id} 
                    todo={todo}
                    toggleTodo={toggleTodo}
                    deleteTodo={deleteTodo}
                    startEditing={startEditing}
                    saveEdit={saveEdit}
                    editingTodo={editingTodo}
                    editedText={editedText}
                    setEditedText={setEditedText}
                    setEditingTodo={setEditingTodo}
                    updateDueDate={updateDueDate}/>
                  ))
                }
              </div>
            )}
          </div>

        </div>
        {/* Right side - habit tracker */}
        <div className="bg-jasmine rounded-2xl shadow-xl shadow-dark-green w-full max-w-lg p-8 mr-3">
          <h1 className="text-5xl text-dark-green font-caveat font-bold mb-7">Habits</h1>
        </div>
      </div>
      {/* Below/bottom - Week's work */}
      <div className="flex flex-col justify-between items-center bg-jasmine rounded-2xl shadow-xl shadow-dark-green w-9/10 p-8 mb-8">
        <h1 className="text-5xl text-dark-green font-caveat font-bold mb-7">Week's Work</h1>
        <div className="flex justify-around bg-sea-green rounded-2xl shadow-xl shadow-dark-green w-9/10 p-8 font-caveat text-xl text-dark-green">
            <div>Sunday</div>
            <div>Monday</div>
            <div>Tuesday</div>
            <div>Wednesday</div>
            <div>Thursday</div>
            <div>Friday</div>
            <div>Saturday</div>
        </div>
      </div>
    </div>
  );
}

export default App
