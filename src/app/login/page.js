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
        // credentials: "include", // Ensure cookies/session are included
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      if (res.ok) {
        setMessage("Logged in successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redirect after login
        }, 1500);
      } else {
        setMessage(text); // Display error message from backend
      }
    } catch (err) {
      console.error(err);
      setMessage("Login failed");
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

