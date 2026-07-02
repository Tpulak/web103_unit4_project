import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCar, deleteCar } from '../services/CarsAPI'
import { formatPrice } from '../utilities/calcPrice'
import '../App.css'
import '../css/CarPages.css'

const CarDetails = ({ title }) => {
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

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this car?')) {
            return
        }

        try {
            await deleteCar(id)
            navigate('/customcars')
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <p className="loading-message">Loading car details...</p>
    }

    if (error || !car) {
        return <p className="error-message">{error || 'Car not found'}</p>
    }

    return (
        <main className="car-page">
            <div className="car-layout">
                <div className="car-preview">
                    <div
                        className="car-preview-box"
                        style={{ backgroundColor: car.exterior_color_hex }}
                    >
                        🏎️
                    </div>
                    <div className="car-preview-details">
                        <h1>{car.name}</h1>
                        <p className="price-display">{formatPrice(car.total_price)}</p>
                    </div>
                </div>

                <article>
                    <header>
                        <h2>Configuration Details</h2>
                    </header>
                    <ul className="detail-list">
                        <li><strong>Trim:</strong> {car.trim_name} ({formatPrice(car.base_price)})</li>
                        <li>
                            <strong>Exterior:</strong>{' '}
                            <span className="color-swatch" style={{ backgroundColor: car.exterior_color_hex }} />
                            {car.exterior_color_name} (+{formatPrice(car.exterior_color_price)})
                        </li>
                        <li><strong>Interior:</strong> {car.interior_color_name}</li>
                        <li><strong>Wheels:</strong> {car.wheels_name} (+{formatPrice(car.wheels_price)})</li>
                        <li>
                            <strong>Features:</strong>{' '}
                            {car.features?.length
                                ? car.features.map((feature) => feature.name).join(', ')
                                : 'None selected'}
                        </li>
                        <li><strong>Created:</strong> {new Date(car.created_at).toLocaleDateString()}</li>
                    </ul>
                    <footer className="car-actions">
                        <Link to={`/edit/${car.id}`} role="button">Edit</Link>
                        <button type="button" onClick={handleDelete}>Delete</button>
                        <Link to="/customcars" role="button">Back to List</Link>
                    </footer>
                </article>
            </div>
        </main>
    )
}

export default CarDetails
