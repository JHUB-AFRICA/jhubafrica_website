-- =========================================================
-- JHUB AFRICA: Team Members Table Creation & Seed Script
-- Run this in the Supabase Dashboard -> SQL Editor
-- =========================================================

-- 1. Create Enum Type if not exists
DO $$ BEGIN
  CREATE TYPE "JHubTeamCategory" AS ENUM ('ADVISORY_BOARD', 'DEV_TEAM', 'EXECUTIVE', 'MENTORS', 'SECRETARIAT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create jhub_team_members Table
CREATE TABLE IF NOT EXISTS "jhub_team_members" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "bio" TEXT,
  "avatar_url" TEXT,
  "avatar_thumb" TEXT,
  "category" "JHubTeamCategory" NOT NULL DEFAULT 'EXECUTIVE',
  "order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Configure Row Level Security (RLS)
ALTER TABLE "jhub_team_members" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view team members" ON "jhub_team_members";
CREATE POLICY "Public can view team members" ON "jhub_team_members" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage team members" ON "jhub_team_members";
CREATE POLICY "Service role can manage team members" ON "jhub_team_members" USING (true) WITH CHECK (true);

-- 4. Seed all 18 JHUB Africa Team Members
INSERT INTO "jhub_team_members" ("id", "name", "title", "category", "avatar_url", "avatar_thumb", "bio", "order")
VALUES
(
  'lawrence-nderu',
  'Dr. Lawrence Nderu',
  'Founder and Project Lead',
  'EXECUTIVE',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/DrLawrenceNderu-scaled.jpg.jpeg',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/DrLawrenceNderu-scaled.jpg.jpeg',
  'Project Lead with extensive experience as Chairman, Lecturer, and Researcher in AI/ML and Software Engineering. A Digital Ecosystem Builder and Founder of JKIAN Hub, serving as a Digital Africa Connector.',
  1
),
(
  'rehema-ndeda',
  'Dr. Rehema Ndeda',
  'Co-Founder, Climate Smart Agriculture/ Automation Lead/JKUAT',
  'EXECUTIVE',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/rehema-ndeda.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/rehema-ndeda-150x150.webp',
  'Mechatronics Engineer with a specialization on automation, currently focusing on development and testing of technologies related to precision agriculture.',
  2
),
(
  'mwangi-karanja',
  'Dr. Mwangi Karanja',
  'Innovative Technology and Data Science Lead',
  'EXECUTIVE',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/mwangi-karanja.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/mwangi-karanja-150x150.webp',
  'An Innovative technology diffusion expert with a background in computing, research and innovation management. Have trained Small scale entrepreneurs on data management and research-driven approaches to growth.',
  3
),
(
  'william-murithi',
  'Dr. William Murithi',
  'DIH Business Development/ Strategy Lead',
  'EXECUTIVE',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/will-muriithi.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/will-muriithi-150x150.webp',
  'An expert in business model innovation, digital entrepreneurship & innovation and design thinking. Founder and Lead consultant at EMBC, a premier management consulting firm that offers bespoke and integrated solutions for enterprises.',
  4
),
(
  'john-kinyuru',
  'Dr. John Kinyuru',
  'Research, and Innovation Development Lead, JKUAT',
  'EXECUTIVE',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/john-kinyuru.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/john-kinyuru.webp',
  'Dr John Kinyuru is an esteemed Food and Nutrition Scientist with great leadership and project management capabilities. Director of research and innovation at Jomo Kenyatta University of Agriculture and Technology(JKUAT), and researcher in Agriculture, food, and nutrition. A food systems and nutrition-sensitive agriculture expert, he is typically the insect hunter(specialist of edible insects), passionate about food security through research and implementation. Dr John Kinyuru is a key member of the JHUB Africa project whose role will transform the food and nutrition ecosystem.',
  5
),
(
  'simon-mwangi',
  'Simon Mwangi',
  'Strategic Partnerships and Product Associate, Hub Manager',
  'SECRETARIAT',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/Simon-JHUB.jpeg',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/Simon-JHUB.jpeg',
  'Simon oversees Strategic Partnerships, product management, and communications at JHUB Africa, and manages the hub’s daily operations. He holds a Master’s in Business Administration from JKUAT and has certifications in Artificial Intelligence Career Essentials and Data Analytics from ALX.',
  6
),
(
  'daisy-ondwari',
  'Ms. Daisy Ondwari',
  'Product Development Fellow',
  'SECRETARIAT',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/ondwari-daisy.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/ondwari-daisy-150x150.webp',
  'Ms. Daisy Ondwari, as a Product Development Fellow, serves as the voice of the customer. Her role extends beyond user interface experience, questioning and shaping products to align with user needs.',
  7
),
(
  'catherine-muraga',
  'Catherine Muraga',
  'Managing Director, Microsoft ADC',
  'ADVISORY_BOARD',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/cate-muraga.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/cate-muraga-150x150.webp',
  'Catherine is a purpose-driven tech executive, presently holding the position of Managing Director at Microsoft ADC. In this role, she spearheads a team dedicated to crafting impactful products and services on a global scale. Catherine’s particular focus lies in advancing STEM education in Africa, reflecting her commitment to driving positive change through technology.',
  8
),
(
  'noumbessy-ghislain',
  'Noumbessy Ghislain',
  'Innovation Hub Leader, Bosch EA',
  'ADVISORY_BOARD',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/noumbessy.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/noumbessy-150x150.webp',
  'Ghislain Noumbessy is a visionary professional who has been with BOSCH, working in different capacities. His rich experience working across different regions in Africa make him one of the most knowledgeable individuals on the problems the continent encounters. Noumbessy believes that Africa can move beyond being a consumer of technologies to being creators of it. Currently the Innovation Hub Leader at Bosch EA, he is passionate about nurturing innovations across the region as a way to find suitable solutions to the unique problems we face.',
  9
),
(
  'irene-kimani',
  'Irene Kimani',
  'ICT Specialist & Data Manager, KALRO',
  'ADVISORY_BOARD',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/irene-kimani.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/irene-kimani.webp',
  'Irene Kimani is an ICT Specialist and Data Manager at the Kenya Agriculture and Livestock Research Organization(KALRO). She has expertise in the ICT field, Data Science, Big Data, Artificial Intelligence, and research informatics. She is passionate about innovations and development, especially in the agricultural sector. Irene’s proficiency in agricultural extension services and weather intel has been vital for for digitization of the food, and her role in the JHUB Africa team is valuable.',
  10
),
(
  'priscilla-muiruri',
  'Priscilla Muiruri',
  'Technical Advisor, Ministry of Agriculture & Livestock Development',
  'ADVISORY_BOARD',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/priscilla-C1euf-1.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/priscilla-C1euf-1.webp',
  'Priscilla is a professional Technical Advisor, Ministry of Agriculture & Livestock Development, a Technical Advisor in the Cabinet Secretary’s Office and coordinates the National Food Systems Transformation Working with innovative solutions.',
  11
),
(
  'mariana-bozesan',
  'Dr Mariana Bozesan',
  'AI Pioneer, Integral Investor, Tech Entrepreneur',
  'ADVISORY_BOARD',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/mariana-bozesan.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/mariana-bozesan-150x150.webp',
  'Dr. Mariana Bozesan is an award-winning integral investor, an AI pioneer, and a successful serial tech-entrepreneur who is leveraging exponentially growing technologies to decarbonize the global economy and accelerate the implementation of the UN SDGs within Planetary Boundaries. She studied Computer Science and AI at Stanford University and the Karlsruhe Institute of Technology of which she is a Prominent Alumna. She is also the recipient of the Golden Angelina Award, as Europe’s Female Angel Investor of 2019 and became the Best European Early stage Investor of the Year 2016 awarded by EBAN, the European Business Angel Network. She is also full member of the prominent international Club of Rome, Fellow of the World Academy of Art and Science, and authored several books including Integral Investing: From Profit to Prosperity, a report to the Club of Rome.',
  12
),
(
  'dominique-kavuisya',
  'Dominique Kavuisya',
  'CEO & Co-founder, Taimba Limited',
  'MENTORS',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/kavuisya-dominique.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/kavuisya-dominique-150x150.webp',
  'An accomplished IT practitioner with over 15 years of experience across US and sub-Saharan Africa, deploying transformational digital solutions. Interested in supply chains, route to market models, fintech & eCommerce.',
  13
),
(
  'samuel-kamochu',
  'Samuel Kamochu',
  'CEO & Co-founder, Meliora Technologies Limited',
  'MENTORS',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/kamochu.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/kamochu.webp',
  'Passionate about Africa and the mission is to empower the next generation of software engineers in Kenya and in the continent of Africa. Shares about personal and professional experiences and opinions. Recently recognised by Business Daily Africa as Top 40 under 40 Men in Kenya in 2022. Happy to continue bringing hope to many!',
  14
),
(
  'brewster-barclay',
  'Brewster Barclay',
  'AWS Partner Manager & Business Development Director, Zuhlke Engineering Ltd',
  'MENTORS',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/Brewster-CbhlanwK.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/Brewster-CbhlanwK-150x150.webp',
  'Brewster F. Barclay is an experienced C-level executive with over 40 years in high technology and software industries, specializing in strategic product sales, marketing, business development and new product launches. With extensive global experience, he has held senior roles in companies like Zuhlke Engineering and e2v PLC and managed Clickstream Technologies. Barclay has been a dedicated mentor and advisor to numerous technology startups through programs such as the Royal Academy of Engineering Enterprise Hub and Accelerate Cambridge. His expertise spans mentoring in deep tech, engineering, software startups and advisory roles in cutting-edge sectors like AI, med-tech and cleantech. Barclay holds an MBA from INSED and a BA in Engineering and Economics from Oxford University.',
  15
),
(
  'wilson-gichuhi',
  'Wilson Gichuhi',
  'Fullstack Software Engineer',
  'DEV_TEAM',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/wilson-gichuhi.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/wilson-gichuhi-150x150.webp',
  'Wilson Gichuhi, a Fullstack Software Engineer, dedicated to web, cross-platform mobile solution,cloud-first development, and open-source contribution. He often finds joy in tinkering with various tools and technologies.',
  16
),
(
  'sonia-lomo',
  'Sonia Lomo',
  'Web Developer',
  'DEV_TEAM',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/sonia.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/sonia-150x150.webp',
  'Sonia is a passionate Software Developer with a Computer Science degree. Her journey began with lines of code and blossomed into a love for creating elegant solutions. Armed with years of experience, she thrives on building robust applications and contributing to the open-source community. When she’s not immersed in code, you’ll find him spending time with his feline friends, indulging in his slight obsession with cats.',
  17
),
(
  'derrick-obwatsa',
  'Derrick Obwatsa',
  'DevOps Engineer',
  'DEV_TEAM',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/obwatsa.webp',
  'https://civzobuofwhgpudtlnjm.supabase.co/storage/v1/object/public/team-members/obwatsa-150x150.webp',
  'A Computer Science major and skilled DevOps engineer, I specialize in backend development and infrastructure automation. My expertise includes designing and implementing APIs using PHP, Node.js, Python, and Java. I excel in setting up servers, orchestrating CI/CD pipelines, and containerizing applications with Docker and Kubernetes. My troubleshooting skills ensure seamless performance, and I’m passionate about continuous learning.',
  18
)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "title" = EXCLUDED."title",
  "category" = EXCLUDED."category",
  "avatar_url" = EXCLUDED."avatar_url",
  "avatar_thumb" = EXCLUDED."avatar_thumb",
  "bio" = EXCLUDED."bio",
  "order" = EXCLUDED."order",
  "updated_at" = NOW();
