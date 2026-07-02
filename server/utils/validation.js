export const validateCarConfiguration = ({ trim, interiorColor, wheels, features = [] }) => {
    const errors = []

    if (!trim) {
        errors.push('A trim level is required.')
        return errors
    }

    if (interiorColor && interiorColor.trim_id !== trim.id) {
        errors.push(`${interiorColor.name} is only available on the ${trim.name === '1LT' ? '1LT' : 'matching'} trim.`)
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
