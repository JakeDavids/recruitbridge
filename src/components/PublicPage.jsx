/**
 * Wrapper for public pages (Landing, etc) that redirects authenticated users
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { getCurrentUser } from "./auth/helpers";

export default function PublicPage({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        // User is logged in, redirect to Dashboard
        navigate(createPageUrl("Dashboard"), { replace: true });
      } else {
        setChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return <>{children}</>;
}