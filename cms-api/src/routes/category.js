const express = require('express');
const category = express.Router();
const  categoryService = require('../services/category-service');
const auth = require('./../middleware/auth');

category.get('/search/', [auth.verifyToken, auth.isModeratorOrAdmin, categoryService.search]);

category.get('/', [auth.verifyToken, auth.isModeratorOrAdmin,  categoryService.getList]);


category.post('/:moduleId', [auth.verifyToken, auth.isModeratorOrAdmin,  categoryService.create]);

category.put('/:id', [auth.verifyToken, auth.isModeratorOrAdmin,  categoryService.update]);


category.delete('/:id', [auth.verifyToken, auth.isAdmin,  categoryService.deleteCategory]);


module.exports = category;