const express = require('express');
const { getAll, getSingle, createUser, updateUser, deleteUser } = require('../controllers/user');

const router = express.Router();

router.get('/', getAll);

router.get('/:id', getSingle);

router.post('/', async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        return res.status(201).json({ id: newUser });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;