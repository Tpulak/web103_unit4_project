import express from 'express'
import {
    getTrims,
    getExteriorColors,
    getExteriorColorById,
    getInteriorColors,
    getWheels,
    getFeatures
} from '../controllers/optionsController.js'

const router = express.Router()

router.get('/trims', getTrims)
router.get('/exterior-colors', getExteriorColors)
router.get('/exterior-colors/:id', getExteriorColorById)
router.get('/interior-colors', getInteriorColors)
router.get('/wheels', getWheels)
router.get('/features', getFeatures)

export default router
