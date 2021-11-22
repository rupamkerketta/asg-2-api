const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { isHexadecimal } = require('validator')

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
		!typeof queryParams.key === 'object' ||
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
	}

	req.query.operationType = req.query.operationType.toUpperCase()
	next()
}

router.get('/:id', countryCTRL.getCountryInfo)

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

module.exports = router
