export const getTrims = async () => {
    const response = await fetch('/api/trims')
    if (!response.ok) {
        throw new Error('Failed to fetch trims')
    }
    return response.json()
}

export const getExteriorColors = async () => {
    const response = await fetch('/api/exterior-colors')
    if (!response.ok) {
        throw new Error('Failed to fetch exterior colors')
    }
    return response.json()
}

export const getExteriorColor = async (id) => {
    const response = await fetch(`/api/exterior-colors/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch exterior color')
    }
    return response.json()
}

export const getInteriorColors = async (trimId) => {
    const url = trimId ? `/api/interior-colors?trim_id=${trimId}` : '/api/interior-colors'
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Failed to fetch interior colors')
    }
    return response.json()
}

export const getWheels = async (trimId) => {
    const url = trimId ? `/api/wheels?trim_id=${trimId}` : '/api/wheels'
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Failed to fetch wheels')
    }
    return response.json()
}

export const getFeatures = async (trimId) => {
    const url = trimId ? `/api/features?trim_id=${trimId}` : '/api/features'
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Failed to fetch features')
    }
    return response.json()
}
