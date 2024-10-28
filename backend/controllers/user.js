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
const createUser = async (userData) => {
  try {
      const db = await getDB();
      
      const existingUser = await db.collection('user').findOne({ 
          userName: userData.userName 
      });
      
      if (existingUser) {
          const error = new Error('Username already exists');
          error.code = 'DUPLICATE_USERNAME';
          throw error;
      }

      const result = await db.collection('user').insertOne(userData);
      return result.insertedId;
  } catch (err) {
      console.error('Error in createUser:', err);
      throw err;
  }
};

const updateUser = async (userId, updatedData) => {
  const db = await getDB();
  const objId = new ObjectId(userId);
  
  const result = await db.collection('user').updateOne(
      { _id: objId }, 
      { $set: updatedData }
  ); 
  
  if (result.modifiedCount > 0) {
      return true;
  }
  return false;
};

const deleteUser = async (userId) => {
  try {
      const db = await getDB();
      const objId = new ObjectId(userId);
      
      const result = await db.collection('user').deleteOne({ 
          _id: objId 
      });
      
      return result.deletedCount > 0;
  } catch (err) {
      console.error('Error in deleteUser:', err);
      throw err;
  }
};
const validateUserData = (req, res, next) => {
  ('Validation middleware - Request body:', req.body);

  if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
          status: 'error',
          message: 'Invalid request body',
          errors: ['Request body is missing or invalid']
      });
  }

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