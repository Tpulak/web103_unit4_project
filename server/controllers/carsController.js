import { pool } from '../config/database.js'
import { calculateTotalPrice } from '../utils/calcPrice.js'
import { validateCarConfiguration } from '../utils/validation.js'

const getCarQuery = `
    SELECT
        c.id,
        c.name,
        c.total_price,
        c.created_at,
        c.trim_id,
        t.name AS trim_name,
        t.base_price,
        c.exterior_color_id,
        ec.name AS exterior_color_name,
        ec.color_hex AS exterior_color_hex,
        ec.price AS exterior_color_price,
        c.interior_color_id,
        ic.name AS interior_color_name,
        ic.price AS interior_color_price,
        c.wheels_id,
        w.name AS wheels_name,
        w.price AS wheels_price,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', f.id,
                    'name', f.name,
                    'price', f.price
                )
            ) FILTER (WHERE f.id IS NOT NULL),
            '[]'
        ) AS features
    FROM cars c
    JOIN trims t ON c.trim_id = t.id
    JOIN exterior_colors ec ON c.exterior_color_id = ec.id
    JOIN interior_colors ic ON c.interior_color_id = ic.id
    JOIN wheels w ON c.wheels_id = w.id
    LEFT JOIN car_features cf ON c.id = cf.car_id
    LEFT JOIN features f ON cf.feature_id = f.id
`

const groupByClause = `
    GROUP BY
        c.id, c.name, c.total_price, c.created_at, c.trim_id,
        t.name, t.base_price,
        c.exterior_color_id, ec.name, ec.color_hex, ec.price,
        c.interior_color_id, ic.name, ic.price,
        c.wheels_id, w.name, w.price
`

const fetchOptionById = async (table, id) => {
    const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id])
    return result.rows[0]
}

const fetchFeaturesByIds = async (featureIds = []) => {
    if (!featureIds.length) {
        return []
    }

    const result = await pool.query(
        'SELECT * FROM features WHERE id = ANY($1::int[])',
        [featureIds]
    )

    return result.rows
}

const buildConfiguration = async ({ trim_id, exterior_color_id, interior_color_id, wheels_id, feature_ids = [] }) => {
    const trim = await fetchOptionById('trims', trim_id)
    const exteriorColor = await fetchOptionById('exterior_colors', exterior_color_id)
    const interiorColor = await fetchOptionById('interior_colors', interior_color_id)
    const wheels = await fetchOptionById('wheels', wheels_id)
    const features = await fetchFeaturesByIds(feature_ids)

    return { trim, exteriorColor, interiorColor, wheels, features }
}

export const getAllCars = async (req, res) => {
    try {
        const result = await pool.query(
            `${getCarQuery} ${groupByClause} ORDER BY c.created_at DESC`
        )
        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error fetching cars:', err)
        res.status(500).json({ error: 'Failed to fetch cars' })
    }
}

export const getCarById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query(
            `${getCarQuery} WHERE c.id = $1 ${groupByClause}`,
            [id]
        )

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Car not found' })
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error('Error fetching car:', err)
        res.status(500).json({ error: 'Failed to fetch car' })
    }
}

export const createCar = async (req, res) => {
    try {
        const { name, trim_id, exterior_color_id, interior_color_id, wheels_id, feature_ids = [] } = req.body

        if (!name || !trim_id || !exterior_color_id || !interior_color_id || !wheels_id) {
            return res.status(400).json({ error: 'Missing required car fields' })
        }

        const config = await buildConfiguration({
            trim_id,
            exterior_color_id,
            interior_color_id,
            wheels_id,
            feature_ids
        })

        if (!config.trim || !config.exteriorColor || !config.interiorColor || !config.wheels) {
            return res.status(400).json({ error: 'Invalid option selected' })
        }

        const validationErrors = validateCarConfiguration(config)
        if (validationErrors.length) {
            return res.status(400).json({ error: validationErrors.join(' ') })
        }

        const total_price = calculateTotalPrice(config)

        const carResult = await pool.query(
            `INSERT INTO cars (name, trim_id, exterior_color_id, interior_color_id, wheels_id, total_price)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [name, trim_id, exterior_color_id, interior_color_id, wheels_id, total_price]
        )

        const carId = carResult.rows[0].id

        for (const featureId of feature_ids) {
            await pool.query(
                'INSERT INTO car_features (car_id, feature_id) VALUES ($1, $2)',
                [carId, featureId]
            )
        }

        req.params.id = carId
        return getCarById(req, res)
    } catch (err) {
        console.error('Error creating car:', err)
        res.status(500).json({ error: 'Failed to create car' })
    }
}

export const updateCar = async (req, res) => {
    try {
        const { id } = req.params
        const { name, trim_id, exterior_color_id, interior_color_id, wheels_id, feature_ids = [] } = req.body

        const existingCar = await pool.query('SELECT id FROM cars WHERE id = $1', [id])
        if (!existingCar.rows.length) {
            return res.status(404).json({ error: 'Car not found' })
        }

        if (!name || !trim_id || !exterior_color_id || !interior_color_id || !wheels_id) {
            return res.status(400).json({ error: 'Missing required car fields' })
        }

        const config = await buildConfiguration({
            trim_id,
            exterior_color_id,
            interior_color_id,
            wheels_id,
            feature_ids
        })

        if (!config.trim || !config.exteriorColor || !config.interiorColor || !config.wheels) {
            return res.status(400).json({ error: 'Invalid option selected' })
        }

        const validationErrors = validateCarConfiguration(config)
        if (validationErrors.length) {
            return res.status(400).json({ error: validationErrors.join(' ') })
        }

        const total_price = calculateTotalPrice(config)

        await pool.query(
            `UPDATE cars
             SET name = $1, trim_id = $2, exterior_color_id = $3, interior_color_id = $4, wheels_id = $5, total_price = $6
             WHERE id = $7`,
            [name, trim_id, exterior_color_id, interior_color_id, wheels_id, total_price, id]
        )

        await pool.query('DELETE FROM car_features WHERE car_id = $1', [id])

        for (const featureId of feature_ids) {
            await pool.query(
                'INSERT INTO car_features (car_id, feature_id) VALUES ($1, $2)',
                [id, featureId]
            )
        }

        return getCarById(req, res)
    } catch (err) {
        console.error('Error updating car:', err)
        res.status(500).json({ error: 'Failed to update car' })
    }
}

export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query('DELETE FROM cars WHERE id = $1 RETURNING id', [id])

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Car not found' })
        }

        res.status(200).json({ message: 'Car deleted successfully' })
    } catch (err) {
        console.error('Error deleting car:', err)
        res.status(500).json({ error: 'Failed to delete car' })
    }
}
