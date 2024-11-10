const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

async function loadSignInPage(req, res) {
    res.render('signin', { title: 'Sign In with GitHub' });
}

async function auth(req, res) {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                redirect_uri: REDIRECT_URI
            }),
            {
                headers: { Accept: 'application/json' }
            }
        );

        const { access_token } = tokenResponse.data;

        if (!access_token) {
            throw new Error("Failed to retrieve access token from GitHub");
        }

        const userInfoResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const userInfo = userInfoResponse.data;

        req.session.user = {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email
        };

        res.redirect('/home');
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(500).send(`Authentication failed: ${error.message}`);
    }
}

async function loadHomePage(req, res) {
    if (!req.session.user) {
        return res.redirect('/signin');
    }

    res.render('home', {
        title: 'Home',
        user: req.session.user
    });
}

async function githubCallback(req, res) {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                redirect_uri: REDIRECT_URI
            }),
            {
                headers: { Accept: 'application/json' }
            }
        );

        const accessToken = tokenResponse.data.access_token;
        
        if (!accessToken) {
            throw new Error("Failed to retrieve access token from GitHub");
        }

        const userInfoResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const userInfo = userInfoResponse.data;

        req.session.user = {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
        };

        res.redirect('/home');
    } catch (error) {
        console.error('GitHub authentication error:', error.message);
        res.status(500).send(`Authentication failed: ${error.message}`);
    }
}

module.exports = { loadSignInPage, auth, loadHomePage, githubCallback };
