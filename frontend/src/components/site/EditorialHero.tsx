import React, { ReactNode, CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import styles from "../../styles/EditorialHero.module.css";

export interface HeroBadgeItem {
  label: ReactNode;
  icon?: ReactNode;
  variant?: "default" | "sector" | "stage" | "verified" | "accent" | "outline";
  color?: string;
  bg?: string;
  className?: string;
}

export interface HeroBackLinkConfig {
  to?: string;
  href?: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface EditorialHeroProps {
  /** Title / Heading of the hero */
  title: ReactNode;
  /** Subtitle or punchy tagline shown directly under title */
  tagline?: ReactNode;
  /** Body description paragraph */
  description?: ReactNode;
  /** Optional back navigation link / button config or custom node */
  backLink?: HeroBackLinkConfig | ReactNode;
  /** Optional media / SVG illustration / graphic to display in split column */
  media?: ReactNode;
  /** Media column position (default: "left") */
  mediaPosition?: "left" | "right";
  /** Max width for the media frame (e.g. "280px" or 320) */
  mediaMaxWidth?: string | number;
  /** Badges / Meta tags displayed above the heading */
  badges?: Array<HeroBadgeItem | ReactNode> | ReactNode;
  /** Call to action buttons / share buttons */
  actions?: ReactNode;
  /** Alignment of single-column content or content column (default: "left") */
  align?: "left" | "center";
  /** Pre-defined color theme */
  themeVariant?: "default" | "navy" | "green" | "dark" | "emerald";
  /** Custom CSS gradient or background color (overrides themeVariant) */
  customBackground?: string;
  /** Whether to show the subtle radial mesh background overlay (default: true) */
  meshOverlay?: boolean;
  /** Additional elements inside the content column */
  children?: ReactNode;
  /** Bottom slot across full container width (e.g. tabs, anchor navigation) */
  bottomSlot?: ReactNode;
  /** Container max width (default: "1240px") */
  containerMaxWidth?: string | number;
  /** Additional container CSS class */
  className?: string;
  /** Custom inline styles */
  style?: CSSProperties;
}

const themeClassMap: Record<string, string> = {
  default: styles.themeDefault,
  navy: styles.themeNavy,
  green: styles.themeGreen,
  dark: styles.themeDark,
  emerald: styles.themeEmerald,
};

const variantClassMap: Record<string, string> = {
  default: styles.badgeDefault,
  sector: styles.badgeSector,
  stage: styles.badgeStage,
  verified: styles.badgeVerified,
  accent: styles.badgeAccent,
  outline: styles.badgeOutline,
};

function HeroBackLink({ backLink }: { backLink?: HeroBackLinkConfig | ReactNode }) {
  if (!backLink) return null;
  if (React.isValidElement(backLink)) return backLink;

  const config = backLink as HeroBackLinkConfig;
  const icon = config.icon ?? <ArrowLeft size={16} />;

  if (config.to) {
    return (
      <Link to={config.to} className={styles.heroBackLink}>
        {icon}
        <span>{config.label}</span>
      </Link>
    );
  }
  if (config.href) {
    return (
      <a href={config.href} className={styles.heroBackLink}>
        {icon}
        <span>{config.label}</span>
      </a>
    );
  }
  if (config.onClick) {
    return (
      <button type="button" onClick={config.onClick} className={styles.heroBackLink}>
        {icon}
        <span>{config.label}</span>
      </button>
    );
  }
  return null;
}

function HeroBadgeItemComponent({ badge }: { badge: HeroBadgeItem | ReactNode }) {
  if (React.isValidElement(badge)) {
    return badge;
  }

  if (typeof badge === "string" || typeof badge === "number") {
    return (
      <span className={styles.badgeDefault}>
        {badge}
      </span>
    );
  }

  const item = badge as HeroBadgeItem;
  if (!item || !item.label) return null;

  const variantClass = variantClassMap[item.variant || "default"] || styles.badgeDefault;
  const badgeStyle: CSSProperties = {};
  if (item.color) badgeStyle.color = item.color;
  if (item.bg) badgeStyle.backgroundColor = item.bg;

  return (
    <span
      className={`${variantClass} ${item.className || ""}`}
      style={badgeStyle}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
}

function HeroBadges({ badges }: { badges?: Array<HeroBadgeItem | ReactNode> | ReactNode }) {
  if (!badges) return null;
  if (!Array.isArray(badges)) {
    return <div className={styles.heroMetaRow}>{badges}</div>;
  }
  if (badges.length === 0) return null;

  return (
    <div className={styles.heroMetaRow}>
      {badges.map((b, i) => {
        const key = React.isValidElement(b) && b.key
          ? String(b.key)
          : typeof b === "string" || typeof b === "number"
            ? `badge-val-${b}`
            : (b as any)?.label && typeof (b as any).label === "string"
              ? `${(b as any).variant || "default"}-${(b as any).label}`
              : `badge-slot-${i}`;
        return <HeroBadgeItemComponent key={key} badge={b} />;
      })}
    </div>
  );
}

function HeroMedia({ media, maxWidth }: { media?: ReactNode; maxWidth?: string | number }) {
  if (!media) return null;

  const frameStyle: CSSProperties = {};
  if (maxWidth) {
    frameStyle.maxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  }

  return (
    <div className={styles.heroMediaCol}>
      <div className={styles.heroMediaFrame} style={frameStyle}>
        {typeof media === "string" ? (
          <img src={media} alt="Hero media" className={styles.heroMediaMedia} />
        ) : (
          media
        )}
      </div>
    </div>
  );
}

function HeroContentColumn({
  title,
  tagline,
  description,
  badges,
  actions,
  isCentered,
  children,
}: {
  title: ReactNode;
  tagline?: ReactNode;
  description?: ReactNode;
  badges?: Array<HeroBadgeItem | ReactNode> | ReactNode;
  actions?: ReactNode;
  isCentered: boolean;
  children?: ReactNode;
}) {
  const isH1 = React.isValidElement(title) && (title.type === "h1" || (typeof title.type === "string" && title.type === "h1"));
  const isTaglineP = React.isValidElement(tagline) && tagline.type === "p";
  const isDescP = React.isValidElement(description) && description.type === "p";

  return (
    <div className={`${styles.heroContentCol} ${isCentered ? styles.centerAligned : ""}`}>
      <HeroBadges badges={badges} />

      {isH1 ? title : <h1 className={styles.heroHeading}>{title}</h1>}

      {tagline && (isTaglineP ? tagline : <p className={styles.heroTagline}>{tagline}</p>)}

      {description && (isDescP ? description : <p className={styles.heroSummary}>{description}</p>)}

      {actions && <div className={styles.heroActionsRow}>{actions}</div>}

      {children}
    </div>
  );
}

export function EditorialHero({
  title,
  tagline,
  description,
  backLink,
  media,
  mediaPosition = "left",
  mediaMaxWidth,
  badges,
  actions,
  align = "left",
  themeVariant = "default",
  customBackground,
  meshOverlay = true,
  children,
  bottomSlot,
  containerMaxWidth,
  className = "",
  style,
}: EditorialHeroProps) {
  const selectedThemeClass = themeClassMap[themeVariant] || styles.themeDefault;
  const isCentered = align === "center";

  const containerStyle: CSSProperties = {
    ...style,
    ...(customBackground ? { background: customBackground } : {}),
  };

  const innerStyle: CSSProperties = containerMaxWidth
    ? { maxWidth: typeof containerMaxWidth === "number" ? `${containerMaxWidth}px` : containerMaxWidth }
    : {};

  const content = (
    <HeroContentColumn
      title={title}
      tagline={tagline}
      description={description}
      badges={badges}
      actions={actions}
      isCentered={isCentered}
    >
      {children}
    </HeroContentColumn>
  );

  return (
    <section
      className={`${styles.heroEditorial} ${selectedThemeClass} ${className}`}
      style={containerStyle}
    >
      {meshOverlay && <div className={styles.heroMeshOverlay} />}

      <div className={styles.heroInner} style={innerStyle}>
        <HeroBackLink backLink={backLink} />

        {media ? (
          <div
            className={`${styles.heroSplitGrid} ${
              mediaPosition === "right" ? styles.mediaRight : ""
            }`}
          >
            {mediaPosition === "left" && <HeroMedia media={media} maxWidth={mediaMaxWidth} />}
            {content}
            {mediaPosition === "right" && <HeroMedia media={media} maxWidth={mediaMaxWidth} />}
          </div>
        ) : (
          <div className={`${styles.heroSingleCol} ${isCentered ? styles.centerAligned : ""}`}>
            {content}
          </div>
        )}

        {bottomSlot && <div className={styles.heroBottomSlot}>{bottomSlot}</div>}
      </div>
    </section>
  );
}

export default EditorialHero;
