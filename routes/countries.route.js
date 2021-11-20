const express = require('express')
const router = express.Router()

// Controllers
const countryCTRL = require('../controllers/countries.contoller')

router.get('/', countryCTRL.countries)

module.exports = router
