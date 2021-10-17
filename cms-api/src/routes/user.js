const express = require('express');
const user = express.Router();
const userService = require('../services/user-service');
const auth = require('./../middleware/auth');

user.get('/', [auth.verifyToken, auth.isModeratorOrAdmin,  userService.getUsersByIds]);
user.get('/search', [auth.verifyToken, auth.isModeratorOrAdmin,  userService.search]);

user.post('/', [auth.verifyToken, auth.isModeratorOrAdmin,  userService.createUser]);

user.put('/:userId/update', [auth.verifyToken, auth.isModeratorOrAdmin,  userService.updateUser]);

user.put('/:userId/change-password', [auth.verifyToken, auth.isModeratorOrAdmin, userService.updateUserPassword]);

user.put('/login', [userService.loginUser]);

user.put('/logout', [userService.logOutUser]);

user.delete('/:userId', [auth.verifyToken, auth.isAdmin, userService.deleteUser]);

module.exports = user;