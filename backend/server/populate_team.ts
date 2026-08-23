import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing keys!")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const members = [
  // Executive
  {
    name: "Dr. Lawrence Nderu",
    title: "Director, JHUB Africa",
    bio: "Leading digital transformation and innovation strategy at JKUAT.",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
    category: "EXECUTIVE"
  },
  {
    name: "Dr. Joseph Muliaro",
    title: "Deputy Director, JHUB Africa",
    bio: "Senior technology strategist and academic coordinator.",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    category: "EXECUTIVE"
  },
  // Advisory Board
  {
    name: "Prof. Victoria Wambui Ngumi",
    title: "Advisory Board Chair",
    bio: "Vice Chancellor of Jomo Kenyatta University of Agriculture and Technology.",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
    category: "ADVISORY_BOARD"
  },
  {
    name: "Dr. Kamau Gachigi",
    title: "Board Member & Founder Gearbox",
    bio: "Expert in digital fabrication, makerspaces and agritech scaling.",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256",
    category: "ADVISORY_BOARD"
  },
  // Secretariat
  {
    name: "Jane Wanjiku",
    title: "Hub Coordinator",
    bio: "Managing daily hub communications, partners relationships and community programs.",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256",
    category: "SECRETARIAT"
  },
  {
    name: "Kelvin Kiprotich",
    title: "Operations Assistant",
    bio: "Coordinating lab access, resource bookings and administrative scheduling.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    category: "SECRETARIAT"
  },
  // Dev Team
  {
    name: "Mary Mutua",
    title: "Fullstack Engineer",
    bio: "Building the digital infrastructure and student enrollment portals.",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    category: "DEV_TEAM"
  },
  {
    name: "Edwin Kimathi",
    title: "IoT Systems Engineer",
    bio: "Designing NPKS soil sensors and ESP32 telemetry hardware integrations.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
    category: "DEV_TEAM"
  },
  // Mentors
  {
    name: "George Njuguna",
    title: "Agritech Lead Mentor",
    bio: "Providing technical mentorship in farming analytics and soil monitoring.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    category: "MENTORS"
  },
  {
    name: "Faith Chepngeno",
    title: "Business Development Coach",
    bio: "Helping innovators refine business plans, pitch proposals and seek seed investment.",
    avatar_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=256",
    category: "MENTORS"
  }
]

async function populate() {
  console.log("🌱 Seeding JHub team members...")
  
  // Clear first
  const { error: deleteError } = await supabase
    .from('jhub_team_members')
    .delete()
    .neq('name', 'placeholder-non-existent') // Matches everything
    
  if (deleteError) {
    console.error("❌ Error clearing existing members:", deleteError)
    process.exit(1)
  }
  console.log("🧹 Existing members cleared.")

  const { data, error } = await supabase
    .from('jhub_team_members')
    .insert(members)
    .select()

  if (error) {
    console.error("❌ Error inserting team members:", error)
  } else {
    console.log("✅ Seeded successfully!")
    console.log(data)
  }
}

populate()
