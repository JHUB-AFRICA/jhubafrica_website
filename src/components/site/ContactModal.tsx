"use client";

import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function ContactModal({ isOpen, onClose, source = "General" }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
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
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            reason: "Student",
            message: "",
          });
        }, 2000);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ margin: 0, padding: 0 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal Content - Resizable */}
      <div 
        className="relative bg-white rounded-lg shadow-xl p-10 overflow-auto" 
        style={{ 
          width: "90%",
          maxWidth: "800px", 
          minWidth: "400px", 
          height: "auto", 
          maxHeight: "95vh", 
          resize: "both", 
          margin: 0,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-xl"
          style={{ margin: 0, padding: 0 }}
        >
          ✕
        </button>
        
        <div className="mb-7" style={{ margin: 0, padding: 0 }}>
          <h2 className="text-2xl font-bold text-gray-900" style={{ margin: 0, padding: 0 }}>Get a Quote / Contact Us</h2>
        </div>

        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-6" style={{ margin: 0, padding: 0 }}>
            <div style={{ margin: 0, padding: 0 }}>
              <label htmlFor="fullName" className="text-base font-semibold text-gray-800 block mb-2" style={{ margin: 0, padding: 0 }}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-700"
                style={{ margin: 0 }}
              />
            </div>

            <div style={{ margin: 0, padding: 0 }}>
              <label htmlFor="email" className="text-base font-semibold text-gray-800 block mb-2" style={{ margin: 0, padding: 0 }}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                required
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-700"
                style={{ margin: 0 }}
              />
            </div>

            <div style={{ margin: 0, padding: 0 }}>
              <label htmlFor="phone" className="text-base font-semibold text-gray-800 block mb-2" style={{ margin: 0, padding: 0 }}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-700"
                style={{ margin: 0 }}
              />
            </div>

            <div style={{ margin: 0, padding: 0 }}>
              <label htmlFor="reason" className="text-base font-semibold text-gray-800 block mb-2" style={{ margin: 0, padding: 0 }}>
                Who you are <span className="text-red-500">*</span>
              </label>
              <select
                required
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-700 bg-white"
                style={{ margin: 0 }}
              >
                <option value="Student">Student</option>
                <option value="Innovator">Innovator</option>
                <option value="Partner">Partner</option>
                <option value="Sponsor">Sponsor</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            <div style={{ margin: 0, padding: 0 }}>
              <label htmlFor="message" className="text-base font-semibold text-gray-800 block mb-2" style={{ margin: 0, padding: 0 }}>
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-gray-700 resize-vertical"
                style={{ margin: 0 }}
              />
            </div>

            <div className="pt-3" style={{ margin: 0, padding: 0 }}>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold text-lg"
                style={{ margin: 0 }}
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
