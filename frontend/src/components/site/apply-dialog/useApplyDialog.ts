import { useState, FormEvent } from "react";
import { ApplyFormData, initialForm, RoleOption } from "./types";
import { submitApplication, submitInnovationSubmission } from "../../../../axios/api/applications";

export function useApplyDialog(setOpen: (open: boolean) => void, source?: string) {
  const [formData, setFormData] = useState<ApplyFormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen && status === "success") {
      setFormData(initialForm);
      setStatus("idle");
      setFeedback("");
    }
  };

  const updateField = (field: keyof ApplyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (role: RoleOption) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setFeedback("Please fill out all required fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setFeedback("Sending your request...");

    const isInnovator = formData.role === "Innovator" || source === "For Innovators Page";

    if (isInnovator) {
      const STAGE_MAP_FE_TO_BE = {
        Concept: "IDEA",
        Prototype: "PROTOTYPE",
        Pilot: "PILOT",
        "Market entry": "SCALING",
        Scale: "MATURE",
      } as const;

      const mappedStage = STAGE_MAP_FE_TO_BE[formData.stage || "Concept"];
      const title = formData.innovationTitle?.trim() || "";
      const sector = formData.sector?.trim() || "";
      const problem = formData.problem?.trim() || "";
      const solution = formData.solution?.trim() || "";
      const need = formData.need?.trim() || "";
      const teamInfo = formData.message.trim();

      if (title.length < 3) {
        setFeedback("Innovation Title must be at least 3 characters long.");
        setStatus("error");
        return;
      }
      if (!sector) {
        setFeedback("Please specify a Sector.");
        setStatus("error");
        return;
      }
      if (problem.length < 10) {
        setFeedback("Problem description must be at least 10 characters long.");
        setStatus("error");
        return;
      }
      if (solution.length < 10) {
        setFeedback("Solution summary must be at least 10 characters long.");
        setStatus("error");
        return;
      }
      if (need.length < 5) {
        setFeedback("Support requirements details must be at least 5 characters long.");
        setStatus("error");
        return;
      }
      if (teamInfo.length < 5) {
        setFeedback("Message (team info) must be at least 5 characters long.");
        setStatus("error");
        return;
      }

      try {
        await submitInnovationSubmission({
          contactName: formData.fullName.trim(),
          contactEmail: formData.email.trim(),
          phone: formData.phone.trim(),
          title,
          sector,
          stage: mappedStage,
          problem,
          solution,
          supportRequired: need,
          teamInfo,
          projectLinks: "",
          attachmentUrl: "",
        });
        setStatus("success");
        setFeedback("Thanks! Your innovation proposal has been submitted successfully.");
        setTimeout(() => setOpen(false), 1400);
      } catch (error) {
        console.error(error);
        setStatus("error");
        setFeedback("Unable to submit your proposal. Please try again later.");
      }
    } else {
      try {
        await submitApplication({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          message: formData.message.trim(),
          source: source || "ApplyDialog",
        });
        setStatus("success");
        setFeedback("Thanks for applying! Our team will reach out to you shortly.");
        setTimeout(() => setOpen(false), 1400);
      } catch (error) {
        console.error(error);
        setStatus("error");
        setFeedback("Unable to submit your application right now. Please try again later.");
      }
    }
  }

  return {
    formData,
    status,
    feedback,
    updateField,
    handleRoleSelect,
    handleSubmit,
    handleOpenChange,
    isInnovator: formData.role === "Innovator" || source === "For Innovators Page",
  };
}
