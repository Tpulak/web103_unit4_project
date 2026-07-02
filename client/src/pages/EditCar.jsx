import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CarForm from '../components/CarForm'
import { getCar, updateCar } from '../services/CarsAPI'
import '../App.css'
import '../css/CarPages.css'

const EditCar = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        const loadCar = async () => {
            try {
                const data = await getCar(id)
                setCar(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadCar()
    }, [id])

    const handleSubmit = async (carData) => {
        await updateCar(id, carData)
        navigate(`/customcars/${id}`)
    }

    if (loading) {
        return <p className="loading-message">Loading car...</p>
    }

    if (error || !car) {
        return <p className="error-message">{error || 'Car not found'}</p>
    }

    const initialValues = {
        name: car.name,
        trim_id: car.trim_id,
        exterior_color_id: car.exterior_color_id,
        interior_color_id: car.interior_color_id,
        wheels_id: car.wheels_id,
        feature_ids: (car.features || []).map((feature) => feature.id)
    }

    return (
        <main className="car-page">
            <header>
                <h1>Edit {car.name}</h1>
                <p>Update your custom Bolt EV configuration.</p>
            </header>
            <CarForm
                key={car.id}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                submitLabel="Update Car"
            />
        </main>
    )
}

export default EditCar
