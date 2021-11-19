const express = require('express')
const router = express.Router()

// Controllers
const countryCTRL = require('../controllers/country.controller')

router.get('/', countryCTRL.countries)

module.exports = router
