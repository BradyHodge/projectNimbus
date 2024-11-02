const express = require('express')
const router = express.Router()
const { loadSignInPage, auth, loadHomePage } = require('../controllers/ui');

router.get('/', loadSignInPage);

router.get('/auth', auth)

router.get('/home', loadHomePage)


module.exports = router