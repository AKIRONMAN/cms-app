const express = require('express');
const customer = express.Router();
const customerService = require('../services/customer-service');
const auth = require('./../middleware/auth');

customer.post('/search', [auth.verifyToken, auth.isModeratorOrAdmin,  customerService.search]);

customer.get('/', [auth.verifyToken, auth.isModeratorOrAdmin,  customerService.getList]);

customer.post('/', [auth.verifyToken, auth.isModeratorOrAdmin,  customerService.create]);

customer.put('/:id', [auth.verifyToken, auth.isModeratorOrAdmin,  customerService.update]);

customer.delete('/:id', [auth.verifyToken, auth.isAdmin,  customerService.deleteCustomer]);

module.exports = customer;