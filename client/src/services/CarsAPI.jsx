export const getAllCars = async () => {
    const response = await fetch('/api/cars')
    if (!response.ok) {
        throw new Error('Failed to fetch cars')
    }
    return response.json()
}

export const getCar = async (id) => {
    const response = await fetch(`/api/cars/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch car')
    }
    return response.json()
}

export const createCar = async (carData) => {
    const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || 'Failed to create car')
    }
    return data
}

export const updateCar = async (id, carData) => {
    const response = await fetch(`/api/cars/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || 'Failed to update car')
    }
    return data
}

export const deleteCar = async (id) => {
    const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE'
    })

    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.error || 'Failed to delete car')
    }
    return data
}
