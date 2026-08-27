import { Router } from 'express';
import {
  adminGetTeamMembers,
  adminGetTeamMember,
  adminCreateTeamMember,
  adminUpdateTeamMember,
  adminDeleteTeamMember,
} from '../../controllers/admin/team.controller.js';

export const adminTeamRouter = Router();

// GET /api/v1/admin/team-members
adminTeamRouter.get('/', adminGetTeamMembers);

// GET /api/v1/admin/team-members/:id
adminTeamRouter.get('/:id', adminGetTeamMember);

// POST /api/v1/admin/team-members
adminTeamRouter.post('/', adminCreateTeamMember);

// PUT /api/v1/admin/team-members/:id
adminTeamRouter.put('/:id', adminUpdateTeamMember);

// DELETE /api/v1/admin/team-members/:id
adminTeamRouter.delete('/:id', adminDeleteTeamMember);

export default adminTeamRouter;
