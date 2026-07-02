import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CarForm from '../components/CarForm'
import { createCar } from '../services/CarsAPI'
import '../App.css'
import '../css/CarPages.css'

const CreateCar = ({ title }) => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = title
    }, [title])

    const handleSubmit = async (carData) => {
        const newCar = await createCar(carData)
        navigate(`/customcars/${newCar.id}`)
    }

    return (
        <main className="car-page">
            <header>
                <h1>Customize Your Bolt</h1>
                <p>Build your dream Chevrolet Bolt EV with trim, color, wheels, and features.</p>
            </header>
            <CarForm onSubmit={handleSubmit} submitLabel="Create Car" />
        </main>
    )
}

export default CreateCar
