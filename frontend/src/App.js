import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000"; // Backend URL

function App() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/v1/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  // Register
  const register = async () => {
    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: form.email,
        password: form.password,
      }),
    });
    const data = await res.json();
    alert(data.message || JSON.stringify(data));
  };

  // Login
  const login = async () => {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      alert("Login successful!");
    } else {
      alert(data.message || "Login failed");
    }
  };

  // Create Task
  const createTask = async () => {
    const res = await fetch(`${API_URL}/api/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: taskInput }),
    });
    await res.json();
    setTaskInput("");
    fetchTasks();
  };

  // Delete Task
  const deleteTask = async (id) => {
    const res = await fetch(`${API_URL}/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await res.json();
    fetchTasks();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>PrimeTrade Frontend Demo</h2>

      <div style={styles.card}>
        <h3>Register / Login</h3>
        <input
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={register}>
            Register
          </button>
          <button style={styles.button} onClick={login}>
            Login
          </button>
        </div>
      </div>

      {token && (
        <div style={styles.card}>
          <h3>Tasks</h3>
          <input
            style={styles.input}
            placeholder="New task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button style={styles.button} onClick={createTask}>
            Add Task
          </button>

          <ul style={styles.list}>
            {tasks.map((t) => (
              <li key={t._id} style={styles.listItem}>
                {t.title}
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteTask(t._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

/* ---------- STYLES ---------- */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
  },
  card: {
    maxWidth: "400px",
    margin: "0 auto 20px",
    padding: "20px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
    borderBottom: "1px solid #eee",
  },
  deleteButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    padding: "5px 8px",
  },
};
