// Single approved impact metric sheet for JHUB Africa.
// Update numbers here — every page reads from this file.
// Source: jhubafrica.com (official) and JHUB Africa partnerships desk.

export const IMPACT_METRICS = [
  { n: "142", l: "Innovators Supported" },
  { n: "20", l: "Active Innovations" },
  { n: "6+", l: "Strategic Partners" },
  { n: "3", l: "Registered Copyrights" },
] as const;

export const FOUNDED_YEAR = 2023;

export type Partner = {
  name: string;
  sector: string;
  outcome: string;
  caseStudy: string;
  url?: string;
  logo?: string;
};

export const PARTNERS: Partner[] = [
  {
    name: "JKUAT",
    sector: "Host University",
    outcome: "Hosts JHUB Africa, provides labs, faculty and graduate talent.",
    caseStudy:
      "As the anchor institution, Jomo Kenyatta University of Agriculture and Technology gives innovators access to engineering, agriculture and business faculties, campus infrastructure and a pipeline of student researchers.",
    url: "https://www.jkuat.ac.ke",
  },
  {
    name: "Google",
    sector: "Technology",
    outcome: "Cloud credits, developer tooling and mentorship for JHUB startups.",
    caseStudy:
      "Google supports JHUB innovators with access to Google for Startups resources, Cloud credits and developer expertise, helping teams build and scale digital products.",
    url: "https://startup.google.com",
  },
  {
    name: "Microsoft",
    sector: "Technology",
    outcome: "Azure credits and AI tooling for early-stage ventures.",
    caseStudy:
      "Through the Microsoft for Startups Founders Hub, JHUB innovators access Azure credits, GitHub Enterprise, OpenAI models and go-to-market support to accelerate product development.",
    url: "https://www.microsoft.com/startups",
  },
  {
    name: "AEDIB|NET",
    sector: "EU–Africa Innovation",
    outcome: "Connects JHUB into the African-European Digital Innovation Bridge Network.",
    caseStudy:
      "AEDIB|NET links JHUB Africa with European Digital Innovation Hubs, opening cross-continental funding calls, matchmaking and knowledge exchange for Kenyan innovators.",
    url: "https://aedibnet.eu",
  },
  {
    name: "FundingBox",
    sector: "Innovation Funding",
    outcome: "Access to EU-backed cascade funding calls for African startups.",
    caseStudy:
      "FundingBox partners with JHUB to channel European cascade-funding opportunities to Kenyan innovators, providing grants, community and expert support for digital ventures.",
    url: "https://fundingbox.com",
  },
  {
    name: "Impact Africa Network",
    sector: "Venture Building",
    outcome: "Joint venture-building programs for high-impact African founders.",
    caseStudy:
      "Impact Africa Network collaborates with JHUB on founder development, connecting innovators to a pan-African venture builder network focused on solving local problems at scale.",
    url: "https://impactafrica.network",
  },
  {
    name: "ASSEK",
    sector: "Industry Association",
    outcome: "Plugs JHUB into the Association of Startup and SME Enablers of Kenya.",
    caseStudy:
      "As a member of ASSEK, JHUB Africa contributes to national policy dialogue, ecosystem coordination and shared standards that strengthen Kenya's startup enablers.",
    url: "https://assek.or.ke",
  },
  {
    name: "Afraken",
    sector: "Franco-Kenyan Network",
    outcome: "Bridges JHUB innovators to French alumni, mentors and partners.",
    caseStudy:
      "The Association of France Alumni in Kenya (Afraken) connects JHUB to French institutions, expertise and mobility programs, opening European partnerships for Kenyan innovators.",
    url: "https://afraken.org",
  },
  {
    name: "Numeral IoT",
    sector: "IoT & Hardware",
    outcome: "Technical partner for IoT prototyping and deployment.",
    caseStudy:
      "Numeral IoT provides JHUB innovators with IoT hardware expertise, connectivity and prototyping support, accelerating projects in agriculture, health and smart infrastructure.",
    url: "https://numeraliot.com",
  },
  {
    name: "Taimba",
    sector: "AgriTech",
    outcome: "Portfolio partner scaling B2B agriculture logistics.",
    caseStudy:
      "Taimba, a mobile-based platform connecting smallholder farmers directly with urban retailers, works with JHUB on ecosystem programs and mentorship for agritech founders.",
    url: "https://taimba.co.ke",
  },
  {
    name: "Yatta Beekeepers",
    sector: "AgriTech / Community",
    outcome: "Grassroots partner piloting digital tools for smallholder beekeepers.",
    caseStudy:
      "Yatta Beekeepers works with JHUB Africa to test and deploy digital monitoring, traceability and market-access tools for honey producers in Machakos, translating hub innovations into rural livelihoods.",
  },
  {
    name: "Zoho",
    sector: "Business Software",
    outcome: "KES 100,000 in Zoho Wallet credits for JHUB innovators.",
    caseStudy:
      "Zoho supports startups incubated at JHUB with wallet credits redeemable across Zoho's productivity, CRM and finance suite — cutting early operating costs for founders.",
    url: "https://www.zoho.com",
  },
];