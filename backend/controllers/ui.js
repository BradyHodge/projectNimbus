const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

async function loadSignInPage(req, res) {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    res.render('signin', { 
        title: 'Sign In To Continue',
        githubAuthUrl 
    });
}

async function auth(req, res) {
    const { code } = req.query;
    
    if (!code) {
        console.error('No code received from GitHub');
        return res.status(400).send('No code received from GitHub');
    }

    console.log('Received GitHub code:', code);
    console.log('Using CLIENT_ID:', CLIENT_ID);
    console.log('Using REDIRECT_URI:', REDIRECT_URI);

    try {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json'
            },
            data: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECT_URI
            }
        });

        console.log('Token response:', tokenResponse.data);

        const access_token = tokenResponse.data.access_token;

        if (!access_token) {
            console.error('No access token in response:', tokenResponse.data);
            throw new Error('No access token received from GitHub');
        }

        const userInfoResponse = await axios({
            method: 'get',
            url: 'https://api.github.com/user',
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            }
        });

        const userInfo = userInfoResponse.data;
        console.log('User info received:', userInfo);

        req.session.user = {
            id: userInfo.id,
            name: userInfo.name || userInfo.login,
            email: userInfo.email
        };

        res.redirect('/home');
    } catch (error) {
        console.error('Detailed authentication error:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : 'No response',
            config: error.config ? {
                url: error.config.url,
                method: error.config.method,
                headers: error.config.headers
            } : 'No config'
        });

        res.status(500).send(`Authentication failed: ${error.message}`);
    }
}

async function loadHomePage(req, res) {
    if (!req.session.user) {
        return res.redirect('/');
    }

    res.render('home', {
        title: 'Home',
        user: req.session.user
    });
}

// Remove the separate githubCallback function since it's redundant with auth

module.exports = { loadSignInPage, auth, loadHomePage };