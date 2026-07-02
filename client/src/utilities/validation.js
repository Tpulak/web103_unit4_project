export const validateCarConfiguration = ({ trim, interiorColor, wheels, features = [] }) => {
    const errors = []

    if (!trim) {
        errors.push('Please select a trim level.')
        return errors
    }

    if (interiorColor && interiorColor.trim_id !== trim.id) {
        errors.push(`${interiorColor.name} is not available on the ${trim.name} trim.`)
    }

    if (wheels && wheels.trim_id && wheels.trim_id !== trim.id) {
        errors.push(`${wheels.name} is only available on the 2LT trim.`)
    }

    for (const feature of features) {
        if (feature.trim_id && feature.trim_id !== trim.id) {
            errors.push(`${feature.name} is only available on the 2LT trim.`)
        }
    }

    const featureNames = features.map((feature) => feature.name)
    if (featureNames.includes('Heated Steering Wheel') && !featureNames.includes('Heated Front Seats')) {
        errors.push('Heated Steering Wheel requires Heated Front Seats.')
    }

    return errors
}

export const isFeatureDisabled = (feature, trim, selectedFeatureIds, allFeatures) => {
    if (feature.trim_id && trim && feature.trim_id !== trim.id) {
        return true
    }

    if (feature.name === 'Heated Steering Wheel') {
        const heatedSeats = allFeatures.find((item) => item.name === 'Heated Front Seats')
        return heatedSeats ? !selectedFeatureIds.includes(heatedSeats.id) : true
    }

    return false
}

export const isWheelDisabled = (wheel, trim) => {
    return wheel.trim_id && trim && wheel.trim_id !== trim.id
}

export const isInteriorDisabled = (interior, trim) => {
    return interior.trim_id && trim && interior.trim_id !== trim.id
}
