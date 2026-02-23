import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';

import { MdOutlineDone } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoClipboardOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", {text:newTodo});
      setTodos([...todos, response.data]);
      setNewTodo("");
    }
    catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
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
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data 
        : todo)));
      setEditingTodo(null);
    }
    catch (error) {
      console.log("Error updating todos:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    }
    catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map((t) => t._id === id ? response.data : t));
    }
    catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-sea-green flex items-center justify-center p-4">
      <div className="bg-jasmine rounded-2xl shadow-xl shadow-dark-green w-full max-w-lg p-8">
        <h1 className="text-5xl text-dark-green font-caveat font-bold mb-7">Task Manager</h1>
        <form onSubmit={addTodo} className="font-caveat flex items-center shadow-sm 
        shadow-dark-green border border-sea-green p-1 rounded-lg my-4">
          <input className="outline-none text-2xl text-dark-green placeholder-sea-green flex-1"
            type="text" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter task :)"
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
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editingTodo === todo._id ? (
                    <div className="flex items-center gap-x-3"> 
                      <input className="flex-1 p-2 border border-sea-green 
                        rounded-md outline-none focus:ring-2 focus:ring-dark-green
                        font-caveat text-xl text-dark-green" 
                        type="text" 
                        value={editedText} 
                        onChange={(e) => setEditedText(e.target.value)}/>
                      <div className="flex gap-x-2">
                        <button onClick={() => saveEdit(todo._id)} className="px-3 py-2 bg-blue-400 text-white
                         rounded-lg hover:bg-blue-500 cursor-pointer">
                          <MdOutlineDone/>
                        </button>
                        <button className="px-3 py-2 bg-red-400 text-white
                         rounded-lg hover:bg-red-500 cursor-pointer" 
                         onClick={() => setEditingTodo(null)}>
                          <IoClose/>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3 overflow-hidden">
                          <button onClick={() => toggleTodo(todo._id)} 
                            className={`h-6 w-6 border-2 border-sea-green rounded-full 
                            flex shrink-0 items-center justify-center ${todo.completed ? "bg-sea-green" 
                            : "hover:border-dark-green"}`}>
                            {todo.completed && <MdOutlineDone/>}
                          </button>
                          <span className="text-dark-green font-caveat text-xl truncate p-2">{todo.text}</span>
                        </div>
                        <div className="flex gap-x-2">
                          <button className="p-2 text-xl text-sea-green hover:text-dark-green rounded-lg 
                          hover:bg-sea-green duration-200" 
                           onClick={() => startEditing(todo)}>
                            <MdModeEditOutline/>
                          </button>
                          <button onClick={() => deleteTodo(todo._id)} className="p-2 text-xl text-red-400 hover:text-red-500 rounded-lg
                           hover:bg-sea-green duration-200" >
                            <FaTrash/>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App
