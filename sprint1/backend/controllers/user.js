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
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
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

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };