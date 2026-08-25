import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { getNewsBySlug } from "../../axios/api/news";
import { NewsPost } from "../types/news";
import { RichContentRenderer } from "../components/ui/RichContentRenderer";
import ResourceFallback from "../components/site/ResourceFallback";

export const Route = createFileRoute("/news/$slug")({
  head: (ctx: { loaderData?: NewsPost }) => {
    const post = ctx.loaderData;
    return {
      meta: [
        { title: post ? `${post.title} — JHub Africa News` : "News — JHub Africa" },
        {
          name: "description",
          content: post ? post.excerpt : "Latest JHub Africa news.",
        },
        { property: "og:title", content: post ? post.title : "News — JHub Africa" },
        {
          property: "og:description",
          content: post ? post.excerpt : "Announcements, partnerships and stories.",
        },
      ],
    };
  },
  loader: async ({ params }) => {
    return getNewsBySlug(params.slug);
  },
  component: NewsDetailPage,
  errorComponent: ({ error, reset }) => (
    <ResourceFallback
      error={error}
      onRetry={reset}
      resourceName="News Article"
      isFullPage={true}
    />
  ),
});

function NewsDetailPage() {
  const post: NewsPost = Route.useLoaderData();

  // Normalize all available images
  const allImages: string[] = (() => {
    if (post.images && post.images.length > 0) {
      return post.images.map((img) => (typeof img === "string" ? img : img.url));
    }
    if (post.image) {
      return [post.image];
    }
    return ["https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=1200"];
  })();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  }, [allImages.length]);

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  }, [allImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, prevImage, nextImage]);

  return (
    <>
      <header className="page-header" style={{ position: "relative" }}>
        <Link
          to="/news"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--jhub-green)",
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          ← Back to News
        </Link>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
          <span
            className={`badge badge-${post.color}`}
            style={{ textTransform: "uppercase", fontSize: "0.8rem", fontWeight: 700 }}
          >
            {post.tag}
          </span>
          <span style={{ fontSize: "0.9rem", color: "#64748b" }}>· {post.date}</span>
        </div>
        <h1 style={{ marginTop: 0, fontSize: "2.5rem", color: "var(--jhub-blue)", lineHeight: 1.2 }}>
          {post.title}
        </h1>
        {post.excerpt && (
          <p
            style={{
              fontSize: "1.15rem",
              color: "#475569",
              lineHeight: "1.6",
              fontWeight: 500,
              marginTop: "1rem",
            }}
          >
            {post.excerpt}
          </p>
        )}
      </header>

      <section className="content-section" style={{ maxWidth: "860px", margin: "0 auto", paddingBottom: "4rem" }}>
        {/* Multi-Image Gallery Area */}
        <div style={{ marginBottom: "2.5rem" }}>
          {/* Main Active Image Display */}
          <div
            style={{
              position: "relative",
              borderRadius: "0.75rem",
              overflow: "hidden",
              height: "440px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              backgroundColor: "#0f172a",
              cursor: "zoom-in",
            }}
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={allImages[activeIndex]}
              alt={`${post.title} - image ${activeIndex + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
            />

            {/* Photo Counter Badge */}
            {allImages.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "20px",
                  backdropFilter: "blur(4px)",
                }}
              >
                {activeIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Navigation Arrows for Main Display */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    border: "none",
                    borderRadius: "50%",
                    width: "38px",
                    height: "38px",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  title="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    border: "none",
                    borderRadius: "50%",
                    width: "38px",
                    height: "38px",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                  title="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip (Rendered when there are 2 or more images) */}
          {allImages.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                overflowX: "auto",
                padding: "0.75rem 0",
                marginTop: "0.5rem",
                scrollbarWidth: "thin",
              }}
            >
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    border: activeIndex === idx ? "2px solid var(--jhub-green, #10b981)" : "2px solid transparent",
                    borderRadius: "8px",
                    overflow: "hidden",
                    width: "110px",
                    height: "75px",
                    padding: 0,
                    cursor: "pointer",
                    flexShrink: 0,
                    opacity: activeIndex === idx ? 1 : 0.65,
                    transition: "all 0.2s ease",
                    backgroundColor: "#f1f5f9",
                  }}
                >
                  <img src={imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Editorial Byline */}
        <div
          style={{
            fontWeight: 700,
            color: "var(--jhub-blue)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ width: "24px", height: "2px", backgroundColor: "var(--jhub-green)" }}></span>
          By {post.author || "JHUB Editorial Team"}
        </div>

        {/* Article Body Content (Supports TipTap Rich JSON & Plaintext) */}
        <RichContentRenderer
          content={post.body}
          contentJson={post.contentJson}
        />

        {/* Back navigation footer */}
        <div style={{ marginTop: "3.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
          <Link
            to="/news"
            className="btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            ← Back to News
          </Link>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
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
            onClick={() => setIsLightboxOpen(false)}
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
              src={allImages[activeIndex]}
              alt=""
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            />

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
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
                  onClick={nextImage}
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
      )}
    </>
  );
}
