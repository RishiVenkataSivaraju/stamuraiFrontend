"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // Async function to fetch data from Express backend
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/register");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        setMessage(data);
      } catch (err) {
        setMessage(`Error: ${err.message}`);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Backend says:</h1>
      <p>{message}</p>
    </div>
  );
}

