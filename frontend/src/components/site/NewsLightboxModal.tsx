import { useEffect } from "react";

interface NewsLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export function NewsLightboxModal({
  isOpen,
  onClose,
  images,
  activeIndex,
  onPrev,
  onNext,
}: NewsLightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onPrev, onNext, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "none",
          border: "none",
          color: "#ffffff",
          fontSize: "2rem",
          cursor: "pointer",
        }}
        title="Close (Esc)"
      >
        ✕
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh", display: "flex", alignItems: "center" }}
      >
        <img
          src={images[activeIndex]}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "85vh",
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={onPrev}
              style={{
                position: "absolute",
                left: "-50px",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={onNext}
              style={{
                position: "absolute",
                right: "-50px",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
