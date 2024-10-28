const { getDB } = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  const db = await getDB();
  const result = await db.collection('user').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const db = await getDB();
  const result = await db.collection('user').find({ _id: userId });
  
  try {
    const userData = await result.toArray();
    const user = userData[0];
    
    const userLocation = user.location || 'Rexburg,US'; 
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${userLocation}&units=imperial&appid=${process.env.WEATHER_API_KEY}`);
    
    if (!weatherResponse.ok) {
      throw new Error('Weather API response was not ok');
    }
    
    const weatherData = await weatherResponse.json();
    
    const responseData = {
      weather: {
        user: user.userName,
        location: userLocation,
        temperature: weatherData.list[0].main.temp,
        conditions: weatherData.list[0].weather[0].description
      }
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};
const createUser = async (User) => {

  try {
    const db = await getDB();
    const result = await db.collection('user').insertOne(User);
    return result.insertedId;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const db = await getDB();
  const updatedData = req.body;
  delete updatedData._id;
  const result = await db.collection('user').updateOne({ _id: userId }, { $set: updatedData });
  if (result.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const db = await getDB();
    const result = await db.collection('user').deleteOne({ _id: userId });
    if (result.deletedCount > 0) {
      res.status(200).json({});
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const validateUserData = (req, res, next) => {
  const { userName, password, location } = req.body;
  const errors = [];

  if (!userName) errors.push('Username is required');
  if (!password) errors.push('Password is required');
  if (!location) errors.push('Location is required');

  if (userName && (typeof userName !== 'string' || userName.length < 3 || userName.length > 30)) {
      errors.push('Username must be between 3 and 30 characters');
  }

  if (password && (typeof password !== 'string' || password.length < 6)) {
      errors.push('Password must be at least 6 characters long');
  }

  if (location && (typeof location !== 'string' || location.length < 2)) {
      errors.push('Location must be a valid string with at least 2 characters');
  }

  if (errors.length > 0) {
      return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors
      });
  }

  next();
};


module.exports = { getAll, getSingle, createUser, updateUser, deleteUser, validateUserData };