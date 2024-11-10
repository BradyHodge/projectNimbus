const MongoClient = require('mongodb').MongoClient;
const env = require('dotenv');
env.config();

const uri = process.env.MONGODB_URI;
let _db;

const connectDB = async (callback) => {
    try {
        const client = await MongoClient.connect(uri);
        _db = client.db();
        callback();
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const getDB = () => {
    if (!_db) {
        throw Error('Database not initialized');
    }
    return _db;
};

module.exports = { connectDB, getDB };