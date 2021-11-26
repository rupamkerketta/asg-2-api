// Environment Variables Configuration
if (process.env.NODE_ENV !== 'production') {
	const result = require('dotenv').config()

	if (result.error) {
		console.log(result.error)
	}
}

const express = require('express')
const app = express()
const yaml = require('js-yaml')
const path = require('path')
const fs = require('fs')

const PORT = process.env.PORT || 5000

// Database connection - mongoDB
const db = require('./db')

// Middlewares
app.use(express.json())

app.get('/', (req, res) => {
	try {
		res.send({
			message: 'Blue Sky Analytics- Assignment 2 (api)',
			author: 'Rupam Kerketta'
		})
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Internal Server Error !!' })
	}
})

// openAPI spec
app.get('/res/open-api-spec', (req, res) => {
	try {
		res.sendFile(path.resolve('./open-api-spec.yml'))
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Internal Server Error!!' })
	}
})

app.get('/res/open-api-spec-json', (req, res) => {
	try {
		const doc = yaml.load(
			fs.readFileSync(path.resolve('./open-api-spec.yml'), 'utf8')
		)
		res.send(doc)
	} catch (err) {
		console.log(err)
		res.status(500).send({ message: 'Internal Server Error!!' })
	}
})

// Routes
const countriesRoute = require('./routes/countries.route')
const countryRoute = require('./routes/country.route')

app.use('/api/v1/countries', countriesRoute)
app.use('/api/v1/country', countryRoute)

const connectionURL = process.env.DB_CONNECTION_STR

db.connect({ connectionURL }, () => {
	app.listen(PORT, () =>
		console.log(`[express] Server running on PORT ${PORT}`)
	)
})
