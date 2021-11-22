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

router.get('/:id/time/all-years', countryCTRL.getAllYearsInfo)

// Filtered options
router.get(
	'/:id/time/start-year/q',
	(req, res, next) => {
		req.SE = 'start-year'
		next()
	},
	countryCTRL.getSEYearInfoFiltered
)

router.get(
	'/:id/time/end-year/q',
	(req, res, next) => {
		req.SE = 'end-year'
		next()
	},
	countryCTRL.getSEYearInfoFiltered
)

router.get(
	'/:id/time/start-and-end-year/q',
	(req, res, next) => {
		req.SE = 'start-and-end-year'
		next()
	},
	countryCTRL.getSEYearInfoFiltered
)

router.get(
	'/:id/time/all-years/q',
	(req, res, next) => {
		req.SE = 'all-years'
		next()
	},
	countryCTRL.getSEYearInfoFiltered
)

module.exports = router
