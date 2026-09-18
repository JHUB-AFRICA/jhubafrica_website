import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpeg";
import image3 from "../../assets/images/image3.jpeg";
import image4 from "../../assets/images/image4.jpeg";
import image5 from "../../assets/images/image5.jpeg";
import styles from "../../styles/Home.module.css";

const HERO_IMAGES = [image1, image2, image3, image4, image5];

const HOMEPAGE_METRICS = [
  { n: "2023", l: "Established", suffix: "" },
  { n: "2024", l: "Launched", suffix: "" },
  { n: 400, l: "Innovators", suffix: "+" },
  { n: 56, l: "Current Innovations", suffix: "" },
  { n: 11, l: "Existing Copyrights", suffix: "" },
] as const;

const numberFormatter = new Intl.NumberFormat("en-US");

function formatCount(value: number, metric: { n: number | string }) {
  if (typeof metric.n === "string" && (metric.n === "2023" || metric.n === "2024")) {
    return String(value);
  }
  return numberFormatter.format(value);
}

export function HomeHeroSlideshow() {
  const [slides, setSlides] = useState<
    { id: number; imageIndex: number; state: "visible" | "entering" }[]
  >([{ id: 0, imageIndex: 0, state: "visible" }]);
  const [counts, setCounts] = useState(() =>
    Array(HOMEPAGE_METRICS.length).fill(0),
  );
  const slideCounter = useRef(1);
  const currentImageIndex = useRef(0);

  useEffect(() => {
    const metricTargets = HOMEPAGE_METRICS.map((m) =>
      typeof m.n === "number"
        ? m.n
        : Number(String(m.n).replace(/[^0-9]/g, "")),
    );
    let cancelled = false;
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      if (cancelled) return;
      const progress = Math.min((now - start) / duration, 1);
      setCounts(
        metricTargets.map((value) => Math.round(value * progress)),
      );
      if (progress < 1) window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextIndex =
        (currentImageIndex.current + 1) % HERO_IMAGES.length;
      currentImageIndex.current = nextIndex;
      const newId = slideCounter.current++;

      setSlides((prev) => [
        ...prev,
        { id: newId, imageIndex: nextIndex, state: "entering" },
      ]);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlides((prev) =>
            prev.map((s) =>
              s.state === "entering" ? { ...s, state: "visible" } : s,
            ),
          );
        });
      });

      setTimeout(() => {
        setSlides((prev) => {
          const last = prev[prev.length - 1];
          return last ? [{ ...last, state: "visible" }] : prev;
        });
      }, 1400);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={styles['hero-bg']}>
      {slides.map((slide) => (
        <div
          key={slide.id}
          className={`${styles['hero-bg-layer']} ${
            slide.state === "visible"
              ? styles['hero-bg-layer--visible']
              : styles['hero-bg-layer--entering']
          }`}
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(8,20,45,0.72), rgba(8,20,45,0.55)), url(${HERO_IMAGES[slide.imageIndex]})`,
          }}
        />
      ))}
      <section className={`${styles['hero-section']} ${styles['hero-on-image']}`}>
        <div className={styles['hero-kicker']}>Africa's Innovation Hub</div>
        {/* eslint-disable-next-line */}
        <h1>
          Africa's Innovation Hub for <span>Turning Ideas into Impact</span>
        </h1>
        <p className={styles['hero-sub']}>
          JHUB Africa empowers innovators, builds solutions and partners across
          sectors to address Africa’s most pressing challenges and create
          sustainable economic growth.
        </p>
        <div className={styles['hero-actions']}>
          <Link to="/innovation" className="btn-primary">
            Explore Innovations
          </Link>
          <Link to="/for-partners" className="btn-outline">
            Partner With Us
          </Link>
        </div>
      </section>

      <div className={`${styles['stats-bar']} ${styles['stats-on-image']}`}>
        {HOMEPAGE_METRICS.map((m, index) => (
          <div key={m.l} className={`${styles.stat} ${styles['metric-card']}`}>
            <div className={styles['stat-n']}>
              {formatCount(counts[index], m)}
              {m.suffix}
            </div>
            <div className={styles['stat-l']}>{m.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
