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
  // Theme class selection
  const themeClassMap: Record<string, string> = {
    default: styles.themeDefault,
    navy: styles.themeNavy,
    green: styles.themeGreen,
    dark: styles.themeDark,
    emerald: styles.themeEmerald,
  };

  const selectedThemeClass = themeClassMap[themeVariant] || styles.themeDefault;
  const isCentered = align === "center";

  // Render Back Link
  const renderBackLink = () => {
    if (!backLink) return null;

    if (React.isValidElement(backLink)) {
      return backLink;
    }

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
        <button
          type="button"
          onClick={config.onClick}
          className={styles.heroBackLink}
        >
          {icon}
          <span>{config.label}</span>
        </button>
      );
    }

    return null;
  };

  // Render Single Badge
  const renderBadge = (badge: HeroBadgeItem | ReactNode, index: number) => {
    if (React.isValidElement(badge)) {
      return React.cloneElement(badge, { key: badge.key ?? index });
    }

    if (typeof badge === "string" || typeof badge === "number") {
      return (
        <span key={index} className={styles.badgeDefault}>
          {badge}
        </span>
      );
    }

    const item = badge as HeroBadgeItem;
    if (!item || !item.label) return null;

    const variantClassMap: Record<string, string> = {
      default: styles.badgeDefault,
      sector: styles.badgeSector,
      stage: styles.badgeStage,
      verified: styles.badgeVerified,
      accent: styles.badgeAccent,
      outline: styles.badgeOutline,
    };

    const variantClass = variantClassMap[item.variant || "default"] || styles.badgeDefault;

    const badgeStyle: CSSProperties = {};
    if (item.color) badgeStyle.color = item.color;
    if (item.bg) badgeStyle.backgroundColor = item.bg;

    return (
      <span
        key={index}
        className={`${variantClass} ${item.className || ""}`}
        style={badgeStyle}
      >
        {item.icon}
        <span>{item.label}</span>
      </span>
    );
  };

  // Render Badges Row
  const renderBadges = () => {
    if (!badges) return null;

    if (Array.isArray(badges)) {
      if (badges.length === 0) return null;
      return (
        <div className={styles.heroMetaRow}>
          {badges.map((b, i) => renderBadge(b, i))}
        </div>
      );
    }

    return <div className={styles.heroMetaRow}>{badges}</div>;
  };

  // Render Media
  const renderMedia = () => {
    if (!media) return null;

    const frameStyle: CSSProperties = {};
    if (mediaMaxWidth) {
      frameStyle.maxWidth = typeof mediaMaxWidth === "number" ? `${mediaMaxWidth}px` : mediaMaxWidth;
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
  };

  // Content Column
  const contentColumn = (
    <div className={`${styles.heroContentCol} ${isCentered ? styles.centerAligned : ""}`}>
      {renderBadges()}

      {React.isValidElement(title) && (title.type === "h1" || (typeof title.type === "string" && title.type === "h1")) ? (
        title
      ) : (
        <h1 className={styles.heroHeading}>{title}</h1>
      )}

      {tagline && (
        React.isValidElement(tagline) && tagline.type === "p" ? (
          tagline
        ) : (
          <p className={styles.heroTagline}>{tagline}</p>
        )
      )}

      {description && (
        React.isValidElement(description) && description.type === "p" ? (
          description
        ) : (
          <p className={styles.heroSummary}>{description}</p>
        )
      )}

      {actions && <div className={styles.heroActionsRow}>{actions}</div>}

      {children}
    </div>
  );

  const containerStyle: CSSProperties = { ...style };
  if (customBackground) {
    containerStyle.background = customBackground;
  }

  const innerStyle: CSSProperties = {};
  if (containerMaxWidth) {
    innerStyle.maxWidth = typeof containerMaxWidth === "number" ? `${containerMaxWidth}px` : containerMaxWidth;
  }

  return (
    <section
      className={`${styles.heroEditorial} ${selectedThemeClass} ${className}`}
      style={containerStyle}
    >
      {meshOverlay && <div className={styles.heroMeshOverlay} />}

      <div className={styles.heroInner} style={innerStyle}>
        {renderBackLink()}

        {media ? (
          <div
            className={`${styles.heroSplitGrid} ${
              mediaPosition === "right" ? styles.mediaRight : ""
            }`}
          >
            {mediaPosition === "left" && renderMedia()}
            {contentColumn}
            {mediaPosition === "right" && renderMedia()}
          </div>
        ) : (
          <div className={`${styles.heroSingleCol} ${isCentered ? styles.centerAligned : ""}`}>
            {contentColumn}
          </div>
        )}

        {bottomSlot && <div className={styles.heroBottomSlot}>{bottomSlot}</div>}
      </div>
    </section>
  );
}

export default EditorialHero;
