import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { getNewsBySlug } from "../../axios/api/news";
import { NewsPost } from "../types/news";
import { RichContentRenderer } from "../components/ui/RichContentRenderer";
import ResourceFallback from "../components/site/ResourceFallback";
import EditorialHero from "../components/site/EditorialHero";
import { NewsLightboxModal } from "../components/site/NewsLightboxModal";

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

  return (
    <>
      <EditorialHero
        themeVariant="dark"
        backLink={{
          to: "/news",
          label: "Back to News & Updates",
        }}
        badges={[
          {
            label: post.tag,
            variant: "sector",
          },
          {
            label: post.date,
            variant: "outline",
          },
        ]}
        title={post.title}
        description={post.excerpt}
      />

      <section className="content-section" style={{ maxWidth: "860px", margin: "0 auto", paddingBottom: "4rem" }}>
        {/* Multi-Image Gallery Area */}
        <div style={{ marginBottom: "2.5rem" }}>
          {/* Main Active Image Display */}
          <div
            style={{
              position: "relative",
              borderRadius: "0.75rem",
              overflow: "hidden",
              maxHeight: "420px",
              maxWidth: "85%",
              margin: "0 auto",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              backgroundColor: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              aria-label="Enlarge active photo in lightbox view"
              onClick={() => setIsLightboxOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "zoom-in",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <img
                src={allImages[activeIndex]}
                alt={`${post.title} (${activeIndex + 1} of ${allImages.length})`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "420px",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                }}
              />
            </button>

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
                  key={`thumb-${imgUrl}`}
                  type="button"
                  aria-label={`View photo ${idx + 1} of ${allImages.length}`}
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
                    transition: "opacity 0.2s ease, border-color 0.2s ease",
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
            fontSize: "0.92rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "var(--jhub-blue)" }}>
            <span style={{ width: "20px", height: "2px", backgroundColor: "var(--jhub-green)" }}></span>
            By {post.author || "JHUB Editorial Team"}
          </div>
          {post.date && (
            <>
              <span style={{ color: "var(--border-color, #cbd5e1)" }}>•</span>
              <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                {post.date}
              </span>
            </>
          )}
          <span style={{ color: "var(--border-color, #cbd5e1)" }}>•</span>
          <span style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
            Jomo Kenyatta University of Agriculture and Technology (JKUAT)
          </span>
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
      <NewsLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={allImages}
        activeIndex={activeIndex}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </>
  );
}
