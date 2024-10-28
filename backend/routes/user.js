const express = require('express');
const { getAll, getSingle, createUser, updateUser, deleteUser, validateUserData } = require('../controllers/user');

const router = express.Router();

router.get('/', getAll);

router.get('/:id', getSingle);

router.post('/', validateUserData, async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        return res.status(201).json({ 
            status: 'success',
            data: { id: newUser }
        });
    } catch (err) {
        console.error('Error creating user:', err);
        if (err.code === 'DUPLICATE_USERNAME') {
            return res.status(409).json({
                status: 'error',
                message: 'Username already exists'
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

router.put('/:id', validateUserData, async (req, res) => {
    console.log('PUT request received:');
    console.log('- params:', req.params);
    console.log('- body:', req.body);
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        return res.status(200).json({
            status: 'success',
            data: { user: updatedUser }
        });
    } catch (err) {
        console.error('Error updating user:', err);
        if (err.code === 'DUPLICATE_USERNAME') {
            return res.status(409).json({
                status: 'error',
                message: 'Username already exists'
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await deleteUser(req.params.id);
        if (!result) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});


module.exports = router;