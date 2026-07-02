export const calculateTotalPrice = ({ trim, exteriorColor, interiorColor, wheels, features = [] }) => {
    const basePrice = trim?.base_price ?? 0
    const exteriorPrice = exteriorColor?.price ?? 0
    const interiorPrice = interiorColor?.price ?? 0
    const wheelsPrice = wheels?.price ?? 0
    const featuresPrice = features.reduce((sum, feature) => sum + (feature.price ?? 0), 0)

    return basePrice + exteriorPrice + interiorPrice + wheelsPrice + featuresPrice
}

export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price)
}
