/**
 * JHUB Africa — Partner data (shared across home + about pages)
 *
 * Sources: jhubafrica.com, techmoran.com, tech-ish.com, techtrendske.co.ke,
 *          expression.africa, kabarak.ac.ke, campusbiz.co.ke, capitalfm.africa,
 *          educationnews.co.ke, afrilabs.com, vc4a.com, kiep.go.ke
 */

export interface Partner {
    name: string;
    /** 1–3 letter abbreviation for logo circle */
    abbr: string;
    /** CSS colour for the logo circle bg */
    color: string;
    /** One-line role of the partner */
    role: string;
    /** Partnership type tag */
    type: "Industry" | "Development" | "Academic" | "Network" | "Government";
    /** What the partnership achieved */
    outcome: string;
    /** Optional short case-study blurb */
    caseStudy?: string;
    /** Optional URL to partner website */
    url?: string;
}

export const PARTNERS: Partner[] = [
    {
        name: "Samsung Electronics",
        abbr: "S",
        color: "#1428a0",
        role: "Samsung Innovation Campus — AI, IoT & Big Data skills training",
        type: "Industry",
        outcome: "Training 80 learners annually (50% women) in AI, IoT, Big Data and programming through the Samsung Innovation Campus at JKUAT.",
        caseStudy: "Launched in November 2025, the Samsung Innovation Campus (SIC) at JKUAT provides hands-on training in Fourth Industrial Revolution skills. The MoU mandates 50% female enrolment and targets students from underprivileged backgrounds, bridging Kenya's digital divide.",
        url: "https://www.samsung.com",
    },
    {
        name: "Zoho Corporation",
        abbr: "Z",
        color: "#e42527",
        role: "Cloud tools, credits & business technology training for startups",
        type: "Industry",
        outcome: "Provides Zoho Wallet Credits (up to KES 100,000) for 55+ cloud products and specialised training in CRM, low-code development and financial management.",
        caseStudy: "Zoho equips JHUB innovators with enterprise-grade SaaS tools at zero cost, enabling early-stage startups to run CRM, invoicing and project management without upfront licensing fees — accelerating their path to market.",
        url: "https://www.zoho.com",
    },
    {
        name: "AMREF Health Africa",
        abbr: "A",
        color: "#00a651",
        role: "AI-powered healthcare innovation for underserved communities",
        type: "Development",
        outcome: "Co-developing AI health solutions — GlycoSafe, MyGlooco, BomaAI and MediBotAI — translating academic research into real-world healthcare impact.",
        caseStudy: "In June 2025, AMREF and JHUB Africa partnered to review and scale student-led health innovations. Projects like MediBotAI (AI-driven triage) and GlycoSafe (glucose monitoring) are being piloted to serve underserved communities in rural Kenya.",
        url: "https://amref.org",
    },
    {
        name: "World Bank (SKIES / KIEP)",
        abbr: "WB",
        color: "#002244",
        role: "Funding Kenya's innovation & entrepreneurship ecosystem via SKIES program",
        type: "Development",
        outcome: "Deployed Rapid Tech Skills Training through the SKIES program, training students in software engineering, data science, cybersecurity and entrepreneurship.",
        caseStudy: "The SKIES (Strengthening Kenya's Innovation and Entrepreneurship Ecosystem) program, a sub-component of the World Bank-funded KIEP, selected JHUB Africa to deliver rapid tech skills training — equipping graduates with job-ready digital competencies.",
        url: "https://www.worldbank.org",
    },
    {
        name: "Huawei",
        abbr: "H",
        color: "#cf0a2c",
        role: "ICT Academy & global ICT skills competition",
        type: "Industry",
        outcome: "Runs the Huawei ICT Academy at JKUAT, with students winning the 2026 Huawei ICT Competition Grand Prize.",
        caseStudy: "The Huawei ICT Academy embedded at JKUAT provides advanced certification training. In 2026, JKUAT students won the global Huawei ICT Competition Grand Prize — a testament to the quality of talent emerging from the JHUB ecosystem.",
        url: "https://www.huawei.com",
    },
    {
        name: "AfriLabs",
        abbr: "AL",
        color: "#f5821f",
        role: "Pan-African innovation hub network membership",
        type: "Network",
        outcome: "JHUB Africa is a member of the AfriLabs network — a community of 400+ innovation hubs across 52 African countries, enabling resource sharing and continental collaboration.",
        url: "https://afrilabs.com",
    },
    {
        name: "SPACE-SI Slovenia",
        abbr: "SI",
        color: "#005da4",
        role: "Climate intelligence hub using satellite data & digital twins",
        type: "Government",
        outcome: "Inaugurated 'The Conduit' — a 6-metre climate intelligence hub using satellite data and digital twin models for river basin management and environmental resilience.",
        caseStudy: "In June 2025, JHUB Africa and Slovenia's SPACE-SI Centre of Excellence launched The Conduit (Conduit@Empathy), applying satellite earth observation and digital twin technology to monitor Kenya's river basins and support climate adaptation.",
        url: "https://www.space.si",
    },
    {
        name: "Bosch East Africa",
        abbr: "B",
        color: "#e20015",
        role: "Industry partnership for IoT and engineering innovation",
        type: "Industry",
        outcome: "Collaborates on IoT-driven projects and provides industry mentorship for engineering innovations within the JHUB ecosystem.",
        url: "https://www.bosch.co.ke",
    },
    {
        name: "Power Learn Project",
        abbr: "PLP",
        color: "#6c3fc5",
        role: "Digital skills training & software development empowerment",
        type: "Network",
        outcome: "Partners with JHUB Africa to deliver coding bootcamps and digital literacy programs, expanding the pipeline of skilled tech talent.",
        url: "https://powerlearnproject.org",
    },
    {
        name: "Kabarak University",
        abbr: "KU",
        color: "#8b0000",
        role: "Academic benchmarking & innovation ecosystem exchange",
        type: "Academic",
        outcome: "Conducted benchmarking tours and collaborative exchanges to share insights on building resilient startup ecosystems and aligning research with industry.",
        caseStudy: "Kabarak University's delegation visited JHUB Africa to study its 6-stage innovation framework, with both institutions committing to joint hackathons, student exchanges and shared incubation resources.",
        url: "https://www.kabarak.ac.ke",
    },
    {
        name: "JICA",
        abbr: "JC",
        color: "#00549f",
        role: "Technical cooperation for research & innovation infrastructure",
        type: "Government",
        outcome: "Supports JKUAT's research infrastructure and capacity building through ongoing technical cooperation programs in Kenya.",
        url: "https://www.jica.go.jp",
    },
    {
        name: "Westcon Africa",
        abbr: "W",
        color: "#0077c8",
        role: "Technology distribution & enterprise solutions support",
        type: "Industry",
        outcome: "Provides enterprise technology solutions and distribution support for JHUB Africa's digital infrastructure needs.",
    },
    {
        name: "Tabarin Consulting",
        abbr: "TC",
        color: "#2c3e50",
        role: "Strategic advisory & consulting for innovation programs",
        type: "Industry",
        outcome: "Offers strategic consulting and advisory services to strengthen JHUB Africa's program design and stakeholder engagement.",
    },
];

/** Partner type tag colours */
export const TYPE_COLORS: Record<Partner["type"], string> = {
    Industry: "var(--jhub-blue)",
    Development: "var(--jhub-green)",
    Academic: "#8b5cf6",
    Network: "#f59e0b",
    Government: "#0ea5e9",
};
