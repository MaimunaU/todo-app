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

const DAYS_OF_WEEK = [
  {label: "S", value: 0},
  {label: "M", value: 1},
  {label: "T", value: 2},
  {label: "W", value: 3},
  {label: "T", value: 4},
  {label: "F", value: 5},
  {label: "S", value: 6},
];

const getCurrentWeekDays = () => {
  const today = new Date();
  const startOfWeek = new Date(today);

  startOfWeek.setDate(today.getDate() - today.getDay());

  return DAYS_OF_WEEK.map((day, idx) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + idx);

    return {...day, date: date.toLocaleDateString("en-CA")};
  });
};

function UserAuth({
  authMode,
  setAuthMode,
  username,
  setUsername,
  password,
  setPassword,
  authError,
  login, 
  register
}) {
  return (
    <div className="min-h-screen w-full bg-sea-green flex flex-col items-center pt-5 gap-10">
      <h1 className="text-5xl text-dark-green font-caveat font-bold mb-7">Like mate, stop procrastinating</h1>
      <form onSubmit={authMode === "login" ? login : register} 
        className="w-6/10 bg-jasmine font-caveat shadow-sm shadow-dark-green border border-sea-green p-2 rounded-lg flex flex-col">
          <h1 className="text-5xl text-dark-green font-caveat font-bold m-2">{authMode === "login" ? "Log In" : "Create account"}</h1>
          {authError && (<p className="text-red-500 font-caveat text-xl">{authError}</p>)}

          <input className=" w-7/10 flex-1 p-1.5 border border-sea-green 
            rounded-md outline-none shadow-sm shadow-dark-green focus:ring-2 focus:ring-dark-green font-caveat text-xl placeholder-sea-green text-dark-green m-2" 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username" required/>

          <input className=" w-7/10 flex-1 p-1.5 border border-sea-green 
            rounded-md outline-none shadow-sm shadow-dark-green focus:ring-2 focus:ring-dark-green font-caveat text-xl placeholder-sea-green text-dark-green m-2" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" required/>

          <div className="flex justify-between">
            <button type="submit" className="bg-dark-green shadow-lg shadow-dark-green hover:bg-sea-green font-caveat text-jasmine rounded-lg px-5 py-2 m-2">{authMode === "login" ? "Log In" : "Sign up"}</button>

            <button type="button" onClick={() => {setAuthMode(authMode === "login" ? "register" : "login");}} className="bg-dark-green shadow-lg shadow-dark-green hover:bg-sea-green font-caveat text-jasmine rounded-lg px-5 py-2 m-2">{authMode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}</button>
          </div>
        </form>
    </div>
  );
}

function TodoItem({
  todo,
  editingTodo,
  editedText,
  setEditedText,
  setEditingTodo,
  saveEditedTodo,
  startEditingTodo,
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
    await saveEditedTodo(todo._id);
    setEditingTodo(null);
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex items-center gap-x-3"> 
          <input className="flex-1 p-1.5 border border-sea-green 
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
            <button onClick={handleSave} className="p-1.5 bg-blue-400 text-white
              rounded-lg hover:bg-blue-500 cursor-pointer">
              <MdOutlineDone/>
            </button>
            <button onClick={() => setEditingTodo(null)} className="p-1.5 bg-red-400 text-white
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
            <span className="text-dark-green font-caveat text-xl whitespace-normal break-normal p-1.5 min-w-0 flex-1">{todo.text}</span>
            {isCompleted && (
              <span className="text-m opacity-60 ml-2 text-dark-green font-caveat self-center">
                completed: {formatDisplayDate(todo.completedAt)}
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
              <button onClick={() => startEditingTodo(todo)} className="p-1.5 text-xl text-sea-green hover:text-dark-green rounded-lg 
                hover:bg-sea-green duration-200">
                <MdModeEditOutline/>
              </button>
              <button onClick={() => deleteTodo(todo._id)} className="p-1.5 text-xl text-red-400 hover:text-red-500 rounded-lg
                hover:bg-sea-green duration-200">
                <FaTrash/>
              </button>
          </div>
          )}
        </div>
      )}
    </div>
  );
}

function HabitItem({
  habit,
  editingHabit,
  editedHabitName,
  editedHabitDays,
  setEditedHabitName,
  setEditedHabitDays,
  setEditingHabit,
  startEditingHabit,
  saveEditedHabit,
  deleteHabit,
  currentWeekDays,
  toggleHabitDate
}) {
  const isEditing = editingHabit === habit._id;

  const toggleEditedDay = (dayValue) => {
    setEditedHabitDays((prev) => prev.includes(dayValue) ? prev.filter((day) => day !== dayValue) : [...prev, dayValue].sort());
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_repeat(7,2rem)_2rem_2rem] items-center gap-2">
      {isEditing ? (
        <>
          <input
          className="p-1.5 border border-sea-green rounded-md outline-none focus:ring-2 focus:ring-dark-green font-caveat text-xl text-dark-green"
          type="text"
          value={editedHabitName}
          onChange={(e) => setEditedHabitName(e.target.value)}/>

          {DAYS_OF_WEEK.map((day) => {
            const isAssigned = editedHabitDays.includes(day.value);
            return (
              <button 
              key={day.value}
              type="button"
              onClick={() => toggleEditedDay(day.value)}
              className={`justify-self-center h-5 w-5 border-2 border-sea-green rounded-full flex items-center justify-center ${isAssigned ? "bg-sea-green": "hover:border-dark-green"}`}>{isAssigned && <MdOutlineDone/>}</button>
            );
            })
          }
          <button type="button" onClick={() => saveEditedHabit(habit._id)} className="p-1.5 bg-blue-400 text-white rounded-lg hover:bg-blue-500 cursor-pointer"><MdOutlineDone /></button>

          <button type="button" onClick={() => setEditingHabit(null)} className="p-1.5 bg-red-400 text-white rounded-lg hover:bg-red-500 cursor-pointer"><IoClose /></button>
        </>
      ) : (
        <>
          <span className="text-dark-green font-caveat text-xl whitespace-normal break-normal p-1.5 min-w-0">{habit.name}</span>

          {currentWeekDays.map((day) => {
            const isAssigned = habit.daysOfWeek.includes(day.value);
            const isCompleted = habit.logs?.some((log) => log.date === day.date);

            return (
              <button key={day.value} type="button" disabled={!isAssigned} onClick={() => toggleHabitDate(habit._id, day.date)} className={`justify-self-center h-5 w-5 border-2 border-sea-green rounded-full flex items-center justify-center ${isCompleted ? "bg-sea-green" : isAssigned ? "bg-transparent hover:border-dark-green" : "opacity-30 cursor-not-allowed"}`}>{isCompleted && <MdOutlineDone/>}</button>
            );
            })
          }

          <button 
          type="button" onClick={() => startEditingHabit(habit)} 
          className="p-1.5 text-xl text-sea-green hover:text-dark-green rounded-lg hover:bg-sea-green duration-200"><MdModeEditOutline/></button>
          
          <button
          type="button" onClick={() => deleteHabit(habit._id)}
          className="self-center p-1.5 text-xl text-red-400 hover:text-red-500 rounded-lg hover:bg-sea-green duration-200"><FaTrash/></button>
        </>
      )}
    </div>
  );
}

function App() {
  console.log("API URL =", import.meta.env.VITE_API_URL); 

  // states for user register/login and auth
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // states for todo list 
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);  
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  // states for habits
  const [newHabit, setNewHabit] = useState("");
  const [habits, setHabits] = useState([]);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editedHabitName, setEditedHabitName] = useState("");
  const [editedHabitDays, setEditedHabitDays] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const currentWeekDays = getCurrentWeekDays();

  // user account and auth functions
  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        username,
        password
      });

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      setUsername("");
      setPassword("");
      setAuthError("");
    }
    catch (error) {
      setAuthError(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        username,
        password
      });

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      setUsername("");
      setPassword("");
      setAuthError("");
    }
    catch (error) {
      setAuthError(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setTodos([]);
    setHabits([]);
  };

  const authConfig = {
    headers: {Authorization: `Bearer ${token}`}
  };

  // todo list functions
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/todos`, {text:newTodo}, authConfig);
      setTodos(prev => [...prev, response.data]);
      setNewTodo("");
    }
    catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/todos`, authConfig);
      // console.log("API response:", response.data);
      setTodos(response.data);
    }
    catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const startEditingTodo = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEditedTodo = async (id) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, {
        text: editedText
      }, authConfig);
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, authConfig);
      setTodos(prev => prev.filter((todo) => todo._id !== id));
    }
    catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const today = new Date().toLocaleDateString("en-CA");

      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, {
        completed: !todo.completed,
        completedAt: !todo.completed ? today : null
      }, authConfig);
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
        { dueDate: date }, authConfig
      );
  
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? response.data : t))
      );
    } catch (error) {
      console.log("Error updating due date:", error);
    }
  };

  // habit functions
  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/habits`, {
        name:newHabit,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      }, authConfig);
      setHabits(prev => [...prev, response.data]);
      setNewHabit("");
    }
    catch (error) {
      console.log("Error adding habit:", error);
    }
  };

  const fetchHabit = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/habits`, authConfig);
      // console.log("API response:", response.data);
      setHabits(response.data);
    }
    catch (error) {
      console.log("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchTodos();
    fetchHabit();
  }, [token]);

  const startEditingHabit = (habit) => {
    setEditingHabit(habit._id);
    setEditedHabitName(habit.name);
    setEditedHabitDays(habit.daysOfWeek);
  };

  const saveEditedHabit = async (id) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/habits/${id}`, {
        name: editedHabitName,
        daysOfWeek: editedHabitDays
      }, authConfig);
      setHabits(prev =>
        prev.map((habit) => (habit._id === id ? response.data : habit))
      );
      setEditingHabit(null);
    }
    catch (error) {
      console.log("Error updating habits:", error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/habits/${id}`, authConfig);
      setHabits(prev => prev.filter((habit) => habit._id !== id));
    }
    catch (error) {
      console.log("Error deleting habit:", error);
    }
  };

  const toggleHabitDate = async (id, date) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/habits/${id}/toggle`, {date}, authConfig);
      setHabits(prev =>
        prev.map((habit) => (habit._id === id ? response.data : habit))
      );
    }
    catch (error) {
      console.log("Error toggling habit:", error);
    }
  };

  if (!token) {
    return (
      <UserAuth
        authMode={authMode}
        setAuthMode={setAuthMode}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        authError={authError}
        login={login}
        register={register}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-sea-green flex flex-col items-center pt-5 gap-10">
      <div className="w-full flex justify-between items-center mt-2 px-7">
        <h1 className="text-5xl text-dark-green font-caveat font-bold">Like mate, stop procrastinating</h1>
        <button onClick={() => logout()} className="border text-xl text-dark-green font-caveat font-bold shadow-xl shadow-dark-green rounded-2xl px-3 hover:bg-jasmine">Log Out</button>
      </div>
      <div className="flex w-full items-start justify-around mt-5">
        {/* Left side - enter today's tasks */}
        <div className="bg-jasmine rounded-2xl shadow-xl shadow-dark-green w-4/10 p-8 m-7">
          <div className="flex justify-between items-center mb-7">
            <h1 className="text-5xl text-dark-green font-caveat font-bold">Tasks</h1>
            <button onClick={() => setShowCompleted(prev => !prev)} 
              className=" border text-xl text-dark-green font-caveat font-bold shadow-xl shadow-dark-green bg-jasmine rounded-2xl pl-2 pr-3 max-h-5/10 hover:bg-sea-green">Completed</button>
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
          <form onSubmit={addTodo} className="font-caveat flex items-center shadow-sm 
          shadow-dark-green border border-sea-green p-1 rounded-lg my-4">
            <input className="outline-none text-2xl text-dark-green placeholder-sea-green flex-1"
              type="text" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter task :)"
              required 
            />
            <button type="submit" className="bg-dark-green hover:bg-sea-green font-caveat text-jasmine text-xl px-4 py-2 rounded-md cursor-pointer">Add</button>
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
                    startEditingTodo={startEditingTodo}
                    saveEditedTodo={saveEditedTodo}
                    editingTodo={editingTodo}
                    editedText={editedText}
                    setEditedText={setEditedText}
                    setEditingTodo={setEditingTodo}
                    updateDueDate={updateDueDate}/>
                  ))}
              </div>
            )}
          </div>
        </div>
        {/* Right side - habit tracker */}
        <div className="bg-jasmine rounded-2xl shadow-xl shadow-dark-green w-6/10 p-8 m-7">
          <div className="flex justify-between items-center mb-7">
            <h1 className="text-5xl text-dark-green font-caveat font-bold">Habits</h1>
            <button onClick={() => setShowSummary(prev => !prev)} 
              className=" border text-xl text-dark-green font-caveat font-bold shadow-xl shadow-dark-green bg-jasmine rounded-2xl pl-2 pr-3 max-h-5/10 hover:bg-sea-green">Summary</button>
            {showSummary && (
              <div onClick={() => setShowSummary(false)} className="fixed inset-0 bg-dark-green/30 flex items-center justify-center z-50">
                {/* modal */}
                <div onClick={(e) => e.stopPropagation()} className="bg-jasmine rounded-2xl shadow-xl shadow-dark-green w-150 max-h-500 p-6 flex flex-col">
                  {/* header */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-caveat text-dark-green">Habit Summary</p>
                    <button onClick={() => setShowSummary(false)} className="text-xl font-caveat text-dark-green">X</button>
                  </div>
                  {/* content */}
                  <div className="flex flex-col gap-4 overflow-y-auto">
                    <p className="text-dark-green font-caveat text-xl">Summary content</p>
                    {/* current streak, longest streak, total # of days completed (since first day habit was added?), can show the month with the completed days filled and state the habit's completion rate for each month, most missed habit, most/least productive day in terms of habit completion*/}
                  </div>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={addHabit} className="font-caveat flex items-center shadow-sm 
          shadow-dark-green border border-sea-green p-1 rounded-lg my-4">
            <input className="outline-none text-2xl text-dark-green placeholder-sea-green flex-1"
              type="text" 
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter habit :)"
              required 
            />
            <button type="submit" className="bg-dark-green hover:bg-sea-green font-caveat text-jasmine text-xl px-4 py-2 rounded-md cursor-pointer">Add</button>
          </form>
          <div className="grid grid-cols-[minmax(0,1fr)_repeat(7,2rem)_2rem_2rem] items-center gap-2">
            <span></span>
            {currentWeekDays.map((day) => (
              <span key={day.value} className="justify-self-center text-center text-dark-green font-caveat text-xl">
                {day.label}
              </span>
            ))}
            <span></span>
            <span></span>
          </div>
          <div className="flex flex-col gap-4">
            {habits.map((habit) => (
              <HabitItem 
              key={habit._id} 
              habit={habit}
              editingHabit={editingHabit}
              editedHabitName={editedHabitName}
              editedHabitDays={editedHabitDays}
              setEditedHabitName={setEditedHabitName}
              setEditedHabitDays={setEditedHabitDays}
              setEditingHabit={setEditingHabit}
              startEditingHabit={startEditingHabit}
              saveEditedHabit={saveEditedHabit}
              deleteHabit={deleteHabit}
              currentWeekDays={currentWeekDays}
              toggleHabitDate={toggleHabitDate}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
