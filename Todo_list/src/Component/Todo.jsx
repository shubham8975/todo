import { useState, useEffect } from "react";
import "./Todo.css";

const API_URL = "http://localhost:8080/todos";

function Todo({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

useEffect(() => {
  setTodos([]); // Clear previous user's todos
  const token = localStorage.getItem("token");
  fetch(`${API_URL}?userId=${user.userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setTodos(data))
    .catch(err => console.error("Error fetching todos:", err));
}, [user.userId]);




function addTodo() {
  if (text.trim() === "") return;

  const token = localStorage.getItem("token");
  const newTodo = {
    title: text,
    date: selectedDate,
    userId: user.userId
  };

  fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(newTodo)
  })
    .then(res => res.json())
    .then(savedTodo => {
      setTodos([...todos, savedTodo]);
      setText("");
    });
}

  function toggleTodo(id) {
  const token = localStorage.getItem("token");
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(updatedTodo => {
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    });
}

 function deleteTodo(id) {
  const token = localStorage.getItem("token");
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(() => {
      setTodos(todos.filter(t => t.id !== id));
    });
}
  // Group todos by date (derived data)
  const groupedTodos = todos.reduce((acc, todo) => {
    acc[todo.date] = acc[todo.date] || [];
    acc[todo.date].push(todo);
    return acc;
  }, {});

  return (
    <div className="todo-app">
      
      <h2>My Todos</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        
      />
      {errors.date && (
  <p style={{ color: "red", fontSize: "13px" }}>
    {errors.date}
  </p>
)}


      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter todo" 
      />
      {errors.title && (
  <p style={{ color: "red", fontSize: "13px" }}>
    {errors.title}
  </p>
)}

      <button onClick={addTodo}>Add</button>

      {Object.keys(groupedTodos).map(date => (
        <div key={date}>
          <h4>{date}</h4>

          <ul>
            {groupedTodos[date].map(todo => (
              <li key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />

                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    marginLeft: "8px"
                  }}
                >
                  {todo.title}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ marginLeft: "10px" }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      
 

  <button
    onClick={onLogout}
    style={{
      background: "#ff4d4d",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer"
    }}
  >
    Logout
  </button>

    </div>
  );
}

export default Todo;
