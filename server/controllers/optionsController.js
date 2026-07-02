import { pool } from '../config/database.js'

export const getTrims = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trims ORDER BY base_price ASC')
        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error fetching trims:', err)
        res.status(500).json({ error: 'Failed to fetch trims' })
    }
}

export const getExteriorColors = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM exterior_colors ORDER BY name ASC')
        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error fetching exterior colors:', err)
        res.status(500).json({ error: 'Failed to fetch exterior colors' })
    }
}

export const getExteriorColorById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await pool.query('SELECT * FROM exterior_colors WHERE id = $1', [id])

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Exterior color not found' })
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error('Error fetching exterior color:', err)
        res.status(500).json({ error: 'Failed to fetch exterior color' })
    }
}

export const getInteriorColors = async (req, res) => {
    try {
        const { trim_id } = req.query
        let result

        if (trim_id) {
            result = await pool.query(
                'SELECT * FROM interior_colors WHERE trim_id = $1 ORDER BY name ASC',
                [trim_id]
            )
        } else {
            result = await pool.query('SELECT * FROM interior_colors ORDER BY name ASC')
        }

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error fetching interior colors:', err)
        res.status(500).json({ error: 'Failed to fetch interior colors' })
    }
}

export const getWheels = async (req, res) => {
    try {
        const { trim_id } = req.query
        let result

        if (trim_id) {
            result = await pool.query(
                'SELECT * FROM wheels WHERE trim_id IS NULL OR trim_id = $1 ORDER BY price ASC',
                [trim_id]
            )
        } else {
            result = await pool.query('SELECT * FROM wheels ORDER BY price ASC')
        }

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error fetching wheels:', err)
        res.status(500).json({ error: 'Failed to fetch wheels' })
    }
}

export const getFeatures = async (req, res) => {
    try {
        const { trim_id } = req.query
        let result

        if (trim_id) {
            result = await pool.query(
                'SELECT * FROM features WHERE trim_id IS NULL OR trim_id = $1 ORDER BY price ASC',
                [trim_id]
            )
        } else {
            result = await pool.query('SELECT * FROM features ORDER BY price ASC')
        }

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error fetching features:', err)
        res.status(500).json({ error: 'Failed to fetch features' })
    }
}
