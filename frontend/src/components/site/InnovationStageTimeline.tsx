import styles from "../../styles/IndividualInnovation.module.css";

const STAGES = ["Concept", "Prototype", "Pilot", "Market entry", "Scale"];

interface InnovationStageTimelineProps {
  currentStage?: string;
}

export function InnovationStageTimeline({ currentStage = "" }: InnovationStageTimelineProps) {
  const currentStageIndex = STAGES.findIndex(
    (s) => s.toLowerCase() === currentStage.toLowerCase()
  );
  const activeStageIdx = currentStageIndex >= 0 ? currentStageIndex : 0;

  return (
    <section className={styles['stepper-strip']}>
      <div className={styles['stepper-strip-header']}>
        <span>Venture Incubation Lifecycle</span>
        <span style={{ color: "var(--jhub-green, #10b981)", fontWeight: 700 }}>
          Current Milestone: {currentStage || "Concept"}
        </span>
      </div>

      <div className={styles['stepper-track']}>
        {STAGES.map((s, idx) => {
          const isCompleted = idx < activeStageIdx;
          const isActive = idx === activeStageIdx;
          return (
            <div
              key={s}
              className={`${styles['stepper-step']} ${
                isActive
                  ? styles['step-active']
                  : isCompleted
                  ? styles['step-completed']
                  : ""
              }`}
            >
              <div className={styles['stepper-bar']} />
              <span className={styles['step-title']}>{s}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
