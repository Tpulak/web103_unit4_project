import express from 'express'
import {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from '../controllers/carsController.js'

const router = express.Router()

router.get('/cars', getAllCars)
router.get('/cars/:id', getCarById)
router.post('/cars', createCar)
router.patch('/cars/:id', updateCar)
router.delete('/cars/:id', deleteCar)

export default router
