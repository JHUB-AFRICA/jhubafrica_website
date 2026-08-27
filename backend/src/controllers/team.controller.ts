import { Request, Response, NextFunction } from 'express';
import { getAllTeamMembers, getTeamMemberById } from '../services/team.service.js';

export async function getTeamMembers(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.query as { category?: string };
    const data = await getAllTeamMembers(category);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function getTeamMember(req: Request, res: Response, next: NextFunction) {
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
