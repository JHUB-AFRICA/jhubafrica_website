import { Request, Response, NextFunction } from 'express';
import {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../services/team.service.js';

export async function adminGetTeamMembers(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.query as { category?: string };
    const data = await getAllTeamMembers(category);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function adminGetTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await getTeamMemberById(id);
    if (!data) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, title, bio, avatarUrl, avatarThumb, category, order } = req.body;
    if (!name || !title) {
      return res.status(400).json({ error: 'Name and title are required' });
    }

    const data = await createTeamMember({
      name,
      title,
      bio,
      avatarUrl,
      avatarThumb,
      category,
      order: Number(order) || 0,
    });

    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await updateTeamMember(id, req.body);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await deleteTeamMember(id);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (err) {
    next(err);
  }
}
