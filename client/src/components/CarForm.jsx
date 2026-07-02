import React, { useEffect, useMemo, useState } from 'react'
import { getTrims, getExteriorColors, getInteriorColors, getWheels, getFeatures } from '../services/OptionsAPI'
import { calculateTotalPrice, formatPrice, getSelectedFeatures } from '../utilities/calcPrice'
import {
    validateCarConfiguration,
    isFeatureDisabled,
    isWheelDisabled,
    isInteriorDisabled
} from '../utilities/validation'
import '../css/CarPages.css'

const CarForm = ({ initialValues = {}, onSubmit, submitLabel = 'Save Car' }) => {
    const [trims, setTrims] = useState([])
    const [exteriorColors, setExteriorColors] = useState([])
    const [interiorColors, setInteriorColors] = useState([])
    const [wheels, setWheels] = useState([])
    const [features, setFeatures] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [validationError, setValidationError] = useState('')

    const [name, setName] = useState(initialValues.name || '')
    const [trimId, setTrimId] = useState(initialValues.trim_id ? String(initialValues.trim_id) : '')
    const [exteriorColorId, setExteriorColorId] = useState(initialValues.exterior_color_id ? String(initialValues.exterior_color_id) : '')
    const [interiorColorId, setInteriorColorId] = useState(initialValues.interior_color_id ? String(initialValues.interior_color_id) : '')
    const [wheelsId, setWheelsId] = useState(initialValues.wheels_id ? String(initialValues.wheels_id) : '')
    const [selectedFeatureIds, setSelectedFeatureIds] = useState(initialValues.feature_ids || [])
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoading(true)
                setError('')
                const [trimsData, exteriorData] = await Promise.all([
                    getTrims(),
                    getExteriorColors()
                ])
                setTrims(trimsData)
                setExteriorColors(exteriorData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadOptions()
    }, [reloadKey])

    useEffect(() => {
        if (!trimId) {
            setInteriorColors([])
            setWheels([])
            setFeatures([])
            return
        }

        const loadTrimOptions = async () => {
            try {
                const [interiorData, wheelsData, featuresData] = await Promise.all([
                    getInteriorColors(trimId),
                    getWheels(trimId),
                    getFeatures(trimId)
                ])
                setInteriorColors(interiorData)
                setWheels(wheelsData)
                setFeatures(featuresData)

                if (interiorData.length && !interiorData.find((item) => item.id === Number(interiorColorId))) {
                    setInteriorColorId(String(interiorData[0].id))
                }

                if (wheelsData.length && !wheelsData.find((item) => item.id === Number(wheelsId))) {
                    setWheelsId(String(wheelsData[0].id))
                }

                setSelectedFeatureIds((current) =>
                    current.filter((featureId) => featuresData.some((feature) => feature.id === featureId))
                )
            } catch (err) {
                setError(err.message)
            }
        }

        loadTrimOptions()
    }, [trimId])

    const selectedTrim = trims.find((trim) => trim.id === Number(trimId))
    const selectedExterior = exteriorColors.find((color) => color.id === Number(exteriorColorId))
    const selectedInterior = interiorColors.find((interior) => interior.id === Number(interiorColorId))
    const selectedWheels = wheels.find((wheel) => wheel.id === Number(wheelsId))
    const selectedFeatures = getSelectedFeatures(features, selectedFeatureIds)

    const totalPrice = useMemo(() => {
        return calculateTotalPrice({
            trim: selectedTrim,
            exteriorColor: selectedExterior,
            interiorColor: selectedInterior,
            wheels: selectedWheels,
            features: selectedFeatures
        })
    }, [selectedTrim, selectedExterior, selectedInterior, selectedWheels, selectedFeatures])

    useEffect(() => {
        if (!selectedTrim) {
            setValidationError('')
            return
        }

        const errors = validateCarConfiguration({
            trim: selectedTrim,
            interiorColor: selectedInterior,
            wheels: selectedWheels,
            features: selectedFeatures
        })

        setValidationError(errors.join(' '))
    }, [selectedTrim, selectedInterior, selectedWheels, selectedFeatures])

    const handleFeatureToggle = (featureId) => {
        setSelectedFeatureIds((current) =>
            current.includes(featureId)
                ? current.filter((id) => id !== featureId)
                : [...current, featureId]
        )
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (validationError) {
            setError(validationError)
            return
        }

        try {
            await onSubmit({
                name,
                trim_id: Number(trimId),
                exterior_color_id: Number(exteriorColorId),
                interior_color_id: Number(interiorColorId),
                wheels_id: Number(wheelsId),
                feature_ids: selectedFeatureIds
            })
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <p className="loading-message">Loading customization options...</p>
    }

    return (
        <div className="car-layout">
            <div className="car-preview">
                <div
                    className="car-preview-box"
                    style={{ backgroundColor: selectedExterior?.color_hex || '#333' }}
                >
                    🏎️
                </div>
                <div className="car-preview-details">
                    <h3>{name || 'Your Custom Bolt'}</h3>
                    <p>{selectedTrim?.name || 'Select a trim'} • {selectedExterior?.name || 'Select a color'}</p>
                    <p className="price-display">Total: {formatPrice(totalPrice)}</p>
                </div>
            </div>

            <form className="car-form" onSubmit={handleSubmit}>
                {error && (
                    <div className="error-message">
                        {error}
                        <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
                            Retry
                        </button>
                    </div>
                )}

                <label>
                    Car Name
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="My Bolt EV"
                        required
                    />
                </label>

                <label>
                    Trim Level
                    <select
                        value={trimId}
                        onChange={(event) => setTrimId(event.target.value)}
                        required
                    >
                        <option value="">Select trim</option>
                        {trims.map((trim) => (
                            <option key={trim.id} value={trim.id}>
                                {trim.name} — {formatPrice(trim.base_price)}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Exterior Color
                    <select
                        value={exteriorColorId}
                        onChange={(event) => setExteriorColorId(event.target.value)}
                        required
                    >
                        <option value="">Select color</option>
                        {exteriorColors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.name} (+{formatPrice(color.price)})
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Interior
                    <select
                        value={interiorColorId}
                        onChange={(event) => setInteriorColorId(event.target.value)}
                        required
                        disabled={!trimId}
                    >
                        <option value="">Select interior</option>
                        {interiorColors.map((interior) => (
                            <option
                                key={interior.id}
                                value={interior.id}
                                disabled={isInteriorDisabled(interior, selectedTrim)}
                            >
                                {interior.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Wheels
                    <select
                        value={wheelsId}
                        onChange={(event) => setWheelsId(event.target.value)}
                        required
                        disabled={!trimId}
                    >
                        <option value="">Select wheels</option>
                        {wheels.map((wheel) => (
                            <option
                                key={wheel.id}
                                value={wheel.id}
                                disabled={isWheelDisabled(wheel, selectedTrim)}
                            >
                                {wheel.name} (+{formatPrice(wheel.price)})
                            </option>
                        ))}
                    </select>
                </label>

                <fieldset disabled={!trimId}>
                    <legend>Features</legend>
                    <div className="feature-list">
                        {features.map((feature) => (
                            <div className="feature-item" key={feature.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedFeatureIds.includes(feature.id)}
                                        disabled={isFeatureDisabled(feature, selectedTrim, selectedFeatureIds, features)}
                                        onChange={() => handleFeatureToggle(feature.id)}
                                    />
                                    {feature.name} (+{formatPrice(feature.price)})
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>

                <p className="price-display">Estimated Total: {formatPrice(totalPrice)}</p>

                <button type="submit" disabled={!!validationError}>
                    {submitLabel}
                </button>
            </form>
        </div>
    )
}

export default CarForm
