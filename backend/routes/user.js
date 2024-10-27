const express = require('express');
const { getAll, getSingle, createUser, updateUser, deleteUser, validateUserData } = require('../controllers/user');

const router = express.Router();

router.get('/', getAll);

router.get('/:id', getSingle);

router.post('/', validateUserData, async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        return res.status(201).json({ id: newUser });
    } catch (err) {
        console.error(err);
        if (err.code === 'DUPLICATE_EMAIL') {
            return res.status(409).json({ 
                errors: ['Email already exists'] 
            });
        }
        res.sendStatus(500);
    }
});

router.put('/:id', validateUserData, async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ 
                errors: ['User not found'] 
            });
        }
        return res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        if (err.code === 'DUPLICATE_EMAIL') {
            return res.status(409).json({ 
                errors: ['Email already exists'] 
            });
        }
        res.sendStatus(500);
    }
});

router.delete('/:id', deleteUser);

module.exports = router;