"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("Logging in...");

  try {
    const res = await fetch("https://stamurai-backend.vercel.app/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
      body: JSON.stringify(formData),
    });

    const data = await res.json(); // Always parse as JSON

    if (res.ok) {
      setMessage("Logged in successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      setMessage(data.message || "Login failed"); // Show backend error message
    }
  } catch (err) {
    console.error("Login error:", err);
    setMessage("Login failed due to network/server error.");
  }
};


  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Log In</button>
      </form>
      <p>
        New here?{" "}
        <Link href="/register">
          Create an account
        </Link>
      </p>
      <p>{message}</p>
    </div>
  );
}

