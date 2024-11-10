const express = require('express');
const router = express.Router();
const { loadSignInPage, auth, loadHomePage, githubCallback } = require('../controllers/ui');

router.get('/', loadSignInPage);

router.get('/auth/github', auth);

router.get('/auth/github/callback', githubCallback); 

router.get('/home', loadHomePage);

module.exports = router;
