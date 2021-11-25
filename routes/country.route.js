const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { isHexadecimal, isInt } = require('validator')

// Controllers
const countryCTRL = require('../controllers/country.controller')

// ID validation middleware
const isValidId = (req, res, next) => {
	const id = req.params.id
	if (
		!isHexadecimal(id) ||
		!id.length === 24 ||
		!mongoose.Types.ObjectId.isValid(id)
	) {
		res.status(400).send({ errMessage: 'Bad input - Invalid Id' })
		return
	}
	next()
}

// Year validation middleware
const isValidYear = (req, res, next) => {
	if (!('year' in req.params)) {
		res
			.status(400)
			.send({ errMessage: 'Bad input - provide a valid year as a param' })
		return
	}

	if (!isInt(req.params.year)) {
		res
			.status(400)
			.send({ errMessage: 'Bad input - provide a valid year as a param' })
		return
	}

	req.params.year = parseInt(req.params.year)

	const d = new Date()
	if (req.params.year < 1990 || req.params.year > d.getFullYear()) {
		res.status(400).send({ errMessage: 'Bad input - Out of range' })
		return
	}

	next()
}

// Query Parameters check key and operationType
const checkQueryParams = (req, res, next) => {
	const queryParams = req.query
	console.log(queryParams)
	const keys = Object.keys(queryParams)

	if (keys.length > 2 || keys.length === 0) {
		res.status(400).send({ errMessage: 'Invalid query params' })
		return
	}

	// key array check (mandatory)
	if (
		!keys.includes('key') ||
		!(typeof queryParams.key === 'object') ||
		!queryParams.key.every((key) => key.length !== 0)
	) {
		res.status(400).send({ errMessage: 'Invalid query params' })
		return
	}

	// operationType value check 'OR', 'AND'
	if (keys.length === 2) {
		if (!keys.includes('operationType')) {
			res.status(400).send({ errMessage: 'Invalid query params' })
			return
		}

		if (!['AND', 'OR', 'or', 'and'].includes(queryParams.operationType)) {
			res.status(400).send({ errMessage: 'Invalid query params' })
			return
		}
		req.query.operationType = req.query.operationType.toUpperCase()
	}

	next()
}

router.get('/:id', isValidId, countryCTRL.getCountryInfo)

router.get(
	'/:id/time/start-year',
	isValidId,
	(req, res, next) => {
		req.SE = 'start-year'
		next()
	},
	countryCTRL.getSEYearInfo
)

router.get(
	'/:id/time/end-year',
	isValidId,
	(req, res, next) => {
		req.SE = 'end-year'
		next()
	},
	countryCTRL.getSEYearInfo
)

router.get(
	'/:id/time/start-and-end-year',
	isValidId,
	(req, res, next) => {
		req.SE = 'start-and-end-year'
		next()
	},
	countryCTRL.getSEYearInfo
)

router.get('/:id/time/all-years', isValidId, countryCTRL.getAllYearsInfo)

// Filtered options
router.get(
	'/:id/time/start-year/q',
	isValidId,
	checkQueryParams,
	(req, res, next) => {
		req.SE = 'start-year'
		next()
	},
	countryCTRL.getSEYearInfoFiltered
)

router.get(
	'/:id/time/end-year/q',
	isValidId,
	checkQueryParams,
	(req, res, next) => {
		req.SE = 'end-year'
		next()
	},
	countryCTRL.getSEYearInfoFiltered
)

router.get(
	'/:id/time/start-and-end-year/q',
	isValidId,
	checkQueryParams,
	(req, res, next) => {
		req.SE = 'start-and-end-year'
		next()
	},
	countryCTRL.getSEYearInfoFiltered
)

router.get(
	'/:id/time/all-years/q',
	isValidId,
	checkQueryParams,
	(req, res, next) => {
		req.SE = 'all-years'
		next()
	},
	countryCTRL.getSEYearInfoFiltered
)

router.get(
	'/:id/year-info/:year',
	isValidId,
	isValidYear,
	countryCTRL.getCountryYearInfo
)

module.exports = router
