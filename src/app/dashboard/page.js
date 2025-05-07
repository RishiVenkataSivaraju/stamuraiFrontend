"use client";

import { useEffect, useState } from "react";
import SearchBar from "../components/searchbar";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "todo",
    assignee: "",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ─── Initial Data Load ───────────────────────────────────────
  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
    fetchTasks();
    fetchNotifications();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, { credentials: "include" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, { credentials: "include" });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load tasks");
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/unread`, { credentials: "include" });
      const data = await res.json();
      console.log(data);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Handlers ────────────────────────────────────────────────

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          priority: "low",
          status: "todo",
          assignee: "",
        });
        setMessage("Task created successfully!");
        await fetchTasks();
        await fetchNotifications();
      } else {
        const { error } = await res.json();
        setMessage(`Failed to create task: ${error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error creating task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.slice(0, 10),
      priority: task.priority,
      status: task.status,
      assignee: task.assignee || "",
    });
    setMessage("");
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setMessage("Task updated successfully!");
        setEditingId(null);
        await fetchTasks();
        await fetchNotifications();
      } else {
        const { error } = await res.json();
        setMessage(`Failed to update task: ${error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessage("Task deleted");
        await fetchTasks();
      } else {
        setMessage("Failed to delete task");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting task");
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setUnreadCount((c) => c - 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Task Dashboard</h1>
      {/* <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} /> */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "1rem",
        }}
      >
        <button
          type="button"
          aria-label="View notifications"
          onClick={() => setNotifOpen((o) => !o)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            position: "relative",
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-10px",
                backgroundColor: "#e63946",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "bold",
                lineHeight: 1,
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              right: 0,
              width: "320px",
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              zIndex: 1000,
              padding: "0.75rem",
              animation: "fadeIn 0.2s ease-in-out",
            }}
          >
            {notifications.length === 0 ? (
              <p
                style={{
                  fontStyle: "italic",
                  color: "#888",
                  textAlign: "center",
                }}
              >
                No new notifications
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "0.5rem 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: "0.5rem" }}>
                      <strong>{n.taskId?.title || "Untitled Task"}</strong>
                      <br />
                      <small style={{ color: "#666" }}>
                        Sent by: {n.sender?.username || "Unknown"}
                      </small>
                      <br />
                      <small style={{ color: "#999" }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <button
                      onClick={() => markAsRead(n._id)}
                      style={{
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Seen
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>



      {/* ─── Task Creation Form ─────────────────────────────── */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: "2rem" }}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <br />
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required />
        <br />
        <select name="priority" value={formData.priority} onChange={handleInputChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <br />
        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <br />
        <select name="assignee" value={formData.assignee} onChange={handleInputChange}>
          <option value="">— Assign to —</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.username}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Create Task</button>
      </form>

      {message && <p>{message}</p>}

      {/* ─── Task List ───────────────────────────────────────── */}
      <h2>My Tasks</h2>
      <SearchBar onResults={setTasks} />
      <ul style={{ padding: 0, listStyle: "none" }}>
        {tasks.length === 0 ? (
          <li>No tasks found</li>
        ) : (
          tasks.map((task) => {
            const creatorId =
              typeof task.createdBy === "string" ? task.createdBy : task.createdBy?._id;
            const isAuthor = currentUser?._id === creatorId;

            const isOverdue =
              !task.status?.toLowerCase().includes("completed") &&
              new Date(task.dueDate) < new Date();

            return (
              <li
                key={task._id}
                style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}
              >
                {editingId === task._id ? (
                  <>
                    <input name="title" value={editForm.title} onChange={handleEditChange} required />
                    <br />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      required
                    />
                    <br />
                    <input
                      type="date"
                      name="dueDate"
                      value={editForm.dueDate}
                      onChange={handleEditChange}
                      required
                    />
                    <br />
                    <select name="priority" value={editForm.priority} onChange={handleEditChange}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <br />
                    <select name="status" value={editForm.status} onChange={handleEditChange}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <br />
                    <select name="assignee" value={editForm.assignee} onChange={handleEditChange}>
                      <option value="">— Assign to —</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.username}
                        </option>
                      ))}
                    </select>
                    <br />
                    <button onClick={() => saveEdit(task._id)}>Save</button>
                    <button onClick={cancelEdit} style={{ marginLeft: "0.5rem" }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <strong>{task.title}</strong> — {task.status} ({task.priority})
                    <br />
                    <em>Due: {new Date(task.dueDate).toLocaleDateString()}</em>
                    <br />
                    <p>{task.description}</p>
                    <p>
                      Assigned to:{" "}
                      {users.find((u) => u._id === task.assignee)?.username || "Unassigned"}
                    </p>
                    <p>
                      Assigned by:{" "}
                      {users.find((u) => u._id === creatorId)?.username || "Unknown"}
                    </p>

                    {isOverdue ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        ⚠ Deadline crossed
                      </span>
                    ) : (
                      <button onClick={() => startEdit(task)}>Edit</button>
                    )}

                    <button onClick={() => handleDelete(task._id)} style={{ marginLeft: "0.5rem" }}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            );
          })
        )}
      </ul>

    </div>
  );
}





