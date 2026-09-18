import { useState, useRef, useEffect } from "react";
import { AdminLoginForm } from "./auth/AdminLoginForm";
import { AdminForgotForm } from "./auth/AdminForgotForm";
import { AdminResetForm } from "./auth/AdminResetForm";

interface AdminAuthCardProps {
  onUnlocked: () => void | Promise<void>;
}

export function AdminAuthCard({ onUnlocked }: AdminAuthCardProps) {
  const [authMode, setAuthMode] = useState<"login" | "forgot" | "reset">("login");
  const resetTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("resetToken");
      if (token) {
        resetTokenRef.current = token;
        setAuthMode("reset");
      }
    }
  }, []);

  if (authMode === "forgot") {
    return <AdminForgotForm onReturnToLogin={() => setAuthMode("login")} />;
  }

  if (authMode === "reset") {
    return (
      <AdminResetForm
        resetToken={resetTokenRef.current}
        onReturnToLogin={() => {
          resetTokenRef.current = null;
          setAuthMode("login");
        }}
      />
    );
  }

  return (
    <AdminLoginForm
      onUnlocked={onUnlocked}
      onForgotPassword={() => setAuthMode("forgot")}
    />
  );
}
