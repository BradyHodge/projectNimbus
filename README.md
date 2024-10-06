# Overview

This is a Website that communicates with server backend that will communicate with a database to store user credentials and preferences. Below is a video demonstrating the functionality of this program.

[Software Demo Video](http://youtube.link.goes.here)

# Cloud Database

I am using Mongodb as the database that stores user credentials. Right now it stores username, password, and location.

# Development Environment

The backend is built with node.js and the front end is build with static html and javascript.

# Useful Websites

These are the main web resources that I used:

- [W3 Schools](https://www.w3schools.com/nodejs/nodejs_mongodb.asp)
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)

# Future Work

Things that still need to be done:

- Implement user sign up
- Implement a salt and hash algorithm for storing sensitive user credentials
- Increase the amount of preferences that can be stored in the database, For example: background image, color scheme, temperature unit, ect.