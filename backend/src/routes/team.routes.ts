import { Router } from 'express'
import { validate } from '../middleware/validate.middleware.js'
import { teamQuerySchema } from '../schemas/team.schema.js'
import { getTeamMembers, getTeamMember } from '../controllers/team.controller.js'

export const teamRouter = Router()

// GET /team-members
teamRouter.get('/', validate(teamQuerySchema, 'query'), getTeamMembers)

// GET /team-members/:id
teamRouter.get('/:id', getTeamMember)

export default teamRouter
