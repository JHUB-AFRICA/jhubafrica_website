import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { supabase, supabaseAdmin } from '../config/supabase.js';

export interface TeamMemberData {
  id: string;
  name: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  avatarThumb?: string | null;
  category: 'ADVISORY_BOARD' | 'DEV_TEAM' | 'EXECUTIVE' | 'MENTORS' | 'SECRETARIAT';
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPossibleDataPaths(): string[] {
  return [
    path.resolve(__dirname, '../../data/jhubteam.json'),
    path.resolve(__dirname, '../../../data/jhubteam.json'),
    path.resolve(__dirname, '../../../../data/jhubteam.json'),
    path.resolve(process.cwd(), 'data/jhubteam.json'),
    path.resolve(process.cwd(), 'backend/data/jhubteam.json'),
  ];
}

function getDataFilePath(): string {
  for (const p of getPossibleDataPaths()) {
    if (fs.existsSync(p)) return p;
  }
  return path.resolve(process.cwd(), 'backend/data/jhubteam.json');
}

function ensureDataFile(): TeamMemberData[] {
  try {
    const dataPath = getDataFilePath();
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('[TeamService] Error reading fallback file:', e);
  }
  return [];
}

function saveDataFile(data: TeamMemberData[]) {
  try {
    const dataPath = getDataFilePath();
    if (!fs.existsSync(path.dirname(dataPath))) {
      fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    }
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('[TeamService] Error writing fallback file:', e);
  }
}

export async function getAllTeamMembers(category?: string): Promise<TeamMemberData[]> {
  try {
    if (supabaseAdmin) {
      let query = supabaseAdmin
        .from('jhub_team_members')
        .select('*')
        .order('order', { ascending: true })
        .order('name', { ascending: true });

      if (category && category !== 'ALL') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((m: any) => ({
          id: m.id,
          name: m.name,
          title: m.title,
          bio: m.bio,
          avatarUrl: m.avatar_url,
          avatarThumb: m.avatar_thumb || m.avatar_url,
          category: m.category,
          order: m.order ?? 0,
          createdAt: m.created_at,
          updatedAt: m.updated_at,
        }));
      }
    }
  } catch (e) {
    console.warn('[TeamService] Supabase query fallback:', e);
  }

  // Safe fallback to local store
  try {
    let items = ensureDataFile();
    if (category && category !== 'ALL') {
      items = items.filter((m) => m.category === category);
    }
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (err) {
    console.error('[TeamService] Error retrieving team members:', err);
    return [];
  }
}

export async function getTeamMemberById(id: string): Promise<TeamMemberData | null> {
  try {
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('jhub_team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          title: data.title,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          avatarThumb: data.avatar_thumb || data.avatar_url,
          category: data.category,
          order: data.order ?? 0,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }
  } catch (e) {
    // Ignore and fallback
  }

  try {
    const items = ensureDataFile();
    return items.find((m) => m.id === id) || null;
  } catch {
    return null;
  }
}

export async function createTeamMember(payload: Partial<TeamMemberData>): Promise<TeamMemberData> {
  const newMember: TeamMemberData = {
    id: payload.id || crypto.randomUUID(),
    name: payload.name || 'New Member',
    title: payload.title || 'Role Title',
    bio: payload.bio || '',
    avatarUrl: payload.avatarUrl || null,
    avatarThumb: payload.avatarThumb || payload.avatarUrl || null,
    category: (payload.category as any) || 'EXECUTIVE',
    order: Number(payload.order) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Try saving to Supabase
  try {
    if (supabaseAdmin) {
      await supabaseAdmin.from('jhub_team_members').insert({
        id: newMember.id,
        name: newMember.name,
        title: newMember.title,
        bio: newMember.bio,
        avatar_url: newMember.avatarUrl,
        avatar_thumb: newMember.avatarThumb,
        category: newMember.category,
        order: newMember.order,
      });
    }
  } catch (e) {
    console.warn('[TeamService] Supabase insert failed, stored locally:', e);
  }

  // Always keep local store updated
  const items = ensureDataFile();
  items.push(newMember);
  saveDataFile(items);

  return newMember;
}

export async function updateTeamMember(id: string, payload: Partial<TeamMemberData>): Promise<TeamMemberData> {
  const existing = (await getTeamMemberById(id)) || {
    id,
    name: '',
    title: '',
    category: 'EXECUTIVE' as const,
  };

  const updated: TeamMemberData = {
    ...existing,
    ...payload,
    id,
    avatarThumb: payload.avatarThumb || payload.avatarUrl || existing.avatarThumb || existing.avatarUrl,
    updatedAt: new Date().toISOString(),
  };

  // Try updating in Supabase
  try {
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('jhub_team_members')
        .update({
          name: updated.name,
          title: updated.title,
          bio: updated.bio,
          avatar_url: updated.avatarUrl,
          avatar_thumb: updated.avatarThumb,
          category: updated.category,
          order: updated.order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    }
  } catch (e) {
    console.warn('[TeamService] Supabase update failed:', e);
  }

  // Update local store
  let items = ensureDataFile();
  const index = items.findIndex((m) => m.id === id);
  if (index >= 0) {
    items[index] = updated;
  } else {
    items.push(updated);
  }
  saveDataFile(items);

  return updated;
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    if (supabaseAdmin) {
      await supabaseAdmin.from('jhub_team_members').delete().eq('id', id);
    }
  } catch (e) {
    console.warn('[TeamService] Supabase delete failed:', e);
  }

  let items = ensureDataFile();
  items = items.filter((m) => m.id !== id);
  saveDataFile(items);
  return true;
}
