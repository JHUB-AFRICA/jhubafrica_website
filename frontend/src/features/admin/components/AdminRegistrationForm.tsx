import { useState, type FormEvent } from "react";
import { Loader2, UserPlus, RotateCcw } from "lucide-react";
import { createAdminUser } from "../../../../axios/api/admin/users";
import { AdminRegistrationHeader } from "./AdminRegistrationHeader";
import { AdminRegistrationFeedback } from "./AdminRegistrationFeedback";
import { AdminNameFields } from "./AdminNameFields";
import { AdminEmailField } from "./AdminEmailField";
import { AdminPasswordFields } from "./AdminPasswordFields";

interface AdminRegistrationFormProps {
  onAdminCreated: () => void | Promise<void>;
}

function validateAdminRegistration(password: string, confirm: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (password !== confirm) return "Passwords do not match. Please verify both fields.";
  return null;
}

function getRegistrationErrorMessage(error: any): string {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    "Failed to register administrator account. Please check your details and try again."
  );
}

function hasFormValues(values: string[]): boolean {
  return values.some((val) => val.trim().length > 0);
}

export function AdminRegistrationForm({ onAdminCreated }: AdminRegistrationFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const isMinLength = password.length >= 8;
  const isMatch = password.length > 0 && password === confirmPassword;
  const isFilled = Boolean(firstName.trim() && lastName.trim() && email.trim());
  const canSubmit = !isCreating && isMinLength && isMatch && isFilled;
  const isDirty = hasFormValues([firstName, lastName, email, password, confirmPassword]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErr("");
    setSuccess("");
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const validationError = validateAdminRegistration(password, confirmPassword);
    if (validationError) {
      setErr(validationError);
      return;
    }

    try {
      setIsCreating(true);
      await createAdminUser({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "ADMIN",
      });

      setSuccess(`Administrator account for ${firstName.trim()} ${lastName.trim()} was successfully registered!`);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      await onAdminCreated();
    } catch (error: any) {
      console.error("Error creating admin:", error);
      setErr(getRegistrationErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        border: "1px solid var(--border-color)",
        boxShadow: "0 10px 35px -5px rgba(15, 23, 42, 0.06)",
        padding: "2.25rem",
        marginBottom: "3rem",
      }}
    >
      <AdminRegistrationHeader />
      <AdminRegistrationFeedback err={err} success={success} />

      <form onSubmit={handleCreate} style={{ display: "grid", gap: "1.5rem" }}>
        <AdminNameFields
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          disabled={isCreating}
        />

        <AdminEmailField
          email={email}
          setEmail={setEmail}
          disabled={isCreating}
        />

        <AdminPasswordFields
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isMinLength={isMinLength}
          isMatch={isMatch}
          disabled={isCreating}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 700,
              opacity: canSubmit ? 1 : 0.5,
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "opacity 0.2s ease",
            }}
          >
            {isCreating ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
            <span>{isCreating ? "Registering Administrator..." : "Register Administrator"}</span>
          </button>

          {isDirty && (
            <button
              type="button"
              onClick={resetForm}
              disabled={isCreating}
              className="btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                fontSize: "0.9rem",
              }}
            >
              <RotateCcw size={15} />
              <span>Reset Form</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
