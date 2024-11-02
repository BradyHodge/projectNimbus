const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

async function loadSignInPage(req, res) {

    res.render('signin', { title: 'Sign In' });
}

async function auth(req, res) {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);


        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });

        const userInfo = userInfoResponse.data;


        req.session.user = {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email
        };


        res.redirect('/home');
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).send('Authentication failed');
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

module.exports = { loadSignInPage, auth, loadHomePage };
