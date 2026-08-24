import { Router } from 'express'
import { addImage, reorderImages, deleteImage } from '../../controllers/admin/images.controller.js'

export const adminImagesRouter = Router({ mergeParams: true })

// /api/v1/admin/:resource/:id/images
adminImagesRouter.post('/:resource/:id/images', addImage)

// /api/v1/admin/:resource/:id/images/reorder
adminImagesRouter.patch('/:resource/:id/images/reorder', reorderImages)

// /api/v1/admin/:resource/images/:imageId
adminImagesRouter.delete('/:resource/images/:imageId', deleteImage)

export default adminImagesRouter
