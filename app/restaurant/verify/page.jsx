"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      verifyEmail(token);
    } else {
      setError("Token is missing from the URL.");
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.get(`/api/restaurants/verify?token=${token}`);
      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setError(response.data.error || "Verification failed.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
