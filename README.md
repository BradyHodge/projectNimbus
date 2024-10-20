# Overview

This is a Website that communicates with server backend which in turn communicates with a database to store user credentials and preferences. The website shows you the weather for your area based on the location you input when creating your account. Below is a video demonstrating the functionality of this program.

[Software Demo Video](https://youtu.be/C-8J1NCUXxU)

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
