interface SkeletonCardsProps {
  count?: number;
  hasImage?: boolean;
}

export default function SkeletonCards({ count = 3, hasImage = false }: SkeletonCardsProps) {
  return (
    <div className="cards-grid" style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="prog-card"
          style={{
            borderStyle: "solid",
            borderColor: "var(--border-color)",
            opacity: 0.7,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {hasImage && (
            <div
              className="skeleton-pulse"
              style={{
                height: "180px",
                borderRadius: "8px",
                marginBottom: "1rem",
                width: "100%",
              }}
            />
          )}
          <div
            className="skeleton-pulse"
            style={{
              height: "22px",
              width: "60%",
              borderRadius: "6px",
              marginBottom: "1rem",
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              height: "15px",
              width: "90%",
              borderRadius: "4px",
              marginBottom: "0.5rem",
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              height: "15px",
              width: "80%",
              borderRadius: "4px",
              marginBottom: "1.5rem",
            }}
          />
          <div
            className="skeleton-pulse"
            style={{
              height: "30px",
              width: "40%",
              borderRadius: "999px",
              marginTop: "auto",
            }}
          />
        </div>
      ))}
    </div>
  );
}
