import { Router } from 'express'
import adminInnovationsRouter from './admin.innovations.js'
import adminCoursesRouter from './admin.courses.js'
import adminEventsRouter from './admin.events.js'
import adminPartnersRouter from './admin.partners.js'
import adminUsersRouter from './admin.users.js'
import adminNewsRouter from './admin.news.js'
import adminUploadsRouter from './admin.uploads.js'
import adminImagesRouter from './admin.images.js'

export const adminRouter = Router()

// Mount admin resource routers
adminRouter.use('/innovations', adminInnovationsRouter)
adminRouter.use('/courses', adminCoursesRouter)
adminRouter.use('/events', adminEventsRouter)
adminRouter.use('/partners', adminPartnersRouter)
adminRouter.use('/users', adminUsersRouter)
adminRouter.use('/news', adminNewsRouter)
adminRouter.use('/uploads', adminUploadsRouter)
adminRouter.use('/', adminImagesRouter)

export default adminRouter
