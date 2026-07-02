import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCars, deleteCar } from '../services/CarsAPI'
import { formatPrice } from '../utilities/calcPrice'
import '../App.css'
import '../css/CarPages.css'

const ViewCars = ({ title }) => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        document.title = title
    }, [title])

    const loadCars = async () => {
        try {
            setLoading(true)
            const data = await getAllCars()
            setCars(data)
            setError('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCars()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this car?')) {
            return
        }

        try {
            await deleteCar(id)
            setCars((current) => current.filter((car) => car.id !== id))
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <p className="loading-message">Loading custom cars...</p>
    }

    return (
        <main className="car-page">
            <header>
                <h1>Your Custom Cars</h1>
                <p>View, edit, or delete your saved Bolt EV configurations.</p>
            </header>

            {error && <div className="error-message">{error}</div>}

            {!cars.length ? (
                <div className="empty-message">
                    <p>No custom cars yet.</p>
                    <Link to="/" role="button">Create Your First Car</Link>
                </div>
            ) : (
                <div className="car-grid">
                    {cars.map((car) => (
                        <article className="car-card" key={car.id}>
                            <header>
                                <h3>{car.name}</h3>
                                <p>
                                    <span
                                        className="color-swatch"
                                        style={{ backgroundColor: car.exterior_color_hex }}
                                    />
                                    {car.trim_name} • {car.exterior_color_name}
                                </p>
                            </header>
                            <p>{formatPrice(car.total_price)}</p>
                            <footer className="car-actions">
                                <Link to={`/customcars/${car.id}`} role="button">View</Link>
                                <Link to={`/edit/${car.id}`} role="button">Edit</Link>
                                <button type="button" onClick={() => handleDelete(car.id)}>Delete</button>
                            </footer>
                        </article>
                    ))}
                </div>
            )}
        </main>
    )
}

export default ViewCars
