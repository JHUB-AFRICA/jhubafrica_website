import { PARTNERS } from "../../data/impact";
import jkuatLogo from "../../assets/partners/jkuat.jpeg";
import googleLogo from "../../assets/partners/google.jpeg";
import microsoftLogo from "../../assets/partners/Microsoft.jpeg";
import aedibnetLogo from "../../assets/partners/aedibnet.jpeg";
import fundingboxLogo from "../../assets/partners/fb-logo.jpeg";
import impactafricaLogo from "../../assets/partners/AfricaImpactNetwork.jpeg";
import assekLogo from "../../assets/partners/assek.jpeg";
import afrakenLogo from "../../assets/partners/afraken.jpeg";
import numeraliotLogo from "../../assets/partners/numeraliot.jpeg";
import taimbaLogo from "../../assets/partners/taimba.jpeg";
import yattaLogo from "../../assets/partners/yatta-beekeepers.jpeg";
import zohoLogo from "../../assets/partners/zoho.jpeg";
import samsungLogo from "../../assets/partners/sumsung.jpeg";
import oracleLogo from "../../assets/partners/oracle.jpeg";
import amrefLogo from "../../assets/partners/amref.png";

const LOGOS: Record<string, string> = {
  JKUAT: jkuatLogo,
  Google: googleLogo,
  Microsoft: microsoftLogo,
  "AEDIB|NET": aedibnetLogo,
  FundingBox: fundingboxLogo,
  "Impact Africa Network": impactafricaLogo,
  ASSEK: assekLogo,
  Afraken: afrakenLogo,
  "Numeral IoT": numeraliotLogo,
  Taimba: taimbaLogo,
  "Yatta Beekeepers": yattaLogo,
  Zoho: zohoLogo,
  Samsung: samsungLogo,
  Oracle: oracleLogo,
  AMREF: amrefLogo,
};

type Props = {
  title?: string;
  eyebrow?: string;
  intro?: string;
  compact?: boolean;
};

export default function PartnersSection({
  title = "Our partners",
  eyebrow = "Ecosystem",
  intro = "JHUB Africa works with universities, industry leaders and development partners to move innovations from idea to impact.",
  compact = false,
}: Props) {
  return (
    <section className="content-section">
      <div className="section-eyebrow">{eyebrow}</div>
      <h2 className="section-h2">{title}</h2>
      <p className="section-p">{intro}</p>

      <div className="partner-logos" aria-label="Partner organisations">
        {PARTNERS.map((p) => {
          const partnerContent = (
            <>
              {LOGOS[p.name] ? (
                <img
                  src={LOGOS[p.name]}
                  alt={`${p.name} logo`}
                  className="partner-logo-img"
                  loading="lazy"
                />
              ) : (
                <span className="partner-logo-mark" aria-hidden="true">
                  {p.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")}
                </span>
              )}
              <span className="partner-logo-name">{p.name}</span>
            </>
          );

          return p.url ? (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="partner-logo"
            >
              {partnerContent}
            </a>
          ) : (
            <div key={p.name} className="partner-logo">
              {partnerContent}
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="cards-grid cards-grid--spaced">
          {PARTNERS.map((p) => (
            <article key={p.name} className="prog-card">
              <div className="prog-title">{p.name}</div>
              <p className="prog-desc">
                <strong>Outcome:</strong> {p.outcome}
              </p>
              <p className="prog-desc">{p.caseStudy}</p>
              {p.url && (
                <div className="prog-meta">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prog-arrow"
                  >
                    Visit {p.name} →
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
