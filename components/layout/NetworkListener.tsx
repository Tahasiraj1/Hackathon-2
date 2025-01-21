"use client"

import React, { useState, useEffect } from "react";

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  if (typeof window === "undefined") return null;

  return isOffline ? (
    <div className="fixed top-0 w-full bg-red-500 text-white text-center p-1">
      You are offline. Please check your connection.
    </div>
  ) : null;
}
