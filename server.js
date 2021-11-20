// Environment Variables Configuration
if (process.env.NODE_ENV !== 'production') {
	const result = require('dotenv').config()

	if (result.error) {
		console.log(result.error)
	}
}

const express = require('express')
const app = express()

const PORT = process.env.PORT || 5000

// Database connection - mongoDB
const db = require('./db')

// Middlewares
app.use(express.json())

app.get('/', (req, res) => {
	try {
		res.send({ message: 'Blue Sky Analytics' })
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Internal Server Error !!' })
	}
})

// Routes
const countriesRoute = require('./routes/countries.route')
const countryRoute = require('./routes/country.route')

app.use('/api/v1/countries', countriesRoute)
app.use('/api/v1/country', countryRoute)

console.log(process.env.DB_CONNECTION_STR)

const connectionURL = process.env.DB_CONNECTION_STR
const mongoUsername = process.env.MONGO_USERNAME
const mongoPassword = process.env.MONGO_PASSWORD

db.connect({ connectionURL, mongoUsername, mongoPassword }, () => {
	app.listen(PORT, () =>
		console.log(`[express] Server running on PORT ${PORT}`)
	)
})
