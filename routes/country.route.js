const express = require('express')
const router = express.Router()

// Controllers
const countryCTRL = require('../controllers/country.controller')

router.get('/:id', countryCTRL.getCountryInfo)

router.get(
	'/:id/time/start-year',
	(req, res, next) => {
		req.SE = 'start-year'
		next()
	},
	countryCTRL.getSEYearInfo
)

router.get(
	'/:id/time/end-year',
	(req, res, next) => {
		req.SE = 'end-year'
		next()
	},
	countryCTRL.getSEYearInfo
)

router.get(
	'/:id/time/start-and-end-year',
	(req, res, next) => {
		req.SE = 'start-and-end-year'
		next()
	},
	countryCTRL.getSEYearInfo
)

// router.get('/:id/q', (req, res) => {
// 	try {
// 		const queries = req.query
// 		res.send(queries)
// 	} catch (err) {
// 		console.log(err)
// 		res.status(500).send({ errMessage: 'Internal Server Error!!' })
// 	}
// })

module.exports = router
