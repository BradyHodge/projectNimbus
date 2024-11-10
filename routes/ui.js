const express = require('express');
const router = express.Router();
const { loadSignInPage, auth, loadHomePage } = require('../controllers/ui');

router.get('/', loadSignInPage);
router.get('/auth/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user:email`;
    res.redirect(githubAuthUrl);
});
router.get('/auth/github/callback', auth);
router.get('/home', loadHomePage);

module.exports = router;