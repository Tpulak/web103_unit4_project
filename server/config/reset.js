import { pool } from './database.js'

const testConnection = async () => {
    try {
        await pool.query('SELECT 1')
        console.log('✅ Database connection successful')
    } catch (err) {
        console.error('\n❌ Database connection failed')
        console.error(`   ${err.message}\n`)
        console.error('Check server/.env — copy the exact Password from Render (not the username).')
        await pool.end()
        process.exit(1)
    }
}

const createTrimsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS trims (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            base_price INTEGER NOT NULL
        );
    `

    try {
        await pool.query(query)
        console.log('🎉 trims table created successfully')
    } catch (err) {
        console.error('⚠️ error creating trims table', err)
    }
}

const createExteriorColorsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS exterior_colors (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            color_hex TEXT NOT NULL,
            price INTEGER NOT NULL DEFAULT 0
        );
    `

    try {
        await pool.query(query)
        console.log('🎉 exterior_colors table created successfully')
    } catch (err) {
        console.error('⚠️ error creating exterior_colors table', err)
    }
}

const createInteriorColorsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS interior_colors (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            trim_id INTEGER NOT NULL REFERENCES trims(id),
            price INTEGER NOT NULL DEFAULT 0
        );
    `

    try {
        await pool.query(query)
        console.log('🎉 interior_colors table created successfully')
    } catch (err) {
        console.error('⚠️ error creating interior_colors table', err)
    }
}

const createWheelsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS wheels (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            trim_id INTEGER REFERENCES trims(id),
            price INTEGER NOT NULL DEFAULT 0
        );
    `

    try {
        await pool.query(query)
        console.log('🎉 wheels table created successfully')
    } catch (err) {
        console.error('⚠️ error creating wheels table', err)
    }
}

const createFeaturesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS features (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            trim_id INTEGER REFERENCES trims(id),
            price INTEGER NOT NULL DEFAULT 0
        );
    `

    try {
        await pool.query(query)
        console.log('🎉 features table created successfully')
    } catch (err) {
        console.error('⚠️ error creating features table', err)
    }
}

const createCarsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS cars (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            trim_id INTEGER NOT NULL REFERENCES trims(id),
            exterior_color_id INTEGER NOT NULL REFERENCES exterior_colors(id),
            interior_color_id INTEGER NOT NULL REFERENCES interior_colors(id),
            wheels_id INTEGER NOT NULL REFERENCES wheels(id),
            total_price INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

    try {
        await pool.query(query)
        console.log('🎉 cars table created successfully')
    } catch (err) {
        console.error('⚠️ error creating cars table', err)
    }
}

const createCarFeaturesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS car_features (
            car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
            feature_id INTEGER NOT NULL REFERENCES features(id),
            PRIMARY KEY (car_id, feature_id)
        );
    `

    try {
        await pool.query(query)
        console.log('🎉 car_features table created successfully')
    } catch (err) {
        console.error('⚠️ error creating car_features table', err)
    }
}

const seedTrims = async () => {
    const query = `
        INSERT INTO trims (name, base_price)
        VALUES
            ('1LT', 26595),
            ('2LT', 29795)
        ON CONFLICT (name) DO NOTHING;
    `

    try {
        await pool.query(query)
        console.log('🎉 trims seeded successfully')
    } catch (err) {
        console.error('⚠️ error seeding trims', err)
    }
}

const seedExteriorColors = async () => {
    const query = `
        INSERT INTO exterior_colors (name, color_hex, price)
        VALUES
            ('Summit White', '#FFFFFF', 0),
            ('Mosaic Black Metallic', '#1a1a1a', 395),
            ('Silver Flare Metallic', '#C0C0C0', 395),
            ('Bright Blue Metallic', '#0066CC', 395),
            ('Radiant Red Tintcoat', '#CC0000', 495)
        ON CONFLICT (name) DO NOTHING;
    `

    try {
        await pool.query(query)
        console.log('🎉 exterior_colors seeded successfully')
    } catch (err) {
        console.error('⚠️ error seeding exterior_colors', err)
    }
}

const seedInteriorColors = async () => {
    const query = `
        INSERT INTO interior_colors (name, trim_id, price)
        VALUES
            ('Jet Black Cloth', (SELECT id FROM trims WHERE name = '1LT'), 0),
            ('Jet Black Perforated Leather', (SELECT id FROM trims WHERE name = '2LT'), 0)
        ON CONFLICT (name) DO NOTHING;
    `

    try {
        await pool.query(query)
        console.log('🎉 interior_colors seeded successfully')
    } catch (err) {
        console.error('⚠️ error seeding interior_colors', err)
    }
}

const seedWheels = async () => {
    const query = `
        INSERT INTO wheels (name, trim_id, price)
        VALUES
            ('17" Silver-painted Aluminum', NULL, 0),
            ('17" Machined-face Aluminum', (SELECT id FROM trims WHERE name = '2LT'), 0),
            ('17" Gloss Black Aluminum', (SELECT id FROM trims WHERE name = '2LT'), 895)
        ON CONFLICT (name) DO NOTHING;
    `

    try {
        await pool.query(query)
        console.log('🎉 wheels seeded successfully')
    } catch (err) {
        console.error('⚠️ error seeding wheels', err)
    }
}

const seedFeatures = async () => {
    const query = `
        INSERT INTO features (name, trim_id, price)
        VALUES
            ('Heated Front Seats', NULL, 500),
            ('Heated Steering Wheel', NULL, 250),
            ('Driver Confidence Package', NULL, 495),
            ('Adaptive Cruise Control', (SELECT id FROM trims WHERE name = '2LT'), 700),
            ('Bose Premium Audio', (SELECT id FROM trims WHERE name = '2LT'), 895)
        ON CONFLICT (name) DO NOTHING;
    `

    try {
        await pool.query(query)
        console.log('🎉 features seeded successfully')
    } catch (err) {
        console.error('⚠️ error seeding features', err)
    }
}

const resetDatabase = async () => {
    await testConnection()
    await createTrimsTable()
    await createExteriorColorsTable()
    await createInteriorColorsTable()
    await createWheelsTable()
    await createFeaturesTable()
    await createCarsTable()
    await createCarFeaturesTable()
    await seedTrims()
    await seedExteriorColors()
    await seedInteriorColors()
    await seedWheels()
    await seedFeatures()
    await pool.end()
}

resetDatabase()
