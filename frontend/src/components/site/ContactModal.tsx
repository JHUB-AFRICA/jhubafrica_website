"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { submitContactInquiry } from "../../../axios/api/contact";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function ContactModal({ isOpen, onClose, source = "General" }: ContactModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    reason: "Student",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First try standard axios API helper
      try {
        await submitContactInquiry({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          category: formData.reason,
          subject: `Contact Modal Inquiry (${source})`,
          message: formData.message.trim(),
          preferredResponseChannel: "email",
        });
      } catch {
        // Fallback to fetch /api/contact
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            source,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to submit inquiry");
        }
      }

      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        reason: "Student",
        message: "",
      });
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your inquiry. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[92vw] max-w-[600px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xl">
        <DialogHeader className="mb-6 space-y-1 text-left">
          <DialogTitle className="text-2xl font-black text-[#0f2d59] tracking-tight">
            Get in Touch
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            Have a question, partnership proposal, or want to join? Leave your details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-[#0f2d59]">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="First and Last Name"
              disabled={loading}
              className="w-full h-[46px] px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#0f2d59]">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                required
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#0f2d59]">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254 720 000 000"
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider text-[#0f2d59]">
              Who you are <span className="text-red-500">*</span>
            </label>
            <select
              required
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-[46px] px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="Student">Student</option>
              <option value="Innovator">Innovator</option>
              <option value="Partner">Partner</option>
              <option value="Sponsor">Sponsor</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-[#0f2d59]">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows={4}
              disabled={loading}
              className="w-full min-h-[110px] p-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-vertical disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              <span>{loading ? "Sending Message..." : "Send Message"}</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
