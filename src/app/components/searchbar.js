"use client";
import { useState } from "react";
import axios from "axios";

export default function SearchBar({ onResults }) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [dueBefore, setDueBefore] = useState("");
  const [dueAfter, setDueAfter] = useState("");
  const [overdue, setOverdue] = useState("");

 const handleSearch = async () => {
  try {
    // Construct query params
    const params = new URLSearchParams();

    // Only add params that are not empty or undefined
    if (query) params.append('query', query);
    if (priority) params.append('priority', priority);
    if (status) params.append('status', status);
    if (dueBefore) params.append('dueBefore', dueBefore);
    if (dueAfter) params.append('dueAfter', dueAfter);
    if (overdue) params.append('overdue', overdue);

    // Send GET request with fetch
 const response = await fetch(`http://localhost:8080/tasks/search?${params.toString()}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json', 
  },
  credentials: 'include', // This ensures cookies are sent (if using cookies for auth)
});
    // Check if the response is OK (status 200)
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    // Parse the response JSON
    const data = await response.json();
    onResults(data); // Pass results to parent (TasksPage)

  } catch (error) {
    console.error("Search failed", error);
  }
};



  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-100 rounded-xl shadow-md">
      <input
        type="text"
        placeholder="Search title or description"
        className="flex-1 p-2 border rounded-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="">Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="">Status</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>

      <input
        type="date"
        value={dueAfter}
        onChange={(e) => setDueAfter(e.target.value)}
        className="p-2 border rounded-md"
        placeholder="Due After"
      />

      <input
        type="date"
        value={dueBefore}
        onChange={(e) => setDueBefore(e.target.value)}
        className="p-2 border rounded-md"
        placeholder="Due Before"
      />

      <select
        value={overdue}
        onChange={(e) => setOverdue(e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="">Overdue?</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}


