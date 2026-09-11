import { Skeleton } from "@/components/ui/skeleton";

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
            opacity: 0.85,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {hasImage && (
            <Skeleton className="h-[180px] w-full rounded-xl mb-4" />
          )}
          <Skeleton className="h-6 w-3/5 rounded-md mb-3" />
          <Skeleton className="h-4 w-full rounded mb-2" />
          <Skeleton className="h-4 w-4/5 rounded mb-5" />
          <Skeleton className="h-9 w-28 rounded-full mt-auto" />
        </div>
      ))}
    </div>
  );
}
